import * as AsyncLock from 'async-lock';
import Village from '../model/Village';
import { changeVillage } from './villageService';

export async function villageLock(lock : AsyncLock, village: Village, callback?){
    return await lock.acquire('villageLock', async () => {
        let returnValue;

        console.log(`${village.name} :: enter villageLock lock`);
        if (!village.isActive) await changeVillage(village)
        if(callback) returnValue =  await callback();
        console.log(`${village.name} :: exit villageLock lock`);

        return returnValue;
    })
}