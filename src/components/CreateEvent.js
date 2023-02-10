import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

const { REACT_APP_API_ENDPOINT } = process.env;

const CreateEvent = () => {

    return (
        <>
          <Card>
            <Card.Body>
              This is where you create events.
            </Card.Body>
          </Card>
        </>
      )
}

export default CreateEvent;