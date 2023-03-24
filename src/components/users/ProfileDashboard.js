import React, { useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { Card, Form } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"

import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Avatar,
    Badge,
    Box,
    Button,
    Center,
    FormControl,
    FormLabel,
    Flex,
    Heading,
    HStack,
    Input,
    Grid,
    GridItem,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Select,
    Text,
    useDisclosure
} from "@chakra-ui/react";

import NavigationBar from '../common/NavigationBar';

// Server URL
const { REACT_APP_API_ENDPOINT } = process.env;

// Main page of Profile, i
const ProfileDashboard = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const yearList = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "Masters", "PHD", "Professor"];

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

    // RENDER STATES
    const [aboutMe, setAboutMe] = React.useState('');
    const [yearSemester, setYearSemester] = React.useState('');
    const [program, setProgram] = React.useState('');
    const [interest, setInterest] = React.useState('');
    const [coop, setCoop] = React.useState('');
    const [pictureURL, setPictureURL] = React.useState('');

    // Inserts the User ID to retrieve their most recent profile 
    const callAPIUserProfile = async (userID) => {

        const url = `${REACT_APP_API_ENDPOINT}/getUserProfile?userID=${userID}`;
        console.log(url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        //console.log("Profile:", body);
        return body;
    }

    // Parses through the data for the user if there is existing data
    const handleAPIUserProfile = (userID) => {
        callAPIUserProfile(userID)
            .then(res => {
                var parsed = JSON.parse(res.express);

                if (parsed.length !== 0) {

                    // Update Render States
                    setAboutMe(parsed[0].aboutMe);
                    setYearSemester(parsed[0].yearSemester);
                    setProgram(parsed[0].program);
                    setInterest(parsed[0].interest);
                    setCoop(parsed[0].coop);
                    setPictureURL(parsed[0].pictureURL);

                    // Update Form states
                    setAboutMeForm(parsed[0].aboutMe);
                    setYearSemesterForm(parsed[0].yearSemester);
                    setProgramForm(parsed[0].program);
                    setInterestForm(parsed[0].interest);
                    setCoopForm(parsed[0].coop);
                    setPictureURLForm(parsed[0].pictureURL);
                }
            })
    }

    // FORM STATES
    const [aboutMeForm, setAboutMeForm] = React.useState('');
    const handleAboutMeForm = (event) => {
        setAboutMeForm(event.target.value);
    }

    const [yearSemesterForm, setYearSemesterForm] = React.useState('');
    const handleYearSemesterForm = (event) => {
        setYearSemesterForm(event.target.value);
    }

    const [programForm, setProgramForm] = React.useState('');
    const handleProgramForm = (event) => {
        setProgramForm(event.target.value);
        console.log(event.target.value);
    }

    const [interestForm, setInterestForm] = React.useState('');
    const handleInterestForm = (event) => {
        setInterestForm(event.target.value);
    }

    const [coopForm, setCoopForm] = React.useState('');
    const handleCoopForm = (event) => {
        setCoopForm(event.target.value);
    }

    const [pictureURLForm, setPictureURLForm] = React.useState('');
    const handlePictureURLForm = (event) => {
        setPictureURLForm(event.target.value);
    }

    const [error, setError] = React.useState("");


    // Other APIs - getUserProfile, editUserProfile and createUserProfile 
    // Add the user's profile information into the database
    const callApiCreateUserProfile = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/createUserProfile`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //authorization: `Bearer ${this.state.token}`
            },
            body: JSON.stringify({
                aboutMe: aboutMeForm,
                yearSemester: yearSemesterForm,
                program: programForm,
                interest: interestForm,
                coop: coopForm,
                userID: userID
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        console.log("Profile:", body);
        return body;
    }

    const handleApiCreateUserProfile = () => {
        callApiCreateUserProfile()
            .then(res => {
                console.log("callApiCreateUserProfile returned: ", res)
            })
    }

    //Edit the user's profile if there is already existing information. 
    const callApiEditUserProfile = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/editUserProfile`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //authorization: `Bearer ${this.state.token}`
            },
            body: JSON.stringify({
                aboutMe: aboutMeForm,
                yearSemester: yearSemesterForm,
                program: programForm,
                interest: interestForm,
                coop: coopForm,
                pictureURL: pictureURLForm,
                userID: userID
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        console.log("Profile Update:", body);
        return body;
    }

    const handleApiEditUserProfile = () => {
        callApiEditUserProfile()
            .then(res => {
                console.log("callApiAddSubmission returned: ", res)
            })
    }

    const HandleEditProfile = () => {
        if (aboutMeForm === "") {
            return setError("Please include an about me section.");
        }

        if (yearSemesterForm === "") {
            return setError("Please set your year and semester.");
        }

        if (programForm === "") {
            return setError("Please input your program.");
        }

        if (interestForm === "") {
            return setError("Please input an interest of yours.")
        }

        if (coopForm === "") {
            return setError("Please input your most recent co-op.");
        }
        setError("");

        // If the user profile doesnt exist, create one
        if (aboutMe === "") {
            handleApiCreateUserProfile();
        }
        // If the user profile exists, update existing row
        else {
            handleApiEditUserProfile();
        }
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }

    return (
        <>
            <NavigationBar></NavigationBar>
            <Box
                p="6"
                width="800px"
                position="absolute"
                top="40%"
                left="50%"
                transform="translate(-50%, -50%)"
            >
                <Card>
                    <Center>
                        <Avatar
                            size="2xl"
                            src={pictureURL}
                            marginTop="16px" />
                    </Center>

                    <Center>
                        <Heading mt="4" mb="2">
                            {firstName} {lastName}
                        </Heading>
                    </Center>

                    <Center>
                        <Badge colorScheme="blue">{program}</Badge>
                    </Center>

                    <Center>
                        <Badge colorScheme="blue" marginTop="8px">{yearSemester}</Badge>
                    </Center>

                    <Box paddingBottom="16px" textAlign="center">
                        <Box>
                            <Heading size="md" mb="4">
                                About Me
                            </Heading>
                            <Text>
                                {aboutMe}
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb="4">
                                Co-op
                            </Heading>
                            <Text>
                                {coop}
                            </Text>
                        </Box>

                        <Box>
                            <Heading size="md" mb="4">
                                Interest
                            </Heading>
                            <Text>
                                {interest}
                            </Text>
                        </Box>
                    </Box>

                    {/*Edit profile dialog*/}
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Edit Profile</ModalHeader>
                            {error &&
                                <Alert
                                    status="error"
                                    marginTop="16px"
                                    className="body"
                                >
                                    <AlertIcon />
                                    {error}
                                </Alert>}
                            <ModalCloseButton />
                            <ModalBody>
                                <Form>
                                    <FormControl
                                        className="body"
                                        marginTop="16px"
                                    >
                                        <FormLabel className="body">Profile Picture URL</FormLabel>
                                        <Input
                                            defaultValue={pictureURL}
                                            onChange={handlePictureURLForm}
                                            type="About Me"
                                            required
                                        />
                                    </FormControl>

                                    <FormControl
                                        className="body"
                                        marginTop="16px"
                                    >
                                        <FormLabel className="body">About Me</FormLabel>
                                        <Input
                                            defaultValue={aboutMe}
                                            onChange={handleAboutMeForm}
                                            type="About Me"
                                            required
                                        />
                                    </FormControl>

                                    <FormControl
                                        id="password"
                                        className="body"
                                        marginTop="16px"
                                    >
                                        <FormLabel className="body">Year and Semester</FormLabel>
                                        <Select
                                            defaultValue={yearSemester}
                                            onChange={handleYearSemesterForm}
                                        >
                                            {yearList.map((year) => (
                                                <option value={year}> {year} </option>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl
                                        className="body"
                                        marginTop="16px"
                                    >
                                        <FormLabel className="body">Program</FormLabel>
                                        <Input
                                            defaultValue={program}
                                            onChange={handleProgramForm}
                                            type="Program"
                                            required
                                        />
                                    </FormControl>

                                    <FormControl
                                        className="body"
                                        marginTop="16px"
                                    >
                                        <FormLabel className="body">Co-op</FormLabel>
                                        <Input
                                            defaultValue={coop}
                                            onChange={handleCoopForm}
                                            type="Co-op"
                                            required
                                        />
                                    </FormControl>

                                    <FormControl
                                        className="body"
                                        marginTop="16px"
                                    >
                                        <FormLabel className="body">Interest</FormLabel>
                                        <Input
                                            defaultValue={interest}
                                            onChange={handleInterestForm}
                                            type="Interest"
                                            required
                                        />
                                    </FormControl>
                                </Form>
                            </ModalBody>

                            <ModalFooter>
                                <Button onClick={onClose}>
                                    Close
                                </Button>
                                <Button onClick={HandleEditProfile}>Edit</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                </Card>
                <Box textAlign="right" marginTop="8px">
                    <Button onClick={onOpen}>Edit Profile</Button>
                </Box>
            </Box>

        </>
    );
};

export default ProfileDashboard;