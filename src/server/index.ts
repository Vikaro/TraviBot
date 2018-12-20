import * as express from 'express';
import * as os from 'os';
import TravianAPI, { travianAPI } from './TravianAPI';
import BuildingsStore from './model/BuildingsStore';
import BuildQueue from './queue/BuildQueue';
// import { BuildingsDb } from './db';
import Building from './model/Building';
import { FetchInitialData, AutoBuild } from './services/buildingsService';
import { stringify} from 'circular-json';
import Village from './model/Village';
import { User1 } from './db';
const app = express();




// var buildQueue = new BuildQueue();
app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.listen(8080, () => console.log('Listening on port 8080!'));

app.get('/api/login', async (req, res) => {
    var loginRes = await travianAPI.LoginUser();
    var userData = await FetchInitialData();
    // await travianAPI.GetVillageBuildings();
    let result;

    for (const villageId in userData.Villages) {
        const village : Village = userData.Villages[villageId];
        const {buildingStore, id, isActive, name } = village
         result = { ... result, 
        [villageId] : {
            name, id, isActive, buildingStore
        }};
    }
    res.send(result);
})


app.get('/api/buildings', async (req, res) => {
    // let buildingsViewModel : BuildingListViewModel = buildings;

    // res.send(BuildingsDb);
});

app.get('/api/buildings/auto', async (req, res) => {
    // objs.sort((a,b) => (a.last_nom > b.last_nom) ? 1 : ((b.last_nom > a.last_nom) ? -1 : 0)); 
    const userData = User1;
    for (const villageId in userData.Villages) {
        const village: Village = userData.Villages[villageId];
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

})