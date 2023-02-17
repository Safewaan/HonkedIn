import React, { useRef, useState, useEffect } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import { createTheme, ThemeProvider, styled, MuiThemeProvider } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";

const { REACT_APP_API_ENDPOINT } = process.env;

/*const MyPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  elevation: 3,
  padding: 8,
  borderRadius: 4,
  margin: theme.spacing(2)
}));

const MainGridContainer = styled(Grid)(({ theme }) => ({
  margin: theme.spacing(4),
})); */


const Events = () => {

  const { currentUser } = useAuth();
  const history = useHistory()

  React.useEffect(() => {
    if (currentUser == null) {
      history.push("/login");
    }
  }, []);

  const [events, setEvents] = React.useState([]);

  const loadGetEvents = () => {
    callApiGetEvents()
      .then(res => {

        var parsed = JSON.parse(res.express);

        setEvents(parsed);
      })
  }

  const callApiGetEvents = async () => {

    const url = `${REACT_APP_API_ENDPOINT}/getEvents`;
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

  const [eventCreator, setEventCreator] = React.useState('');

  useEffect(() => {
    loadGetEvents();
  }, []);

  const loadUserEmailSearch = () => {
    callApiGetUserEmailSearch()
      .then(res => {
        var parsed = JSON.parse(res.express);
        //console.log(parsed[0].firstName + " " + parsed[0].lastName);
        var creatorName = (parsed[0].firstName).concat(" ", parsed[0].lastName);
        console.log(creatorName);
        //setEventCreator(parsed[0].id);
      });

  }

  const callApiGetUserEmailSearch = async () => {
    const url = `${REACT_APP_API_ENDPOINT}/userEmailSearch`;
    console.log(url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  return (
    <>
      <body>
        <div id="body">
          <html>
            <h1>
              Events
            </h1>


            {events.map(({ id, firstName, lastName, name, description, location, date }) => (
              //need to map this better and generally look nicer tbh
              //also need to update date formatting 
              // and figure out userID
              <Card >
                <ul item key={id} value={[firstName, lastName, name, description, location, date]}>
                  <font size='5'> {name} <br></br></font>
                  Hosted By: {firstName}&nbsp;{lastName} <br></br>
                  Date: {date} <br></br>
                  {location} <br></br>
                  <font size='3'>  &nbsp;  {description} <br></br></font>
                </ul>
              </Card>
            ))}


          </html>
        </div>
      </body>

    </>
  )
}


export default Events;