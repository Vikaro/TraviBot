import Building, { maxLevel } from './Building';
import { objectFilterKey } from '../utility/object';

const maxBuildingQueue = 5;
export default class BuildingsStore {
    public avilableBuildings: {} = {}
    // public actualQueue: Building[] = [];

    public GetUpgreadableBuildings(): Building[] {
        return this.GetBuildings().filter(el => el.level !== maxLevel)
            .sort((a, b) => a.level - b.level);
    }

    public GetSmithy() : Building {
        return this.GetBuildings().find(el => el.name.includes('Smithy'))
    }

    public GetAcademy(): Building {
        return this.GetBuildings().find(el => el.name.includes('Academy'))
    }

    public GetTownHall(): Building {
        return this.GetBuildings().find(el => el.name.includes('Town Hall'))
    }

    public GetBuildings(): Array<Building> {
        return Object.values(this.avilableBuildings)
    }

    public addBuildings(buildings: Array<Building>) {
        var newBuildings = {}

        buildings.forEach(building => {
            newBuildings[building.id] = building;
        });

        this.avilableBuildings = {
            ...this.avilableBuildings,
            ...newBuildings
        }
    }

    public removeBuilding(building: Building) {
        var newAvailableBuildings = objectFilterKey(this.avilableBuildings, obj => obj !== building.id)
        this.avilableBuildings = newAvailableBuildings;
        return newAvailableBuildings;
    }
}