import { Response } from "superagent";
import * as $ from 'cheerio';
import { removeWhitespaces, remove } from "../utility/text";
import Upgrade from "../model/Upgrade";
import Celebration from "../model/Celebration";

export function townHallParser(response: Response): { [key: string]: Celebration } {
    const $res = $(response.text);
    let celebrations = {};
    $res.find(".research").each((index, el) => {
        const $el = $(el);
        const title = removeWhitespaces($el.find(".title a").last().text());
        let link = $el.find(".information button.green").attr("onclick");
        if (link == null) return true;
        link = remove(link, ["window.location.href = '", "'; return false;"]);
        const id = link.substr(link.indexOf("type=") + "type=".length, 1);
        const duration = $el.find(".clocks").text().trim();
        celebrations[id] = new Celebration({
            id, title, link, duration
        });
    });
    return celebrations;
}