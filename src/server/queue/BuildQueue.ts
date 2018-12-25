import * as Queue from 'better-queue';
import QueueTask from '../model/queue/QueueTask';
import Time, { delay } from '../utility/Duration';
import Building from '../model/Building';
import TravianAPI from '../TravianAPI';

import { BuildBuilding } from '../services/buildingsService'
import Village from '../model/Village';
import { changeVillage } from '../services/villageService';
import * as AsyncLock from 'async-lock';

export default class BuildQueue {
    private queue: Queue;
    private _village: Village;
    private _lock: AsyncLock;
    constructor(village: Village, lock: AsyncLock) {
        this._lock = lock;
        this._village = village;
        this.queue = new Queue(this.process, { maxRetries: 10, retryDelay: 1000 });
        this.queue.on('task_finish', function (taskId, result, stats) {
            // taskId = 1, result: 3, stats = { elapsed: <time taken> }
            // taskId = 2, result: 5, stats = { elapsed: <time taken> }
            console.log(taskId, result, stats)
        })
        this.queue.on('task_failed', function (taskId, err, stats) {
            // Handle error, stats = { elapsed: <time taken> }
            console.error(taskId, err, stats)

        })
    }
    
    process = function (data: QueueTask, done: Queue.ProcessFunctionCb<any>) {
        console.log(data);

        data.Run().then((res) => {
            console.log("finished", res);
            done(null, res);
        }).catch((error) => {
            console.error(error);
            done(error, null);
        })
    }

    addNewBuilding = (building: Building, callback?: () => void, onError?: (building: Building) => void) => {

        var task = new QueueTask(`${building.name} ${building.level}`,() => new Promise(async (resolve, reject) => {
            let updatedBuilding: Building, duration;
            try {
                await this._lock.acquire("buildQueue", async (done) => {
                    try {
                        console.log(`village ${this._village.name} aquired lock`);
                        if (!this._village.isActive) await changeVillage(this._village)
                        // const changeVillageResponse = !this._village.isActive ?  : "this is active village";
                        // console.log(changeVillageResponse);
                        console.log(`try to build ${building.name}`)
                        updatedBuilding = await BuildBuilding(building);
                        // console.log(updatedBuilding);
                        this._village.buildingStore.addBuildings([updatedBuilding]);
                        duration = updatedBuilding.duration;
                        // done();
                    } catch (error) {
                        console.error(error);
                    } finally{
                        done();
                    }
                  
                });
                const response = await delay(duration);
                if (callback) await callback();
                resolve(updatedBuilding);
            } catch (error) {
                console.log(error.description);
                if (onError) onError(updatedBuilding);
                if (callback) await callback();

                // resolve(updatedBuilding);
                reject(error);
            }

        }));
        this.queue.push(task);
        console.log("Added new building to queue");
    }

   

    addExistingBuilding = async (building: Building) => {
        const task = new QueueTask(`${building.name} ${building.level}`, () => delay(building.duration));
        this.queue.push(task);
        console.log("Added existing building to queue");
    }

}
