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
  villages: {},
})

export default appStore

export function onChange(event) {
  appStore[event.target.name] = event.target.value;
}

export async function login() {
  console.log('login');
  const response = await api.login();
  console.log(dashboardRoutes);
  appStore.villages = response.data;
  dashboardRoutes.push(
    {
      path: "/upgrade-to-pro",
      sidebarName: "Upgrade To PRO",
      navbarName: "Upgrade To PRO",
      icon: Unarchive,
      component: UpgradeToPro
    });
}
