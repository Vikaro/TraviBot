import Building from "../model/Building";
import TravianAPI, { travianAPI } from "../TravianAPI";
import { ParseBuildingView } from "../parser/TravianParser";
import { BuildingsDb } from "../db";


export async function BuildBuilding(building: Building) : Promise<Building> {
    const buildingFromPage = await travianAPI.BuildingPage(building).then(ParseBuildingView);
    if(!buildingFromPage.upgradeUrl) throw Error(`Error: ${buildingFromPage.name} :: ${buildingFromPage.id} - upgrade url not found`);
    await travianAPI.BuildingUpgrade(buildingFromPage)
    const updatedBuilding =  new Building({
        ...building,
        ...buildingFromPage
    });
    BuildingsDb.AddBuildings([updatedBuilding]);
    return updatedBuilding;
}