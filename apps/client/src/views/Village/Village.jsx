import React, { Component } from "react";
import * as api from "api/api";
import { withStyles } from "@material-ui/core/styles";
import { view } from "react-easy-state";
import appStore, { autoBuildVillage, fetchVillages } from "store/store";
import Card from "components/Card/Card";
import CardFooter from "components/Card/CardFooter";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import RegularButton from "components/CustomButtons/RegularButton";
import Icon from "@material-ui/core/Icon";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Slider from "@material-ui/lab/Slider";
// import Divider from '@material-ui/core/Divider';
import InboxIcon from "@material-ui/icons/Inbox";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CardBody from "components/Card/CardBody";
// import DraftsIcon from '@material-ui/icons/Drafts';
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import VillageUnitsCard from "./VillageUnitsCard";
import VillageMarketCard from "./VillageMarketCard";

const styles = theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  ...dashboardStyle
});

class Village extends Component {
  state = {
    village: appStore.villages[this.props.match.params.villageId],
    smithyUpgrades: [],
    units: appStore.getVillageUnits(this.props.match.params.villageId)
  };

  handleAutoBuildVillage = () => autoBuildVillage(this.state.village.id);
  handleAutoUpgradeUnits = () => api.smithyAutoUpgrade(this.state.village.id);
  async componentDidMount() {
    await fetchVillages();
    if(!this.state.village){
      this.setState({
        village: appStore.villages[this.props.match.params.villageId]
      });
    }
    const { villageId } = this.props.match.params;
    const smithyUpgradesResponse = await api.smithyUpgrades(villageId);
    const smithyUpgrades = Object.values(smithyUpgradesResponse.data);
    console.log(smithyUpgrades, smithyUpgradesResponse);
    this.setState({
      smithyUpgrades
    });
  }

  render() {
    const { village, smithyUpgrades, units } = this.state;
    const { classes } = this.props;

    if (!village) return <NoVillageFound />;
    const { buildingStore, unitsStore, resources } = village;
    const { buildings } = buildingStore;
    const resourceBuildings = Object.values(buildings).filter(
      i => parseInt(i.id) < 19
    );
    const villageBuildings = Object.values(buildings).filter(
      i => parseInt(i.id) >= 19
    );
    const nonMaxLevelBuildings = Object.values(buildings).filter(
      i => i.level !== "max"
    );
    const isAnyUpgrade = smithyUpgrades.length > 0;

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Name: {village.name}</h4>
              <p className={classes.cardCategoryWhite}>Id: {village.id}</p>
              <p className={classes.cardCategoryWhite}>
                Upgradeable buildings: {nonMaxLevelBuildings.length}
              </p>
            </CardHeader>
            <CardBody>
              <BuildingsPanel
                title="Resource Buildings"
                buildings={resourceBuildings}
                classes={classes}
              />
              <BuildingsPanel
                title="Village Buildings"
                buildings={villageBuildings}
                classes={classes}
              />
              <RegularButton onClick={this.handleAutoBuildVillage}>
                Auto Build village
              </RegularButton>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Smithy Upgrades</h4>
              <p className={classes.cardCategoryWhite}>
                Found: {smithyUpgrades.length}
              </p>
            </CardHeader>
            <CardBody>
              {!isAnyUpgrade && (
                <Typography>
                  Can't find any upgrade left. Do you have smithy?
                </Typography>
              )}
              {isAnyUpgrade && (
                <SmithyPanel
                  title="Upgrades"
                  smithyUpgrades={smithyUpgrades}
                  classes={classes}
                />
              )}
            </CardBody>
            <CardFooter>
              {isAnyUpgrade && (
                <RegularButton onClick={this.handleAutoUpgradeUnits}>
                  Auto upgrade units
                </RegularButton>
              )}
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Units</h4>
              <p className={classes.cardCategoryWhite} />
            </CardHeader>
            <CardBody>
              {units.map(unit => (
                <Typography key={unit.id}>
                  Name : {unit.name} // {unit.available}
                </Typography>
              ))}
            </CardBody>
          </Card>
        </GridItem>
        <GridItem md={6}>
              <VillageUnitsCard units={units} village={village} />
        </GridItem>
        <GridItem md={6}>
              <VillageMarketCard resources={resources} village={village} />
        </GridItem>
      </GridContainer>
    );
  }
}
export default withStyles(styles)(view(Village));

const VillageInformation = ({ village, classes }) => {
  return <Typography>isActive: {village.isActive}</Typography>;
  // <ExpansionPanel>
  //   <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
  //     <Typography className={classes.heading}>Village details</Typography>
  //   </ExpansionPanelSummary>
  //   <ExpansionPanelDetails>

  //   </ExpansionPanelDetails>
  // </ExpansionPanel>)
};

const NoVillageFound = () => {
  return <p>Village cannot be found</p>;
};

const BuildingsPanel = ({ title, buildings, classes }) => {
  const nonMaxLevelBuildings = Object.values(buildings).filter(
    i => i.level !== "max"
  );
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>
          {title} ({nonMaxLevelBuildings.length})
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <List component="nav">
          {buildings.map(building => (
            <ListItem button key={building.id}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText
                primary={building.name}
                secondary={building.level}
              />
            </ListItem>
          ))}
        </List>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const SmithyPanel = ({ title, smithyUpgrades, classes }) => {
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>{title}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <List component="nav">
          {smithyUpgrades.map(upgrade => (
            <ListItem button key={upgrade.id}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText
                primary={upgrade.title}
                secondary={upgrade.duration}
              />
            </ListItem>
          ))}
        </List>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
