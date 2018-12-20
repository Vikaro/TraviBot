import Building from "../model/Building";
import TravianAPI, { travianAPI } from "../TravianAPI";
import { ParseBuildingPage, parseVillageList, ParseResourcesPage } from "../parser/TravianParser";
import User, { User1 } from "../db";
import { exportToJsonFile } from "../utility/file";
import Village from "../model/Village";


export async function BuildBuilding(building: Building): Promise<Building> {
    const buildingFromPage = await travianAPI.BuildingPage(building).then(res => {
        return res;
    }).then(ParseBuildingPage);
    if (!buildingFromPage.upgradeUrl) throw new Error(`Error: ${buildingFromPage.name} :: ${buildingFromPage.id} - upgrade url not found`);
    const buildUpgradeResponse = await travianAPI.BuildingUpgrade(buildingFromPage);
    if (!isNaN(buildingFromPage.level))++buildingFromPage.level;
    const updatedBuilding = new Building({
        ...building,
        ...buildingFromPage
    });
    return updatedBuilding;
}

export async function FetchInitialData(): Promise<User> {
    const resourcePage = await travianAPI.ResourcesPage();
    const parsedVillages = parseVillageList(resourcePage);
    for (const parsedVillage of parsedVillages) {
        User1.Villages = {
            ...User1.Villages,
            [parsedVillage.id]: new Village({
                api: travianAPI,
                id: parsedVillage.id,
                isActive: parsedVillage.isActive,
                name: parsedVillage.name
            })
        }
    }
    for (const villageId in User1.Villages) {
        const village = User1.Villages[villageId];
        if (village.isActive) {
            const { actualQueue, buildings } = ParseResourcesPage(resourcePage);
            actualQueue.forEach(element => {
                village.GetBuildingsQueue().addExistingBuilding(element);
            });
            const villageBuildings = await travianAPI.GetVillageBuildings()
            village.buildingStore.AddBuildings(buildings);
            village.buildingStore.AddBuildings(villageBuildings);
        } else {
            // redirect using village id
            // fetch resources page
            // fetch village page
        }
    }
    return User1;

    // const queue = village.GetBuildingsQueue();
    // const buildings = await travianAPI.GetResourceBuildings();
    // buildings.ActualQueue.forEach(el => {
    //     queue.addExistingBuilding(el);
    // });

    // BuildingsDb.ActualQueue = buildings.ActualQueue;
    // BuildingsDb.AvilableBuildings = buildings.AvilableBuildings;
    // BuildingsDb.AddBuildings(await travianAPI.GetVillageBuildings());
}

export async function AutoBuild(village: Village) {
    const { buildingStore } = village;
    const buildQueue = village.GetBuildingsQueue();

    console.log("auto");
    let sorted = buildingStore.GetUpgreadableBuildings();
    const buildFunction = () => {
        const sorted = buildingStore.GetUpgreadableBuildings();
        if (sorted.length > 0) {
            console.log(sorted[0])
            buildQueue.addNewBuilding(sorted[0], buildFunction);
        }
    };
    if (sorted.length > 0) {
        console.log(sorted[0]);
        buildQueue.addNewBuilding(sorted[0], buildFunction);
        return sorted[0];
    }
    return null;
}