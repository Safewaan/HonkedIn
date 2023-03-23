import React, { useRef, useState } from "react"
import { Form, Card } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import NavigationBar from '../common/NavigationBar';

import {
  Alert,
  AlertIcon,
  Button,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Input,
  Text
} from "@chakra-ui/react";

import {
  HOME_PAGE,
  USER_SETTINGS_PAGE
} from "../constants/Routes";

import "../../styles/style.css";

export default function UpdateCredentials() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { currentUser, updatePassword, updateEmail } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  function handleSubmit(e) {
    e.preventDefault()
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match.")
    }

    if (passwordRef.current.value.length < 8) {
      return setError("The new password must be at least 8 characters in length.")
    }

    const promises = []
    setLoading(true)
    setError("")

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value))
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value))
    }

    Promise.all(promises)
      .then(() => {
        history.push(HOME_PAGE)
      })
      .catch(() => {
        setError("Failed to update account.")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <NavigationBar></NavigationBar>
      <Card>
        <Card.Body>

          <Text className="header">Update Credentials</Text>

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
                defaultValue={currentUser.email}
              />
            </FormControl>

            <FormControl
              id="password"
              className="body"
              marginTop="16px"
            >
              <FormLabel className="body">New Password</FormLabel>
              <Input
                type="password"
                ref={passwordRef}
                placeholder="Leave blank to keep the same"
              />
            </FormControl>

            <FormControl
              id="password-confirm"
              className="body"
              marginTop="16px"
            >
              <FormLabel className="body">New Password Confirmation</FormLabel>
              <Input
                type="password"
                ref={passwordConfirmRef}
                placeholder="Leave blank to keep the same"
              />
            </FormControl>

            <Button
              className="button"
              marginTop="16px"
              onClick={handleSubmit}
            >
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <div className="w-100 text-center mt-2">
        <Link
          to={USER_SETTINGS_PAGE}
          className="link"
        >
          Cancel</Link>
      </div>
    </>
  )
}