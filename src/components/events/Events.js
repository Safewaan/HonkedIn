import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MuiAlert from '@mui/material/Alert';
import NavigationBar from '../common/NavigationBar';
import Search from '../common/Search';
import SubmitButton from '../common/SubmitButton';
import Box from "@material-ui/core/Box";

const { REACT_APP_API_ENDPOINT } = process.env;

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

const Events = () => {

  const { currentUser } = useAuth();
  //const history = useHistory()

  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState('');

  //const [email, setEmail] = React.useState('');
  const [userID, setUserID] = React.useState('');

  const [events, setEvents] = React.useState([]);

  const [searchTerm, setSearchTerm] = React.useState(""); 

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleOpenDialog = (event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
    setIsDialogOpen(false);
  };

  React.useEffect(() => {
    //setEmail(currentUser.email);
    loaduserSearchByEmail(currentUser.email);
    loadGetEvents(searchTerm);
  }, []);

  const loadGetEvents = async () => {
    try {
      const res = await callApiGetEvents(searchTerm);
      const parsed = JSON.parse(res.express);
      setEvents(parsed);
    } catch (error) {
      console.error(error);
    }
  }

  const callApiGetEvents = async (searchTerm) => {

    const url = `${REACT_APP_API_ENDPOINT}/getEvents?searchTerm=${searchTerm}`;
    console.log(url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  const handleJoinEvent = () => {
    callApiJoinEvent()
      .then(res => {
        console.log(res.message);

        // Success
        if (res.message === "The user joined the event successfully.") {
          setAlertMessage('You joined the event successfully.');
          setAlertSeverity('success');
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }

        // Already Joined
        if (res.message === "The user has already joined the event.") {
          setAlertMessage('You have already joined this event.');
          setAlertSeverity('error');
          setTimeout(() => {
            setAlertMessage('');
            setAlertSeverity('');
          }, 3000);
        }

        // Event is Full
        if (res.message === "The event is full.") {
          setAlertMessage('You cannot join this event as it is full.');
          setAlertSeverity('error');
          setTimeout(() => {
            setAlertMessage('');
            setAlertSeverity('');
          }, 3000);
        }
      });
  }

  const callApiJoinEvent = async () => {
    const url = `${REACT_APP_API_ENDPOINT}/joinEvent`;
    console.log(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventID: selectedEvent.id,
        participantID: userID
      })
    });
    const body = await response.json();
    if (response.status === 400) throw Error(body.message);
    return body;
  }

  /*useEffect(() => {
    loadGetEvents();
  }, []); */

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

  return (
    <div id="body">

      <NavigationBar></NavigationBar>

      <Box sx={{ position: 'absolute', top: 110, left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Typography
          variant="h4"
          gutterBottom
          component="div">
          Events
        </Typography>
      </Box>

      <Box sx={{ width: '30%', position: 'absolute', top: 150, left: '50%', transform: 'translateX(-50%)', marginBottom: '20px' }}>
        <Search
          label="Search for events"
          searchTerm={searchTerm}
          onSetSearch={handleSearch}
          fullWidth
          
        />
      </Box>
        <br/>
        <br/>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '30%', position: 'absolute', top: 210, left: '50%', transform: 'translateX(-50%)', marginBottom: '20px' }}>
        <SubmitButton
          label={"SEARCH"}
          onButtonClick={loadGetEvents}
          position='absolute'
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
                Date: {new Date(new Date(event.date).getTime() - (5 * 60 * 60 * 1000)).toLocaleString()}<br />
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Participants: {event.participants} / {event.totalParticipants}<br />
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Status: {event.status}<br />
              </Typography>
            </CardContent>
            <CardActions>
              <Button onClick={() => handleOpenDialog(event)}>View Event</Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {selectedEvent && (
        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>{selectedEvent.name}</DialogTitle>
          <DialogContent>
            <DialogContentText>{selectedEvent.description}</DialogContentText>
            <DialogContentText>Hosted By: {selectedEvent.creatorName}</DialogContentText>
            <DialogContentText>Date: {new Date(new Date(selectedEvent.date).getTime() - (5 * 60 * 60 * 1000)).toLocaleString()}</DialogContentText>
            <DialogContentText>Location: {selectedEvent.location}</DialogContentText>
            <DialogContentText>Participants: {selectedEvent.participants}/{selectedEvent.totalParticipants}</DialogContentText>
            <DialogContentText>Status: {selectedEvent.status}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
            {selectedEvent.status === "Active" && <Button onClick={handleJoinEvent}>Join Event</Button>}
          </DialogActions>
        </Dialog>
      )}

      {alertMessage && (
        <Alert severity={alertSeverity}>
          {alertMessage}
        </Alert>
      )}
    </div>
  )
}

/*const Search = ({ label, onSetSearch, searchTerm, loadGetEvents }) => {
  return (
    <TextField
      id="search"
      label={label}
      value={searchTerm}
      onChange={onSetSearch}
      variant="standard"
      autoComplete="off"
      color="secondary"
      fullWidth
    />
  )
}; 

const SubmitButton = ({ label, onButtonClick }) => (
  <Button
    variant="contained"
    color="secondary"
    onClick={(event) => onButtonClick(event)}
    position='absolute'

  >
    {label}
  </Button>
)*/

export default Events;