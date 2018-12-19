import BuildQueue from "../queue/BuildQueue";
import TravianAPI from "../TravianAPI";

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

    public api: TravianAPI;
    public id: number;
    constructor(obj){
        if (obj) {
            Object.assign(this, obj);
            const {api, id} = obj;
        }
    }


}