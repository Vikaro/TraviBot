import BuildingsStore from "./model/BuildingsStore";
import BuildQueue from "./queue/BuildQueue";
import { travianAPI } from "./TravianAPI";
import Village from "./model/Village";

// export const BuildingsDb = new BuildingsStore();
export const BuildQueues = {};

export default class User {
  public Villages: { [id: string]: Village } = {};
}

export const User1 = new User();
// export const User = {
//   Villages: {id : string} : {},
// }