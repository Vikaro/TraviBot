import * as $ from 'cheerio';
import Building, { maxLevel } from '../model/Building';
import { Response } from 'superagent';

export function ParseBuildings(index, el) {
    let level = maxLevel;

    const $el = $(el);
    const url = $el.attr('href');
    const title = $el.attr('title');

    const $title = $(title);
    // const $building = $title.children().first();
    // var buildingName = $building.text() || "Empty Place";
    var name = $title.first().text() || "Empty Place";
    const resources = $title.children().map(ParseResources).get();
    const splittedName = name.split("level");

    if (splittedName.length > 1) {
        if (splittedName[1]) level = splittedName[1].trim();
    }

    var building = new Building({ name, url, resources, level })
    return building;
}

export function ParseResources(index, el) {
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

export function ParseActualQueue(index, el) {
    var $el = $(el);
    var name = $el.find(".name").text().trim().replace(/\t/g, '');
    var level = $el.find(".name lvl").text().trim();
    var buildDuration = $el.find(".buildDuration").text();
    var timeArray = buildDuration.replace("hrs. done at", "").split(" ");
    var duration = timeArray[0].trim();

    const building = new Building({ name, duration, level });

    return building;
}

export function ParseBuildingView(res: Response) {
    const $res = $(res.text);

    const name = $res.find(".build > .titleInHeader").text();
    const level = $res.find(".build > .titleInHeader > .level").text();

    const resources = $res.find(".contractCosts .resources").children().map(ParseResources).get();
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
