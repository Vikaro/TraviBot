import React, { Component } from 'react';
import PropTypes from 'prop-types';
import avatar from "assets/img/faces/marc.jpg";
import CardAvatar from 'components/Card/CardAvatar';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import RegularButton from 'components/CustomButtons/RegularButton';
import withStyles from "@material-ui/core/styles/withStyles";
import { view } from 'react-easy-state';
import store from "store/store";

const styles = {
    cardCategoryWhite: {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
    }
};


class Login extends Component {

    render() {

        const { classes } = this.props;
        return (
            <div>
                <Card profile>
                    <CardAvatar profile>
                        <a href="#pablo" onClick={e => e.preventDefault()}>
                            <img src={avatar} alt="..." />
                        </a>
                    </CardAvatar>
                    <CardBody profile>
                        <h6 className={classes.cardCategory}>CEO / CO-FOUNDER</h6>
                        <h4 className={classes.cardTitle}>Alec Thompson</h4>
                        <p className={classes.description}>
                            Don't be scared of the truth because we need to restart the
                            human foundation in truth And I love you like Kanye loves Kanye
                            I love Rick Owens’ bed design but the back is...
                        </p>
                        <RegularButton color="primary" round>
                            Follow
                        </RegularButton>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(view(Login));
