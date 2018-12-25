import * as Queue from 'better-queue';
import QueueTask from '../model/queue/QueueTask';
import * as AsyncLock from 'async-lock';
import User from '../db';
import { changeVillage } from '../services/villageService';
import { delay } from '../utility/Duration';
import * as smithService from '../services/smithyService';
import Upgrade from '../model/upgrade';
import Village from '../model/Village';

export default class smithQueue {
    private queue: Queue;
    private _village: Village;
    constructor(village) {
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

        data.Run().then((res) => {
            console.log("finished", res);
            done(null, res);
        }).catch((error) => {
            console.error(error);
            done(error, null);
        });
    }

    add(upgradeId: string, callback?: () => void) {
        const upgrade =  this._village.smithyStore[upgradeId];
        var task = new QueueTask(`${upgrade.title}`, () => new Promise(async (resolve, reject) => {
            // let updatedBuilding: Building, duration;
            try {
                if (!this._village.isActive) await changeVillage(this._village)

                await smithService.upgrade(this._village, upgrade.id)

                await delay(upgrade.duration);
                if (callback) callback();
                resolve(upgrade.title);
            } catch (error) {
                console.log(error.description);
                if (callback) callback();

                reject(error);
            }
        }));
        this.queue.push(task);
        console.log("Added smithy upgrade to queue");
    }
}