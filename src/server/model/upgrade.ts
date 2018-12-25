export default class Upgrade {
    public id;
    public title;
    public link;
    public duration;
    constructor(obj) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
}