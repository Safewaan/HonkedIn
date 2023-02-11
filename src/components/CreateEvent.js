import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Paper from "@material-ui/core/Paper";
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Typography from "@material-ui/core/Typography";
import { createTheme, ThemeProvider, styled, MuiThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


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



  const [events, setEvents] = React.useState([]); 

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
          eventName: eventName.current.value,
          eventDesc: eventDesc.current.value, 
          eventLocation: eventLocation.current.value,
          eventDate: eventDate.current.value,

        })
      });
  
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
          <MyPaper>
          <form style={{display: 'flex'}}>

          <MainGridContainer
            container
            spacing={4}
            style={{ maxWidth: '50%' }}
            direction="column"
            justifyContent="space-evenly"
            alignItems="stretch"
          >

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
            </form>

            <ReviewRating
              selectedRating={selectedRating}
              ratingError={ratingError}
              helperTextRating={helperTextRating}
              onSelectedRating={handleSelectedRating}
            />

            <Grid item>
              <SubmitButton
                label={"SUBMIT"}
                onButtonClick={validateReview}
              />

            </Grid>

            <Grid>
              <List
                list={reviewList}
              />
            </Grid>


            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="success">
                Your review has been recieved
              </Alert>
            </Snackbar>

          </MainGridContainer>
          </form>
        </MyPaper>
        </>
      )
}

const EventName = ({ eventName, onEnterEventName, eventNameError, eventNameErrorText }) => {
  return (
    <Grid item>
      <TextField
        id="name-of-event"
        label="Event Name"
        value={eventName}
        onChange={onEnterEventName}
        error={eventNameError}
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
        rows={4}
        placeholder="Enter a description of your event!"
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


export default CreateEvent;