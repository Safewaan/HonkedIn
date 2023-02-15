import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

const { REACT_APP_API_ENDPOINT } = process.env;

const Events = () => {

  const [events, setEvents] = React.useState([]); 

  const loadCreateEvent = () => { 
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;

  }




    return (
        <>
          <Card>
            <Card.Body>
              Welcome to the Events Page.
            </Card.Body>
          </Card>
        </>
      )
}

export default Events;