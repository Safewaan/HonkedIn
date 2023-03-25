import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Card } from "react-bootstrap"

import {
    Box,
    Text,
} from "@chakra-ui/react";

import NavigationBar from '../common/NavigationBar';

const { REACT_APP_API_ENDPOINT } = process.env;

const Requests = () => {

    // Store the user's history and currentUser
    const { currentUser } = useAuth()

    // API: Get the user's fullname for the title. 
    //Get the user's email and then get their full name
    const [email, setEmail] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [userID, setUserID] = React.useState('');

    // Obtain the user ID, firstName and lastName from the query
    const handleUserSearchByEmail = (email) => {
        callApiGetUserSearchByEmail(email)
            .then(res => {
                var parsed = JSON.parse(res.express);
                //console.log(parsed[0].id);
                setUserID(parsed[0].id);
                setFirstName(parsed[0].firstName)
                setLastName(parsed[0].lastName)
                handleGetRequestSent(parsed[0].id);
                handleGetRequestReceived(parsed[0].id);
            });
    }

    const callApiGetUserSearchByEmail = async (email) => {
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

    // Get requests sent by user
    const [sentRequests, setSentRequests] = React.useState([]);
    const [receivedRequests, setReceivedRequests] = React.useState([]);

    const handleGetRequestSent = (userID) => {
        callApiGetRequestsSent(userID).then(res => {
            var parsed = JSON.parse(res.express);
            setSentRequests(parsed);
        })
    }

    const callApiGetRequestsSent = async (userID) => {
        const url = `${REACT_APP_API_ENDPOINT}/getRequests?senderID=${userID}`;
        //debug statement
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

    const handleGetRequestReceived = (userID) => {
        callApiGetRequestsReceived(userID).then(res => {
            var parsed = JSON.parse(res.express);
            setReceivedRequests(parsed);
        })
    }

    const callApiGetRequestsReceived = async (userID) => {
        const url = `${REACT_APP_API_ENDPOINT}/getRequests?receiverID=${userID}`;
        //debug statement
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

    // Get the current user's email. 
    React.useEffect(() => {

        setEmail(currentUser.email);
        handleUserSearchByEmail(currentUser.email);
    }, []);

    return (
        <div id="body">

            <NavigationBar></NavigationBar>

            <Box marginTop="90px">
                <Box>
                    <Text
                        className="title"
                        marginBottom="16px">Sent Requests
                    </Text>
                    <RequestsList
                        requests={sentRequests}
                        type="To"
                    />
                </Box>

                <Box>
                    <Text
                        className="title"
                        marginBottom="16px">Received Requests
                    </Text>
                    <RequestsList
                        requests={receivedRequests}
                        type="From"
                    />
                </Box>
            </Box>
        </div>
    )
}

const RequestsList = ({ requests, type }) => {
    return (
        <>
            {requests.map((request) => {
                return (
                    <Box marginBottom="8px">
                        <Card>
                            <Box
                                padding="16px"
                            >
                                <Text
                                    className="header to-text"
                                >
                                    {type}:
                                </Text>
                                <Text className="body to-text">
                                    {type === 'To' ? request.receiver_name : request.sender_name}
                                </Text>

                                <Text
                                    className="header to-text"
                                    marginTop="8px"
                                >
                                    Message:
                                </Text>
                                <Text className="body to-text">
                                    {request.body}
                                </Text>
                            </Box>
                        </Card>
                    </Box>
                )
            })}
        </>
    )
}

export default Requests;