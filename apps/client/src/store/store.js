import { store } from "react-easy-state"
import * as api from "api/api"
import { dashboardRoutes } from "routes/dashboard";
import Unarchive from "@material-ui/icons/Unarchive";
import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.jsx";

const appStore = store({
  beers: [],
  username: "",
  password: "",
  isLoading: false,
  autoBuildEnabled: false,
  villages: {},
  adventures: {},

  getVillageUnits: (villageId) => appStore.villages[villageId] ? Object.values(appStore.villages[villageId].unitsStore.units) : []
});

export default appStore

export function onChange(event) {
  appStore[event.target.name] = event.target.value;
}


export async function login() {
  console.log('login');
  const response = await api.login();
  console.log(dashboardRoutes);
  appStore.villages = response.data;
}

export async function autoBuild() {
  console.log('autobuid');
  const response = await api.autoBuild();
  appStore.autoBuildEnabled = true;
}

export async function fetchAdventures() {
  const response = await api.fetchAdventures();
  appStore.adventures = response.data.adventures;
}

export async function runAllAdventures() {
  const response = await api.runAllAdventures();
}

export async function fetchVillages() {
  const response = await api.fetchVillages();
  appStore.villages = response.data;
}

export async function autoBuildVillage(villageId) {
  const response = await api.autoBuildVillage(villageId);
}