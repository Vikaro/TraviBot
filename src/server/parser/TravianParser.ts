import * as $ from 'cheerio';
import Building, { maxLevel } from '../model/Building';
import { Response } from 'superagent';

export function ParseBuildings(index, el): Building {
    let level = maxLevel;

    const $el = $(el);
    const url = $el.attr('href');
    const title = $el.attr('title');

    const $title = $(title);
    // const $building = $title.children().first();
    // var buildingName = $building.text() || "Empty Place";
    var name = $title.first().text() || "Empty Place";
    const resources = $title.children().map(ParseResourcesTypes).get();
    const splittedName = name.split("level");

    if (splittedName.length > 1) {
        if (splittedName[1]) level = splittedName[1].trim();
    }

    var building = new Building({ name, url, resources, level })
    return building;
}

export function ParseResourcesTypes(index, el) {
    var $el = $(el);
    if ($el.parent().hasClass("resources")) {
        var iconClass = $el.attr('class');
        var type;
        switch (iconClass) {
            case "r1": type = "Wood"; break;
            case "r2": type = "Clay"; break;
            case "r3": type = "Iron"; break;
            case "r4": type = "Crop"; break;
            default: type = "undefined";
        }
        var valueText = $el.parent().text().trim();
        return { [type]: valueText }
    }
}

export function ParseActualQueue(index, el): Building {
    var $el = $(el);
    var name = $el.find(".name").text().trim().replace(/\t/g, '');
    var level = $el.find(".name lvl").text().trim();
    var buildDuration = $el.find(".buildDuration").text();
    var timeArray = buildDuration.replace("hrs. done at", "").split(" ");
    var duration = timeArray[0].trim();

    const building = new Building({ name, duration, level });

    return building;
}

export function ParseBuildingPage(res: Response) {
    const $res = $(res.text);

    const name = $res.find(".build > .titleInHeader").text();
    const level = $res.find(".build > .titleInHeader > .level").text();

    const resources = $res.find(".contractCosts .resources").children().map(ParseResourcesTypes).get();
    const duration = $res.find(".upgradeButtonsContainer > .section1 > .clocks").text();
    var buildButton = $res.find(".upgradeButtonsContainer > .section1 > .build");

    var building = new Building({ name, resources, duration, level })

    if (buildButton.length > 0) {
        const onClick = buildButton.attr('onclick');
        const upgradeLink = onClick.replace("window.location.href = '", "").replace("'; return false;", "").trim();
        building.upgradeUrl = upgradeLink;
    }

    return building;
}

export function ParseResourcesPage(res: Response): { actualQueue: Array<Building>, buildings: Array<Building> } {
    const $res = $(res.text);
    // exportToJsonFile(res, "getResourceBuildings");
    // let model = new BuildingsStore();
    // @ts-ignore
    var buildingList = $res.find(".buildingList .boxes-contents ul li");
    const actualQueue = buildingList.map(ParseActualQueue).get();

    // @ts-ignore
    var $areas = $res.find('.village1 area');
    const buildings: Array<Building> = $areas.map(ParseBuildings).get();
    return {
        actualQueue, buildings
    }
}
export function parseVillageList(res: Response): Array<any> {
    const $res = $(res.text);
    const idParam = "?newdid=";
    const villagesArray = $res.find("#sidebarBoxVillagelist li").map((index, el) => {
        const $el = $(el);
        const isActive = $el.hasClass("active");
        const href = $el.find("a").attr("href");
        const id = href.substring(href.lastIndexOf(idParam)+idParam.length);
        const name = $el.find(".name").text()
        return {
            id, isActive, name
        }
    }).get();
    return villagesArray;
}
