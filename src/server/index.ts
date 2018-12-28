import * as express from 'express';
import * as os from 'os';
import TravianAPI, { travianAPI } from './TravianAPI';
import BuildingsStore from './model/BuildingsStore';
import BuildQueue from './queue/BuildQueue';
// import { BuildingsDb } from './db';
import Building from './model/Building';
import { autoUpgrade, addNewBuilding } from './services/buildingsService';
import Village from './model/Village';
import { User1 } from './db';
import { fetchInitialData } from './services/villageService';
import { getListOfAdventures, startAdventure } from './services/adventuresService';
import { getUpgrades, upgrade } from './services/smithyService';
import { getBarracksUnits, trainBarracksUnit } from './services/unitsService';
import { sendResourcesToVillage } from './services/marketplaceService';
import { getMap } from './services/mapService';
const app = express();




// var buildQueue = new BuildQueue();
app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.listen(8080, () => console.log('Listening on port 8080!'));

app.get('/api/login', async (req, res) => {
    var loginRes = await travianAPI.LoginUser();
    var userData = await fetchInitialData(User1);
    let result;

    for (const villageId in userData.villages) {
        const village: Village = userData.villages[villageId];
        const { buildingStore, id, isActive, name } = village
        result = {
            ...result,
            [villageId]: {
                name, id, isActive, buildingStore
            }
        };
    }
    res.send(result);
})


app.get('/api/buildings', async (req, res) => {
    var userData = await fetchInitialData(User1);
    let result;

    for (const villageId in userData.villages) {
        const village: Village = userData.villages[villageId];
        const { buildingStore, id, isActive, name } = village
        result = {
            ...result,
            [villageId]: {
                name, id, isActive, buildingStore
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
    res.send("");
})

app.get('/api/buildings/:buildingId', async (req, res) => {
    // var buildingId = req.params.buildingId;
    // if (!BuildingsDb.AvilableBuildings[buildingId]) {
    //     res.send(null);
    //     return;
    // }
    // buildQueue.addNewBuilding(BuildingsDb.AvilableBuildings[buildingId]);
    // res.send(BuildingsDb.AvilableBuildings[buildingId]);
})

app.get('/api/buildings/:buildingId/units', async (req, res) => {

});

app.get('/api/villages', async (req, res) => {

});

app.get('/api/adventures', async (req, res) => {
    let { adventures, heroVillageId } = await getListOfAdventures();
    if (!User1.villages[heroVillageId].isActive) {
        const updatedValues = await getListOfAdventures(User1.villages[heroVillageId]);
        adventures = updatedValues.adventures;
    }

    User1.heroVillageId = heroVillageId;
    User1.adventures = adventures;
    res.send({ adventures, heroVillageId });
});

app.get('/api/adventures/auto', async (req, res) => {
    const allAdventures = Object.values(User1.adventures);
    allAdventures.forEach(adventure => {
        User1.adventuresQueue.addNewAdventure(adventure)
    });
    res.send('added all adventures to queue');
});

app.get('/api/adventures/:id', async (req, res) => {
    const { id } = req.params;

    User1.adventuresQueue.addNewAdventure(User1.adventures[id])
    // await startAdventure(User1.heroVillageId, {id});
    res.send(`added ${id} adventure to queue`);
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

    let upgrades = Object.keys(village.smithyStore);
    if (upgrades.length > 0) {
        const task = async () => {
            console.log(`village - ${villageId} smithy fetching new updates`)
            const response = await getUpgrades(village);
            village.smithyStore = response;
            let upgrades = Object.keys(village.smithyStore);
            if (upgrades.length > 0) {
                village.getSmithyQueue().add(upgrades[0], task)
            } else {
                console.log(`village - ${villageId} :: no more upgrades found `)
            }
        };
        village.getSmithyQueue().add(upgrades[0], task);
        res.send(`village - ${villageId} smithy auto upgrade`);
        return;
    }
    res.send(`village - ${villageId} smithy upgrades not found`)
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

    const units = await getBarracksUnits(village)
    res.send(units)
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
    res.send(`started training ${unitId}`)
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
            "Rally Point": 1,
            "Main Building": 3
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
            "Main Building": 3, "Warehouse": 1, "Granary": 1
        },
        placeId: 31,
        buildingId: 17
    },
    {
        // academy
        requirements: {
            "Barracks": 3, "Main Building": 3
        },
        placeId: 27,
        buildingId: 22
    },
    {
        requirements: {
            "academy": 1
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
            'smithy': 3,
            'academy': 5
        },
        placeId: 30,
        buildingId: 20
    },
    {
        // town hall
        requirements: {
            'main building': 10,
            'academy': 10
        },
        placeId: 24,
        buildingId: 24
    },
    {
        // residence
        requirements: {
            'main building': 10,
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
            "Barracks" :20,
        },  
        placeId: 37,
        buildingId: 29
    },
]
app.get('/api/villages/:villageId/new-buildings', async (req, res) => {
    const { villageId } = req.params;
    const village = User1.villages[villageId];
    // const { placeId, buildingId } = req.query;
    await params.forEach(async element => {
        const { placeId, buildingId } = element;
        if (!placeId || !buildingId) {
            res.send('parameter placeId or buildingId is not found');
            return;
        }
        console.log(placeId, buildingId);
        await addNewBuilding(village, element);
    });
    res.send('buildings aded');

});

app.get('/api/villages/:villageId/send-resources', async(req, res) => {
    const { villageId } = req.params;
    const { iron, wood, clay, crop, targetId } = req.query;
    const village = User1.villages[villageId];
    await sendResourcesToVillage(village, targetId, {iron, wood, clay, crop});
    res.send('resources sent')
});

app.get('/api/map/', async(req,res) => {
    const map = await getMap(User1.api,-80,80);
    res.send(map)
})