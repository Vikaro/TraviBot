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

class VillageUnitsCard extends Component {
  state = {
    units: {},
    target: {
      x: 0,
      y: 0
    },
    type: 1,
    time: 0,
    repeat: false
  };
  handleUnitChange = (name, value) => {
    console.log(name, value);
    this.setState(prevState => {
      return { units: { ...prevState.units, [name]: parseInt(value) } };
    });
  };
  handleTargetChange = (name, value) => {
    this.setState(prevState => {
      return { target: { ...prevState.target, [name]: parseInt(value) } };
    });
  };
  handleChange = (name, value) => {
    this.setState({ [name]:  value  });
    console.log(name, value);
  };
  step = available => (available === 1 ? 1 : parseInt(0.01 * available));
  handleSubmit = () => {
    const { id } = this.props.village;
    const { units, target, type, repeat, time } = this.state;
    const data = {
      units,
      target,
      type,
      repeat:
        repeat === false
          ? null
          : {
              time,
              name: "something new"
            }
    };
    console.log(data);
    api.sendUnits(id, data);
  };
  render() {
    const { units, classes } = this.props;
    return (
      <Card>
        <CardHeader color="info">
        <GridContainer>
          <GridItem md={6}>
              <h4 className={classes.cardTitleWhite}>Send Units</h4>
              {/* <p className={classes.cardCategoryWhite} /> */}
          </GridItem>
          <GridItem md={6}>
              <Switch
                checked={this.state.repeat}
                onChange={event => this.handleChange("repeat", event.target.checked)}
                value={'repeat'}
              />
          </GridItem>
        </GridContainer>
         
        </CardHeader>
        <CardBody>
          {units.map(unit => (
            <div key={unit.id}>
              <Typography>
                {unit.name}
                <span>
                  {this.state.units[unit.id] || 0} / {unit.available}
                </span>
              </Typography>
              <Slider
                value={this.state.units[unit.id] || 0}
                onChange={(event, value) =>
                  this.handleUnitChange(unit.id, value)
                }
                name={unit.name}
                step={this.step(unit.available)}
                max={unit.available}
                classes={{ container: classes.slider }}
              />
            </div>
          ))}

          <Typography>
            Target: {this.state.x || 0} {this.state.y || 0}
          </Typography>
          <CustomInput
            labelText="X"
            id="X"
            formControlProps={{
              fullWidth: true,
              onChange: event =>
                this.handleTargetChange("x", event.target.value)
            }}
          />
          <CustomInput
            labelText="Y"
            id="Y"
            formControlProps={{
              fullWidth: true,
              onChange: event =>
                this.handleTargetChange("y", event.target.value)
            }}
          />
          <CustomInput
            labelText="Type (2,3,4)"
            id="type"
            formControlProps={{
              fullWidth: true,
              onChange: event =>
                this.handleChange("type", parseInt(event.target.value))
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

export default withStyles(styles)(VillageUnitsCard);
