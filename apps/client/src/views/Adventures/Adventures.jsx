import React, { Component } from 'react'
import { view } from 'react-easy-state';
import appStore, { autoBuild, fetchAdventures } from 'store/store';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardIcon from 'components/Card/CardIcon';
import Icon from "@material-ui/core/Icon";
import CardFooter from 'components/Card/CardFooter';
import Danger from 'components/Typography/Danger';
import Warning from 'components/Typography/Warning';
import dashboardStyle from 'assets/jss/material-dashboard-react/views/dashboardStyle';
import withStyles from "@material-ui/core/styles/withStyles";
import RegularButton from 'components/CustomButtons/RegularButton';
import { runAllAdventures } from 'api/api';

class Adventures extends Component {
    componentDidMount() {
        this.handleUpdateAdventures();
    }
    handleUpdateAdventures = () => fetchAdventures();
    handleRunAllAdventures = () => runAllAdventures();
    render() {
        const { classes } = this.props;
        const adventures = Object.values(appStore.adventures);

        return (
            <div>
                <GridContainer>
                    <GridItem xs={12} sm={6} md={6}>
                        <Card>
                            <RegularButton color="primary" round onClick={this.handleUpdateAdventures}>
                                Update adventures
                        </RegularButton>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={6}>
                        <Card>
                            <RegularButton color="primary" round onClick={this.handleRunAllAdventures}>
                                Run all adventures
                        </RegularButton>
                        </Card>
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    {adventures.map((adventure) => <AdventureCard adventure={adventure} classes={classes} />)}
                </GridContainer>
            </div>
        )
    }
}
export default withStyles(dashboardStyle)(view(Adventures));

const AdventureCard = ({ adventure, classes }) => {
    const { location, moveTime, difficult, id } = adventure
    return (
        <GridItem xs={12} sm={6} md={4}>
            <Card>
                <CardHeader color="warning" stats icon>
                    <CardIcon color="warning">
                        <Icon>content_copy</Icon>
                    </CardIcon>
                    <p className={classes.cardCategory}>{id}</p>
                    <h3 className={classes.cardTitle}>
                        {location}
                    </h3>
                </CardHeader>
                <CardFooter stats>
                    <div className={classes.stats}>
                        <Danger>
                            <Warning />
                        </Danger>
                        {moveTime}
                    </div>
                </CardFooter>
            </Card>
        </GridItem>
    )
}

