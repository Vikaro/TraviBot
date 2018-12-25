import BuildQueue from "../queue/BuildQueue";
import TravianAPI from "../TravianAPI";
import BuildingsStore from "./BuildingsStore";
import * as AsyncLock from 'async-lock';
import User from "../db";
export default class Village {
    private _buildingQueue: BuildQueue;
    // army
    private _baracksQueue;
    private _stableQueue;
    private _workshopQueue;
    // upgrades
    private _academyQueue;
    private _smithQueue;
    // merchants
    private _marketplaceQueue;
    // culture
    private _townhallQueue;

    public buildingStore : BuildingsStore;
    public api: TravianAPI;
    public user: User;
    public id: number;
    public isActive : boolean;
    public name : string;
    constructor(obj){
        if (obj) {
            Object.assign(this, obj);
            const {api} = obj;
            this.buildingStore = new BuildingsStore();
            this._buildingQueue = new BuildQueue(this, this.user.lock);
        }

    }

    getBuildingsQueue(){
       return this._buildingQueue; 
    }

}