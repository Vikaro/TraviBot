import BuildQueue from "../queue/BuildQueue";
import TravianAPI from "../TravianAPI";
import BuildingsStore from "./BuildingsStore";
import * as AsyncLock from 'async-lock';
import User from "../db";
import SmithQueue from "../queue/smithQueue";
import smithQueue from "../queue/smithQueue";
import Upgrade from "./upgrade";
export default class Village {
    private _buildingQueue: BuildQueue;
    // army
    private _baracksQueue;
    private _stableQueue;
    private _workshopQueue;
    // upgrades
    private _academyQueue;
    private _smithQueue: smithQueue;
    // merchants
    private _marketplaceQueue;
    // culture
    private _townhallQueue;

    public buildingStore: BuildingsStore;
    public smithyStore: { [key: string]: Upgrade };
    public api: TravianAPI;
    public user: User;
    public id: number;
    public isActive: boolean;
    public name: string;
    constructor(obj) {
        if (obj) {
            Object.assign(this, obj);
            const { api } = obj;
            this.buildingStore = new BuildingsStore();
            this._buildingQueue = new BuildQueue(this, this.user.lock);
            this._smithQueue = new SmithQueue(this);
        }

    }

    getBuildingsQueue = () => this._buildingQueue;
    getSmithyQueue = () => this._smithQueue;

}