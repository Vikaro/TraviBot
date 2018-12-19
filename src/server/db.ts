import BuildingsStore from "./model/BuildingsStore";
import BuildQueue from "./queue/BuildQueue";
import { travianAPI } from "./TravianAPI";

export const BuildingsDb = new BuildingsStore();
export const BuildQueues = {};

export function CreateNewBuildQueue(villageId) {
  BuildQueues[villageId] =  new BuildQueue(travianAPI)
}