import BuildingsStore from "./model/BuildingsStore";
import BuildQueue from "./queue/BuildQueue";
import { travianAPI } from "./TravianAPI";
import Village from "./model/Village";
import * as AsyncLock from 'async-lock';
import adventuresQueue from "./queue/adventuresQueue";
import Adventure from "./model/adventure";

// export const BuildingsDb = new BuildingsStore();
export const BuildQueues = {};

export default class User {
  public villages: { [id: string]: Village } = {};
  public adventuresQueue = new adventuresQueue(this);
  public adventures: {[id:string] : Adventure} = {};
  public lock = new AsyncLock({ domainReentrant: true });
  // public api = travianAPI;
}

export const User1 = new User();
// export const User = {
//   Villages: {id : string} : {},
// }