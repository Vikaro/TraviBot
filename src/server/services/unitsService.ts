import Village from "../model/Village";
import { parseBarracksPage } from "../parser/barracksParser";

export async function getBarracksUnits(village: Village) {
    const barracks =  village.buildingStore.getBarracks();
    const units = await village.api.upgradeBuildingPage(barracks).then(res => parseBarracksPage(res));
    for (const key in units) {
        if (units.hasOwnProperty(key)) {
            const unit = units[key];
            unit.building = barracks;
        }
    }
    return units;
}

export async function trainBarracksUnit(village : Village, unitId, count) {
    const barracks = village.buildingStore.getBarracks();
    await village.api.trainUnits(barracks.id, unitId, count);
}