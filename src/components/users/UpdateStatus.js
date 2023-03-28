import React, { useRef, useState } from "react"
import { Form, Card } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

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

import NavigationBar from '../common/NavigationBar';

import {
  USER_SETTINGS_PAGE
} from "../constants/Routes";

import "../../styles/style.css";

const { REACT_APP_API_ENDPOINT } = process.env;

export default function UpdateStatus() {
  const history = useHistory()

  const { currentUser } = useAuth();

  const [userID, setUserID] = React.useState('');
  const [userStatus, setUserStatus] = React.useState('');

  const [showSuccessfulActivateMsg, setshowSuccessfulActivateMsg] = React.useState(false);
  const [showSuccessfulArchiveMsg, setshowSuccessfulArchiveMsg] = React.useState(false);

  const callApiGetuserSearchByEmail = async (email) => {
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

  const loaduserSearchByEmail = (email) => {
    callApiGetuserSearchByEmail(email)
      .then(res => {
        var parsed = JSON.parse(res.express);
        //console.log(parsed[0].id);
        setUserID(parsed[0].id);
        setUserStatus(parsed[0].status);
      });
  }

  const callApiArchiveUser = async () => {
    const url = `${REACT_APP_API_ENDPOINT}/archiveUser`;
    console.log(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: userID
      })
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  const callApiActivateUser = async () => {
    const url = `${REACT_APP_API_ENDPOINT}/activateUser`;
    console.log(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: userID
      })
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  async function handleActivateAccount() {
    callApiActivateUser();
    setshowSuccessfulActivateMsg(true);
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }

  async function handleArchiveAccount() {
    await loaduserSearchByEmail(currentUser.email);
    callApiArchiveUser();
    setshowSuccessfulArchiveMsg(true);
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }

  React.useEffect(() => {
    loaduserSearchByEmail(currentUser.email);
  }, []);

  return (
    <>
      <NavigationBar></NavigationBar>
      <Card>
        <Card.Body>

          <Text className="header">Update Status</Text>

          <FormControl>
            <FormControl
              id="status">
              <FormLabel
                className="body"
                textAlign="center"
                marginTop="16px"
              >
                Status: {userStatus}
              </FormLabel>

              {userStatus === "Active" && (
                <FormLabel
                  className="body"
                  textAlign="center"
                  marginTop="16px"
                >
                  Archiving your account will remove you from search results
                  however, you will no longer be able to create events, forums and resources.
                </FormLabel>
              )}

              {userStatus === "Archived" && (
                <FormLabel
                  className="body"
                  textAlign="center"
                  marginTop="16px"
                >
                  Activating your account will allow you to create events, forums, and
                  resources. You will also appear in search results.
                </FormLabel>
              )}
            </FormControl>
            {userStatus === "Active" && (
              <Button
                onClick={handleArchiveAccount}
                className="button"
                marginTop="16px"
              >
                Archive Account
              </Button>
            )}
            {userStatus === "Archived" && (
              <Button
                onClick={handleActivateAccount}
                className="button"
                marginTop="16px"
              >
                Activate Account
              </Button>
            )}
          </FormControl>
        </Card.Body>
      </Card>

      <div className="w-100 text-center mt-2">
        <Link to={USER_SETTINGS_PAGE} className="link">Cancel</Link>
      </div>

      {showSuccessfulActivateMsg && (
        <Alert
          status="success"
          sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
          <AlertIcon />
          Account activated.
        </Alert>
      )}

      {showSuccessfulArchiveMsg && (
        <Alert
          status="success"
          sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
          <AlertIcon />
          Account archived.
        </Alert>
      )}
    </>
  )
}
