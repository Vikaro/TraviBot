import Village from "../model/Village";
import { parseSmithyPage } from "../parser/smithyParser";
import { villageLock } from "./locksService";

export async function getUpgrades(village: Village) {
    return await villageLock(village.user.lock, village, async () => {
        const smithy = village.buildingStore.getSmithy();
        if (smithy) {
            console.log(`smithy id: ${smithy.id}, villageid: ${village.id}`);
            const smithyPage = await village.api.upgradeBuildingPage(smithy);
            return parseSmithyPage(smithyPage);
        } else {
            console.log(`cannot find smithy for ${village.id}`);
            return {};
        }
    });
}

export async function upgrade(village: Village, upgradeId: string) {
    return await villageLock(village.user.lock, village, async () => {
        const smithy = village.buildingStore.getSmithy();
        const smithyPage = parseSmithyPage(await village.api.upgradeBuildingPage(smithy));
        const unitUpgrade = smithyPage[upgradeId];
        if (unitUpgrade) {
            console.log(`${village.name} :: upgrade ${unitUpgrade.title}`);
            await village.api.smithyUpgrade(unitUpgrade.link);
        } else {
            console.error(`${village.name} :: upgrade ${upgradeId} :: error - upgrade not found`);
        }
    });
}