import * as cors from 'cors';
import * as express from 'express';
import * as os from 'os';
import User, { User1 } from './db';
import Village from './model/Village';
import { getListOfAdventures } from './services/adventuresService';
import { addNewBuilding, autoUpgrade } from './services/buildingsService';
import { getMap } from './services/mapService';
import { sendResourcesToVillage } from './services/marketplaceService';
import { getUpgrades } from './services/smithyService';
import { getBarracksUnits, sendUnits, trainBarracksUnit } from './services/unitsService';
import { fetchInitialData, updateVillageInformation } from './services/villageService';
import RepeatableTask from './model/RepeatableTask';

const app = express();

// var buildQueue = new BuildQueue();
app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.listen(8080, () => console.log('Listening on port 8080!'));

function serializeUserVillages(userData: User) {
  let serializedUserData = {};
  for (const villageId in userData.villages) {
    const village: Village = userData.villages[villageId];
    const { buildingStore, id, isActive, name, unitsStore, resources } = village;
    serializedUserData[villageId] = {
      name,
      id,
      isActive,
      buildingStore,
      unitsStore,
      resources
    };
  }
  return serializedUserData;
}

app.get('/api/login', async (req, res) => {
  const userData = await fetchInitialData(User1);

  res.send(serializeUserVillages(userData));
});

app.get('/api/buildings', async (req, res) => {
  const userData = await fetchInitialData(User1);
  let result;

  for (const villageId in userData.villages) {
    const village: Village = userData.villages[villageId];
    const { buildingStore, id, isActive, name } = village;
    result = {
      ...result,
      [villageId]: {
        name,
        id,
        isActive,
        buildingStore
      }
    };
  }
  res.send(result);
});

app.get('/api/buildings/auto', async (req, res) => {
  // objs.sort((a,b) => (a.last_nom > b.last_nom) ? 1 : ((b.last_nom > a.last_nom) ? -1 : 0));
  const userData = User1;
  for (const villageId in userData.villages) {
    const village: Village = userData.villages[villageId];
    autoUpgrade(village);
  }
  res.send('');
});

app.get('/api/buildings/:buildingId', async (req, res) => {
  // var buildingId = req.params.buildingId;
  // if (!BuildingsDb.AvilableBuildings[buildingId]) {
  //     res.send(null);
  //     return;
  // }
  // buildQueue.addNewBuilding(BuildingsDb.AvilableBuildings[buildingId]);
  // res.send(BuildingsDb.AvilableBuildings[buildingId]);
});

app.get('/api/buildings/:buildingId/units', async (req, res) => {});

app.get('/api/adventures', async (req, res) => {
  const firstVillage = Object.keys(User1.villages)[0];
  let heroVillage = User1.villages[firstVillage];
  let { adventures, heroVillageId } = await getListOfAdventures(heroVillage);
  if (firstVillage !== heroVillageId) {
    heroVillage = User1.villages[heroVillageId];
    // update travel times
    const updatedValues = await getListOfAdventures(heroVillage);
    adventures = updatedValues.adventures;
  }

  User1.adventures = adventures;
  User1.adventuresQueue.setNewHeroVillage(heroVillage);

  res.send({ adventures, heroVillageId });
});

app.get('/api/adventures/auto', async (req, res) => {
  const allAdventures = Object.values(User1.adventures);
  allAdventures.forEach(adventure => {
    User1.adventuresQueue.addNewAdventure(adventure);
  });
  res.send('added all adventures to queue');
});

app.get('/api/adventures/:id', async (req, res) => {
  const { id } = req.params;

  User1.adventuresQueue.addNewAdventure(User1.adventures[id]);
  // await startAdventure(User1.heroVillageId, {id});
  res.send(`added ${id} adventure to queue`);
});

app.get('/api/villages', async (req, res) => {
  let promises = [];
  for (const villageId in User1.villages) {
    if (User1.villages.hasOwnProperty(villageId)) {
      const village = User1.villages[villageId];
      promises.push(updateVillageInformation(village));
    }
  }
  await Promise.all(promises);
  res.send(serializeUserVillages(User1));
});
app.get('/api/villages/:villageId/smithy', async (req, res) => {
  const { villageId } = req.params;
  const village = User1.villages[villageId];
  const response = await getUpgrades(village);
  village.smithyStore = response;
  res.send(response);
});

app.get('/api/villages/:villageId/smithy/auto', async (req, res) => {
  const { villageId } = req.params;
  const village = User1.villages[villageId];

  const upgrades = Object.keys(village.smithyStore);
  if (upgrades.length > 0) {
    const task = async () => {
      console.log(`village - ${villageId} smithy fetching new updates`);
      const response = await getUpgrades(village);
      village.smithyStore = response;
      const upgrades = Object.keys(village.smithyStore);
      if (upgrades.length > 0) {
        village.getSmithyQueue().add(upgrades[0], task);
      } else {
        console.log(`village - ${villageId} :: no more upgrades found `);
      }
    };
    village.getSmithyQueue().add(upgrades[0], task);
    res.send(`village - ${villageId} smithy auto upgrade`);
    return;
  }
  res.send(`village - ${villageId} smithy upgrades not found`);
});

app.get('/api/villages/:villageId/smithy/:upgradeId', async (req, res) => {
  const { villageId, upgradeId } = req.params;
  const village = User1.villages[villageId];
  village.getSmithyQueue().add(upgradeId);
  // const response = await upgrade()
  res.send(`upgrade ${upgradeId} added to queue`);
});

app.get('/api/villages/:villageId/barracks', async (req, res) => {
  const { villageId } = req.params;
  const village = User1.villages[villageId];

  const units = await getBarracksUnits(village);
  res.send(units);
});
app.get('/api/villages/:villageId/barracks/:unitId', async (req, res) => {
  const { villageId, unitId } = req.params;
  const { count } = req.query;
  if (!count) {
    res.send('parameter count not found');
    return;
  }
  const village = User1.villages[villageId];
  const units = await trainBarracksUnit(village, unitId, count);
  res.send(`started training ${unitId}`);
});

app.get('/api/villages/:villageId/new-building', async (req, res) => {
  const { villageId } = req.params;
  const { placeId, buildingId } = req.query;
  if (!placeId || !buildingId) {
    res.send('parameter placeId or buildingId is not found');
    return;
  }
  console.log(placeId, buildingId);
  const village = User1.villages[villageId];
  await addNewBuilding(village, { placeId, buildingId });
  res.send('new building is built');
});

const params = [
  {
    // rally point
    placeId: 39,
    buildingId: 16
  },
  {
    // earth wall
    placeId: 40,
    buildingId: 32
  },
  {
    // barracks

    requirements: {
      'Rally Point': 1,
      'Main Building': 3
    },
    placeId: 32,
    buildingId: 19
  },

  {
    // granary
    placeId: 21,
    buildingId: 11
  },
  {
    // warehouse
    placeId: 20,
    buildingId: 10
  },
  {
    // marketplace
    requirements: {
      'Main Building': 3,
      Warehouse: 1,
      Granary: 1
    },
    placeId: 31,
    buildingId: 17
  },
  {
    // academy
    requirements: {
      Barracks: 3,
      'Main Building': 3
    },
    placeId: 27,
    buildingId: 22
  },
  {
    requirements: {
      academy: 1
    },
    // smithy
    placeId: 28,
    buildingId: 12
  },
  {
    // sawmill
    requirements: {
      // "Woodcutter": 10, "Main Building ": 5
    },
    placeId: 36,
    buildingId: 5
  },
  {
    // bricks
    // requirements: { "Clay Pit": 10, "Main Building": 5 },
    placeId: 33,
    buildingId: 6
  },
  {
    // iron
    requirements: {
      // "Iron Mine ": 10, "Main Building": 5
    },
    placeId: 29,
    buildingId: 7
  },
  {
    // grain
    requirements: {
      // "Cropland":5
    },
    placeId: 25,
    buildingId: 8
  },
  {
    // cranny
    placeId: 22,
    buildingId: 23
  },
  {
    // stable
    requirements: {
      smithy: 3,
      academy: 5
    },
    placeId: 30,
    buildingId: 20
  },
  {
    // town hall
    requirements: {
      'main building': 10,
      academy: 10
    },
    placeId: 24,
    buildingId: 24
  },
  {
    // residence
    requirements: {
      'main building': 10
    },
    placeId: 34,
    buildingId: 25
  },
  {
    // bakery
    requirements: {
      // "Cropland" :10, "Main Building":5
    },
    placeId: 23,
    buildingId: 9
  },
  {
    // workshop
    requirements: {
      // "Cropland" :10, "Main Building":5
    },
    placeId: 35,
    buildingId: 21
  },
  {
    // great barracks
    requirements: {
      Barracks: 20
    },
    placeId: 37,
    buildingId: 29
  }
];
app.get('/api/villages/:villageId/new-buildings', async (req, res) => {
  const { villageId } = req.params;
  const village = User1.villages[villageId];
  // const { placeId, buildingId } = req.query;
  const func = index => {
    if (params.length <= index) return;
    addNewBuilding(village, params[index], () => func(++index));
  };
  if (params.length > 0) {
    addNewBuilding(village, params[0], () => func(0));
  }
  res.send('buildings added');
});

app.post('/api/villages/:villageId/send-resources', async (req, res) => {
  const { villageId } = req.params;
  const { iron, wood, clay, crop, targetId, repeat } = req.body;
  console.log(req.body);
  const village = User1.villages[villageId];
  if (repeat) {
    const task = new RepeatableTask({
      name: repeat.name,
      id: Object.keys(User1.repeatableTraderTasks.tasks).length,
      time: repeat.time,
      callback: () => sendResourcesToVillage(village, targetId, { iron, wood, clay, crop })
    });
    User1.repeatableUnitTasks.tasks[task.getId()] = task;
    task.start();
  } else {
    await sendResourcesToVillage(village, targetId, { iron, wood, clay, crop });
  }

  res.send('resources sent');
});

app.get('/api/map/', async (req, res) => {
  const map = {
    villages: []
  };
  const promises = [];
  const api = Object.values(User1.villages)[0].api;
  for (let x = -100; x < -50; x += 13) {
    for (let y = 100; y > 50; y -= 13) {
      promises.push(getMap(api, x, y));
    }
  }
  const maps = await Promise.all(promises);
  maps.forEach(el => {
    map.villages.push(...el.villages);
  });
  res.send(map);
});

const sendUnitsParams = {
  units: {
    t2: 30000
  },
  target: {
    x: -77,
    y: 59
  },
  type: 4
};
app.post('/api/villages/:villageId/send-units', async (req, res) => {
  const { villageId } = req.params;
  console.log(req.body);
  const village = User1.villages[villageId];
  const { units, target, type, repeat } = req.body;
  if (repeat) {
    const task = new RepeatableTask({
      name: repeat.name,
      id: Object.keys(User1.repeatableUnitTasks.tasks).length,
      time: repeat.time,
      callback: () => sendUnits(village, units, target, type)
    });
    User1.repeatableUnitTasks.tasks[task.getId()] = task;
    task.start();
  } else {
    await sendUnits(village, units, target, type);
  }
  res.send('units sent');
});
