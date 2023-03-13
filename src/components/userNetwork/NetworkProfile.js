import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom"
import { Card, Button } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import Box from "@material-ui/core/Box";
import NavigationBar from '../common/NavigationBar';
import MuiAlert from '@mui/material/Alert';
import { useParams } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// Server URL
const { REACT_APP_API_ENDPOINT } = process.env;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    }
}));

const NetworkProfile = () => {

    const classes = useStyles();
    const { currentUser } = useAuth()
    const [email, setEmail] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [userID, setUserID] = React.useState('');
    const { selectedUserID } = useParams();
    const [openDialog, setOpenDialog] = React.useState(false);

    // Get the current user's email. 
    useEffect(() => {
        setEmail(currentUser.email);
        console.log('selected user id is: ' + selectedUserID);
        //handleUserSearchByEmail(currentUser.email);
        handleAPIUserProfile(selectedUserID);
    }, []);

    const [userName, setUserName] = React.useState('');
    const [aboutMe, setAboutMe] = React.useState('');
    const [yearSemester, setYearSemester] = React.useState('');
    const [program, setProgram] = React.useState('');
    const [interest, setInterest] = React.useState('');
    const [coop, setCoop] = React.useState('');

    // Obtain the user ID, firstName and lastName from the query
    //WILL NEED TO EDIT TO ACCOUNT FOR SOMEONE ELSE'S PROFILE
    const handleUserSearchByEmail = (email) => {
        callApiGetUserSearchByEmail(email)
            .then(res => {
                var parsed = JSON.parse(res.express);
                //console.log(parsed[0].id);
                setUserID(parsed[0].id);
                setFirstName(parsed[0].firstName)
                setLastName(parsed[0].lastName)

                handleAPIUserProfile(selectedUserID);
            });
    }



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


    const handleAPIUserProfile = async () => {
        try {
            const res = await callAPIUserProfile();
            const parsed = JSON.parse(res.express);
            if (parsed.length !== 0) {

                setUserName(parsed[0].userName);
                setAboutMe(parsed[0].aboutMe);
                setYearSemester(parsed[0].yearSemester);
                setProgram(parsed[0].program);
                setInterest(parsed[0].interest);
                setCoop(parsed[0].coop);
            } else {
                setOpenDialog(true);
            }

        } catch (error) {
            console.error(error);
        }
    }

    const callAPIUserProfile = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/getUserProfile`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //authorization: `Bearer ${this.state.token}`
            },
            body: JSON.stringify({
                selectedUserID: selectedUserID,
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log("Profile:", body);
        return body;
    }

    const handleClosePage = () => { 
        window.close(); 
    };

    return (

        <div className={classes.root}>
            <NavigationBar></NavigationBar>

            <Box sx={{ position: 'absolute', top: 100, alignItems: 'center', justifyContent: 'center' }} >
                <Card>
                    <Card.Body>
                        <h2> {userName}'s HonkedIn Profile</h2>
                    </Card.Body>
                </Card>
            </Box>

            <Box sx={{ position: 'absolute', top: 240, justifyContent: 'center' }} >
                <div>  <h5><strong>About Me:</strong>  </h5>
                    {aboutMe}
                </div>
            </Box>

            <Box sx={{ position: 'absolute', top: 380, justifyContent: 'center' }} >
                <div> <h5><strong>Year of Study:</strong> </h5>
                    {yearSemester}
                </div>
            </Box>

            <Box sx={{ position: 'absolute', top: 500, justifyContent: 'center' }} >
                <div>  <h5><strong>Program: </strong></h5>
                    {program}
                </div>

            </Box>

            <Box sx={{ position: 'absolute', top: 640, justifyContent: 'center' }} >
                <div> <h5> <strong>Interest: </strong>  </h5>
                    {interest}
                </div>

            </Box>

            <Box sx={{ position: 'absolute', top: 790, justifyContent: 'center'}} >
                <div> <h5><strong>Co-op:</strong> </h5>
                    {coop}
                </div>

            </Box>

            < Dialog open={openDialog}  >
                <DialogTitle> Oops! Look's like this user hasn't created a profile yet!</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClosePage}>Return to previous page</Button>
                </DialogActions>

            </Dialog>



        </div>
    );

}

export default NetworkProfile; 