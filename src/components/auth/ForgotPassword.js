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
  LOGIN_PAGE,
  SIGNUP_PAGE
} from "../constants/Routes";

import "../../styles/style.css";

import GOOSE_IMAGE from "../../images/Goose.png"

export default function ForgotPassword() {
  const emailRef = useRef()
  const { resetPassword } = useAuth()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage("Check your inbox for further instructions.")
    } catch {
      setError("Failed to reset password.")
    }

    setLoading(false)
  }

  return (
    <Box sx={{ position: 'absolute', top: 0, left: '50%', width: 400, transform: 'translateX(-50%)' }}>
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
          <Text className="header">Password Reset</Text>

          {error &&
            <Alert
              status="error"
              marginTop="16px"
              className="body"
            >
              <AlertIcon />
              {error}
            </Alert>}

          {message &&
            <Alert
              status="info"
              marginTop="16px"
              className="body"
            >
              <AlertIcon />
              {message}
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

            <Button
              className="button"
              marginTop="16px"
              onClick={handleSubmit}
            >
              Reset Password
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <div className="link">
        Need an account? <Link to={SIGNUP_PAGE}>Sign Up</Link>
      </div>
      <div className="link">
        Remembered your password? <Link to={LOGIN_PAGE}>Log In</Link>
      </div>
    </Box>
    // <>
    //   <Card>
    //     <Card.Body>
    //       <h2 className="text-center mb-4">Password Reset</h2>
    //       {error && <Alert variant="danger">{error}</Alert>}
    //       {message && <Alert variant="success">{message}</Alert>}
    //       <Form onSubmit={handleSubmit}>
    //         <Form.Group id="email">
    //           <Form.Label>Email</Form.Label>
    //           <Form.Control type="email" ref={emailRef} required />
    //         </Form.Group>
    //         <Button disabled={loading} className="w-100" type="submit">
    //           Reset Password
    //         </Button>
    //       </Form>
    //       <div className="w-100 text-center mt-3">
    //         <Link to={LOGIN_PAGE}>Login</Link>
    //       </div>
    //     </Card.Body>
    //   </Card>
    //   <div className="w-100 text-center mt-2">
    //     Need an account? <Link to={SIGNUP_PAGE}>Sign Up</Link>
    //   </div>
    // </>
  )
}
