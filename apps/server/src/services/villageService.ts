import Village from '../model/Village';
import TravianAPI from '../TravianAPI';
import {
  parseVillageList,
  parseResourcesPage,
  parseVillageBuildings,
  parseTroops
} from '../parser/TravianParser';
import User from '../db';
import * as request from 'superagent';
import { villageLock } from './locksService';

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
  const loginRes = await user.api.LoginUser();
  // let resourcePage = await travianAPI.resourcesPage();
  const parsedVillages = parseVillageList(loginRes);
  const promises = [];
  for (const [index, parsedVillage] of parsedVillages.entries())
    promises.push(createVillageContext(user, parsedVillage, index === 0 ? user.api : undefined));

  const villagesArr = await Promise.all(promises);
  villagesArr.forEach((village: Village) => {
    user.villages[village.id] = village;
  });
  return user;
}

async function createVillageContext(
  user: User,
  villageDetails: any,
  api?: TravianAPI
): Promise<Village> {
  const villageAPI = api || new TravianAPI();
  if (!api) {
    await villageAPI.LoginUser();
    await villageAPI.changeVillage(villageDetails.id);
  }
  const village = new Village({
    api: villageAPI,
    id: villageDetails.id,
    isActive: villageDetails.isActive,
    name: villageDetails.name,
    user
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
