import { objectFilterKey } from "../utility/object";
import Building, { maxLevel } from "./Building";

export default class BuildingsStore {
  public buildings: { [key: string]: Building } = {};
  // public actualQueue: Building[] = [];

  public getUpgreadableBuildings(): Building[] {
    return this.getBuildings()
      .filter(
        el =>
          el.level !== maxLevel &&
          (el.maxLevel !== undefined && el.level < el.maxLevel)
      )
      .sort((a, b) => a.level - b.level);
  }
  public getByName(name): Building {
    return this.getBuildings().find(el =>
      el.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  public getSmithy(): Building {
    return this.getBuildings().find(el => el.name.includes("Smithy"));
  }
  public getMarketplace(): Building {
    return this.getBuildings().find(el => el.name.includes("Marketplace"));
  }

  public getAcademy(): Building {
    return this.getBuildings().find(el => el.name.includes("Academy"));
  }

  public getTownHall(): Building {
    return this.getBuildings().find(el => el.name.includes("Town Hall"));
  }

  public getBarracks(): Building {
    return this.getBuildings().find(el => el.name.includes("Barracks"));
  }

  public getGreatBarracks(): Building {
    return this.getBuildings().find(el => el.name.includes("Great Barracks"));
  }

  public getStable(): Building {
    return this.getBuildings().find(el => el.name.includes("Stable"));
  }

  public getGreatStable(): Building {
    return this.getBuildings().find(el => el.name.includes("Great Stable"));
  }

  public getBuildings(): Building[] {
    return Object.values(this.buildings);
  }

  public addBuildings(buildings: Building[]) {
    const newBuildings = {};

    buildings.forEach(building => {
      newBuildings[building.id] = building;
    });

    this.buildings = {
      ...this.buildings,
      ...newBuildings
    };
  }

  public removeBuilding(building: Building) {
    const newAvailableBuildings = objectFilterKey(
      this.buildings,
      obj => obj !== building.id
    );
    this.buildings = newAvailableBuildings;
    return newAvailableBuildings;
  }
}
