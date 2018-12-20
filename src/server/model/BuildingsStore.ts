import Building,{maxLevel} from './Building';

const maxBuildingQueue = 5;
export default class BuildingsStore {
    public avilableBuildings: {} = {}
    // public actualQueue: Building[] = [];

    public GetUpgreadableBuildings() : Building[]{
        return this.GetBuildings().filter(el => el.level !== maxLevel)
            .sort((a, b) => a.level - b.level);
    }

    private GetBuildings(): Array<Building>{
        return Object.values(this.avilableBuildings)
    }

    public AddBuildings (buildings : Array<Building>){
        var newBuildings = {}

        buildings.forEach(building => {
            newBuildings = {...newBuildings, 
            [building.id] : building}
        });

        this.avilableBuildings = {
            ...this.avilableBuildings,
            ...newBuildings
        }
    }
}