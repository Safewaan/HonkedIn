import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import { Router, Switch, Route } from "react-router-dom";
import history from '../Navigation/history';

const SignIn = () => {
    return (
        <div>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <Button color="inherit" variant="contained" onClick={() => history.push('/landing')}>Sign In</Button>
            </Grid>
        </div>
    )
}

export default SignIn;