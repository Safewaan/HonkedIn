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

  return (
    <>
      <NavigationBar></NavigationBar>
      <Box sx={{ position: 'absolute', top: 200, left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Typography
          variant="h3"
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
      <Box sx={{ position: 'absolute', top: 300, left: '25%', transform: 'translateX(-50%)' }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          component="div">
          Recent Events
        </Typography>
        {events.map((event) => (
          <Card style={{ width: '500 px', marginBottom: '20px' }} key={event.id}>
            <CardContent>
              <Typography variant="h5" component="div">
                {event.name}<br />
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Date of Event: {new Date(new Date(event.date).getTime() - (5 * 60 * 60 * 1000)).toLocaleDateString()}<br />
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Location of Event: {event.location}<br />
              </Typography>
            </CardContent>
          </Card>
        ))}
        <Link to={`/events`}>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            component="div">
            View all events
          </Typography>
        </Link>
      </Box>
    </>
  )
}