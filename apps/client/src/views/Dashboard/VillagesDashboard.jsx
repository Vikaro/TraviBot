import Icon from "@material-ui/core/Icon";
import withStyles from "@material-ui/core/styles/withStyles";
import dashboardStyle from 'assets/jss/material-dashboard-react/views/dashboardStyle';
import Card from 'components/Card/Card';
import CardFooter from 'components/Card/CardFooter';
import CardHeader from 'components/Card/CardHeader';
import CardIcon from 'components/Card/CardIcon';
import RegularButton from 'components/CustomButtons/RegularButton';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Danger from 'components/Typography/Danger';
import Warning from 'components/Typography/Warning';
import React, { Component } from 'react';
import { view } from 'react-easy-state';
import appStore, { autoBuild, fetchVillages } from 'store/store';
import {Link} from 'react-router-dom';
class VillagesDashboard extends Component {
    componentDidMount() {
        fetchVillages();
    }

    handleAutoBuild = () => autoBuild();
    render() {
        const { classes } = this.props;
        const villages = Object.values(appStore.villages);
        return (
            <div>
                <GridContainer>
                    {villages.map((village) =>
                        <VillageCard village={village} classes={classes} key={village.id} />
                    )}
                </GridContainer>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card >
                            <RegularButton color="primary" disabled={appStore.autoBuildEnabled} round onClick={this.handleAutoBuild}>
                                <div>Auto build in every village</div>
                        </RegularButton>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div>
        )
    }
}
export default withStyles(dashboardStyle)(view(VillagesDashboard));

const VillageCard = ({ village, classes }) => {

    const { id, name, isActive } = village
    return (
        <GridItem xs={12} sm={6} md={4}>
            <Link to={`/villages/${id}`}>
                <Card>
                    <CardHeader color="warning" stats icon>
                        <CardIcon color="warning">
                            <Icon>content_copy</Icon>
                        </CardIcon>
                        <p className={classes.cardCategory}>{id}</p>
                        <h3 className={classes.cardTitle}>
                            {name}
                        </h3>
                    </CardHeader>
                    {/* <CardFooter stats>
                        <div className={classes.stats}>
                            <Danger>
                                <Warning />
                            </Danger>
                        </div>
                    </CardFooter> */}
                </Card>
            </Link>
        </GridItem>
    )
}

