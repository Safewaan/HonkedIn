import React, { useRef, useState, useEffect } from "react"
import { Card } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

import NavigationBar from './common/NavigationBar';

import {
  Box,
  Grid,
  GridItem,
  Text
} from '@chakra-ui/react';

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
      <Box sx={{ position: 'absolute', top: 115, left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Text
          className="title"
        >
          Dashboard
        </Text>
      </Box>

      <Box sx={{ width: '1200px', position: 'absolute', top: 185, left: '50%', transform: 'translateX(-50%)', marginBottom: '20px', zIndex: 1 }}>
        <Grid templateColumns='repeat(3, 1fr)' gap={6}>
          <GridItem xs={8} md={4}>
            <Text
              className="headerBig"
              marginBottom="16px"
            >
              Upcoming Events
            </Text>

            {events.map((event) => (
              <Card style={{ marginBottom: '8px', padding: '16px' }} key={event.id}>
                <Text className="header to-text">
                  {event.name}
                </Text>
                <Text className="body to-text" marginTop="8px">
                  Date: {new Date(new Date(event.date).getTime() - (4 * 60 * 60 * 1000)).toLocaleDateString()}
                </Text>
                <Text className="body to-text" marginTop="8px">
                  Location: {event.location}
                </Text>
                <Text className="body to-text" marginTop="8px">
                  {event.description}
                </Text>
              </Card>
            ))}
            <Link to={`/events`}>
              <Text
                className="link"
              >
                View Upcoming Events
              </Text>
            </Link>
          </GridItem>

          <GridItem xs={8} md={4}>
            <Text
              className="headerBig"
              marginBottom="16px"
            >
              Popular Forums
            </Text>
            {forums.map((forum) => (
              <Card style={{ marginBottom: '8px', padding: '16px' }} key={forum.id}>
                <Link to={`/forum/${forum.id}`} target="_blank">
                  <Text className="header to-text">
                    {forum.forumTitle}
                  </Text>
                </Link>
                <Text
                  className="body to-text"
                  marginTop="2px"
                >
                  {forum.description}
                </Text>
              </Card>
            ))}
            <Link to={`/forums`}>
              <Text
                className="link"
              >
                View Popular Forums
              </Text>
            </Link>
          </GridItem>

          <GridItem xs={8} md={4}>
            <Text
              className="headerBig"
              marginBottom="16px"
            >
              Joined Events
            </Text>
            {myEvents.map((event) => (
              <Card style={{ marginBottom: '8px', padding: '16px' }} key={event.id}>
                <Text className="header to-text">
                  {event.name}
                </Text>
                <Text className="body to-text" marginTop="8px">
                  Date: {new Date(new Date(event.date).getTime() - (4 * 60 * 60 * 1000)).toLocaleDateString()}
                </Text>
                <Text className="body to-text" marginTop="8px">
                  Location: {event.location}
                </Text>
                <Text className="body to-text" marginTop="8px">
                  {event.description}
                </Text>
              </Card>
            ))}
            <Link to={`/events`}>
              <Text
                className="link"
              >
                Join More Events!
              </Text>
            </Link>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}