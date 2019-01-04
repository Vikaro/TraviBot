import * as AsyncLock from "async-lock";
import * as Queue from "better-queue";
import User from "../db";
import QueueTask from "../model/queue/QueueTask";
import Upgrade from "../model/Upgrade";
import Village from "../model/Village";
import { villageLock } from "../services/locksService";
import * as smithService from "../services/smithyService";
import { changeVillage } from "../services/villageService";
import { delay } from "../utility/Duration";

export default class smithQueue {
    private queue: Queue;
    private _village: Village;
    constructor(village) {
        this._village = village;
        this.queue = new Queue(this.process, { maxRetries: 10, retryDelay: 1000 });
        this.queue.on("task_finish", (taskId, result, stats) => {
            // taskId = 1, result: 3, stats = { elapsed: <time taken> }
            // taskId = 2, result: 5, stats = { elapsed: <time taken> }
            console.log(taskId, result, stats);
        });
        this.queue.on("task_failed", (taskId, err, stats) => {
            // Handle error, stats = { elapsed: <time taken> }
            console.error(taskId, err, stats);
        });
    }

    public add = (upgradeId: string, callback?: () => void) => {
        const upgrade = this._village.smithyStore[upgradeId];
        const task = new QueueTask(`${upgrade.title}`, () => new Promise(async (resolve, reject) => {
            // let updatedBuilding: Building, duration;
            try {
                await smithService.upgrade(this._village, upgrade.id);
                await delay(upgrade.duration);
                if (callback) {
                    callback();
                }
                resolve(upgrade.title);
            } catch (error) {
                console.log(error.description);
                if (callback) {
                    callback();
                }
                reject(error);
            }
        }));
        this.queue.push(task);
        console.log("Added smithy upgrade to queue");
    }

    private process = (data: QueueTask, done: Queue.ProcessFunctionCb<any>) => {

        data.Run().then((res) => {
            console.log("finished", res);
            done(null, res);
        }).catch((error) => {
            console.error(error);
            done(error, null);
        });
    }
}
