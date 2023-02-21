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
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const drawerWidth = 240;
const { REACT_APP_API_ENDPOINT } = process.env;

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
    const { currentUser } = useAuth()
    const history = useHistory()

    //Get the user's email and then get their full name
    const [email, setEmail] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [userID, setUserID] = React.useState('');

    // Get the current user's email. 
    React.useEffect(() => {

        if (currentUser == null) {
            history.push("/login");
        }

        setEmail(currentUser.email);
        handleUserSearchByEmail(currentUser.email);
    }, []);

    // Obtain the user ID, firstName and lastName from the query
    const handleUserSearchByEmail = (email) => {
        callApiGetUserSearchByEmail(email)
            .then(res => {
                var parsed = JSON.parse(res.express);
                //console.log(parsed[0].id);
                setUserID(parsed[0].id);
                setFirstName(parsed[0].firstName)
                setLastName(parsed[0].lastName)
            });
    }

    // Call the API to query with the user's email obtained from Firebase
    const callApiGetUserSearchByEmail = async (email) => {
        const url = `${REACT_APP_API_ENDPOINT}/userSearchByEmail`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }


    // For About Me
    const [aboutMe, setAboutMe] = React.useState('');

    const handleAboutMe = (event) => {
        setAboutMe(event.target.value);
    }

    // For year and semester
    const [yearSemester, setYearSemester] = React.useState('');

    const handleYearSemester = (event) => {
        setYearSemester(event.target.value);
    }

    // APIs 
    // API to retrieve the year and semester list from SQL 
    const [yearList, setYearList] = React.useState([]);

    React.useEffect(() => {
        handleGetYearList();
    }, []);

    const callApiGetYearList = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/userSearchByEmail`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //authorization: `Bearer ${this.state.token}`
            },
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log("Year and Semester List ", body);
        return body;
    }

    const handleGetYearList = () => {
        callApiGetYearList()
            .then(res => {
                console.log("callApiGetYearList: ", res)
                var parsed = JSON.parse(res.express);
                console.log("callApiGetYearList: ", parsed)
                setYearList(parsed);
            })
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
            <Box sx={{ position: 'absolute', top: 100, left: "42%" }} >
                <Card>
                    <Card.Body>
                        <h2> {firstName} {lastName}'s HonkedIn Profile</h2>
                    </Card.Body>
                </Card>
            </Box>


            <Box sx={{ position: 'absolute', top: 240, left: "35%" }} >
                <h5>About Me: </h5>
            </Box>

            <Box sx={{ position: 'absolute', top: 225, left: "45%" }} >
                <div>
                    <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            id="AboutMe"
                            label="About Me"
                            defaultValue="Enter About Me"
                            variant="outlined"
                            style={{ width: "300px" }}
                            value={aboutMe}
                            onChange={handleAboutMe}
                            inputProps={{ maxLength: 200 }} />

                    </form>
                    <FormHelperText> Tell us about you! [Max 200 Char.] </FormHelperText>
                </div>
            </Box>

            <Box sx={{ position: 'absolute', top: 330, left: "35%" }} >
                <h5>Year of Study </h5>
            </Box>

            <Box sx={{ position: 'absolute', top: 320, left: "45%" }} >
                <FormControl className={classes.formControl}>
                    <InputLabel id="MovieSelect">Movie Titles</InputLabel>
                    <Select
                        labelId="MovieSelect"
                        id="MovieSelect"
                        value={yearSemester}
                        onChange={handleYearSemester}
                    >
                        {yearList.map((movie) => (
                            <MenuItem value={yearList.year}> {yearList.year} </MenuItem>
                        ))}

                    </Select>

                    <FormHelperText> Select a year and semester from the list! </FormHelperText>
                </FormControl>
            </Box>

            <Box sx={{ position: 'absolute', top: 500, left: "35%" }} >
                <Button variant="outlined" style={{ color: "white", backgroundColor: "seagreen" }} >Save</Button>
            </Box>

        </div>
    );
};

export default ProfileMain;
