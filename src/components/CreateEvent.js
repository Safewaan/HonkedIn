import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import Paper from "@material-ui/core/Paper";
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from "@material-ui/core/Typography";
import { styled } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const { REACT_APP_API_ENDPOINT } = process.env;

const MainGridContainer = styled(Grid)(({ theme }) => ({
  margin: theme.spacing(4),
}));

const MyPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  elevation: 3,
  padding: 8,
  borderRadius: 4,
  margin: theme.spacing(2)
}));



const CreateEvent = () => {

 /* function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
*/

  const [open, setOpen] = React.useState(false);
  const [userID, setUserID] = React.useState('3'); //will need to update later

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

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
  
  const [eventDate, setEventDate] = React.useState('');
  const [eventDateError, setEventDateError] = React.useState('');
  const [eventDateErrorText, setEventDateErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
  const handleEventDate = (event) => {
    setEventDate(event.target.value);
    setEventDateError(false);
    setEventDateErrorText('');
  }

  const resetForm = () => {
    setEventName('');
    setEventDesc('');
    setEventLocation('');
    setEventDate('');
  }

  const validateEvent = () => {

    var date_regex =  '/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/'; //to validate date format

    if (eventName == '') {
      setEventNameError(true);
      setEventNameErrorText('Please enter your event name');
      return false;
    } else if (eventDesc == '') {
      setEventDescError(true);
      setEventDescErrorText('Please enter a description of your event');
      return false;
    } else if (eventLocation == '') {
      setEventLocationError(true);
      setEventLocationErrorText('Please enter the location of your event');
      return false;
    } else if (eventDate == ''/*|| !(date_regex.test(eventDate))*/) { 
      //may need to rework to properly account for date functionality
      setEventDateError(true);
      setEventDateErrorText('Please enter the date of your event in the YYYY-MM_DD format');
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
      loadCreateEvent();
      resetForm();

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

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventName: eventName/*.current.value*/,
          eventDesc: eventDesc/*.current.value*/, 
          eventLocation: eventLocation/*.current.value*/,
          eventDate: eventDate/*.current.value*/,
          userID: userID
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
        <>

            <Typography variant="h4" color="inherit" component="div" noWrap>
              Create new Event
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

               <EventDate
                classes={classes}
                eventDate={eventDate}
                onEnterEventDate={handleEventDate}
                eventDateError={eventDateError}
                eventDateErrorText={eventDateErrorText}
              />
            </form>


            <Grid item>
              <SubmitButton
                label={"SUBMIT"}
                onButtonClick={validateEvent}
              />
            </Grid>


            

     
        </>
      )
}


/* moved from under submit item above: 
<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="success">
                Your review has been recieved
              </Alert>
            </Snackbar>
            */


const EventName = ({ eventName, onEnterEventName, eventNameError, eventNameErrorText }) => {
  return (
    <Grid item>
      <TextField
        id="name-of-event"
        label="Event Name"
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
        label="Event Description"
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
        label="Event Location"
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

const EventDate = ({ eventDate, onEnterEventDate, eventDateError, eventDateErrorText }) => {
  return (
    <Grid item>
      <TextField
        id="date-of-event"
        label="Event Date"
        placeholder="Enter the date of the event in the format YYYY-MM-DD"
        value={eventDate}
        onChange={onEnterEventDate}
        error={eventDateError}
        fullWidth
      />
      <FormHelperText>{eventDateErrorText}</FormHelperText>
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