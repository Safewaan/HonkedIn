import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import NavigationBar from '../common/NavigationBar';
import Search from '../common/Search';
import Chip from '@material-ui/core/Chip';
import DropdownFilter from "../common/filters/DropdownFilter";
import ClearFilters from "../common/filters/ClearFilters";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { ChakraProvider } from "@chakra-ui/provider";
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
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
    Select,
    Text
} from '@chakra-ui/react';

//import "../../styles/form-style.css";

const { REACT_APP_API_ENDPOINT } = process.env;

const MyResources = () => {
    const useStyles = makeStyles((theme) => ({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '50ch',
            },
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
        },
    }));


    const { currentUser } = useAuth();
    const history = useHistory()
    const classes = useStyles();


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
        //console.log("got here");
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
                <Typography
                    variant="h4"
                    gutterBottom
                    component="div">
                    My Resources
                </Typography>
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
                        <Card style={{ width: '800px', marginBottom: '20px' }} key={resource.id}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {resource.resourcesTitle}<br />
                                </Typography>
                                {resource.mediaTag && <Chip
                                    key={resource.id}
                                    label={resource.mediaTag}
                                    color="primary"
                                    size="small"
                                    style={{ marginRight: 8 }}
                                />}
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Posted on {new Date(new Date(resource.dateTime).getTime() - (5 * 60 * 60 * 1000)).toLocaleDateString()}
                                </Typography>
                                <a href={`${resource.resourcesLink}`} target="_blank">
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        <br />{resource.resourcesLink}<br />
                                    </Typography>
                                </a>
                            </CardContent>
                            <CardActions>
                                {<Button onClick={() => handleOpenDialog(resource)}>Edit Resource</Button>}
                                {<Button onClick={() => handleOpenDeleteDialog(resource)}>Delete Resource</Button>}
                            </CardActions>
                        </Card>
                    )
                })}
            </Box>
            <ChakraProvider>
                {selectedResource && (
                    <div>
                        {/*Edit resource dialog*/}
                        < Dialog open={isDialogOpen} onClose={handleCloseDialog} >
                            <DialogTitle>{selectedResource.resourcesTitle}</DialogTitle>
                            <DialogContent>
                                <ResourceTitle
                                    classes={classes}
                                    resourceTitle={resourceTitle}
                                    onEnterResourceTitle={handleResourceTitle}
                                    resourceTitleError={resourceTitleError}
                                    resourceTitleErrorText={resourceTitleErrorText}
                                />

                                <ResourceLink
                                    classes={classes}
                                    resourceLink={resourceLink}
                                    onEnterResourceLink={handleResourceLink}
                                    resourceLinkError={resourceLinkError}
                                    resourceLinkErrorText={resourceLinkErrorText}
                                />

                                <MediaTag
                                    classes={classes}
                                    mediaTag={mediaTag}
                                    handleMediaTag={handleMediaTag}
                                    mediaTagList={mediaTagList}
                                />

                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog}>Close</Button>
                                {<Button onClick={handleEditForum}>Edit Resource</Button>}
                            </DialogActions>
                        </Dialog>
                    </div>
                )}

                {showEditAlertMessage && (
                    <Alert
                        status="success"
                        sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                        <AlertIcon />
                        <AlertDescription>Resource successfully edited.</AlertDescription>
                    </Alert>
                )}

                {selectedResource && (
                    <div>
                        {/* delete resource dialog*/}
                        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                            <DialogTitle> Confirm deletion</DialogTitle>
                            <DialogContent>
                                <Typography variant="body1">
                                    Are you sure you want to delete this resource? This action is irreversible.
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDeleteDialog}>No</Button>
                                <Button onClick={handleDeleteResource}>Yes</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                )}

                {showSuccessfulDeleteMsg && (
                    <Alert
                        status="success"
                        sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                        <AlertIcon />
                        <AlertDescription>Resource successfully deleted.</AlertDescription>
                    </Alert>
                )}

            </ChakraProvider>
        </div>
    );

}

const ResourceTitle = ({ resourceTitle, onEnterResourceTitle, resourceTitleError, resourceTitleErrorText }) => {
    return (
        <div>
            <FormControl
                isRequired
                marginTop="16px"
                isInvalid={resourceTitleError}
            >
                <Input
                    id="resource-title"
                    label="Title"
                    placeholder="Enter the resource title"
                    value={resourceTitle}
                    onChange={onEnterResourceTitle}
                    error={resourceTitleError}
                    fullWidth
                />
                <FormHelperText>{resourceTitleErrorText}</FormHelperText>
            </FormControl>
        </div>
    )
}

const ResourceLink = ({ resourceLink, onEnterResourceLink, resourceLinkError, resourceLinkErrorText }) => {
    return (
        <div>
            <FormControl
                isRequired
                marginTop="16px"
                isInvalid={resourceLinkError}>
                <FormLabel className="form-label">Link</FormLabel>
                <Input
                    placeholder='Resource link'
                    className="form-input"
                    value={resourceLink}
                    onChange={onEnterResourceLink}
                    inputProps={{ maxLength: 1000 }}
                />
                <FormHelperText className="form-helper-text">Enter the link to your resource ex: "https://www.google.com/".</FormHelperText>
                <FormErrorMessage className="form-helper-text">{resourceLinkErrorText}</FormErrorMessage>
            </FormControl>
        </div>
    )
}
const MediaTag = ({ mediaTag, handleMediaTag, mediaTagList }) => {
    return (
        <div>
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
        </div>
    )
}



export default MyResources; 
