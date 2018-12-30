import * as Queue from 'better-queue';
import QueueTask from '../model/queue/QueueTask';
import * as AsyncLock from 'async-lock';
import Adventure from '../model/adventure';
import User from '../db';
import { changeVillage } from '../services/villageService';
import { startAdventure } from '../services/adventuresService';
import { delay } from '../utility/Duration';

export default class adventuresQueue {
    private queue: Queue;
    private _user: User;
    constructor(user) {
        this._user = user;
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
        });
    }

    addNewAdventure(adventure: Adventure, callback?: () => void) {
        var task = new QueueTask(`${adventure.id}`, () => new Promise(async (resolve, reject) => {
            // let updatedBuilding: Building, duration;
            try {
                const { heroVillageId } = this._user;
                if (!this._user.villages[heroVillageId].isActive) await changeVillage(this._user.villages[heroVillageId])

                await startAdventure(adventure)

                await delay(adventure.moveTime);
                await delay(adventure.moveTime);
                if (callback) callback();
                resolve();
            } catch (error) {
                console.log(error.description);
                if (callback) callback();

                reject(error);
            }
        }));
        this.queue.push(task);
        console.log("Added new adventure to queue");
    }
}