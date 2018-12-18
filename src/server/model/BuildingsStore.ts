import Building,{maxLevel} from './Building';


export default class BuildingsStore {
    public AvilableBuildings: {} = {}
    public ActualQueue: Building[] = [];

    public GetUpgreadableBuildings() : Building[]{
        return this.GetBuildings().filter(el => el.level != maxLevel)
            .sort((a, b) => a.level - b.level);
    }

    private GetBuildings(): Array<Building>{
        return Object.values(this.AvilableBuildings)
    }

    public AddBuildings (buildings : Array<Building>){
        var newBuildings = {}

        buildings.forEach(building => {
            newBuildings = {...newBuildings, 
            [building.id] : building}
        });

        this.AvilableBuildings = {
            ...this.AvilableBuildings,
            ...newBuildings
        }
    }
}