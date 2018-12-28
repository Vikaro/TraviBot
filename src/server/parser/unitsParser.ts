import * as $ from 'cheerio';
import { Response } from 'superagent';
import { remove, removeWhitespaces } from '../utility/text';
import Upgrade from '../model/Upgrade';
import Unit from '../model/Unit';

export function parseSendTroops(response: Response) {
    const $res = $(response.text);
    let params = {};
    $res.find("form input").each((index, el) => {
        const $el = $(el);
        params[$el.attr("name")] =$el.attr("value");
    })
    return params
}