export default class Adventure {
    public location;
    public moveTime;
    public difficult;
    public id;

    constructor(obj) {
        if (obj) Object.assign(this, obj);
    }
}