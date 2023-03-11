import React, { useRef, useState } from "react"
import { Form, Button, Card } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import NavigationBar from '../common/NavigationBar';

import MuiAlert from '@mui/material/Alert';

import {
  USER_SETTINGS_PAGE
} from "../constants/Routes";

const { REACT_APP_API_ENDPOINT } = process.env;

const Alert = React.forwardRef(function Alert(props, ref) {
  return (
    <MuiAlert
      elevation={6}
      ref={ref}
      variant="filled"
      {...props}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999
      }}
    />
  );
});

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
          <h2 className="text-center mb-4">Update Status</h2>
          <Form>
            <Form.Group id="status">
              <Form.Label className="d-flex justify-content-center mb-4">Status: {userStatus}</Form.Label>

              {userStatus === "Active" && (
                <Form.Label className="text-center mb-4">Archiving your account will remove you from search results 
                however, you will no longer be able to create events, forums and resources.
                </Form.Label>
              )}

              {userStatus === "Archived" && (
                <Form.Label className="text-center mb-4">Activating your account will allow you to create events, forums, and
                  resources. You will also appear in search results.
                </Form.Label>
              )}
            </Form.Group>
            {userStatus === "Active" && (
              <Button variant="primary" onClick={handleArchiveAccount} className="w-100">
                Archive Account
              </Button>
            )}
            {userStatus === "Archived" && (
              <Button variant="primary" onClick={handleActivateAccount} className="w-100">
                Activate Account
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>

      <div className="w-100 text-center mt-2">
        <Link to={USER_SETTINGS_PAGE}>Cancel</Link>
      </div>

      {showSuccessfulActivateMsg && (
        <Alert severity="success">
          Account activated.
        </Alert>
      )}

      {showSuccessfulArchiveMsg && (
        <Alert severity="success">
          Account archived.
        </Alert>
      )}
    </>
  )
}
