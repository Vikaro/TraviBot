import BuildQueue from '../queue/BuildQueue';
import TravianAPI from '../TravianAPI';
import BuildingsStore from './BuildingsStore';
import User from '../db';
import SmithQueue from '../queue/smithQueue';
import smithQueue from '../queue/smithQueue';
import Upgrade from './Upgrade';
import * as domain from 'domain';
import UnitsStore from './UnitsStore';

export default class Village {
  public buildingStore: BuildingsStore;
  public smithyStore: { [key: string]: Upgrade };
  public unitsStore: UnitsStore;
  public api: TravianAPI;
  public user: User;
  public id: number;
  public isActive: boolean;
  public name: string;
  public domain = domain.create();

  private _buildingQueue: BuildQueue;
  // army
  //   private _baracksQueue;
  //   private _stableQueue;
  //   private _workshopQueue;
  // upgrades
  private _academyQueue;
  private _smithQueue: smithQueue;
  // merchants
  private _marketplaceQueue;
  // culture
  private _townhallQueue;
  constructor(obj) {
    if (obj) {
      Object.assign(this, obj);
      const { api } = obj;
      this.buildingStore = new BuildingsStore();
      this.unitsStore = new UnitsStore();
      this._buildingQueue = new BuildQueue(this, this.user.lock);
      this._smithQueue = new SmithQueue(this);
    }
  }

  getBuildingsQueue = () => this._buildingQueue;
  getSmithyQueue = () => this._smithQueue;
}
