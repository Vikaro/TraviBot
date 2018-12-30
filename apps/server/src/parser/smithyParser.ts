import * as $ from 'cheerio';
import { Response } from 'superagent';
import { remove, removeWhitespaces } from '../utility/text';
import Upgrade from '../model/Upgrade';

export function parseSmithyPage(response: Response): { [key: string]: Upgrade } {
    const $res = $(response.text);
    let upgrades = {};
    $res.find(".research").each((index, el) => {
        const $el = $(el);
        const title = removeWhitespaces($el.find(".title").text());
        let link = $el.find(".contractLink button").attr("onclick");
        if (link == null) return true;
        link = remove(link, ["window.location.href = '", "'; return false;"]);
        const id = link.substr(link.indexOf("a=") + 2, 1);
        const duration = $el.find(".clocks").text().trim();
        upgrades[id] = new Upgrade({
            id, title, link, duration
        });
    });
    return upgrades;
}