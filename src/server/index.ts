import * as express from 'express';
import * as os from 'os';
import TravianAPI, { travianAPI } from './TravianAPI';
import BuildingsStore from './model/BuildingsStore';
import BuildQueue from './queue/BuildQueue';
import { BuildingsDb } from './db';
import Building from './model/Building';

const app = express();




var buildQueue = new BuildQueue(travianAPI);
app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.listen(8080, () => console.log('Listening on port 8080!'));

app.get('/api/login', async (req, res) => {
    var loginRes = await travianAPI.LoginUser();

    // await travianAPI.GetVillageBuildings();
    res.send(loginRes);
})

app.get('/api/buildings', async (req, res) => {
    // let buildingsViewModel : BuildingListViewModel = buildings;

    var buildings = await travianAPI.GetResourceBuildings();
    buildings.ActualQueue.forEach(el => {
        buildQueue.addExistingBuilding(el);
    });

    BuildingsDb.ActualQueue = buildings.ActualQueue;
    BuildingsDb.AvilableBuildings = buildings.AvilableBuildings;
    BuildingsDb.AddBuildings(await travianAPI.GetVillageBuildings());

    res.send(BuildingsDb);
});

app.get('/api/buildings/auto', async (req, res) => {
    // objs.sort((a,b) => (a.last_nom > b.last_nom) ? 1 : ((b.last_nom > a.last_nom) ? -1 : 0)); 
    console.log("auto");
    var sorted = BuildingsDb.GetUpgreadableBuildings();
    await buildQueue.addNewBuilding(sorted[0]);
    res.send(sorted[0]);
    // do {
    //     sorted = BuildingsDb.GetUpgreadableBuildings();
    //     console.log(sorted);
    //     if (sorted.length > 0) {
            
    //         buildQueue.addNewBuilding(sorted[0]);
    //     }
    //     await sleep(10000);
    // } while (sorted.length > 0);
})
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

app.get('/api/buildings/:buildingId', async (req, res) => {
    var buildingId = req.params.buildingId;
    if (!BuildingsDb.AvilableBuildings[buildingId]) {
        res.send(null);
        return;
    }
    buildQueue.addNewBuilding(BuildingsDb.AvilableBuildings[buildingId]);
    res.send(BuildingsDb.AvilableBuildings[buildingId]);
})

app.get('/api/buildings/:buildingId/units', async (req, res) => {

});

