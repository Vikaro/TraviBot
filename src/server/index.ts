import * as express from 'express';
import * as os from 'os';
import TravianAPI, { travianAPI } from './TravianAPI';
import BuildingsStore from './model/BuildingsStore';
import BuildQueue from './queue/BuildQueue';
// import { BuildingsDb } from './db';
import Building from './model/Building';
import { AutoBuild } from './services/buildingsService';
import Village from './model/Village';
import { User1 } from './db';
import { fetchInitialData } from './services/villageService';
import { getListOfAdventures, startAdventure } from './services/adventuresService';
import { getUpgrades, upgrade } from './services/smithyService';
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
        AutoBuild(village);
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

app.get('/api/villages/:villageId/smithy/auto',async (req, res) => {
    const { villageId } = req.params;
    const village = User1.villages[villageId];

    let upgrades = Object.keys(village.smithyStore); 
    if(upgrades.length > 0) {
        const task = async () => {
            console.log(`village - ${villageId} smithy fetching new updates`)
            const response = await getUpgrades(village);
            village.smithyStore = response;
            let upgrades = Object.keys(village.smithyStore);
            if (upgrades.length > 0) {
                village.getSmithyQueue().add(upgrades[0],task)
            } else {
                console.log(`village - ${villageId} :: no more upgrades found `)
            }
        };
        village.getSmithyQueue().add(upgrades[0],task);
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

