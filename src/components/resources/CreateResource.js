import React, { useRef, useState, useEffect } from "react"
import { Form, Button, Card } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../contexts/AuthContext"

import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Box,
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

const CreateResource = () => {

    function isValidHttpUrl(string) {
        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
    }

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

    const [resourcesTitle, setResourcesTitle] = React.useState('');
    const [resourcesTitleError, setResourcesTitleError] = React.useState('');
    const [resourcesTitleErrorText, setResourcesTitleErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleResourcesTitle = (event) => {
        setResourcesTitle(event.target.value);
        setResourcesTitleError(false);
        setResourcesTitleErrorText('');
    }

    const [resourcesLink, setResourcesLink] = React.useState('');
    const [resourcesLinkError, setResourcesLinkError] = React.useState('');
    const [resourcesLinkErrorText, setResourcesLinkErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleResourcesLink = (event) => {
        setResourcesLink(event.target.value);
        setResourcesLinkError(false);
        setResourcesLinkErrorText('');
    }

    const [mediaTag, setMediaTag] = React.useState('');
    const mediaTagList = ["", "Youtube", "Stack Overflow", "School Website", "Personal Website", "Spreadsheet"];

    const handleMediaTag = (event) => {
        setMediaTag(event.target.value);
    }

    const [successfullSubmissionMsg, setsuccessfullSubmissionMsg] = React.useState(false);

    const resetForm = () => {
        setResourcesTitle('');
        setResourcesLink('');
        setMediaTag('');
    }

    const validateResources = () => {

        if (userStatus === "Archived") {
            return false;
        };

        if (resourcesTitle === '') {
            setResourcesTitleError(true);
            setResourcesTitleErrorText('Please enter your resource title.');
            return false;
        } else if (resourcesLink === '') {
            setResourcesLinkError(true);
            setResourcesLinkErrorText('Please enter the link to your resource.');
            return false;
        } else if (!isValidHttpUrl(resourcesLink)) {
            setResourcesLinkError(true);
            setResourcesLinkErrorText('Please ensure the link to your resource link starts with "https://".');
            return false;
        } else {

            setOpen(true);

            var newResources = {
                resourcesTitle: resourcesTitle,
                resourcesLink: resourcesLink,
                mediaTag: mediaTag
            }

            // console.log(format(eventDate))
            loadCreateResources();
            resetForm();
            setsuccessfullSubmissionMsg(true);
            setTimeout(() => {
                setsuccessfullSubmissionMsg(false);
            }, 3000);

            return false;
        }
    };

    const loadCreateResources = () => {
        callApiCreateResources()
    }

    const callApiCreateResources = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/createResource`;
        console.log(url);
        //console.log(eventDate);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    creatorID: userID,
                    resourcesTitle: resourcesTitle,
                    resourcesLink: resourcesLink,
                    mediaTag: mediaTag
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
            <Card style={{ padding: '16px' }}>
                <Text align="center" className="form-header">Create a Resource</Text>
                <Form>
                    <FormControl
                        isRequired
                        marginTop="16px"
                        isInvalid={resourcesTitleError}
                    >
                        <FormLabel className="form-label">Title</FormLabel>
                        <Input
                            placeholder='Resource title'
                            className="form-input"
                            value={resourcesTitle}
                            onChange={handleResourcesTitle}
                            inputProps={{ maxLength: 200 }}
                        />
                        <FormHelperText className="form-helper-text">Enter the title of your resource.</FormHelperText>
                        <FormErrorMessage className="form-helper-text">{resourcesTitleErrorText}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                        isRequired
                        marginTop="16px"
                        isInvalid={resourcesLinkError}>
                        <FormLabel className="form-label">Link</FormLabel>
                        <Input
                            placeholder='Resource link'
                            className="form-input"
                            value={resourcesLink}
                            onChange={handleResourcesLink}
                            inputProps={{ maxLength: 1000 }}
                        />
                        <FormHelperText className="form-helper-text">Enter the link to your resource ex: "https://www.google.com/".</FormHelperText>
                        <FormErrorMessage className="form-helper-text">{resourcesLinkErrorText}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                        marginTop="16px"
                    >
                        <FormLabel className="form-label">Tag</FormLabel>
                        <Select
                            labelId="Media-Tag"
                            id="MediaTagList"
                            value={mediaTag}
                            onChange={handleMediaTag}
                            className="form-helper-text"
                        >
                            {mediaTagList.map((tag) => (
                                <option value={tag}> {tag} </option>
                            ))}
                        </Select>
                        <FormHelperText className="form-helper-text">Select a tag for your resource.</FormHelperText>
                    </FormControl>
                </Form>

                <Box marginTop="16px">
                    <Button
                        className="form-submit"
                        onClick={(event) => validateResources(event)}
                    >
                        Submit
                    </Button>
                </Box>
            </Card>

            {successfullSubmissionMsg && (
                <Alert
                    status="success"
                    sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                    <AlertIcon />
                    <AlertDescription>Resource successfully created.</AlertDescription>
                </Alert>
            )}

            {showUserStatusError && (
                <Alert
                    status="error"
                    sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                    <AlertIcon />
                    <AlertDescription>You cannot create a resource if your account is archived.</AlertDescription>
                </Alert>
            )}
        </div>
    )
}

export default CreateResource;