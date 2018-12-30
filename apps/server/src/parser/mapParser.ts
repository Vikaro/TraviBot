import * as $ from 'cheerio';
import { Response } from 'superagent';
import { remove, removeWhitespaces } from '../utility/text';

interface IMapTile {
    x: number,
    y: number
    c: string
    t: string
}

const VILLAGE = "Village:";
const TRIBE = "Tribe:";
const PLAYER = "Player:";
const POPULATION = "Popualtion:";
const ALLIANCE = "Alliance:";

function getSubstringBetweenWords(text: string, startWord: string, endWord: string) {
    return text.substring(text.indexOf(startWord) + startWord.length, text.indexOf(endWord)).trim()
}
interface IMapResponse {
    response: {
        error: Boolean,
        errorMsg: string,
        data: {
            tiles: Array<IMapTile>
        }
    }
}

class Map {
    villages: Array<MapVillage> = [];
}
class MapVillage {
    name; player; population; alliance; x; y;
    constructor(obj) {
        if (obj) {
            Object.assign(this, obj);
        }
    }
}
export function parseMap(response: Response): Map {
    const res: IMapResponse = JSON.parse(response.text);

    let map = new Map();
    const filteredTiles = res.response.data.tiles;
    // const filteredTiles = tiles.filter(item => item.c !== '');
    //    "t": "<font color='white'><b>Village: Athkatla</b></font><br>(-99|76)<br>Player: vikaro<br>Popualtion: 1294<br>Alliance: <br>Tribe: Tuetons
    filteredTiles.forEach(tile => {
        const text = $(tile.t).text();
        const isVillage = text.startsWith(VILLAGE);
        if (isVillage) {
            const name = getSubstringBetweenWords(text, VILLAGE, PLAYER);
            const player = getSubstringBetweenWords(text, PLAYER, POPULATION);
            const population = getSubstringBetweenWords(text, POPULATION, ALLIANCE);
            const alliance = getSubstringBetweenWords(text, ALLIANCE, TRIBE);
            const x = tile.x;
            const y = tile.y;
            map.villages.push(new MapVillage({ name, player, population, alliance, x, y }));
        }
    });

    return map;
}