import { travianAPI } from "../TravianAPI";
import { parseAdventurePage, parseAdventuresPage } from "../parser/TravianParser";
import { changeVillage } from "./villageService";
import Village from "../model/Village";
import { villageLock } from "./locksService";

export async function getListOfAdventures(capitalVillage? : Village) : Promise<any> {
   return await villageLock(capitalVillage.user.lock, capitalVillage, async () => {
        const adventuresPage = await capitalVillage.api.AdventuresPage().then(res => parseAdventuresPage(res));
        return adventuresPage;
    })
}

export async function startAdventure(village: Village,{id}){
     await village.api.AdventureStart(id);
}