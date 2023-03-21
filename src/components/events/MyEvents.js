import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import DatePicker from "react-datepicker";
import Box from "@material-ui/core/Box";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import Search from '../common/Search';


import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react';

import NavigationBar from '../common/NavigationBar';

const { REACT_APP_API_ENDPOINT } = process.env;

const MyEvents = () => {

    const useStyles = makeStyles((theme) => ({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '50ch',
            },
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
        },
    }));

    const { currentUser } = useAuth();
    const history = useHistory()

    const [searchTerm, setSearchTerm] = React.useState("");
    const [refreshSearch, setRefreshSearch] = React.useState(1);
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

    const [selectedEvent, setSelectedEvent] = React.useState(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false);
    const [isParticipantsListOpen, setIsParticipantsListOpen] = React.useState(false);
    const [showCancelAlertMessage, setShowCancelAlertMessage] = React.useState(false);

    const [showEditAlertMessage, setShowEditAlertMessage] = React.useState(false);

    const [email, setEmail] = React.useState('');
    const [userID, setUserID] = React.useState('');

    const [events, setEvents] = useState([]);

    const [eventName, setEventName] = React.useState('');
    const [eventNameError, setEventNameError] = React.useState('');
    const [eventNameErrorText, setEventNameErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleEventName = (event) => {
        setEventName(event.target.value);
        setEventNameError(false);
        setEventNameErrorText('');
    }

    const [eventDesc, setEventDesc] = React.useState('');
    const [eventDescError, setEventDescError] = React.useState('');
    const [eventDescErrorText, setEventDescErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleEventDesc = (event) => {
        setEventDesc(event.target.value);
        setEventDescError(false);
        setEventDescErrorText('');
    }

    const [eventLocation, setEventLocation] = React.useState('');
    const [eventLocationError, setEventLocationError] = React.useState('');
    const [eventLocationErrorText, setEventLocationErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleEventLocation = (event) => {
        setEventLocation(event.target.value);
        setEventLocationError(false);
        setEventLocationErrorText('');
    }

    const [eventCurrentParticipants, setEventCurrentParticipants] = React.useState('');
    const [eventCurrentParticipantsError, setEventCurrentParticipantsError] = React.useState(false);

    const [eventParticipants, setEventParticipants] = React.useState('');
    const [eventParticipantsError, setEventParticipantsError] = React.useState('');
    const [eventParticipantsErrorText, setEventParticipantsErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleEventParticipants = (event) => {
        const strToInt = parseInt(event.target.value);

        // If the input is number, update the react state
        if (!isNaN(strToInt)) {
            setEventParticipants(parseInt(event.target.value));
            setEventParticipantsError(false);
            setEventParticipantsErrorText('');
        }
        // Catch where first number can't be deleted, reset the state
        else {
            setEventParticipants('');
            setEventParticipantsError('');
            setEventParticipantsErrorText('');
        }
    }

    const [eventDateOG, setEventDateOG] = React.useState(new Date());

    const handleOpenDialog = (event) => {
        setSelectedEvent(event);
        setIsDialogOpen(true);

        // Update event name
        setEventName(event.name);
        setEventNameError(false);
        setEventNameErrorText('');

        // Update event desc
        setEventDesc(event.description);
        setEventDescError(false);
        setEventDescErrorText('');

        // Update event location
        setEventLocation(event.location);
        setEventLocationError(false);
        setEventLocationErrorText('');

        // Update event current participants
        setEventCurrentParticipants(event.participants);

        // Update event participants
        setEventParticipants(parseInt(event.totalParticipants));
        setEventParticipantsError(false);
        setEventParticipantsErrorText('');

        // Update event date
        setEventDateOG(new Date(event.date));
    };

    const handleCloseDialog = () => {
        setSelectedEvent(null);
        setIsDialogOpen(false);
    };

    const handleOpenCancelDialog = (event) => {
        setSelectedEvent(event);
        setIsCancelDialogOpen(true);
    };

    const handleCloseCancelDialog = () => {
        setSelectedEvent(null);
        setIsCancelDialogOpen(false);
    };

    const [selectedEventParticipants, setSelectedEventParticipants] = React.useState([]);
    //const [currentEventID, setCurrentEventID] = React.useState(''); 
    var currentEventID = '';

    const handleOpenParticipantsDialog = (event) => {
        setSelectedEvent(event);
        //setCurrentEventID(event.id); 
        currentEventID = event.id;
        setIsParticipantsListOpen(true);
        handleGetParticipants();
        //old code if want to switch to one api call that pulls the list of all participants
        //setSelectedEventParticipants(participantsList.filter(x => x.id === event.id));
    };

    const handleCloseParticipantsDialog = () => {
        setSelectedEvent(null);
        setIsParticipantsListOpen(false);
        //resets the array so in the split second the api call is rendering the new list, the list appears empty
        //and doesn't show the list of the previous list
        setSelectedEventParticipants([]);
    };

    React.useEffect(() => {
        setEmail(currentUser.email);
        loaduserSearchByEmail(currentUser.email);
        loadGetEventsByUser(userID, searchTerm);
    }, []);



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

    const loaduserSearchByEmail = (email) => {
        callApiGetuserSearchByEmail(email)
            .then(res => {
                var parsed = JSON.parse(res.express);
                //console.log(parsed[0].id);
                setUserID(parsed[0].id);
            });
    }

    const loadGetEventsByUser = async () => {
        try {
            const res = await CallApiGetEventsByUser(userID, searchTerm);
            const parsed = JSON.parse(res.express);
            setEvents(parsed);
        } catch (error) {
            console.error(error);
        }
    }

    const CallApiGetEventsByUser = async (userID, searchTerm) => {

        const url = `${REACT_APP_API_ENDPOINT}/getEventsByUser?userID=${userID}&searchTerm=${searchTerm}`;
        console.log(url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const body = await response.json();
        console.log(body);
        if (response.status !== 200) throw Error(body.message);
        return body;
    }



    const CallApiCancelEvents = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/cancelEvent`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                eventID: selectedEvent.id
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    const handleCancelEvent = () => {
        CallApiCancelEvents();
        setShowCancelAlertMessage(true);
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    };

    const CallApiEditEvent = async () => {

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
    }

    const handleGetParticipants = () => {
        CallApiGetParticipants()
            .then(res => {
                var parsed = JSON.parse(res.express);
                setSelectedEventParticipants(parsed);
            });
    };

    const CallApiGetParticipants = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/getParticipants`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                eventID: currentEventID
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    React.useEffect(() => {
        loadGetEventsByUser(userID, searchTerm);
        //console.log("userId is: " + userID + "and" )
    }, [userID, refreshSearch]);

    const handleRefreshSearch = async () => {
        setSearchTerm("");
        setRefreshSearch(refreshSearch + 1);
    }

    const classes = useStyles();

    return (
        <div id="body">

            <NavigationBar></NavigationBar>

            <Box sx={{ position: 'absolute', top: 115, left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    component="div">
                    My Events
                </Typography>
            </Box>

            <Box sx={{ width: '600px', position: 'absolute', top: 150, left: '50%', transform: 'translateX(-50%)', marginBottom: '20px' }}>
                <Search
                    label="Search for event names or descriptions"
                    searchTerm={searchTerm}
                    onSetSearch={handleSearch}
                    fullWidth
                    onButtonClick={loadGetEventsByUser}
                    onResetSearch={handleRefreshSearch}
                />
            </Box>

            <Box sx={{ position: 'absolute', top: 260, left: '50%', transform: 'translateX(-50%)' }}>
                {events.map((event) => (
                    <Card style={{ width: '600px', marginBottom: '20px' }} key={event.id}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {event.name}<br />
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Date: {new Date(event.date).toLocaleDateString()}<br />
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Participants: {event.participants} / {event.totalParticipants}<br />
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Status: {event.status}<br />
                            </Typography>
                        </CardContent>

                        <CardActions>
                            {event.status === "Active" && <Button onClick={() => handleOpenDialog(event)}>Edit Event</Button>}
                            {event.status === "Active" && <Button onClick={() => handleOpenCancelDialog(event)}>Cancel Event</Button>}
                            {<Button onClick={() => handleOpenParticipantsDialog(event)}>See Participants</Button>}
                        </CardActions>
                    </Card>
                ))}
            </Box>

            {selectedEvent && (
                <div>
                    {/* Cancel event dialog */}
                    < Dialog open={isCancelDialogOpen} onClose={handleCloseCancelDialog}>
                        <DialogTitle>Confirm cancellation</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1">
                                Are you sure you want to cancel this event? This action is irreversible.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseCancelDialog}>No</Button>
                            <Button variant="contained" onClick={handleCancelEvent}>Yes</Button>
                        </DialogActions>
                    </Dialog>

                    {/* Edit event diaglog */}
                    < Dialog open={isDialogOpen} onClose={handleCloseDialog} >
                        <DialogTitle>{selectedEvent.name}</DialogTitle>
                        <DialogContent>
                            <EventName
                                classes={classes}
                                eventName={eventName}
                                onEnterEventName={handleEventName}
                                eventNameError={eventNameError}
                                eventNameErrorText={eventNameErrorText}
                            />

                            <EventDesc
                                classes={classes}
                                eventDesc={eventDesc}
                                onEnterEventDesc={handleEventDesc}
                                eventDescError={eventDescError}
                                eventDescErrorText={eventDescErrorText}
                            />

                            <EventLocation
                                classes={classes}
                                eventLocation={eventLocation}
                                onEnterEventLocation={handleEventLocation}
                                eventLocationError={eventLocationError}
                                eventLocationErrorText={eventLocationErrorText}
                            />

                            <EventParticipants
                                classes={classes}
                                eventParticipants={eventParticipants}
                                onEnterEventParticipants={handleEventParticipants}
                                eventParticipantsError={eventParticipantsError}
                                eventParticipantsErrorText={eventParticipantsErrorText}
                            />

                            <DatePicker
                                selected={eventDateOG}
                                onChange={(eventDateOG) => setEventDateOG(eventDateOG)}
                                dateFormat="yyyy-MM-dd"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Close</Button>
                            {selectedEvent.status === "Active" && <Button onClick={handleEditEvent}>Edit Event</Button>}
                        </DialogActions>
                    </Dialog>

                    {/* Get event partipants dialog*/}
                    < Dialog open={isParticipantsListOpen} onClose={handleCloseParticipantsDialog}>
                        <DialogTitle>Participants</DialogTitle>
                        <DialogContent>
                            <div class="container">
                                {selectedEventParticipants.map((event) => (
                                    <ul>
                                        {event.participantName} <br />
                                    </ul>
                                ))}
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseParticipantsDialog}>Close</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )}

            {showCancelAlertMessage && (
                <Alert
                    status="success"
                    sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                    <AlertIcon />
                    <AlertDescription>Event successfully cancelled.</AlertDescription>
                </Alert>
            )}

            {showEditAlertMessage && (
                <Alert
                    status="success"
                    sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                    <AlertIcon />
                    <AlertDescription>Event successfully editted.</AlertDescription>
                </Alert>
            )}

            {eventCurrentParticipantsError && (
                <Alert
                    status="error"
                    sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                    <AlertIcon />
                    <AlertDescription>You cannot set the maximum number of participants lower than your
                        current number of participants. This event currently has {eventCurrentParticipants}
                        &nbsp;participants.</AlertDescription>
                </Alert>
            )}
        </div >
    )
}

const EventName = ({ eventName, onEnterEventName, eventNameError, eventNameErrorText, defaultValue }) => {
    return (
        <Grid item>
            <TextField
                id="name-of-event"
                label="Name"
                placeholder="Enter the name of your event"
                value={eventName}
                onChange={onEnterEventName}
                error={eventNameError}
                fullWidth
            />
            <FormHelperText>{eventNameErrorText}</FormHelperText>
        </Grid>
    )
}

const EventDesc = ({ eventDesc, onEnterEventDesc, eventDescError, eventDescErrorText, defaultValue }) => {
    return (
        <Grid item>
            <TextField
                id="desc-of-event"
                label="Description"
                multiline
                minrows={4}
                placeholder="Enter a description of your event"
                value={eventDesc}
                onChange={onEnterEventDesc}
                error={eventDescError}
                inputProps={{ maxLength: 200 }}
                fullWidth
            />
            <FormHelperText>{eventDescErrorText}</FormHelperText>
        </Grid>
    )
}

const EventLocation = ({ eventLocation, onEnterEventLocation, eventLocationError, eventLocationErrorText, defaultValue }) => {
    return (
        <Grid item>
            <TextField
                id="location-of-event"
                label="Location"
                placeholder="Enter the location of your event"
                value={eventLocation}
                onChange={onEnterEventLocation}
                error={eventLocationError}
                fullWidth

            />
            <FormHelperText>{eventLocationErrorText}</FormHelperText>
        </Grid>
    )
}

const EventParticipants = ({ eventParticipants, onEnterEventParticipants, eventParticipantsError, eventParticipantsErrorText, defaultValue }) => {
    return (
        <Grid item>
            <TextField
                id="Participants-of-event"
                label="Participants"
                placeholder="Enter the maximum number of participants for your event"
                value={eventParticipants}
                onChange={onEnterEventParticipants}
                error={eventParticipantsError}
                fullWidth
            />
            <FormHelperText>{eventParticipantsErrorText}</FormHelperText>
        </Grid>
    )
}


export default MyEvents;