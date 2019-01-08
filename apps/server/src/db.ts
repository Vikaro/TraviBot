import Village from './model/Village';
import * as AsyncLock from 'async-lock';
import adventuresQueue from './queue/adventuresQueue';
import Adventure from './model/adventure';
import TravianAPI from './TravianAPI';
import RepeatableTask from 'model/RepeatableTask';

// export const BuildingsDb = new BuildingsStore();
export const BuildQueues = {};
interface IRepeatableTasksRepository {
  tasks: { [id: number]: RepeatableTask };
}
export default class User {
  public villages: { [id: string]: Village } = {};
  public adventuresQueue = new adventuresQueue(this);
  public adventures: { [id: string]: Adventure } = {};
  public lock = new AsyncLock({ domainReentrant: true });
  public api = new TravianAPI();
  public repeatableUnitTasks: IRepeatableTasksRepository = { tasks: {} };
  public repeatableTraderTasks: IRepeatableTasksRepository = { tasks: {} };
}

export const User1 = new User();
// export const User = {
//   Villages: {id : string} : {},
// }
