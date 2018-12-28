import TravianAPI from "../TravianAPI";

export async function getMap(api : TravianAPI, x, y) {
    return await api.getMap(x,y);
}