import Building from "../model/Building";
import TravianAPI, { travianAPI } from "../TravianAPI";
import { ParseBuildingView } from "../parser/TravianParser";
import { BuildingsDb } from "../db";
import { exportToJsonFile } from "../utility/file";


export async function BuildBuilding(building: Building): Promise<Building> {
    const buildingFromPage = await travianAPI.BuildingPage(building).then(res => {
        // exportToJsonFile(res, "buildingViewResponse");
        return res;
    }).then(ParseBuildingView);
    if (!buildingFromPage.upgradeUrl) throw new Error(`Error: ${buildingFromPage.name} :: ${buildingFromPage.id} - upgrade url not found`);
    const buildUpgradeResponse = await travianAPI.BuildingUpgrade(buildingFromPage);
    // exportToJsonFile(buildUpgradeResponse, "buildingUpgradeResponse");
    if (!isNaN(buildingFromPage.level)) ++buildingFromPage.level;
    const updatedBuilding = new Building({
        ...building,
        ...buildingFromPage
    });
    BuildingsDb.AddBuildings([updatedBuilding]);
    return updatedBuilding;
}