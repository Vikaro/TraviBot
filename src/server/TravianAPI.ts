// @ts-ignore
import * as request from 'superagent';
import * as superagentCheerio from 'superagent-cheerio';
import * as $ from 'cheerio';
import Building from './model/Building';
import BuildingsStore from './model/BuildingsStore';
import { parseVillageBuildings, parseActualQueue, parseBuildingPage } from './parser/TravianParser';
// import { BuildingsDb } from './db';
import { exportToJsonFile } from './utility/file';

const Settings = {
    url: "http://www.x10000.aspidanetwork.com",
    login: "vikaro",
    password: 'jc*a5cv#KJ5RqbYU9$gB'
}

export const BuildingsCategories = {
    INFRASTRUCTURE: 1,
    MILITARY: 2,
    RESOURCES: 3
}

export default class TravianAPI {

    private serverUrl;
    private resourceUrl = "/dorf1.php";
    private villageUrl = "/dorf2.php";
    private buildUrl = "/build.php?";
    private adventureUrl = '/hero_adventure.php'
    private adventureStart = '/a2b.php'

    private agent: request.SuperAgentStatic;

    constructor() {
        this.serverUrl = Settings.url;
        this.agent = request.agent()
            .set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36")
            .type('form');
    }
    AdventuresPage = async () => await this.agent.get(this.serverUrl + this.adventureUrl);
    AdventureStart = async (adventureId) => await this.agent.post(this.serverUrl + this.adventureStart).type('form').send("a=adventure").send('c=6').send('id=39').send(`h=${adventureId}`);

    newBuildingPage = async (placeId) => await this.agent.get(this.serverUrl + this.buildUrl + `id=${placeId}&category=1`);
    newBuilding = async (placeId, buildingId, captcha) => {
        return await this.agent.get(this.serverUrl + this.villageUrl + `?%D0%B0=${buildingId}&id=${placeId}&c=${captcha}`);
    }


    upgradeBuildingPage = async (building: Building) => await this.agent.get(this.serverUrl + "/" + building.url)
    upgradeBuilding = async (building: Building) => await this.agent.get(encodeURI(this.serverUrl + "/" + building.upgradeUrl))

    loginPage = async () => await this.agent.get(this.serverUrl);
    resourcesPage = async () => await this.agent.get(this.serverUrl + this.resourceUrl);
    changeVillage = async (villageId) => await this.agent.get(this.serverUrl + this.resourceUrl + '?newdid=' + villageId);

    smithyUpgrade = async (link) => await this.agent.get(this.serverUrl + '/' + link);

    trainUnits = async (buildingId, unitId, count) => await this.agent.post(this.serverUrl + this.buildUrl).type('form').send(`id=${buildingId}`).send('ft=t1').send(`${unitId}=${count}`);
    sendResources = async (marketplaceId, targetVillageId, wood, clay, iron, crop) => await this.agent.post(this.serverUrl + this.buildUrl).type("form").send({
        'ft': 'mk1',
        'id': marketplaceId,
        'send3': '1',
        'r1': wood,
        'r2': clay,
        'r3': iron,
        'r4': crop,
        'getwref': targetVillageId
    });

    getMap = async (x, y) => await this.agent.post(this.serverUrl + "/map_ajax.php?cmd=mapPositionData").send("form").send({
        'cmd': 'mapPositionData',
        'data[x]': x,
        'data[y]': y,
        'data[zoomLevel]': 2
    });
    
    LoginUser = async () => {
        try {
            var loginPage = await this.agent.get(this.serverUrl)
                .use(superagentCheerio);
            // exportToJsonFile(loginPage, "loginPageRespond");
            // @ts-ignore
            var actionUrl = loginPage.$("form[method='post']").attr("action");
            // @ts-ignore
            var loginValue = loginPage.$("input[name='login']").attr("value");
            console.log(loginValue, actionUrl);
            return await this.agent.post(this.serverUrl + `/${actionUrl}`)
                .type('form')
                // .send(`name=${Settings.login}`)
                // .send(`password=${Settings.password}`)
                // .send("s1=Login")
                .send(`user=${Settings.login}`)
                .send(`pw=${Settings.password}`)
                .send(`ft=a4`)
                .send("w=100:100")
                .send("s2=Go")
                .send("lowRes=1")
                //.send(`login=${loginValue}`)
                .accept("*/*")

        } catch (error) {
            console.error(error);
            return error;
        }
    }

    villagePage = async () => await this.agent.get(this.serverUrl + "/dorf2.php")
}



export const travianAPI = new TravianAPI();
