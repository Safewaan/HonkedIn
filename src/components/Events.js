import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

const { REACT_APP_API_ENDPOINT } = process.env;

const Events = () => {

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