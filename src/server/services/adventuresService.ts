import { travianAPI } from "../TravianAPI";
import { parseAdventurePage, parseAdventuresPage } from "../parser/TravianParser";
import { changeVillage } from "./villageService";
import Village from "../model/Village";

export async function getListOfAdventures(capitalVillage? : Village) : Promise<any> {
    if(capitalVillage) changeVillage(capitalVillage)
    const adventuresPage = await travianAPI.AdventuresPage().then(res => parseAdventuresPage(res));
    return adventuresPage;
}

export async function startAdventure({id}){
     await travianAPI.AdventureStart(id);
}