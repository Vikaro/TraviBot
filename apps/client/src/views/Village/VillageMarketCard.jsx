import React, { Component } from "react";
import * as api from "api/api";
import { withStyles } from "@material-ui/core/styles";
import { view } from "react-easy-state";
import appStore, { autoBuildVillage, onChange } from "store/store";
import Card from "components/Card/Card";
import CardFooter from "components/Card/CardFooter";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import RegularButton from "components/CustomButtons/RegularButton";
import Icon from "@material-ui/core/Icon";

import Switch from "@material-ui/core/Switch";
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
import CustomInput from "components/CustomInput/CustomInput";
const styles = theme => ({
  slider: {
    padding: "20px 0px"
  },
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  ...dashboardStyle
});

class VillageMarketCard extends Component {
  state = {
    resources: {},
    targetId: 0,
    time: 0,
    repeat: false
  };
  handleResourceChange = (name, value) => {
    console.log(name, value);
    this.setState(prevState => {
      return { resources: { ...prevState.resources, [name]: parseInt(value) } };
    });
  };
  handleTargetChange = (name, value) => {
    this.setState(prevState => {
      return { target: { ...prevState.target, [name]: parseInt(value) } };
    });
  };
  handleChange = (name, value) => {
    this.setState({ [name]: value });
    console.log(name, value);
  };
  step = available => (available === 1 ? 1 : parseInt(0.01 * available));
  handleSubmit = () => {
    const { id } = this.props.village;
    const { resources, targetId, repeat, time } = this.state;
    const data = {
      ...resources,
      targetId,
      repeat:
        repeat === false
          ? null
          : {
              time,
              name: "newName"
            }
    };
    console.log(data);
    api.sendResources(id, data);
  };
  render() {
    const { resources, classes } = this.props;
    const resourceArray = Object.entries(resources);
    console.log(resourceArray);
    return (
      <Card>
        <CardHeader color="info">
          <GridContainer>
            <GridItem md={6}>
              <h4 className={classes.cardTitleWhite}>Send resources</h4>
            </GridItem>
            <GridItem md={6}>
              <Switch
                checked={this.state.repeat}
                onChange={event =>
                  this.handleChange("repeat", event.target.checked)
                }
                value={"repeat"}
              />
            </GridItem>
          </GridContainer>
        </CardHeader>
        <CardBody>
          {resourceArray.map(resource => {
            const type = resource[0];
            const value = parseInt(resource[1]);
            return (
              <div key={type}>
                <Typography>
                  {type} {this.state.resources[type] || 0} / {value}
                </Typography>
                <Slider
                  value={this.state.resources[type] || 0}
                  onChange={(event, value) =>
                    this.handleResourceChange(type, value)
                  }
                  // name={unit.name}
                  step={this.step(value)}
                  max={value}
                  classes={{ container: classes.slider }}
                />
              </div>
            );
          })}
          <Typography>
            Target: {this.state.x || 0} {this.state.y || 0}
          </Typography>
          <CustomInput
            labelText="Village ID"
            id="village_id"
            formControlProps={{
              fullWidth: true,
              onChange: event =>
                this.handleChange("targetId", event.target.value)
            }}
          />
          {this.state.repeat && (
            <CustomInput
              labelText="Repeat every seconds:"
              formControlProps={{
                fullWidth: true,
                onChange: event => this.handleChange("time", event.target.value)
              }}
            />
          )}
          <RegularButton color="primary" round onClick={this.handleSubmit}>
            Send
          </RegularButton>
        </CardBody>
      </Card>
    );
  }
}

export default withStyles(styles)(VillageMarketCard);
