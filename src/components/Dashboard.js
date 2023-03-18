import React, { useRef, useState, useEffect } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Menu from '@material-ui/core/Menu';
import Drawer from "@material-ui/core/Drawer";
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import NavigationBar from './common/NavigationBar';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@material-ui/core/styles';

const pages = ['Events'];
const settings = ['Update Profile', 'Logout'];

const { REACT_APP_API_ENDPOINT } = process.env;

export default function Dashboard() {

  const { currentUser } = useAuth();
  const history = useHistory()

  //const email = currentUser.email;
  const [email, setEmail] = React.useState('');
  const [userID, setUserID] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const [events, setEvents] = useState([]);
  const [forums, setForums] = useState([]);
  const [myEvents, setMyEvents] = useState([]);

  React.useEffect(() => {
    setEmail(currentUser.email);
    loadUserEmailSearch(currentUser.email);
  }, []);

  const loadUserEmailSearch = (email) => {
    callApiGetUserEmailSearch(email)
      .then(res => {
        var parsed = JSON.parse(res.express);
        //console.log(parsed[0].id);
        setUserID(parsed[0].id);
      });
  }

  const callApiGetUserEmailSearch = async (email) => {
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

  const callApiGetRecentEvents = async () => {

    const url = `${REACT_APP_API_ENDPOINT}/getRecentEvents`;
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

  const loadGetRecentEvents = async () => {
    try {
      const res = await callApiGetRecentEvents();
      const parsed = JSON.parse(res.express);
      setEvents(parsed);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadGetRecentEvents();
  }, []);

  const callApiGetPopularForums = async () => {

    const url = `${REACT_APP_API_ENDPOINT}/getPopularForums`;
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

  const loadGetPopularForums = async () => {
    try {
      const res = await callApiGetPopularForums();
      const parsed = JSON.parse(res.express);
      setForums(parsed);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadGetPopularForums();
  }, []);

  const CallApiGetMyEvents = async (userID) => {

    const url = `${REACT_APP_API_ENDPOINT}/getMyEvents?userID=${userID}`;
    console.log(url);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        /*body: JSON.stringify({
            userID: userID
        })*/
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
}

  const loadGetMyEvents = async () => {
    try {
      const res = await CallApiGetMyEvents(userID);
      const parsed = JSON.parse(res.express);
      setMyEvents(parsed);
  } catch (error) {
      console.error(error);
  }
  }

  useEffect(() => {
    loadGetMyEvents();
  }, [userID]);

  return (
    <>
      <NavigationBar></NavigationBar>
      <Box sx={{ position: 'absolute', top: 150, left: '50%', transform: 'translateX(-50%)' }}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none'
          }}
          component="div">
          Welcome to HonkedIn!
        </Typography>
      </Box>

      <Box sx={{ width: 1200, height: 1000, position: 'absolute', top: 250, left: '50%', transform: 'translateX(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Grid container spacing={10}>
          <Grid item xs={8} md={4}>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              component="div">
              Upcoming Events
            </Typography>
            {events.map((event) => (
              <Card style={{ width: '200 px', marginBottom: '20px' }} key={event.id}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {event.name}<br />
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Date: {new Date(new Date(event.date).getTime() - (5 * 60 * 60 * 1000)).toLocaleDateString()}<br />
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Location: {event.location}<br />
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {event.description}<br />
                  </Typography>
                </CardContent>
              </Card>
            ))}
            <Link to={`/events`}>
              <Typography
                variant="h6"
                align="left"
                gutterBottom
                component="div">
                View all events
              </Typography>
            </Link>
          </Grid>
          <Grid item xs={8} md={4}>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              component="div">
              Popular Forums
            </Typography>
            {forums.map((forum) => (
              <Card style={{ width: '200 px', marginBottom: '20px' }} key={forum.id}>
                <CardContent>
                  <Link to={`/forum/${forum.id}`} target="_blank">
                    <Typography variant="h5" component="div">
                      {forum.forumTitle}<br />
                    </Typography>
                  </Link>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {forum.description}<br />
                  </Typography>
                </CardContent>
              </Card>
            ))}
            <Link to={`/forums`}>
              <Typography
                variant="h6"
                align="left"
                gutterBottom
                component="div">
                View all forums
              </Typography>
            </Link>
          </Grid>
          <Grid item xs={8} md={4}>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              component="div">
              Your RSVPed Events
            </Typography>
            {myEvents.map((myEvent) => (
              <Card style={{ width: '200 px', marginBottom: '20px' }} key={myEvent.id}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {myEvent.name}<br />
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Date of Event: {new Date(new Date(myEvent.date).getTime() - (5 * 60 * 60 * 1000)).toLocaleDateString()}<br />
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Location of Event: {myEvent.location}<br />
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}