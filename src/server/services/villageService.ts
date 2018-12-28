import Village from "../model/Village";
import { travianAPI } from "../TravianAPI";
import { parseVillageList, parseResourcesPage, parseVillageBuildings } from "../parser/TravianParser";
import User, { User1 } from "../db";
import * as request from 'superagent';

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
    let resourcePage = await travianAPI.resourcesPage();
    const parsedVillages = parseVillageList(resourcePage);
    let villages = {};
    for (const parsedVillage of parsedVillages) {
        villages[parsedVillage.id] = new Village({
            api: travianAPI,
            id: parsedVillage.id,
            isActive: parsedVillage.isActive,
            name: parsedVillage.name,
            user: user
        })
    }
    user.villages = villages;
    for (const villageId in user.villages) {
        const village = user.villages[villageId];
        await updateVillageBuildings(village);
    }

    return user;
}


export async function updateVillageBuildings(village: Village) {
    const resourcePage = await changeVillage(village);
    const { actualQueue, resourceBuildings } = parseResourcesPage(resourcePage);
    actualQueue.forEach(element => {
        village.getBuildingsQueue().addExistingTask(element);
    });
    const villageBuildings = parseVillageBuildings(await travianAPI.villagePage());
    village.buildingStore.addBuildings(resourceBuildings);
    village.buildingStore.addBuildings(Object.values(villageBuildings));
}