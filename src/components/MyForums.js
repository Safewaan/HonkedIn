import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import NavigationBar from './NavigationBar';
import Box from "@material-ui/core/Box";

const { REACT_APP_API_ENDPOINT } = process.env;

const MyForums = () => {

    const { currentUser } = useAuth();
    const history = useHistory()
    const [email, setEmail] = React.useState('');
    const [userID, setUserID] = React.useState('');
    const [forums, setForums] = useState([]);

    React.useEffect(() => {
        setEmail(currentUser.email);
        loaduserSearchByEmail(currentUser.email);
    }, []);

    const loaduserSearchByEmail = (email) => {
        callApiGetuserSearchByEmail(email)
            .then(res => {
                var parsed = JSON.parse(res.express);
                //console.log(parsed[0].id);
                setUserID(parsed[0].id);
            });
    }

    const callApiGetuserSearchByEmail = async (email) => {
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

    const loadGetForumsByUser = async () => {
        try {
            const res = await CallApiGetForumsByUser();
            const parsed = JSON.parse(res.express);
            setForums(parsed);
        } catch (error) {
            console.error(error);
        }
    }

    const CallApiGetForumsByUser = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/getForumsByUser`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userID: userID
            })
        });
        const body = await response.json();
        console.log("got here"); 
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    useEffect(() => {
        loadGetForumsByUser();
    }, [userID]);

    //WILL IMPLEMENT THIS IN OTHER PR
    /*const CallApiEditEvent = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/editEvent`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                eventName: eventName,
                eventDesc: eventDesc,
                eventLocation: eventLocation,
                eventDate: new Date(eventDateOG).toISOString().slice(0, 19).replace('T', ' '),
                eventParticipants: eventParticipants,
                eventID: selectedEvent.id
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    const [forumTitle, setForumTitle] = React.useState('');
    const [forumTitleError, setForumTitleError] = React.useState('');
    const [forumTitleErrorText, setForumTitleErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleForumTitle = (event) => {
        setForumTitle(event.target.value);
        setForumTitleError(false);
        setForumTitleErrorText('');
    }

    const handleEditEvent = () => {
        if (eventName === '') {
            setEventNameError(true);
            setEventNameErrorText('Please enter your event name');
            return false;
        } else if (eventDesc === '') {
            setEventDescError(true);
            setEventDescErrorText('Please enter a description of your event');
            return false;
        } else if (eventLocation === '') {
            setEventLocationError(true);
            setEventLocationErrorText('Please enter the location of your event');
            return false;
        } else if (eventParticipants === '') {
            setEventParticipantsError(true);
            setEventParticipantsErrorText('Please enter a valid number of maximum participants.');
            return false;
        } else if (eventParticipants < eventCurrentParticipants) {
            setEventCurrentParticipantsError(true);
            setTimeout(() => {
                setEventCurrentParticipantsError(false);
            }, 10000);
        } else {
            CallApiEditEvent();
            setEventCurrentParticipantsError(false);
            setShowEditAlertMessage(true);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    }*/

    return (
        <div id="body">

            <NavigationBar></NavigationBar>

            <Box sx={{ position: 'absolute', top: 110, left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    component="div">
                    My Forums
                </Typography>
            </Box>

            <Box sx={{ position: 'absolute', top: 150, left: '50%', transform: 'translateX(-50%)' }}>
            {forums.map((event) => (
                <Card style={{ width: '800px', marginBottom: '20px' }} key={event.id}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {event.forumTitle}<br />
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Posted on {new Date(event.dateTime).toLocaleDateString()}<br />
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <br />{event.description}<br />
                        </Typography>
                    </CardContent>
                </Card>
            ))}
            </Box>
        </div>
    )


}

export default MyForums;