import Village from "../model/Village";
import { parseSmithyPage } from "../parser/smithyParser";
import Upgrade from "../model/Upgrade";
import { villageLock } from "./locksService";

export async function getUpgrades(village: Village) {
    return await villageLock(village.user.lock, village, async () => {
        const smithy = village.buildingStore.getSmithy();
        console.log(`smithy id: ${smithy.id}, villageid: ${village.id}`);

        const smithyPage = await village.api.upgradeBuildingPage(smithy);
        return parseSmithyPage(smithyPage);
    })
}

export async function upgrade(village: Village, upgradeId: string) {
    return await villageLock(village.user.lock, village, async () => {
        const smithy = village.buildingStore.getSmithy();
        const smithyPage = parseSmithyPage(await village.api.upgradeBuildingPage(smithy));
        const upgrade = smithyPage[upgradeId];
        if (upgrade){
            console.log(`${village.name} :: upgrade ${upgrade.title}`);
            await village.api.smithyUpgrade(upgrade.link);
        } else {
            console.error(`${village.name} :: upgrade ${upgradeId} :: error - upgrade not found`)
        }
    });
}