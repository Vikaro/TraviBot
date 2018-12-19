import * as Queue from 'better-queue';
import QueueTask from '../model/queue/QueueTask';
import Time from '../utility/Duration';
import Building from '../model/Building';
import TravianAPI from '../TravianAPI';
import { stat } from 'fs';

import { BuildBuilding } from '../services/buildingsService'
var readline = require('readline');

export default class BuildQueue {
    private queue: Queue;
    private travianAPI: TravianAPI;
    constructor(travianAPI: TravianAPI) {
        this.travianAPI = travianAPI

        this.queue = new Queue(this.process, { maxRetries: 1, retryDelay: 1000 });
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

    addNewBuilding = (building: Building) => {

        var task = new QueueTask(() => new Promise(async (resolve, reject) => {
            // await BuildBuilding(building).then(updatedBuilding => {
            //     const {duration} = updatedBuilding;
            //     this.delay(duration).then(response => {
            //         resolve(updatedBuilding);
            //     }).catch(error => {
            //         reject(error);
            //     });
            // }).catch(error => {
            //     reject(error);
            // });
            try {
                const updatedBuilding = await BuildBuilding(building);
                const { duration } = updatedBuilding;
                const response = await this.delay(duration)
                resolve(updatedBuilding);
            } catch (error) {
                console.log(error.description);
                reject(error);
            }

        }));
        this.queue.push(task);
        console.log("Added new building to queue");
    }

    delay = (time: string) => {
        return new Promise((resolve, reject) => {
            if (time == null) reject("duration error");
            const due = new Time(time);
            const timeLeft = new Time("0:0:0");

            const intervalId = setInterval(() => {
                readline.clearLine(process.stdout, 0);
                readline.cursorTo(process.stdout, 0, null);
                process.stdout.write(`${timeLeft.GetString()} / ${due.GetString()}`);
                timeLeft.AddSeconds(1);
            }, 1000);
            setTimeout(() => {
                clearInterval(intervalId);
                resolve()
            }, due.GetMiliseconds());
        })
    }

    addExistingBuilding = async (building: Building) => {
        const task = new QueueTask(() => this.delay(building.duration));
        this.queue.push(task);
        console.log("Added existing building to queue");
    }



}
