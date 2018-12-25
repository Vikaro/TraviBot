import Building from "../model/Building";
import TravianAPI, { travianAPI } from "../TravianAPI";
import { parseBuildingPage, parseVillageList, parseResourcesPage } from "../parser/TravianParser";
import User, { User1 } from "../db";
import { exportToJsonFile } from "../utility/file";
import Village from "../model/Village";
import { getVillageBuildings } from "./villageService";

// User is set as constant to User1 - Need fix

export async function BuildBuilding(building: Building): Promise<Building> {
    const buildingFromPage = await travianAPI.BuildingPage(building).then(res => {
        return res;
    }).then(parseBuildingPage);
    if (!buildingFromPage.upgradeUrl) throw new Error(`Error: ${buildingFromPage.name} :: ${buildingFromPage.id} - upgrade url not found`);
    const buildUpgradeResponse = await travianAPI.buildingUpgrade(buildingFromPage);
    if (!isNaN(buildingFromPage.level))++buildingFromPage.level;
    const updatedBuilding = new Building({
        ...building,
        ...buildingFromPage
    });
    return updatedBuilding;
}

export async function AutoBuild(village: Village) {
    const { buildingStore } = village;
    const buildQueue = village.getBuildingsQueue();
    let sorted = buildingStore.GetUpgreadableBuildings();
    let actualBuilding = undefined;

    const buildFunction = async () => {
        await getVillageBuildings(village)
        const sorted = buildingStore.GetUpgreadableBuildings();
        if (sorted.length > 0) {
            console.log("actualBuilding", actualBuilding);
            console.log(sorted[0])
            buildQueue.addNewBuilding(sorted[0], buildFunction);
        }
    };

  
    if (sorted.length > 0) {
        actualBuilding = sorted[0];
        console.log(actualBuilding);
        buildQueue.addNewBuilding(actualBuilding, buildFunction);
        return actualBuilding;
    }
    return null;
}