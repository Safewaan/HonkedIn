import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { Card } from 'react-bootstrap';

import NavigationBar from '../common/NavigationBar';
import Search from '../common/Search';
import DropdownFilter from "../common/filters/DropdownFilter";
import ClearFilters from "../common/filters/ClearFilters";

import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Badge,
    Box,
    Button,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberDecrementStepper,
    NumberIncrementStepper,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Select,
    Text
} from '@chakra-ui/react'

const { REACT_APP_API_ENDPOINT } = process.env;

const MyResources = () => {
    const { currentUser } = useAuth();
    const history = useHistory()

    const [searchTerm, setSearchTerm] = React.useState("");
    const [refreshSearch, setRefreshSearch] = React.useState(1);
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }
    const [userID, setUserID] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [resources, setResources] = React.useState([]);

    const [selectedResource, setSelectedResource] = React.useState(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [showEditAlertMessage, setShowEditAlertMessage] = React.useState(false);
    const [showSuccessfulDeleteMsg, setshowSuccessfulDeleteMsg] = React.useState(false);

    const [resourceTitle, setResourceTitle] = React.useState("");
    const [resourceTitleError, setResourceTitleError] = React.useState("");
    const [resourceTitleErrorText, setResourceTitleErrorText] = React.useState("");
    const handleResourceTitle = (resource) => {
        setResourceTitle(resource.target.value);
        setResourceTitleError(false);
        setResourceTitleErrorText('');
    }
    const [resourceLink, setResourceLink] = React.useState("");
    const [resourceLinkError, setResourceLinkError] = React.useState("");
    const [resourceLinkErrorText, setResourceLinkErrorText] = React.useState("");
    const handleResourceLink = (resource) => {
        setResourceLink(resource.target.value);
        setResourceLinkError(false);
        setResourceLinkErrorText('');
    }
    //for editing chosen tag
    const [mediaTag, setMediaTag] = React.useState("");
    const mediaTagList = ["", "Interview Tips", "Youtube", "Stack Overflow", "School", "Personal Website", "Spreadsheet"];
    const handleMediaTag = (event) => {
        setMediaTag(event.target.value);
    }

    //for filtering
    const [resourceTag, setResourceTag] = React.useState("");
    const resourceTagList = ["Interview Tips", "Youtube", "Stack Overflow", "School", "Personal Website", "Spreadsheet"];
    const handleResourceTag = (event) => {
        setResourceTag(event.target.value);
    }

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

    React.useEffect(() => {
        setEmail(currentUser.email);
        loaduserSearchByEmail(currentUser.email);
    }, []);

    const loaduserSearchByEmail = (email) => {
        callApiGetuserSearchByEmail(email)
            .then(res => {
                var parsed = JSON.parse(res.express);
                //console.log(parsed[0].id);
                setUserID(parsed[0].id);
            });
    }

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

    React.useEffect(() => {
        setEmail(currentUser.email);
        loaduserSearchByEmail(currentUser.email)
    }, []);

    const loadgetResourcesByUser = async () => {
        try {
            const res = await callAPIgetResourcesByUser(userID, searchTerm);
            const parsed = JSON.parse(res.express);
            setResources(parsed);
        } catch (error) {
            console.error(error);
        }
    }

    const callAPIgetResourcesByUser = async (userID, searchTerm) => {

        const url = `${REACT_APP_API_ENDPOINT}/getResourcesByUser?userID=${userID}&searchTerm=${searchTerm}`;
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

    useEffect(() => {
        loadgetResourcesByUser();
    }, [userID, refreshSearch]);

    const handleEditForum = () => {
        if (resourceTitle === '') {
            setResourceTitleError(true);
            setResourceTitleErrorText('Please enter the resource title');
            return false;
        } else if (resourceLink === '') {
            setResourceLinkError(true);
            setResourceLinkErrorText('Please enter the resource link');
            return false;
        } else {
            //console.log("about to call api edit resource");
            CallApiEditResource();
            setShowEditAlertMessage(true);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    }

    const CallApiEditResource = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/editResource`;
        console.log(url);

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                resourceTitle: resourceTitle,
                resourceLink: resourceLink,
                mediaTag: mediaTag,
                resourceID: selectedResource.id
            })
        });

        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    const handleDeleteResource = async () => {
        await loaduserSearchByEmail(currentUser.email);
        setshowSuccessfulDeleteMsg(true);
        callAPIDeleteResource();
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }

    const callAPIDeleteResource = async () => {
        const url = `${REACT_APP_API_ENDPOINT}/deleteResource`;
        console.log(url);

        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                resourceID: selectedResource.id
            })
        });
        console.log("want to delete resource: " + selectedResource.id)
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    const handleOpenDialog = (resource) => {
        setSelectedResource(resource);
        console.log(selectedResource)
        setIsDialogOpen(true);

        // Update resource title
        setResourceTitle(resource.resourcesTitle);
        setResourceTitleError(false);
        setResourceTitleErrorText('');

        // Update resource link
        setResourceLink(resource.resourcesLink);
        setResourceLinkError(false);
        setResourceLinkErrorText('');

        // Update resource media tag
        setMediaTag(resource.mediaTag);
    };

    const handleOpenDeleteDialog = (resource) => {
        setSelectedResource(resource);
        setOpenDeleteDialog(true);
    }

    const handleCloseDeleteDialog = () => {
        setSelectedResource(null);
        setOpenDeleteDialog(false);
    }

    const handleCloseDialog = () => {
        setSelectedResource(null);
        setIsDialogOpen(false);
    };

    const handleRefreshFilter = async () => {
        setResourceTag("");
    }

    const handleRefreshSearch = async () => {
        setSearchTerm("");
        setRefreshSearch(refreshSearch + 1);
    }

    return (
        <div id="body">

            <NavigationBar></NavigationBar>

            <Box sx={{ position: 'absolute', top: 115, left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Text
                    className="title"
                >
                    My Resources
                </Text>
            </Box>

            <Box sx={{ width: '600px', position: 'absolute', top: 185, left: '50%', transform: 'translateX(-50%)', marginBottom: '20px' }}>
                <Search
                    label="Search for resource names"
                    searchTerm={searchTerm}
                    onSetSearch={handleSearch}
                    fullWidth
                    onButtonClick={loadgetResourcesByUser}
                    onResetSearch={handleRefreshSearch}
                />
                <Text
                    className="header"
                >
                    Filters
                </Text>
                <DropdownFilter
                    placeholder="Select a Media Type Tag"
                    value={resourceTag}
                    onChange={handleResourceTag}
                    lists={resourceTagList}
                />
                <ClearFilters
                    onClick={() => handleRefreshFilter()}
                />
            </Box>

            <Box sx={{ position: 'absolute', top: 390, left: '50%', transform: 'translateX(-50%)' }}>
                {resources.map((resource) => {
                    if (resourceTag && resource.mediaTag !== resourceTag) {
                        return null;
                    }
                    return (
                        <Card style={{ width: '600px', marginBottom: '8px', padding: '16px' }}>
                            <Text className="headerBig to-text">
                                {resource.resourcesTitle}
                            </Text>

                            {resource.mediaTag &&
                                <Badge
                                    className="body"
                                    backgroundColor="#023679"
                                    color="#FFFFFF"
                                    marginTop="4px"
                                    textAlign="center"
                                    width="140px"
                                >
                                    {resource.mediaTag}
                                </Badge>
                            }

                            <Text
                                className="header to-text"
                                marginTop="8px"
                            >
                                Posted on: {new Date(new Date(resource.dateTime).getTime() - (4 * 60 * 60 * 1000)).toLocaleDateString()}
                            </Text>

                            <Text
                                className="header to-text"
                                marginTop="8px"
                            >
                                By: {resource.creatorName}
                            </Text>

                            <Text
                                className="header to-text"
                                marginTop="8px"
                            >
                                Link to Resource:
                            </Text>
                            <a href={`${resource.resourcesLink}`} target="_blank">
                                <Text
                                    className="body to-text"
                                    marginTop="2px"
                                >
                                    {resource.resourcesLink}
                                </Text>
                            </a>

                            <Box
                                display="flex"
                                flexDirection="row"
                                marginTop="8px"
                            >
                                <Button
                                    onClick={() => handleOpenDeleteDialog(resource)}
                                    className="button"
                                    marginRight="8px"
                                >
                                    Delete Resource
                                </Button>

                                <Button
                                    onClick={() => handleOpenDialog(resource)}
                                    className="button"
                                >
                                    Edit Resource
                                </Button>
                            </Box>
                        </Card>
                    )
                })}
            </Box>

            {selectedResource && (
                <Box>
                    {/* Cancel event diaglog */}
                    <Modal isOpen={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                        <ModalOverlay />
                        <ModalContent
                            style={{ width: '400px', padding: '16px' }}
                        >
                            <ModalHeader
                                className="bigHeader"
                                textAlign="center"
                            >
                                Confirm Deletion
                            </ModalHeader>

                            <Text className="header to-text">
                                Are you sure you want to delete this resource? This action is irreversible.
                            </Text>

                            <Box
                                display="flex"
                                flexDirection="row"
                                marginTop="8px"
                            >
                                <Button
                                    className="button"
                                    onClick={handleCloseDeleteDialog}
                                    marginRight="8px"
                                >
                                    No
                                </Button>
                                <Button
                                    className="button"
                                    onClick={handleDeleteResource}
                                >
                                    Yes
                                </Button>
                            </Box>
                        </ModalContent>
                    </Modal>

                    <Modal isOpen={isDialogOpen} onClose={handleCloseDialog}>
                        <ModalOverlay />
                        <ModalContent
                            style={{ width: '400px', padding: '16px' }}
                        >
                            {/*Edit resource dialog*/}
                            <Text align="center" className="form-header">Edit Resource</Text>
                            <FormControl>
                                <FormControl
                                    isRequired
                                    marginTop="16px"
                                    isInvalid={resourceTitleError}
                                >
                                    <FormLabel className="form-label">Title</FormLabel>
                                    <Input
                                        placeholder='Resource title'
                                        className="form-input"
                                        value={resourceTitle}
                                        onChange={handleResourceTitle}
                                        inputProps={{ maxLength: 200 }}
                                    />
                                    <FormHelperText className="form-helper-text">Enter the title of your resource.</FormHelperText>
                                    <FormErrorMessage className="form-helper-text">{resourceTitleErrorText}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    isRequired
                                    marginTop="16px"
                                    isInvalid={resourceLinkError}>
                                    <FormLabel className="form-label">Link</FormLabel>
                                    <Input
                                        placeholder='Resource link'
                                        className="form-input"
                                        value={resourceLink}
                                        onChange={handleResourceLink}
                                        inputProps={{ maxLength: 1000 }}
                                    />
                                    <FormHelperText className="form-helper-text">Enter the link to your resource ex: "https://www.google.com/".</FormHelperText>
                                    <FormErrorMessage className="form-helper-text">{resourceLinkErrorText}</FormErrorMessage>
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
                            </FormControl>

                            <Box
                                display="flex"
                                flexDirection="row"
                                marginTop="16px"
                            >
                                <Button
                                    className="button"
                                    onClick={handleCloseDialog}
                                    marginRight="8px"
                                >
                                    Close
                                </Button>
                                <Button
                                    className="button"
                                    onClick={handleEditForum}
                                >
                                    Edit
                                </Button>
                            </Box>
                        </ModalContent>
                    </Modal>
                </Box>
            )
            }

            {
                showEditAlertMessage && (
                    <Alert
                        status="success"
                        sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                        <AlertIcon />
                        <AlertDescription>Resource successfully edited.</AlertDescription>
                    </Alert>
                )
            }

            {
                showSuccessfulDeleteMsg && (
                    <Alert
                        status="success"
                        sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                        <AlertIcon />
                        <AlertDescription>Resource successfully deleted.</AlertDescription>
                    </Alert>
                )}
        </div>
    );

}

export default MyResources; 
