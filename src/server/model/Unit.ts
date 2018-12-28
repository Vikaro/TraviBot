import Building from "./Building";

export default class Unit {
    public id; 
    public title;
    public available;
    public building : Building;
    constructor(obj) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
}