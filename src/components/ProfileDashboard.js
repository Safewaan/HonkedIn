import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom"
import { Card, Button } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import NavigationBar from './NavigationBar';
import MuiAlert from '@mui/material/Alert';

// Server URL
const { REACT_APP_API_ENDPOINT } = process.env;

// Set the style of the appBar and drawer
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
}));

const Alert = React.forwardRef(function Alert(props, ref) {
    return (
        <MuiAlert
            elevation={6}
            ref={ref}
            variant="filled"
            {...props}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 9999
            }}
        />
    );
});

// Main page of Profile, i
const ProfileDashboard = () => {
    const classes = useStyles();

    // Store the user's history and currentUser
    const { currentUser } = useAuth()

    // API: Get the user's fullname for the title. 
    //Get the user's email and then get their full name
    const [email, setEmail] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [userID, setUserID] = React.useState('');

    // Get the current user's email. 
    React.useEffect(() => {

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

                handleAPIUserProfile(parsed[0].id);
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

    // States and Variables to store user's information
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
    // Handle Save, and create an array to insert into the SQL database
    const [submission, setSubmission] = React.useState();

    // Add or edit profile info into the database
    const addProfileInfo = () => {

        if (!editProfile) {
            handleApiAddSubmission();
        } else {
            handleApiEditUserProfile();
        }

        setAboutMe("");
        setYearSemester("");
        setProgram("");
        setInterest("");
        setCoop("");
    }

    // Ensures that the fields have been filled out before inserting into the SQL database. 
    const validationCheck = () => {
        setMissingAboutMe(aboutMe === "");
        setMissingYearSemester(yearSemester === "");
        setMissingProgram(program === "");
        setMissingInterest(interest === "");
        setMissingCoop(coop === "");

        if (!(aboutMe === "") && !(yearSemester === "") && !(program === "") && !(interest === "") && !(coop === "")) {
            addProfileInfo();
            setSubmission(true);
            setLoadProfile(true);
            handleAPIUserProfile(userID);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } else {
            setSubmission(false);
            setLoadProfile(false);
        }
    }

    // Other APIs - getUserProfile, editUserProfile and createUserProfile 
    // Add the user's profile information into the database
    const callApiAddSubmission = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/createUserProfile`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //authorization: `Bearer ${this.state.token}`
            },
            body: JSON.stringify({
                aboutMe: aboutMe,
                yearSemester: yearSemester,
                program: program,
                interest: interest,
                coop: coop,
                userID: userID
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

    //Edit the user's profile if there is already existing information. 
    const callApiEditUserProfile = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/editUserProfile`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //authorization: `Bearer ${this.state.token}`
            },
            body: JSON.stringify({
                aboutMe: aboutMe,
                yearSemester: yearSemester,
                program: program,
                interest: interest,
                coop: coop,
                userID: userID
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        console.log("Profile Update:", body);
        return body;
    }

    const handleApiEditUserProfile = () => {
        callApiEditUserProfile()
            .then(res => {
                console.log("callApiAddSubmission returned: ", res)
            })
    }

    // Display the user's profile 
    // Obtain the appropriate fields 
    // Load the profile if it is not empty and ensure that they can edit/update the rows
    const [loadProfile, setLoadProfile] = React.useState();
    const [editProfile, setEditProfile] = React.useState();

    // Inserts the User ID to retrieve their most recent profile 
    const callAPIUserProfile = async (userID) => {

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
        console.log("Profile:", body);
        return body;
    }

    // Parses through the data for the user if there is existing data
    const handleAPIUserProfile = (userID) => {
        callAPIUserProfile(userID)
            .then(res => {
                var parsed = JSON.parse(res.express);

                if (parsed.length !== 0) {

                    setAboutMe(parsed[0].aboutMe);
                    setYearSemester(parsed[0].yearSemester);
                    setProgram(parsed[0].program);
                    setInterest(parsed[0].interest);
                    setCoop(parsed[0].coop);

                    if (parsed[0].aboutMe === "") {
                        setLoadProfile(false);
                        setEditProfile(false);
                    } else {
                        setLoadProfile(true);
                        setEditProfile(true);
                    }
                }
            })
    }

    return (
        // Displays the AppBar, Drawer, the Title, the fields and conditionals for the SAVE/EDIT button. 
        <div className={classes.root}>
            <NavigationBar></NavigationBar>
            <Box sx={{ position: 'absolute', top: 100, left: "35%" }} >
                <Card>
                    <Card.Body>
                        <h2> {firstName} {lastName}'s HonkedIn Profile</h2>
                    </Card.Body>
                </Card>
            </Box>

            <Box sx={{ position: 'absolute', top: 240, left: "35%" }} >
                <div>  <h5><strong>About Me:</strong>  </h5>
                    {loadProfile ? <h6> {aboutMe} </h6> : <form className={classes.root} noValidate autoComplete="off">
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
                    {missingAboutMe && <FormHelperText> <strong><p style={{ color: 'red' }}>Please fill this out!</p></strong> </FormHelperText>} </div>
            </Box>

            <Box sx={{ position: 'absolute', top: 380, left: "35%" }} >
                <div> <h5><strong>Year of Study:</strong> </h5>
                    {loadProfile ? <h6> {yearSemester} </h6> : <FormControl className={classes.formControl}>
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
                    </FormControl>} </div>
            </Box>

            <Box sx={{ position: 'absolute', top: 500, left: "35%" }} >
                <div>  <h5><strong> Program: </strong></h5>
                    {loadProfile ? <h6> {program} </h6> : <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            id="Program"
                            label="Program"
                            defaultValue="Enter Program"
                            variant="outlined"
                            style={{ width: "300px" }}
                            value={program}
                            onChange={handleProgram}
                            inputProps={{ maxLength: 200 }} />
                    </form>}
                    {!loadProfile && <FormHelperText> Ex. Computer Science </FormHelperText>}
                    {missingProgram && <FormHelperText> <strong><p style={{ color: 'red' }}>Please fill this out!</p></strong> </FormHelperText>}</div>
            </Box>

            <Box sx={{ position: 'absolute', top: 640, left: "35%" }} >
                <div> <h5> <strong>Interest: </strong>  </h5>
                    {loadProfile ? <h6> {interest} </h6> : <form className={classes.root} noValidate autoComplete="off">
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
                    {missingInterest && <FormHelperText> <strong><p style={{ color: 'red' }}>Please fill this out!</p></strong> </FormHelperText>}</div>
            </Box>

            <Box sx={{ position: 'absolute', top: 790, left: "35%" }} >
                <div> <h5><strong> Co-op:</strong> </h5> {loadProfile ? <h6>
                    {coop} </h6> : <form className={classes.root} noValidate autoComplete="off">
                    <TextField
                        id="Co-op"
                        label="Co-op"
                        defaultValue="Co-op"
                        variant="outlined"
                        style={{ width: "300px" }}
                        value={coop}
                        onChange={handleCoop}
                        inputProps={{ maxLength: 200 }} />

                </form>}
                    {!loadProfile && <FormHelperText> Role, Company (Ex. None, None) </FormHelperText>}
                    {missingCoop && <FormHelperText> <strong><p style={{ color: 'red' }}>Please fill this out!</p></strong> </FormHelperText>}</div>
            </Box>

            <Box sx={{ position: 'absolute', top: 850, left: "60%" }} >
                {loadProfile ? <Button variant="outlined" style={{ color: "white", backgroundColor: "red" }} onClick={() => { setLoadProfile(false) }} >Edit Profile</Button> : <Button variant="outlined" style={{ color: "white", backgroundColor: "seagreen" }} onClick={() => { validationCheck() }} >Save Profile</Button>}

                {submission && <Alert severity="success"> Profile successfully edited. </Alert>}
            </Box>

        </div>
    );
};

export default ProfileDashboard;