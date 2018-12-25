import Village from "../model/Village";
import { parseSmithyPage } from "../parser/smithyParser";
import Upgrade from "../model/upgrade";

export async function getUpgrades(village: Village) {
    const smithy = village.buildingStore.GetSmithy();
    const smithyPage = await village.api.BuildingPage(smithy);
    return parseSmithyPage(smithyPage);
}

export async function upgrade(village: Village, upgradeId : string){
    const smithy = village.buildingStore.GetSmithy();
    const smithyPage = parseSmithyPage(await village.api.BuildingPage(smithy));
    await village.api.smithyUpgrade(smithyPage[upgradeId].link);
}