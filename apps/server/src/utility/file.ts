import {writeFile} from 'fs'

export function exportToJsonFile(obj : any, filename:string){
    writeFile(`./${filename}.${Date.now().toString()}.json`, JSON.stringify(obj), 'utf8', (err) =>{
        console.error(err);
    });
} 