import React, { useState, useEffect } from "react"
import { Card, Form } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { useParams } from 'react-router-dom';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    Avatar,
    Badge,
    Box,
    Button,
    Center,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Select,
    Text,
    useDisclosure,
    Textarea,
    FormHelperText
} from "@chakra-ui/react";

import NavigationBar from '../common/NavigationBar';

import "../../styles/style.css";

// Server URL
const { REACT_APP_API_ENDPOINT } = process.env;

const NetworkProfile = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    // Store the user's history and currentUser
    const { currentUser } = useAuth()

    // API: Get the user's fullname for the title. 
    //Get the user's email and then get their full name
    const [email, setEmail] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [userID, setUserID] = React.useState('');

    // Get the current user's email. 
    React.useEffect(() => {

        setEmail(currentUser.email);
        handleUserSearchByEmail(currentUser.email);
    }, []);

    // Obtain the user ID, firstName and lastName from the query
    const handleUserSearchByEmail = (email) => {
        callApiGetUserSearchByEmail(email)
            .then(res => {
                var parsed = JSON.parse(res.express);
                //console.log(parsed[0].id);
                setUserID(parsed[0].id);
                setFirstName(parsed[0].firstName)
                setLastName(parsed[0].lastName)

                handleAPIUserProfile(parsed[0].id);
            });
    }

    // Call the API to query with the user's email obtained from Firebase
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

    const { selectedUserID } = useParams();
    const [openDialog, setOpenDialog] = React.useState(false);

    useEffect(() => {
        //setEmail(currentUser.email);
        //console.log('selected user id is: ' + selectedUserID);
        handleAPIUserProfile(selectedUserID);
    }, []);

    const [profileID, setProfileID] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [aboutMe, setAboutMe] = React.useState('');
    const [yearSemester, setYearSemester] = React.useState('');
    const [program, setProgram] = React.useState('');
    const [interest, setInterest] = React.useState('');
    const [coop, setCoop] = React.useState('');
    const [pictureURL, setPictureURL] = React.useState('');

    const handleAPIUserProfile = async () => {
        try {
            const res = await callAPIUserProfile(selectedUserID);
            const parsed = JSON.parse(res.express);
            if (parsed.length !== 0) {

                setProfileID(parsed[0].userID);
                setUserName(parsed[0].userName);
                setAboutMe(parsed[0].aboutMe);
                setYearSemester(parsed[0].yearSemester);
                setProgram(parsed[0].program);
                setInterest(parsed[0].interest);
                setCoop(parsed[0].coop);
                setPictureURL(parsed[0].pictureURL);
            } else {
                setOpenDialog(true);
            }

        } catch (error) {
            console.error(error);
        }
    }

    const callAPIUserProfile = async (selectedUserID) => {

        const url = `${REACT_APP_API_ENDPOINT}/getUserProfile?userID=${selectedUserID}`;
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

    const [body, setBody] = React.useState("");
    const handleBody = (event) => {
        setBody(event.target.value);
    }

    const [error, setError] = React.useState("");
    const [successfullSubmissionMsg, setsuccessfullSubmissionMsg] = React.useState(false);

    const handleCreateRequest = () => {
        if (body === "") {
            return setError("Please create a message for your request.");
        }

        callApiGetRequestsSentPreviously(userID).then(res => {
            var parsed = JSON.parse(res.express);
            console.log(parsed);
            console.log(parsed.length);
            if (parsed.length > 0) {
                return setError(`You've already sent ${userName} a request.`);
            } else {
                callAPICreateRequest().then(res => {
                    setError("");
                    setsuccessfullSubmissionMsg(true);
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                });
            }
        })
    }

    const callAPICreateRequest = async () => {
        const url = `${REACT_APP_API_ENDPOINT}/createRequest`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                senderID: userID,
                receiverID: selectedUserID,
                body: body
            })
        });
        const bodyResponse = await response.json();
        if (response.status !== 200) throw Error(bodyResponse.message);
        return bodyResponse;
    }

    const callApiGetRequestsSentPreviously = async (userID) => {
        const url = `${REACT_APP_API_ENDPOINT}/getRequests?senderID=${userID}&receiverID=${profileID}`;
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

    return (
        <>
            <NavigationBar></NavigationBar>

            <Box sx={{ position: 'absolute', top: 115, left: '50%', width: 800, transform: 'translateX(-50%)' }}>
                <Card>
                    <Center>
                        <Avatar
                            size="2xl"
                            src={pictureURL}
                            marginTop="16px" />
                    </Center>

                    <Center>
                        <Heading className="title" mt="4" mb="2">
                            {userName}
                        </Heading>
                    </Center>

                    <Center>
                        <Badge
                            className="body"
                            backgroundColor="#023679"
                            color="#FFFFFF"
                        >
                            {program}
                        </Badge>
                    </Center>

                    <Center>
                        <Badge
                            className="body"
                            backgroundColor="#023679"
                            color="#FFFFFF"
                            marginTop="4px"
                        >
                            {yearSemester}
                        </Badge>
                    </Center>

                    <Box
                        marginTop="16px"
                        paddingBottom="16px"
                        textAlign="center"
                    >
                        <Box>
                            <Heading className="headerBig">
                                About Me
                            </Heading>
                            <Text className="header">
                                {aboutMe}
                            </Text>
                        </Box>

                        <Box marginTop="8px">
                            <Heading className="headerBig">
                                Co-op
                            </Heading>
                            <Text className="header">
                                {coop}
                            </Text>
                        </Box>

                        <Box marginTop="8px">
                            <Heading className="headerBig">
                                Interest
                            </Heading>
                            <Text className="header">
                                {interest}
                            </Text>
                        </Box>
                    </Box>

                    {/*Edit profile dialog*/}
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader className="header">Send Request</ModalHeader>
                            {error &&
                                <Alert
                                    status="error"
                                    marginTop="16px"
                                    className="body"
                                >
                                    <AlertIcon />
                                    {error}
                                </Alert>}
                            <ModalBody>
                                <Form>
                                    <FormLabel className="body" textAlign="center">
                                        Send a request to {userName} to connect externally.
                                    </FormLabel>
                                    <FormControl
                                        className="body"
                                        marginTop="32px"
                                    >
                                        <FormLabel className="body">Message:</FormLabel>
                                        <Textarea
                                            onChange={handleBody}
                                            type="About Me"
                                            required
                                            maxLength="255"
                                        />
                                        <FormHelperText className="body">
                                            Make sure to include a phone number or email address.
                                        </FormHelperText>
                                    </FormControl>
                                </Form>
                            </ModalBody>

                            <ModalFooter>
                                <Button className="button" onClick={onClose} marginRight="8px">
                                    Close
                                </Button>
                                <Button className="button" onClick={handleCreateRequest}>Send</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Card>

                <Box float="right" width="15%" marginTop="8px">
                    <Button
                        onClick={onOpen}
                        className="button"
                    >Send Request</Button>
                </Box>
            </Box>

            {
                successfullSubmissionMsg && (
                    <Alert
                        status="success"
                        sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                        <AlertIcon />
                        <AlertDescription>Request successfully sent.</AlertDescription>
                    </Alert>
                )
            }
        </>
    );
}

export default NetworkProfile; 