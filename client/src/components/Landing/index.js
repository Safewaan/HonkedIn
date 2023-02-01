import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from "@material-ui/core/Typography";
import history from '../Navigation/history';

const Landing = () => {
    return (
        <div>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <AppBar position="static">
                <Typography
                    variant="h6"
                    gutterBottom
                    component="div"
                    align = 'center'>
                    HonkedIn
                </Typography>
                    <Toolbar>
                        <Button color="inherit">My Profile</Button>
                        <Button color="inherit">User Search</Button>
                        <Button color="inherit">Events</Button>
                        <Button color="inherit">Forums</Button>
                        <Button color="inherit">Resources</Button>
                        <Button color="inherit">Sign Out</Button>
                    </Toolbar>
                </AppBar>
            </Grid>
        </div>
    )
}

export default Landing;