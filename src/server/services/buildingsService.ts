import Building, { maxLevel } from "../model/Building";
import TravianAPI, { travianAPI } from "../TravianAPI";
import { parseBuildingPage, parseVillageList, parseResourcesPage } from "../parser/TravianParser";
import User, { User1 } from "../db";
import { exportToJsonFile } from "../utility/file";
import Village from "../model/Village";
import { updateVillageBuildings } from "./villageService";
import { parseNewBuildingCaptcha } from "../parser/buildingsParser";

// User is set as constant to User1 - Need fix

export async function upgradeBuilding(building: Building): Promise<Building> {
    const buildingFromPage = parseBuildingPage(await travianAPI.upgradeBuildingPage(building));
    const updatedBuilding = new Building({
        ...building,
        ...buildingFromPage
    });

    if (buildingFromPage.level !== maxLevel || buildingFromPage.level < buildingFromPage.maxLevel    ) {
        if (!buildingFromPage.upgradeUrl) throw new Error(`Error: ${buildingFromPage.name} :: ${buildingFromPage.id} - upgrade url not found`);
        const buildUpgradeResponse = await travianAPI.upgradeBuilding(buildingFromPage);
        if (!isNaN(buildingFromPage.level))++buildingFromPage.level;
    } else {
        console.log(`${buildingFromPage.name} :: level: ${buildingFromPage.level} is max level`);
    }

    return updatedBuilding;
}

export async function autoUpgrade(village: Village) {
    const { buildingStore } = village;
    const buildQueue = village.getBuildingsQueue();
    let sorted = buildingStore.getUpgreadableBuildings();
    let actualBuilding = undefined;

    const autoBuildFunction = async () => {
        const updateFunc = updateVillageBuildings(village)
        const sorted = buildingStore.getUpgreadableBuildings();
        if (sorted.length > 0) {
            buildQueue.upgradeBuilding(sorted[0].id, autoBuildFunction);
        }
        await updateFunc;
    };


    if (sorted.length > 0) {
        actualBuilding = sorted[0];
        buildQueue.upgradeBuilding(actualBuilding.id, autoBuildFunction);
        return actualBuilding;
    }
    return null;
}

export async function addNewBuilding(village: Village, params) {
    const { placeId, buildingId, requirements } = params;
    const place = village.buildingStore.availableBuildings[placeId];
    if (!place || !(place.name === 'Empty place' || place.name === 'Construction Site')) {
        console.error(`${village.name} :: ${placeId} :: error - something is already built on this place`);
        return;
    }
    
    const buildQueue = village.getBuildingsQueue();
    buildQueue.addNewBuilding(params);
}