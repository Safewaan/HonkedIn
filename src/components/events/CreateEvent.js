import React, { useRef, useState, useEffect } from "react"
import { Card } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns'
import { useAuth } from "../../contexts/AuthContext"

import { SingleDatepicker } from "chakra-dayzed-datepicker";

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
  Select,
  Text
} from '@chakra-ui/react';

import NavigationBar from '../common/NavigationBar';

import "../../styles/form-style.css";

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
  const handleEventParticipants = (valueString, valueAsNumber) => {
    // If the input is number, update the react state
    if (!isNaN(valueAsNumber)) {
      setEventParticipants(valueAsNumber);
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
  const dateToday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
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

  const datePickerRef = useRef(null);

  const handleClick = () => {
    datePickerRef.current.setOpen(true);
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
      setEventNameErrorText('Please enter your event name.');
      return false;
    } else if (eventDesc === '') {
      setEventDescError(true);
      setEventDescErrorText('Please enter a description of your event.');
      return false;
    } else if (eventLocation === '') {
      setEventLocationError(true);
      setEventLocationErrorText('Please enter the location of your event.');
      return false;
    } else if (eventDate === '') {
      setEventDateError(true);
      setEventDateErrorText('Please enter the date of your event in the YYYY-MM_DD format.');
      return false;
    } else if (eventParticipants === '') {
      setEventParticipantsError(true);
      setEventParticipantsErrorText('Please enter a valid number of maximum participants.');
      return false;
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
      <Card style={{ padding: '16px' }}>
        <Text align="center" className="form-header">Create an Event</Text>
        <FormControl>
          <FormControl
            isRequired
            marginTop="16px"
            isInvalid={eventNameError}
          >
            <FormLabel className="form-label">Name</FormLabel>
            <Input
              placeholder='Event name'
              className="form-input"
              value={eventName}
              onChange={handleEventName}
              inputProps={{ maxLength: 200 }}
            />
            <FormHelperText className="form-helper-text">Enter the name of your event.</FormHelperText>
            <FormErrorMessage className="form-helper-text">{eventNameErrorText}</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            marginTop="16px"
            isInvalid={eventDescError}>
            <FormLabel className="form-label">Description</FormLabel>
            <Input
              placeholder='Event description'
              className="form-input"
              value={eventDesc}
              onChange={handleEventDesc}
              inputProps={{ maxLength: 350 }}
            />
            <FormHelperText className="form-helper-text">Enter a description of your event.</FormHelperText>
            <FormErrorMessage className="form-helper-text">{eventDescErrorText}</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            marginTop="16px"
            isInvalid={eventLocationError}>
            <FormLabel className="form-label">Location</FormLabel>
            <Input
              placeholder='Event location'
              className="form-input"
              value={eventLocation}
              onChange={handleEventLocation}
              inputProps={{ maxLength: 350 }}
            />
            <FormHelperText className="form-helper-text">Enter the location of your event.</FormHelperText>
            <FormErrorMessage className="form-helper-text">{eventLocationErrorText}</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            marginTop="16px"
            isInvalid={eventParticipantsError}>
            <FormLabel className="form-label">Maximum Participants</FormLabel>
            <NumberInput
              max={1000}
              min={1}
              className="form-input"
              value={eventParticipants}
              onChange={handleEventParticipants}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormHelperText className="form-helper-text">Enter the number of maximum participants of your event.</FormHelperText>
            <FormErrorMessage className="form-helper-text">{eventParticipantsErrorText}</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            marginTop="16px"
            isInvalid={eventDateErrorText}
          >
            <FormLabel className="form-label">Date</FormLabel>
            <SingleDatepicker
              name="date-input"
              date={eventDateOG}
              minDate={dateToday}
              onDateChange={(eventDateOG) => setEventDateOG(eventDateOG)}
              propsConfigs={{
                dayOfMonthBtnProps: {
                  defaultBtnProps: {
                    _hover: {
                      background: '#164684',
                      color: '#F0F6FF',
                    },
                    _active: {
                      background: '#214E89',
                    }
                  },
                  selectedBtnProps: {
                    background: '#023679',
                    color: '#F0F6FF',
                    _hover: {
                      background: '#164684',
                      color: '#F0F6FF',
                    },
                    _active: {
                      background: '#214E89',
                    }
                  },
                  todayBtnProps: {
                    borderColor: "#023679"
                  },
                }
              }}
            />
            <FormHelperText className="form-helper-text">
              Enter the date of your event.
            </FormHelperText>
            <FormErrorMessage className="form-helper-text">
              {eventDateErrorText}
            </FormErrorMessage>
          </FormControl>
        </FormControl>

        <Box marginTop="16px">
          <Button
            className="form-submit"
            onClick={(event) => validateEvent(event)}
          >
            Submit
          </Button>
        </Box>
      </Card >

      {
        successfullSubmissionMsg && (
          <Alert
            status="success"
            sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
            <AlertIcon />
            <AlertDescription>Event successfully created.</AlertDescription>
          </Alert>
        )
      }

      {
        showUserStatusError && (
          <Alert
            status="error"
            sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
            <AlertIcon />
            <AlertDescription>You cannot create an event if your account is archived.</AlertDescription>
          </Alert>
        )
      }

    </div >
  )
}

export default CreateEvent;