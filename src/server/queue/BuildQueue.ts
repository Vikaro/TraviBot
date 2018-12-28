import * as Queue from 'better-queue';
import QueueTask from '../model/queue/QueueTask';
import Time, { delay } from '../utility/Duration';
import Building from '../model/Building';
import TravianAPI from '../TravianAPI';

import { upgradeBuilding } from '../services/buildingsService'
import Village from '../model/Village';
import { changeVillage, updateVillageBuildings } from '../services/villageService';
import * as AsyncLock from 'async-lock';
import { parseNewBuildingCaptcha } from '../parser/buildingsParser';
import { villageLock } from '../services/locksService';

export default class BuildQueue {
    private queue: Queue;
    private _village: Village;
    private _lock: AsyncLock;
    constructor(village: Village, lock: AsyncLock) {
        this._lock = lock;
        this._village = village;
        this.queue = new Queue(this.process, { maxRetries: 3, retryDelay: 1000 });
        this.queue.on('task_finish', (taskId, result, stats) => {
            // taskId = 1, result: 3, stats = { elapsed: <time taken> }
            // taskId = 2, result: 5, stats = { elapsed: <time taken> }

            if (result instanceof Building) {
                console.log(`${this._village.name} :: ${result.name} :: ${stats.elapsed}`);
            } else {
                console.log(`${this._village.name} :: ${result} :: ${stats.elapsed}`);
            }
        })
        this.queue.on('task_failed', function (taskId, err, stats) {
            // Handle error, stats = { elapsed: <time taken> }
            console.error(taskId, err, stats)

        })
    }

    process = async (data: QueueTask, done: Queue.ProcessFunctionCb<any>) => {
        try {
            const building = await data.Run();
            done(null, building);

        } catch (error) {
            done(error, null);

        }
    }

    upgradeBuilding = (buildingId: string, callback?: () => void, onError?: (building: Building) => void) => {

        const test = (building) => new Promise(async (resolve, reject) => {
            // console.log(`village ${this._village.name} aquired lock`);
            if (!this._village.isActive) await changeVillage(this._village)
            // console.log(`try to build ${building.name}`)
            const updatedBuilding = await upgradeBuilding(building);
            this._village.buildingStore.addBuildings([updatedBuilding]);
            const duration = updatedBuilding.duration;
            // console.log(`duration: ${duration}`)
            resolve(updatedBuilding);
        })
        var task = new QueueTask(`${buildingId}`, () => new Promise(async (resolve, reject) => {
            let updatedBuilding: Building, duration;
            const building = this._village.buildingStore.getUpgreadableBuildings().find(i => i.id === buildingId);
            console.log(building);
            if (building === null || building === undefined) {
                resolve('building upgrade process is finished')
                return;
            } else {
                try {
                    await villageLock(this._lock, this._village, async () => {
                        updatedBuilding = await upgradeBuilding(building);
                        this._village.buildingStore.addBuildings([updatedBuilding]);
                        duration = updatedBuilding.duration;
                    })
                    // await this._lock.acquire('buildQueue', async () => {
                    //     console.log(`${this._village.name} :: ${building.name} :: enter buildQueue lock`);
                    //     if (!this._village.isActive) await changeVillage(this._village)

                    //     console.log(`${this._village.name} :: ${building.name} ::  left buildQueue`);
                    // })
                    console.log(`${this._village.name} :: ${building.name} :: countdown ${duration}`);
                    const response = await delay(duration);
                    console.log(`${this._village.name} :: ${building.name} :: countdown finished`);
                    resolve(updatedBuilding);
                } catch (error) {
                    console.log(error.description);
                    if (onError) onError(updatedBuilding);
                    reject(error);
                }
            }
            if (callback) await callback();

        }));
        this.queue.push(task);
        console.log("Added upgrade to queue");
    }



    addExistingTask = async (building: Building) => {
        const task = new QueueTask(`${building.name} ${building.level}`, () => delay(building.duration));
        this.queue.push(task);
        console.log("Added existing building to queue");
    }

    addNewBuilding = async (params) => {
        const { placeId, buildingId, requirements } = params;
        var task = new QueueTask(`${placeId}-${buildingId}`, () => new Promise(async (resolve, reject) => {
            await villageLock(this._lock, this._village, async () => {
                if (requirements) {
                    for (const key in requirements) {
                        const element = requirements[key];
                        const building = this._village.buildingStore.getByName(key);
                        if (!building) {
                            console.error(`${this._village.name} :: ${placeId} :: cannot build - requiured ${key} but it's not exist in village`);
                            resolve();
                            return;
                        }
                        if (parseInt(building.level) < element) {
                            console.error(`${this._village.name} :: ${placeId} :: cannot build - requiured ${building.name} level ${element} but ${building.level} is built`);
                            resolve();
                            return;
                        }
                    }
                }
                const buildPage = await this._village.api.newBuildingPage(placeId);
                const captcha = parseNewBuildingCaptcha(buildPage);
                console.log(captcha);
                if (!captcha || !placeId || !buildingId) {
                    console.error('error in queue while parsing parameters, ');
                    console.error(`captcha: ${captcha} :: placeId: ${placeId} :: buildingId ${buildingId}`);
                    resolve();
                    return;
                }
                const response = await this._village.api.newBuilding(placeId, buildingId, captcha);
                updateVillageBuildings(this._village);
                await delay("0:0:2");
                resolve();
            })
            // const buildPage = await this._village.api.newBuildingPage(placeId);
            // const captcha = parseNewBuildingCaptcha(buildPage);
            // console.log(captcha);
            // if (!captcha || !placeId || !buildingId) {
            //     console.error('error in queue while parsing parameters');
            //     resolve();
            // }
            // const response = await this._village.api.newBuilding(placeId, buildingId, captcha);
            // resolve();
        }));
        this.queue.push(task);
        console.log("Added new building to queue");
    }
}
