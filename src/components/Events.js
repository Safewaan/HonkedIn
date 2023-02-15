import React, { useRef, useState, useEffect } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Typography from "@material-ui/core/Typography";

const { REACT_APP_API_ENDPOINT } = process.env;

const Events = () => {

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

  useEffect(() => { 
    loadGetEvents(); 
  }, []);


    return (
        <>
          <Card>
            <Card.Body>
              Welcome to the Events Page.
            </Card.Body>

            
              {events.map(({ id, name, description, location, date}) => (
                //need to map this better and generally look nicer tbh
                //also need to update date formatting 
                // and figure out userID
                <Card.Body key = {id} value={[name, description, location, date]}>
                    {name} &nbsp;
                    {description} &nbsp;
                    {location} &nbsp;
                    {date} &nbsp;
                </Card.Body>
              ))}
            
          </Card>
        </>
      )
}


export default Events;