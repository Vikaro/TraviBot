import * as AsyncLock from 'async-lock';
import Village from '../model/Village';
import { changeVillage } from './villageService';

export async function villageLock(lock: AsyncLock, village: Village, callback?) {
    let returnValue;
    await village.domain.run(async () => {
        console.log(`${village.name} :: enter village domain`);
        await lock.acquire('villageLock', async () => {

            console.log(`${village.name} :: enter villageLock lock`);
            if (!village.isActive) changeVillage(village)
            if (callback) returnValue = await callback();
            console.log(`${village.name} :: exit villageLock lock`);

        })
        console.log(`${village.name} :: exit village domain`);
    });
    return returnValue;
}