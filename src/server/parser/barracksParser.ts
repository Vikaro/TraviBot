import * as $ from 'cheerio';
import { Response } from 'superagent';
import { remove, removeWhitespaces } from '../utility/text';
import Upgrade from '../model/Upgrade';
import Unit from '../model/Unit';

export function parseBarracksPage(response: Response): { [key: string]: Unit } {
    const $res = $(response.text);
    let units = {};
    $res.find(".details").each((index, el) => {
        const $el = $(el);
        const title = removeWhitespaces($el.find(".tit").first().text().split(' (Available:')[0]);
        // let link = $el.find(".contractLink button").attr("onclick");
        // if (link == null) return true;
        // link = remove(link, ["window.location.href = '", "'; return false;"]);
        const id = $el.find('input').attr('name');
        const available = $el.find('input').siblings('a').first().text();
        // const duration = $el.find(".clocks").text().trim();
        units[id] = new Unit({
            id, title, available
        })
    });
    return units;
}