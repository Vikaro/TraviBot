import Building, { maxLevel } from "../model/Building";
import { parseBuildingPage, parseVillageList, parseResourcesPage } from "../parser/TravianParser";
import Village from "../model/Village";
import { updateVillageInformation } from "./villageService";


export async function upgradeBuilding(village : Village, building: Building): Promise<Building> {
    const buildingFromPage = parseBuildingPage(await village.api.upgradeBuildingPage(building));
    const updatedBuilding = new Building({
        ...building,
        ...buildingFromPage
    });

    if (buildingFromPage.level !== maxLevel || buildingFromPage.level < buildingFromPage.maxLevel    ) {
        if (!buildingFromPage.upgradeUrl) throw new Error(`Error: ${buildingFromPage.name} :: ${buildingFromPage.id} - upgrade url not found`);
        const buildUpgradeResponse = await village.api.upgradeBuilding(buildingFromPage);
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
        const updateFunc = updateVillageInformation(village)
        const sorted = buildingStore.getUpgreadableBuildings();
        if (sorted.length > 0) {
            buildQueue.upgradeBuilding(sorted[0].id, autoBuildFunction);
        }
        // await updateFunc;
    };


    if (sorted.length > 0) {
        actualBuilding = sorted[0];
        buildQueue.upgradeBuilding(actualBuilding.id, autoBuildFunction);
        return actualBuilding;
    }
    return null;
}

export async function addNewBuilding(village: Village, params, callback?) {
    const { placeId, buildingId, requirements } = params;
    const place = village.buildingStore.buildings[placeId];
    if (!place || !(place.name === 'Empty place' || place.name === 'Construction Site')) {
        console.error(`${village.name} :: ${placeId} :: error - something is already built on this place`);
        callback();
        return;
    }
    
    const buildQueue = village.getBuildingsQueue();
    buildQueue.addNewBuilding(params, callback);
}