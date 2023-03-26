import React, { useRef, useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../contexts/AuthContext";

import {
    Alert,
    AlertIcon,
    AlertDescription,
    Box,
    Button,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Select,
    Text
} from '@chakra-ui/react';

import NavigationBar from '../common/NavigationBar';

import "../../styles/form-style.css";

const { REACT_APP_API_ENDPOINT } = process.env;

const CreateForum = () => {

    const { currentUser } = useAuth();
    const history = useHistory()

    //const email = currentUser.email;
    const [email, setEmail] = React.useState('');
    const [userID, setUserID] = React.useState('');
    const [userStatus, setUserStatus] = React.useState('');

    const [showUserStatusError, setShowUserStatusError] = React.useState(false);

    const [open, setOpen] = React.useState(false);


    React.useEffect(() => {
        setEmail(currentUser.email);
        loadUserEmailSearch(currentUser.email);
    }, []);

    const loadUserEmailSearch = (email) => {
        callApiGetUserEmailSearch(email)
            .then(res => {
                var parsed = JSON.parse(res.express);
                //console.log(parsed[0].id);
                setUserID(parsed[0].id);
                setUserStatus(parsed[0].status);
                setShowUserStatusError(parsed[0].status === "Archived");
            });
    }

    const callApiGetUserEmailSearch = async (email) => {
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

    const [forumName, setForumName] = React.useState('');
    const [forumNameError, setForumNameError] = React.useState('');
    const [forumNameErrorText, setForumNameErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleForumName = (event) => {
        setForumName(event.target.value);
        setForumNameError(false);
        setForumNameErrorText('');
    }

    const [forumDesc, setForumDesc] = React.useState('');
    const [forumDescError, setForumDescError] = React.useState('');
    const [forumDescErrorText, setForumDescErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleForumDesc = (event) => {
        setForumDesc(event.target.value);
        setForumDescError(false);
        setForumDescErrorText('');
    }

    const [forumTag, setForumTag] = React.useState('');
    const forumTagList = ["", "School", "Co-op", "Funny", "Debate", "Rant", "Interview", "Class Review", "Good News"];

    const handleForumTag = (event) => {
        setForumTag(event.target.value);
    }

    const [successfullSubmissionMsg, setsuccessfullSubmissionMsg] = React.useState(false);

    const resetForm = () => {
        setForumName('');
        setForumDesc('');
        setForumTag('');
    }

    const validateForum = () => {

        if (userStatus === "Archived") {
            return false;
        };

        if (forumName === '') {
            setForumNameError(true);
            setForumNameErrorText('Please enter your forum name.');
            return false;
        } else if (forumDesc === '') {
            setForumDescError(true);
            setForumDescErrorText('Please enter a description of your forum.');
            return false;
        } else {

            setOpen(true);

            var newForum = {
                forumName: forumName,
                forumDesc: forumDesc,
                forumTag: forumTag
            }

            // console.log(format(eventDate))
            loadCreateForum();
            resetForm();
            setsuccessfullSubmissionMsg(true);
            setTimeout(() => {
                setsuccessfullSubmissionMsg(false);
            }, 3000);

            return false;
        }
    };

    const loadCreateForum = () => {
        callApiCreateForum()
    }

    const callApiCreateForum = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/createForum`;
        console.log(url);
        //console.log(eventDate);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    forumTitle: forumName,
                    forumDesc: forumDesc,
                    creatorID: userID,
                    forumTag: forumTag
                })
            });

            //console.log("got past the const response thing");
            if (!response.ok) {
                throw new Error(`${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <NavigationBar></NavigationBar>

            <Box sx={{ position: 'absolute', top: 115, left: '50%', width: 600, transform: 'translateX(-50%)' }}>
                <Card style={{ padding: '16px' }}>
                    <Text align="center" className="form-header">Create a Forum</Text>
                    <FormControl>
                        <FormControl
                            isRequired
                            marginTop="16px"
                            isInvalid={forumNameError}
                        >
                            <FormLabel className="form-label">Name</FormLabel>
                            <Input
                                placeholder='Forum name'
                                className="form-input"
                                value={forumName}
                                onChange={handleForumName}
                                inputProps={{ maxLength: 350 }}
                            />
                            <FormHelperText className="form-helper-text">Enter the name of your forum.</FormHelperText>
                            <FormErrorMessage className="form-helper-text">{forumNameErrorText}</FormErrorMessage>
                        </FormControl>

                        <FormControl
                            isRequired
                            marginTop="16px"
                            isInvalid={forumDescError}>
                            <FormLabel className="form-label">Description</FormLabel>
                            <Input
                                placeholder='Forum description'
                                className="form-input"
                                value={forumDesc}
                                onChange={handleForumDesc}
                                inputProps={{ maxLength: 350 }}
                            />
                            <FormHelperText className="form-helper-text">Enter a description of your forum.</FormHelperText>
                            <FormErrorMessage className="form-helper-text">{forumDescErrorText}</FormErrorMessage>
                        </FormControl>

                        <FormControl
                            marginTop="16px"
                        >
                            <FormLabel className="form-label">Tag</FormLabel>
                            <Select
                                labelId="Media-Tag"
                                id="MediaTagList"
                                value={forumTag}
                                onChange={handleForumTag}
                                className="form-helper-text"
                            >
                                {forumTagList.map((tag) => (
                                    <option value={tag}> {tag} </option>
                                ))}
                            </Select>
                            <FormHelperText className="form-helper-text">Select a tag for your forum.</FormHelperText>
                        </FormControl>

                    </FormControl>

                    <Box marginTop="16px">
                        <Button
                            className="form-submit"
                            onClick={(event) => validateForum(event)}
                        >
                            Submit
                        </Button>
                    </Box>
                </Card>
            </Box>

            {successfullSubmissionMsg && (
                <Alert
                    status="success"
                    sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                    <AlertIcon />
                    <AlertDescription>Forum successfully created.</AlertDescription>
                </Alert>
            )}

            {showUserStatusError && (
                <Alert
                    status="error"
                    sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                    <AlertIcon />
                    <AlertDescription>You cannot create a forum if your account is archived.</AlertDescription>
                </Alert>
            )}
        </div>
    )
}

export default CreateForum;