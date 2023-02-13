import React, { useRef, useState, useEffect } from "react"
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
import { format } from 'date-fns'
import moment from 'moment';

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

 // const tester = new Date(); 
 // moment(tester).format('')
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
  
  var holderDate = new Date();
  //const [eventDateOG, setEventDateOG] = React.useState(new Date()); 
  //eventDateOG is to handle date picker value input as Date
  //below version accounts for built-in time offset due to JS date function
  const [eventDateOG, setEventDateOG] = React.useState(new Date(holderDate.getTime() + Math.abs(holderDate.getTimezoneOffset()*60000) ))

  //actual eventDate component needs to be string in order to be proper format
  const [eventDate, setEventDate] = React.useState(''); 
  const [eventDateError, setEventDateError] = React.useState('');
  const [eventDateErrorText, setEventDateErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
  const handleEventDateOG = (event) => {
    setEventDateOG(event.target.value);


    //setEventDateError(false);
   // setEventDateErrorText('');
  }

  const resetForm = () => {
    setEventName('');
    setEventDesc('');
    setEventLocation('');
    setEventDate('');
  }

  //const [enableError, setEnableError] = React.useState(false); 

  useEffect(() => {
   validateEvent(); 
  }, [eventDate]);


  const formatDate = () => {

    //setEnableError(true);
    //console.log("before eventDate state is updated " + enableError)
    setEventDate(eventDateOG.toISOString().split('T')[0]);


    console.log(("eventDateOG = " + eventDateOG))
    console.log("eventDate = " + eventDate)

    validateEvent();
  }


  const validateEvent =  () => {

   // console.log(" enableError is currently: " + enableError)

    if (eventName == '' /* && enableError == true*/) {
      setEventNameError(true);
      setEventNameErrorText('Please enter your event name');
      return false;
    } else if (eventDesc == '' /*&& enableError == true*/) {
      setEventDescError(true);
      setEventDescErrorText('Please enter a description of your event');
      return false;
    } else if (eventLocation == '' /*&& enableError == true*/) {
      setEventLocationError(true);
      setEventLocationErrorText('Please enter the location of your event');
      return false;
    } else if (eventDate == '' /*&& enableError == true*/) { 
      console.log("this is the problem");
      setEventDateError(true);
      setEventDateErrorText('Please enter the date of your event in the YYYY-MM_DD format');
      return false
    } else /*if (enableError == true)*/{

      setOpen(true);

      var newEvent = {
        eventName: eventName,
        eventDesc: eventDesc,
        eventLocation: eventLocation,
       // eventDate: testDate
       eventDate: eventDate
      }

      var localList = [...createdEventsList];
      localList.push(newEvent);
      console.log("this is localList " + localList[0].eventName);
      setCreatedEventsList(localList);
     // console.log(format(eventDate))
      loadCreateEvent();
      resetForm();

      return false;
    } /*else { 
      console.log("stuck here since enableError is: " + enableError)
      setEnableError(false);
      return false; 
    }*/ 
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
          eventName: eventName/*.current.value*/,
          eventDesc: eventDesc/*.current.value*/, 
          eventLocation: eventLocation/*.current.value*/,
          eventDate: eventDate/*.current.value*/,
         // eventDate: testDate,
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
                <DatePicker 
                selected={eventDateOG} 
                onChange={(eventDateOG) => setEventDateOG(eventDateOG)} 
                
                dateFormat="yyyy-MM-dd"
               // showTimeSelect
                //timeFormat="HH:mm"
               // timeIntervals={15}
               // timeCaption="time"
                //dateFormat="yyyy-MM-dd hh:mm aa"
                //formatWeekDay={(post.eventDate, 'yyyy/mm/dd hh:mm:ss')}
                />

            </form>

            <Grid item>
              <SubmitButton
                label={"SUBMIT"}
                //onButtonClick={validateEvent}
                onButtonClick={formatDate}
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