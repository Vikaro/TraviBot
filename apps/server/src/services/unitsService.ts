import Village from "../model/Village";
import { parseBarracksPage } from "../parser/barracksParser";
import { villageLock } from "./locksService";
import { parseSendTroops } from "../parser/unitsParser";

export async function getBarracksUnits(village: Village) {
    const barracks = village.buildingStore.getBarracks();
    const units = await village.api.upgradeBuildingPage(barracks).then(res => parseBarracksPage(res));
    for (const key in units) {
        if (units.hasOwnProperty(key)) {
            const unit = units[key];
            unit.building = barracks;
        }
    }
    return units;
}

export async function trainBarracksUnit(village: Village, unitId, count) {
    const barracks = village.buildingStore.getBarracks();
    await village.api.trainUnits(barracks.id, unitId, count);
}


export async function sendUnits(village: Village, units, { x, y }, type) {
    await villageLock(village.user.lock, village, async () => {
        console.log(units);
        const response = await village.api.sendUnits(units, x, y, parseInt(type));
        const { arrivedIn, params } = parseSendTroops(response);
        console.log(arrivedIn, params);
        const confirmation = await village.api.sendUnitsConfirmation(params);
    })
}