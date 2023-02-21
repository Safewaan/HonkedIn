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
import { useParams } from "react-router-dom";
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

    // API: Get the user's fullname for the title. 
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

    //Create a link for the profile page 

    // For About Me
    const [aboutMe, setAboutMe] = React.useState('');
    const [missingAboutMe, setMissingAboutMe] = React.useState('');

    const handleAboutMe = (event) => {
        setAboutMe(event.target.value);
        setMissingAboutMe(event.target.value === "");
        setSubmission(event.target.value = false);
    }

    // For year and semester list
    const [yearSemester, setYearSemester] = React.useState('');
    const [missingYearSemester, setMissingYearSemester] = React.useState('');

    const handleYearSemester = (event) => {
        setYearSemester(event.target.value);
        setMissingYearSemester(event.target.value === "");
        setSubmission(event.target.value = false);
    }

    const yearList = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "Masters", "PHD", "Professor"];

    // For my Program 
    const [program, setProgram] = React.useState('');
    const [missingProgram, setMissingProgram] = React.useState('');

    const handleProgram = (event) => {
        setProgram(event.target.value);
        setMissingProgram(event.target.value === "");
        setSubmission(event.target.value = false);
    }

    // For Interests
    const [interest, setInterest] = React.useState('');
    const [missingInterest, setMissingInterest] = React.useState('');

    const handleInterest = (event) => {
        setInterest(event.target.value);
        setMissingInterest(event.target.value === "");
        setSubmission(event.target.value = false);
    }

    // For Co-op
    const [coop, setCoop] = React.useState('');
    const [missingCoop, setMissingCoop] = React.useState('');

    const handleCoop = (event) => {
        setCoop(event.target.value);
        setMissingCoop(event.target.value === "");
        setSubmission(event.target.value = false);
    }
    // Handle Save
    const [submission, setSubmission] = React.useState();
    const [submissionList, setSubmissionList] = React.useState([])

    const newSubmission = submissionList.concat({
        aboutMe: aboutMe,
        yearSemester: yearSemester,
        program: program,
        interest: interest,
        coop: coop,
    })

    // Add Reviews
    const addProfileInfo = () => {
        setSubmissionList(newSubmission);
        handleApiAddSubmission();

        setAboutMe("");
        setYearSemester("");
        setProgram("");
        setInterest("");
        setCoop("");
    }

    // Only submit if all of the fields have been filled out. 
    const validationCheck = () => {
        setMissingAboutMe(aboutMe === "");
        setMissingYearSemester(yearSemester === "");
        setMissingProgram(program === "");
        setMissingInterest(interest === "");
        setMissingCoop(coop === "");

        if (!(aboutMe === "") && !(yearSemester === "") && !(program === "") && !(interest === "") && !(coop === "")) {
            addProfileInfo();
            setSubmission(true);
        } else {
            setSubmission(false);
        }
    }


    // Other APIs 
    // Save the Profile 
    const callApiAddSubmission = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/addUserProfile`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //authorization: `Bearer ${this.state.token}`
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                aboutMe: aboutMe,
                yearSemester: yearSemester,
                program: program,
                interest: interest,
                coop: coop,
                userID: userID,
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log("Profile:", body);
        return body;
    }

    const handleApiAddSubmission = () => {
        callApiAddSubmission()
            .then(res => {
                console.log("callApiAddSubmission returned: ", res)
            })
    }

    // Load existing if any! 
    const [existingAboutMe, setExistingAboutMe] = React.useState();
    const [existingYear, setExistingYear] = React.useState();
    const [existingProgram, setExistingProgram] = React.useState();
    const [existingInterest, setExistingInterest] = React.useState();
    const [existingCoop, setExistingCoop] = React.useState();

    // Display the user's profile 
    // Obtain the appropriate fields 
    React.useEffect(() => {
        handleAPIProfile();
        if (existingAboutMe === "") {
            setLoadProfile(false); 
        } else {
            setLoadProfile(true); 
        }
    }, []);

    const callAPIProfile = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/getUserProfile`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //authorization: `Bearer ${this.state.token}`
            },
            body: JSON.stringify({
                userID: userID,
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log("New Search", body);
        return body;
    }

    const handleAPIProfile = () => {
        callAPIProfile()
            .then(res => {
                console.log("callApiProfile returned: ", res)
                var parsed = JSON.parse(res.express);
                setExistingAboutMe(parsed[0].aboutMe);
                setExistingYear(parsed[0].yearSemester);
                setExistingProgram(parsed[0].program);
                setExistingInterest(parsed[0].interest);
                setExistingCoop(parsed[0].coop);
            })
    }

    // Load the profile if it is not empty
    const [loadProfile, setLoadProfile] = React.useState();

    
    return (

        // To create into own component later
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
                   {loadProfile ? <h6> {existingAboutMe} </h6> : <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            id="AboutMe"
                            label="About Me"
                            defaultValue="Enter About Me"
                            variant="outlined"
                            style={{ width: "300px" }}
                            value={aboutMe}
                            onChange={handleAboutMe}
                            inputProps={{ maxLength: 200 }} />

                    </form>} 
                    {!loadProfile && <FormHelperText> Tell us about you! [Max 200 Char.] </FormHelperText>}
                    {missingAboutMe && <FormHelperText> <strong><p style={{ color: 'red' }}>Please fill this out!</p></strong> </FormHelperText>} 
                </div>
            </Box>

            <Box sx={{ position: 'absolute', top: 340, left: "35%" }} >
                <h5>Year of Study: </h5>
            </Box>

            <Box sx={{ position: 'absolute', top: 320, left: "45%" }} >
            {loadProfile ? <h6> {existingYear} </h6> : <FormControl className={classes.formControl}>
                    <InputLabel id="Year and Semester">Year and Semester</InputLabel>
                    <Select
                        labelId="YearSemesterSelect"
                        id="YearSemester"
                        value={yearSemester}
                        onChange={handleYearSemester}
                    >
                        {yearList.map((year) => (
                            <MenuItem value={year}> {year} </MenuItem>
                        ))}

                    </Select>

                    <FormHelperText> Select a year and semester from the list! </FormHelperText>
                    {missingYearSemester && <FormHelperText> <strong><p style={{ color: 'red' }}>Please fill this out!</p></strong> </FormHelperText>}
                </FormControl>}
            </Box>

            <Box sx={{ position: 'absolute', top: 450, left: "35%" }} >
                <h5>Program: </h5>
            </Box>

            <Box sx={{ position: 'absolute', top: 430, left: "45%" }} >
                <div>
                {loadProfile ? <h6> {existingProgram} </h6> : <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            id="Program"
                            label="Program"
                            defaultValue="Enter Program"
                            variant="outlined"
                            style={{ width: "300px" }}
                            value={program}
                            onChange={handleProgram}
                            inputProps={{ maxLength: 200 }} />

                    </form> }
                    {!loadProfile && <FormHelperText> Ex. Computer Science </FormHelperText>}
                    {missingProgram && <FormHelperText> <strong><p style={{ color: 'red' }}>Please fill this out!</p></strong> </FormHelperText>}
                </div>
            </Box>

            <Box sx={{ position: 'absolute', top: 550, left: "35%" }} >
                <h5>Interest: </h5>
            </Box>

            <Box sx={{ position: 'absolute', top: 540, left: "45%" }} >
                <div>
                {loadProfile ? <h6> {existingInterest} </h6> : <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            id="Interest"
                            label="Interest"
                            defaultValue="Enter Interest"
                            variant="outlined"
                            style={{ width: "300px" }}
                            value={interest}
                            onChange={handleInterest}
                            inputProps={{ maxLength: 200 }} />

                    </form>}
                   {!loadProfile && <FormHelperText> Ex. Coding </FormHelperText>} 
                    {missingInterest && <FormHelperText> <strong><p style={{ color: 'red' }}>Please fill this out!</p></strong> </FormHelperText>}
                </div>
            </Box>


            <Box sx={{ position: 'absolute', top: 660, left: "35%" }} >
                <h5>Co-op: </h5>
            </Box>

            <Box sx={{ position: 'absolute', top: 650, left: "45%" }} >
                <div>
                {loadProfile ? <h6> {existingCoop} </h6> : <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            id="Coop"
                            label="Coop"
                            defaultValue="Coop"
                            variant="outlined"
                            style={{ width: "300px" }}
                            value={coop}
                            onChange={handleCoop}
                            inputProps={{ maxLength: 200 }} />

                    </form>}
                    {!loadProfile && <FormHelperText> Role, Company (Ex. None, None) </FormHelperText>}
                    {missingCoop && <FormHelperText> <strong><p style={{ color: 'red' }}>Please fill this out!</p></strong> </FormHelperText>}
                </div>
            </Box>

            <Box sx={{ position: 'absolute', top: 760, left: "67%" }} >
                {loadProfile ? <Button variant="outlined" style={{ color: "white", backgroundColor: "red" }} onClick={() => { setLoadProfile(false) }} >Edit</Button> : <Button variant="outlined" style={{ color: "white", backgroundColor: "seagreen" }} onClick={() => { validationCheck() }} >Save</Button>}

                {submission && <FormHelperText> <strong><p style={{ color: 'darkgreen' }}>Your profile has been saved!</p></strong> </FormHelperText>}
            </Box>

        </div>
    );
};

export default ProfileMain;
