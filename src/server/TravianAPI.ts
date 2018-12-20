// @ts-ignore
import * as request from 'superagent';
import * as superagentCheerio from 'superagent-cheerio';
import * as $ from 'cheerio';
import Building from './model/Building';
import BuildingsStore from './model/BuildingsStore';
import { ParseBuildings, ParseActualQueue, ParseBuildingPage } from './parser/TravianParser';
// import { BuildingsDb } from './db';
import { exportToJsonFile } from './utility/file';

const Settings = {
    url: "http://www.x1000.aspidanetwork.com",
    login: "vikaro",
    password: 'jc*a5cv#KJ5RqbYU9$gB'
}


export default class TravianAPI {

    private serverUrl;
    private resourceUrl = "/dorf1.php";

    private agent: request.SuperAgentStatic;

    constructor() {
        this.serverUrl = Settings.url;
        this.agent = request.agent()
            .set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36")
            .type('form');
    }

    BuildingPage = async (building: Building) => {
        return await this.agent.get(this.serverUrl + "/" + building.url)
    }

    BuildingUpgrade = async (building: Building) => {
        return await this.agent.get(encodeURI(this.serverUrl + "/" + building.upgradeUrl));
    }
    LoginPage = async() => await this.agent.get(this.serverUrl);
    ResourcesPage = async() => await this.agent.get(this.serverUrl + this.resourceUrl )

    BuildBuilding = async (building: Building) => {

        let newBuilding = await this.agent.get(this.serverUrl + "/" + building.url).then(res => {
            // exportToJsonFile(res, "buildingViewResponse");
            return res;
        })
            // .use(superagentCheerio)
            .then(ParseBuildingPage);

        newBuilding.url = building.url;

        if (newBuilding.upgradeUrl) {
            console.log(this.serverUrl + "/" + newBuilding.upgradeUrl);
            var buildRequest = await this.agent.get(encodeURI(this.serverUrl + "/" + newBuilding.upgradeUrl));
            console.log("NewBuilding Updated");
            console.log(newBuilding);
            // BuildingsDb.AddBuildings([newBuilding])
            return newBuilding;
        }

        return null;
    }

    // GetResourceBuildings = async (): Promise<BuildingsStore> => {
    //     return await this.agent.get(this.serverUrl + "/dorf1.php")
    //         .use(superagentCheerio)
    //         .then((res) => {
    //             // exportToJsonFile(res, "getResourceBuildings");
    //             let model = new BuildingsStore();
    //             // @ts-ignore
    //             var buildingList = res.$(".buildingList .boxes-contents ul li");
    //             model.ActualQueue = buildingList.map(ParseActualQueue).get();

    //             // @ts-ignore
    //             var $areas = res.$('.village1 area');
    //             model.AddBuildings($areas.map(ParseBuildings).get());
    //             return model;
    //         })
    // }
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

    GetVillageBuildings = async (): Promise<Building[]> => {
        return await this.agent.get(this.serverUrl + "/dorf2.php")
            .use(superagentCheerio)
            .then((res) => {
                // exportToJsonFile(res, "getVillageBuildings");
                // @ts-ignore
                var $areas = res.$('#village_map area');
                var buildings: Building[] = $areas.map(ParseBuildings).get();
                return buildings;
            })
    }

    TrainUnits = async (buildingId, count) => {
        let postActionUrl = null;
        var hiddenParams = await this.agent.get(this.serverUrl + `/build.php?id=${buildingId}`)
            .use(superagentCheerio)
            .then(res => {
                // @ts-ignore
                postActionUrl = res.$("form[method='post']").attr("action");
                // @ts-ignore
                var hiddenInputs = res.$("form[method='post'] input[type='hidden']");
                var parameters = hiddenInputs.map((index, el) => {
                    return {
                        [el.name]: el.value
                    }
                }).get();
                return parameters;
            });
        if (postActionUrl) {
            var queryParams = {};
            hiddenParams.forEach(element => {
                queryParams = {
                    ...queryParams,
                    ...element
                }
            });
            return await this.agent.post(this.serverUrl + `/${postActionUrl}`)
                .type('form')
                .query(queryParams)
        }
        return null;
        // return await this.agent.post(this.serverUrl + `/${actionUrl}`)
        //     .type('form')
        //     // .send(`name=${Settings.login}`)
        //     // .send(`password=${Settings.password}`)
        //     // .send("s1=Login")
        //     .query()
        //     .send(`user=${Settings.login}`)
        //     .send(`pw=${Settings.password}`)
        //     .send(`ft=a4`)
        //     .send("w=100:100")
    }
}



export const travianAPI = new TravianAPI();
