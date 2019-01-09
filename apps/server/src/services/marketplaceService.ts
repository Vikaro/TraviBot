import Village from "../model/Village";
import { villageLock } from "./locksService";

export async function sendResourcesToVillage(village: Village, targetId, resources){
    await villageLock(village.user.lock, village,async () => {
        console.log(`${village.name} :: ${targetId} :: ${JSON.stringify(resources)}`)
        const marketplace = village.buildingStore.getMarketplace();
        const { wood, iron, clay, crop } = resources
        await village.api.sendResources(marketplace.id, targetId, wood, clay, iron, crop);
    })
}