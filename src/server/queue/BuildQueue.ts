import * as Queue from 'better-queue';
import QueueTask from '../model/queue/QueueTask';
import Duration from '../utility/Duration';
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
            // try {
            //     const updatedBuilding = await BuildBuilding(building);
            //     console.log("UpdatedBulding duration", updatedBuilding.duration);
            //     var delay = this.delay(updatedBuilding.duration);
            //     console.log(`Task ${updatedBuilding.name} is done`);
            //     resolve();
            // } catch (error) {
            //     console.log(error)
            //     reject(error)
            // }
            await BuildBuilding(building).then(updatedBuilding => {
                console.log("UpdatedBulding", updatedBuilding);
                console.log("UpdatedBulding duration", updatedBuilding.duration);

                const {duration} = updatedBuilding;
                this.delay(duration).then(response => {
                    console.log(`Task ${updatedBuilding.name} is done`);
                    resolve(updatedBuilding);
                }).catch(error => {
                    reject(error);
                });
            }).catch(error => {
                reject(error);
            });

        }));
            //     this.travianAPI.BuildBuilding(building).then(updatedBuilding => {
        //         if (updatedBuilding != null) {
        //             building = updatedBuilding;
        //             this.delay(updatedBuilding.duration).then(response => {
        //                 console.log(`Task ${updatedBuilding.name} is done`);
        //                 resolve(updatedBuilding);
        //             }).catch(error => {
        //                 reject(error);
        //             });
        //         } else {
        //             reject('update url not found');
        //         }
        //     }).catch(error => {
        //         reject(error);
        //     })
        // }));
        this.queue.push(task);
        console.log("Added new building to queue");
    

    }

    delay = (duration: string) => {
        console.log(`TUTEJ: ${duration}`);
        return new Promise((resolve, reject) => {
            console.log("duration!!", typeof duration);
            console.log("duration!!", duration);
            if (duration == null) reject("duration error");
            var duration = new Duration(duration);
            var timeLeft = new Duration("0:0:0");

            var intervalId = setInterval(() => {
                readline.clearLine(process.stdout, 0);
                readline.cursorTo(process.stdout, 0, null);
                process.stdout.write(`${timeLeft.GetString()} / ${duration.GetString()}`);
                timeLeft.AddSeconds(1);
            }, 1000);
            setTimeout(() => {
                clearInterval(intervalId);
                resolve()
            }, duration.GetMiliseconds());
        })
    }

    addExistingBuilding = async (building: Building) => {
        var task = new QueueTask(() => this.delay(building.duration));
        this.queue.push(task);
        console.log("Added existing building to queue");
    }

        
    
}
