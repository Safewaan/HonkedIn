import React, { useRef, useState, useEffect } from "react"
import { Form, Button, Card } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns'
import { useAuth } from "../../contexts/AuthContext"

import DatePicker from "react-datepicker";

import Paper from "@material-ui/core/Paper";
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from "@material-ui/core/Typography";
import { styled } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'

import NavigationBar from '../common/NavigationBar';

const { REACT_APP_API_ENDPOINT } = process.env;

const CreateEvent = () => {

  const { currentUser } = useAuth();
  const history = useHistory()

  React.useEffect(() => {
    setEmail(currentUser.email);
    loaduserSearchByEmail(currentUser.email);
  }, []);

  //const email = currentUser.email;
  const [email, setEmail] = React.useState('');
  const [userID, setUserID] = React.useState('');
  const [userStatus, setUserStatus] = React.useState('');

  const [showUserStatusError, setShowUserStatusError] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const [createdEventsList, setCreatedEventsList] = React.useState([]);

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

  var holderDate = new Date();
  const [eventDateOG, setEventDateOG] = React.useState(new Date());
  //eventDateOG is to handle date picker value input as Date
  //below version accounts for built-in time offset due to JS date function
  //const [eventDateOG, setEventDateOG] = React.useState(new Date(holderDate.getTime() + Math.abs(holderDate.getTimezoneOffset() * 60000)))

  //actual eventDate component needs to be string in order to be proper format
  const [eventDate, setEventDate] = React.useState('');
  const [eventDateError, setEventDateError] = React.useState('');
  const [eventDateErrorText, setEventDateErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
  const handleEventDateOG = (event) => {
    setEventDateOG(event.target.value);
  };

  const [successfullSubmissionMsg, setsuccessfullSubmissionMsg] = React.useState(false);

  const loaduserSearchByEmail = (email) => {
    callApiGetuserSearchByEmail(email)
      .then(res => {
        var parsed = JSON.parse(res.express);
        //console.log(parsed[0].id);
        setUserID(parsed[0].id);
        setUserStatus(parsed[0].status);
        setShowUserStatusError(parsed[0].status === "Archived");
      });
  };

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

  const resetForm = () => {
    setEventName('');
    setEventDesc('');
    setEventLocation('');
    setEventDate('');
    setEventParticipants('');
  }

  useEffect(() => {
    formatDate();
  }, [eventDateOG]);

  const formatDate = () => {
    setEventDate(eventDateOG.toISOString().split('T')[0]);
  }

  const validateEvent = () => {

    // Do nothing if the user's status is archived
    if (userStatus === "Archived") {
      return false;
    };

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
    } else if (eventDate === '') {
      setEventDateError(true);
      setEventDateErrorText('Please enter the date of your event in the YYYY-MM_DD format');
      return false
    } else if (eventParticipants === '') {
      setEventParticipantsError(true);
      setEventParticipantsErrorText('Please enter a valid number of maximum participants.');
      return false
    } else {

      setOpen(true);

      var newEvent = {
        eventName: eventName,
        eventDesc: eventDesc,
        eventLocation: eventLocation,
        eventDate: eventDate
      }

      var localList = [...createdEventsList];
      localList.push(newEvent);
      console.log("this is localList " + localList[0].eventName);
      setCreatedEventsList(localList);
      // console.log(format(eventDate))
      loadCreateEvent();
      resetForm();
      setsuccessfullSubmissionMsg(true);
      setTimeout(() => {
        setsuccessfullSubmissionMsg(false);
      }, 3000);

      return false;
    }
  };


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

  const classes = useStyles();

  const loadCreateEvent = () => {
    callApiCreateEvent()
  }

  const callApiCreateEvent = async () => {

    const url = `${REACT_APP_API_ENDPOINT}/createEvent`;
    console.log(url);
    //console.log(eventDate);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventName: eventName,
          eventDesc: eventDesc,
          eventLocation: eventLocation,
          eventDate: eventDate,
          userID: userID,
          eventParticipants: eventParticipants
        })
      });

      console.log("got past the const response thing");
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }

  }

  return (
    <div>
      <NavigationBar></NavigationBar>
      <Typography variant="h4" color="inherit" component="div" noWrap>
        Create Event
      </Typography>


      <form className={classes.root} noValidate autoComplete="off">
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

      </form>

      <Grid item>
        <SubmitButton
          label={"SUBMIT"}
          onButtonClick={validateEvent}
        />
      </Grid>
      {successfullSubmissionMsg && (
        <Alert
          status="success"
          sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
          <AlertIcon />
          <AlertDescription>Event Successfully created.</AlertDescription>
        </Alert>
      )}

      {showUserStatusError && (
        <Alert
          status="error"
          sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
          <AlertIcon />
          <AlertDescription>You cannot create an event if your account is archived.</AlertDescription>
        </Alert>
      )}

    </div>
  )
}

const EventName = ({ eventName, onEnterEventName, eventNameError, eventNameErrorText }) => {
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

const EventDesc = ({ eventDesc, onEnterEventDesc, eventDescError, eventDescErrorText, }) => {
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

const EventLocation = ({ eventLocation, onEnterEventLocation, eventLocationError, eventLocationErrorText }) => {
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

const EventParticipants = ({ eventParticipants, onEnterEventParticipants, eventParticipantsError, eventParticipantsErrorText }) => {
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

const SubmitButton = ({ label, onButtonClick }) => (
  <Button
    variant="contained"
    color="secondary"
    onClick={(event) => onButtonClick(event)}
  >
    {label}
  </Button>
)

export default CreateEvent;