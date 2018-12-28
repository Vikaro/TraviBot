import Building, { maxLevel } from './Building';
import { objectFilterKey } from '../utility/object';

const maxBuildingQueue = 5;
export default class BuildingsStore {
    public availableBuildings: { [key: string]: Building } = {}
    // public actualQueue: Building[] = [];

    public getUpgreadableBuildings(): Building[] {
        return this.getBuildings()
        .filter(el => el.level !== maxLevel 
            && (el.maxLevel !== undefined && el.level < el.maxLevel))
            .sort((a, b) => a.level - b.level);
    }
    public getByName(name): Building { return this.getBuildings().find(el => el.name.toLowerCase().includes(name.toLowerCase())) };
    public getSmithy(): Building {
        return this.getBuildings().find(el => el.name.includes('Smithy'))
    }
    public getMarketplace(): Building {
        return this.getBuildings().find(el => el.name.includes('Marketplace'))
    }

    public getAcademy(): Building {
        return this.getBuildings().find(el => el.name.includes('Academy'))
    }

    public getTownHall(): Building {
        return this.getBuildings().find(el => el.name.includes('Town Hall'))
    }

    public getBarracks(): Building {
        return this.getBuildings().find(el => el.name.includes('Barracks'))
    }

    public getGreatBarracks(): Building {
        return this.getBuildings().find(el => el.name.includes('Great Barracks'))
    }

    public getStable(): Building {
        return this.getBuildings().find(el => el.name.includes('Stable'))
    }

    public getGreatStable(): Building {
        return this.getBuildings().find(el => el.name.includes('Great Stable'))
    }

    public getBuildings(): Array<Building> {
        return Object.values(this.availableBuildings)
    }

    public addBuildings(buildings: Array<Building>) {
        var newBuildings = {}

        buildings.forEach(building => {
            newBuildings[building.id] = building;
        });

        this.availableBuildings = {
            ...this.availableBuildings,
            ...newBuildings
        }
    }

    public removeBuilding(building: Building) {
        var newAvailableBuildings = objectFilterKey(this.availableBuildings, obj => obj !== building.id)
        this.availableBuildings = newAvailableBuildings;
        return newAvailableBuildings;
    }
}