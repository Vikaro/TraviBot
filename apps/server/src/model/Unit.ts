import Building from "./Building";

export default class Unit {
    public id : string; 
    public title : string;
    public available : number;
    public building : Building;
    constructor(obj) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
}