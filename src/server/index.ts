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
});

app.get('/api/adventures/:id', async (req, res) => {
    const { id } = req.params;

    User1.adventuresQueue.addNewAdventure(User1.adventures[id])
    // await startAdventure(User1.heroVillageId, {id});
    res.send('');
});

app.get('/api/smithy', async (req,res) => {
    
});