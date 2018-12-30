import TravianAPI from "../TravianAPI";
import { parseMap } from "../parser/mapParser";

export async function getMap(api: TravianAPI, x, y) {
    return parseMap(await api.getMap(x, y));
}