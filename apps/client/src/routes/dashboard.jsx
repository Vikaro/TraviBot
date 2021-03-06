// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
// import ContentPaste from "@material-ui/icons/ContentPaste";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
// core components/views
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import UserProfile from "views/UserProfile/UserProfile.jsx";
import TableList from "views/TableList/TableList.jsx";
import Typography from "views/Typography/Typography.jsx";
import Icons from "views/Icons/Icons.jsx";
import Maps from "views/Maps/Maps.jsx";
import NotificationsPage from "views/Notifications/Notifications.jsx";
import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.jsx";
import Login from "views/Login/Login";
import appStore from "store/store";
import { view } from "react-easy-state";
import Village from "views/Village/Village";
import VillagesDashboard from "views/Dashboard/VillagesDashboard";
import Adventures from "views/Adventures/Adventures";

export let dashboardRoutes = [
  {
    path: "/login",
    sidebarName: "Login",
    navbarName: "Login",
    icon: Unarchive,
    component: Login
  },
  {
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "Material Dashboard",
    icon: Dashboard,
    component: DashboardPage
  },
 
  {
    path: "/adventures",
    sidebarName: "Adventures",
    navbarName: "Adventures",
    icon: Dashboard,
    component: Adventures
  },
  {
    path: "/villages/:villageId",
    sidebarName: "Village",
    navbarName: "Village",
    icon: Dashboard,
    component: Village,
    sidebar: false
  },
   {
    path: "/villages",
    sidebarName: "Villages",
    navbarName: "Villages",
    icon: Dashboard,
    component: VillagesDashboard
  },
  // {
  //   path: "/user",
  //   sidebarName: "User Profile",
  //   navbarName: "Profile",
  //   icon: Person,
  //   component: UserProfile
  // },
  // {
  //   path: "/table",
  //   sidebarName: "Table List",
  //   navbarName: "Table List",
  //   icon: "content_paste",
  //   component: TableList
  // },
  // {
  //   path: "/typography",
  //   sidebarName: "Typography",
  //   navbarName: "Typography",
  //   icon: LibraryBooks,
  //   component: Typography
  // },
  // {
  //   path: "/icons",
  //   sidebarName: "Icons",
  //   navbarName: "Icons",
  //   icon: BubbleChart,
  //   component: Icons
  // },
  // {
  //   path: "/maps",
  //   sidebarName: "Maps",
  //   navbarName: "Map",
  //   icon: LocationOn,
  //   component: Maps
  // },
  // {
  //   path: "/notifications",
  //   sidebarName: "Notifications",
  //   navbarName: "Notifications",
  //   icon: Notifications,
  //   component: NotificationsPage
  // },
 

  { redirect: true, path: "/", to: "/login", navbarName: "Redirect" }
];
export default dashboardRoutes;
