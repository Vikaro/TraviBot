import Village from "../model/Village";
import TravianAPI, { travianAPI } from "../TravianAPI";
import { parseVillageList, parseResourcesPage, parseVillageBuildings, parseTroops } from "../parser/TravianParser";
import User, { User1 } from "../db";
import * as request from 'superagent';
import { villageLock } from "./locksService";

export async function changeVillage(village: Village): Promise<request.Response> {
    const response = await village.api.changeVillage(village.id);
    setAllVillagesAsInactive(village.user);
    village.isActive = true;
    console.log(`Changed village to ${village.name}`);
    return response;
}

export async function setAllVillagesAsInactive(user: User) {
    for (const key in user.villages) {
        if (user.villages.hasOwnProperty(key)) {
            const village = user.villages[key];
            village.isActive = false;
        }
    }
}

export async function fetchInitialData(user: User): Promise<User> {
    const loginRes = await travianAPI.LoginUser();
    // let resourcePage = await travianAPI.resourcesPage();
    const parsedVillages = parseVillageList(loginRes);
    const promises = [];
    for (const parsedVillage of parsedVillages) {
        promises.push(createVillageContext(user, parsedVillage));
        // const villageAPI = new TravianAPI();
        // await villageAPI.LoginUser();
        // await villageAPI.changeVillage(parsedVillage.id);
        // villages[parsedVillage.id] = new Village({
        //     api: villageAPI,
        //     id: parsedVillage.id,
        //     isActive: parsedVillage.isActive,
        //     name: parsedVillage.name,
        //     user,
        // });
    }
    // user.villages = villages;
    // for (const villageId in user.villages) {
    //     const village = user.villages[villageId];
    //     await updateVillageBuildings(village);
    // }
    const villagesArr = await Promise.all(promises);
    villagesArr.forEach((village: Village) => {
        user.villages[village.id] = village;
    });
    return user;
}

async function createVillageContext(user: User, villageDetails: any): Promise<Village> {
    const villageAPI = new TravianAPI();
    await villageAPI.LoginUser();
    await villageAPI.changeVillage(villageDetails.id);
    const village = new Village({
        api: villageAPI,
        id: villageDetails.id,
        isActive: villageDetails.isActive,
        name: villageDetails.name,
        user,
    });
    await updateVillageInformation(village);
    return village;
}

export async function updateVillageInformation(village: Village) {
    await villageLock(village.user.lock, village, async () => {
        const resourcePage = village.api.resourcesPage();
        const villagePage = village.api.villagePage();

        const resourceData = await resourcePage;
        const { actualQueue, resourceBuildings } = parseResourcesPage(resourceData);
        actualQueue.forEach(element => {
            village.getBuildingsQueue().addExistingTask(element);
        });
        const villageData = Object.values(parseVillageBuildings(await villagePage));
        
        village.buildingStore.addBuildings(resourceBuildings);
        village.buildingStore.addBuildings(villageData);
        village.unitsStore.addUnits(parseTroops(resourceData));
    });
}