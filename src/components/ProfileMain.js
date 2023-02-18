import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link, useHistory } from "react-router-dom"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import Box from "@material-ui/core/Box";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1, // Set the appbar above the drawer
        backgroundColor: "seagreen", // Change the background color of the appbar
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        marginTop: "20px", // Add margin to space the drawer away from the appbar
    },
    drawerContainer: {
        overflow: "auto",
    },
}));

const ProfileMain = () => {
    const classes = useStyles();

    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError("")

        try {
            await logout()
            history.push("/login")
        } catch {
            setError("Failed to log out")
        }
    }

    return (

        // All of this code is for the nav bar + drawer, create into own component later
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h3" noWrap>
                        Profile
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <Toolbar />
                <div className={classes.drawerContainer}>
                    <List>
                        <ListItem button component={Link} to="/profile">
                            <ListItemText>
                                <Typography variant="h6" fontWeight="bold" textAlign="center">
                                    My Profile
                                </Typography>
                            </ListItemText>
                        </ListItem>
                        <ListItem button component={Link} to="/">
                            <ListItemText>
                                <Typography variant="h6" fontWeight="bold" textAlign="center">
                                    Search Profiles
                                </Typography>
                            </ListItemText>
                        </ListItem>
                    </List>
                </div>
            </Drawer>
            <Toolbar />
            <Box sx={{ position: 'absolute', top: 100, left: "42%"}} >
                <Card>
                    <Card.Body>
                        <h2>Esha Shah's HonkedIn Profile</h2>
                    </Card.Body>
                </Card>
            </Box>

            <Box sx={{ position: 'absolute', top: 200, left: "35%"}} >
                <Card>
                    <Card.Body>
                        <h6>About me: </h6>
                    </Card.Body>
                </Card>
            </Box>

            <Box sx={{ position: 'absolute', top: 200, left: "45%"}} >
                <Card>
                    <Card.Body>
                        <body1>This will be replaced by a textbox that can be edited by the user.</body1>
                    </Card.Body>
                </Card>
            </Box>

            <Box sx={{ position: 'absolute', top: 300, left: "35%"}} >
                <Card>
                    <Card.Body>
                        <h6>Year: </h6>
                    </Card.Body>
                </Card>
            </Box>

            <Box sx={{ position: 'absolute', top: 300, left: "45%"}} >
                <Card>
                    <Card.Body>
                        <body1>This will be replaced by a textbox that can be edited by the user. OR a dropdown?</body1>
                    </Card.Body>
                </Card>
            </Box>

            <Box sx={{ position: 'absolute', top: 600, left: "35%"}} >
                <Card>
                    <Card.Body>
                        <h6>Email: </h6>
                    </Card.Body>
                </Card>
            </Box>

            <Box sx={{ position: 'absolute', top: 600, left: "45%"}} >
                <Card>
                    <Card.Body>
                        <body1>This will be replaced by a textbox that can be edited by the user.</body1>
                    </Card.Body>
                </Card>
            </Box>

        </div>
    );
};

export default ProfileMain;
