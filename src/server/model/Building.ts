import Duration from "../utility/Duration";

const max20level = ['Cropland', 'Iron Mine', 'Clay Pit', 'Woodcutter', 'Marketplace', 'Granary', 'Rally Point', 'Earth Wall', 'Marketplace', 'Smithy', 'Heromansion', 'Main Building']
const max10level = ['Warehouse', 'Academy', 'Treasury']
const unknownLevel = ['Residence', 'Embassy']

export const maxLevel = "max";

export default class Building {
    public resources: Array<object>;
    public name: string;
    public duration: string;
    public url: string;
    public upgradeUrl: string;
    public unitsUrl: Array<string>;
    public level: any;
    public maxLevel: any;
    public id: string;

    constructor(obj) {
        if (obj) {
            Object.assign(this, obj);
            this.id = this._setId();
            this.level = this._setLevel();
        }
    }
    // constructor(name: string, href: string, resources: Array<Object>, duration: string) {
    //     this.name = name.trim();
    //     this.url = href;
    //     this.resources = resources;
    //     this.duration = duration;
    //     this.GetMaxLevel(this.name);
    //     this.id = this.GetId(href);
    // }

    private _getMaxLevel(name) {
        if (max20level.filter(item => item === name).length > 0) this.maxLevel = 20;
        if (max10level.filter(item => item === name).length > 0) this.maxLevel = 10;
    }

    private _setId(): string {
        if (this.url) {
            const splitted = this.url.split("id=");
            return splitted.length > 1 ? splitted[1] : undefined;
        }
        return undefined;
    }

    public _setLevel() {
        if (this.level) {
            console.log(this.level);
            console.log(typeof (this.level));
            if (typeof (this.level) == "string") {
                this.level = this.level.replace(/level/ig, '')
                this.level = this.level.trim();
                return parseInt(this.level) == this.level ? parseInt(this.level) : this.level;
            } else return this.level;

        }
    }
}