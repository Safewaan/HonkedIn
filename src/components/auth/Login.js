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
  FORGOT_PASSWORD_PAGE,
  SIGNUP_PAGE
} from "../constants/Routes";

import "../../styles/style.css";

import GOOSE_IMAGE from "../../images/Goose.png"

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      history.push(HOME_PAGE)
    } catch {
      setError("Failed to log in")
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
          <Text className="header">Log In</Text>

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

            <Button
              className="button"
              marginTop="16px"
              onClick={handleSubmit}
            >
              Log In
            </Button>
          </Form>

          <div className="link">
            <Link to={FORGOT_PASSWORD_PAGE}>Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>

      <div className="link">
        Need an account? <Link to={SIGNUP_PAGE}>Sign Up</Link>
      </div>
      <div className="link">
        Forgot your password? <Link to={FORGOT_PASSWORD_PAGE}>Password Reset</Link>
      </div>
    </Box>
  )
}
