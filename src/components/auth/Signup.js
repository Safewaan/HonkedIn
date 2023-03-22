import React, { useRef, useState } from "react"
import { Form, Card } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  Text
} from "@chakra-ui/react";

import {
  HOME_PAGE,
  LOGIN_PAGE
} from "../constants/Routes";

import "../../styles/style.css";

import GOOSE_IMAGE from "../../images/Goose.png"

const { REACT_APP_API_ENDPOINT } = process.env;

export default function Signup() {
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  const callApiCreateUser = async () => {
    const url = `${REACT_APP_API_ENDPOINT}/createUser`;
    console.log(url);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: firstNameRef.current.value,
          lastName: lastNameRef.current.value,
          email: emailRef.current.value
        })
      });

      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      callApiCreateUser()
      history.push(HOME_PAGE)
    } catch {
      setError("Failed to create an account")
    }

    setLoading(false)
  }

  return (
    <Box transform="translateY(-10%)">
      <Box
        className="title"
        display="flex"
        alignItems="center"
      >
        <Image
          src={GOOSE_IMAGE}
          boxSize='100px'
          className="logo"></Image>
        <Text
        >
          HonkedIn
        </Text>
      </Box>
      <Card>
        <Card.Body>
          <Text className="header">Sign Up</Text>

          {error &&
            <Alert
              status="error"
              marginTop="16px"
              className="body"
            >
              <AlertIcon />
              {error}
            </Alert>}

          <Form>
            <FormControl
              id="first-name"
              className="body"
              marginTop="16px"
            >
              <FormLabel className="body">First Name</FormLabel>
              <Input
                type="email"
                ref={firstNameRef}
                required
              />
            </FormControl>

            <FormControl
              id="last-name"
              className="body"
              marginTop="16px"
            >
              <FormLabel className="body">Last Name</FormLabel>
              <Input
                type="email"
                ref={lastNameRef}
                required
              />
            </FormControl>

            <FormControl
              id="email"
              className="body"
              marginTop="16px"
            >
              <FormLabel className="body">Email</FormLabel>
              <Input
                type="email"
                ref={emailRef}
                required
              />
            </FormControl>

            <FormControl
              id="password"
              className="body"
              marginTop="16px"
            >
              <FormLabel className="body">Password</FormLabel>
              <Input
                type="password"
                ref={passwordRef}
              />
            </FormControl>

            <FormControl
              id="password-confirm"
              className="body"
              marginTop="16px"
            >
              <FormLabel className="body">Password Confirmation</FormLabel>
              <Input
                type="password"
                ref={passwordConfirmRef}
              />
            </FormControl>

            <Button
              className="button"
              marginTop="16px"
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="link">
        Already have an account? <Link to={LOGIN_PAGE}>Log In</Link>
      </div>
    </Box>
  )
}
