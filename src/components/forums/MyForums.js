import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { Card } from 'react-bootstrap';

import Search from '../common/Search';
import DropdownFilter from "../common/filters/DropdownFilter";
import ClearFilters from "../common/filters/ClearFilters";
import DateFilter from "../common/filters/DateFilter";
import Chip from '@material-ui/core/Chip';
import "react-datepicker/dist/react-datepicker.css";

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
} from '@chakra-ui/react';

import NavigationBar from '../common/NavigationBar';

const { REACT_APP_API_ENDPOINT } = process.env;

const MyForums = () => {

    const { currentUser } = useAuth();
    const history = useHistory()
    const [email, setEmail] = React.useState('');
    const [userID, setUserID] = React.useState('');
    const [forums, setForums] = useState([]);
    const [selectedForum, setSelectedForum] = React.useState(null);

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isArchiveDialogOpen, setIsArchiveDialogOpen] = React.useState(false);

    const [showEditAlertMessage, setShowEditAlertMessage] = React.useState(false);

    const [forumStatus, setForumStatus] = React.useState('');
    const [showSuccessfulArchiveMsg, setshowSuccessfulArchiveMsg] = React.useState(false);

    const [searchTerm, setSearchTerm] = React.useState("");
    const [refreshSearch, setRefreshSearch] = React.useState(1);
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

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

    const loadgetForumsByUserID = async () => {
        try {
            const res = await CallApigetForumsByUserID(userID, searchTerm);
            const parsed = JSON.parse(res.express);
            setForums(parsed);
            setForumStatus(parsed.status);
        } catch (error) {
            console.error(error);
        }
    }

    const CallApigetForumsByUserID = async (userID, searchTerm) => {

        const url = `${REACT_APP_API_ENDPOINT}/getForumsByUserID?userID=${userID}&searchTerm=${searchTerm}`;
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
        loadgetForumsByUserID();
    }, [userID, refreshSearch]);

    const callApiArchiveForum = async () => {
        const url = `${REACT_APP_API_ENDPOINT}/archiveForum`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: selectedForum.id
            })
        });

        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    async function handleArchiveForum() {
        callApiArchiveForum();
        setshowSuccessfulArchiveMsg(true);
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }

    const CallApiEditForum = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/editForum`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                forumTitle: forumTitle,
                forumDesc: forumDesc,
                forumTag: forumTag,
                forumID: selectedForum.id
            })
        });
        //console.log("forumID = " + selectedForum.id)
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    const [forumTitle, setForumTitle] = React.useState('');
    const [forumTitleError, setForumTitleError] = React.useState('');
    const [forumTitleErrorText, setForumTitleErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleForumTitle = (forum) => {
        setForumTitle(forum.target.value);
        setForumTitleError(false);
        setForumTitleErrorText('');
    }

    const [forumDesc, setForumDesc] = React.useState('');
    const [forumDescError, setForumDescError] = React.useState('');
    const [forumDescErrorText, setForumDescErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleForumDesc = (event) => {
        setForumDesc(event.target.value);
        setForumDescError(false);
        setForumDescErrorText('');
    }

    const handleEditForum = () => {
        if (forumTitle === '') {
            setForumTitleError(true);
            setForumTitleErrorText('Please enter your forum title.');
            return false;
        } else if (forumDesc === '') {
            setForumDescError(true);
            setForumDescErrorText('Please enter a conversation starter.');
            return false;
        } else {
            //console.log("about to call api edit forum");
            CallApiEditForum();
            setShowEditAlertMessage(true);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    }

    const handleOpenDialog = (event) => {
        setSelectedForum(event);
        setIsDialogOpen(true);

        // Update forum title
        setForumTitle(event.forumTitle);
        setForumTitleError(false);
        setForumTitleErrorText('');

        // Update forum desc
        setForumDesc(event.description);
        setForumDescError(false);
        setForumDescErrorText('');

        // Update tag
        setForumTag(event.forumTag);

    };

    const handleCloseDialog = () => {
        setSelectedForum(null);
        setIsDialogOpen(false);
    };

    const handleOpenArchivelDialog = (event) => {
        setSelectedForum(event);
        setIsArchiveDialogOpen(true);
    };

    const handleCloseArchiveDialog = () => {
        setSelectedForum(null);
        setIsArchiveDialogOpen(false);
    };

    const handleRefreshSearch = async () => {
        setSearchTerm("");
        setRefreshSearch(refreshSearch + 1);
    }

    // Filters
    const [forumTag, setForumTag] = React.useState('');
    const forumTagList = ["", "School", "Co-op", "Funny", "Debate", "Rant", "Interview", "Class Review", "Good News"];

    const handleForumTag = (event) => {
        setForumTag(event.target.value);
    }

    //for filtering
    const [forumFilterTag, setForumFilterTag] = React.useState("");
    const handleForumFilterTag = (event) => {
        setForumFilterTag(event.target.value);
    }

    const [status, setStatus] = React.useState('');
    const statusList = ["Active", "Archived"];

    const handleStatus = (event) => {
        setStatus(event.target.value);
    }

    const [selectedDates, setSelectedDates] = React.useState([]);

    const handleRefreshFilter = async () => {
        setForumFilterTag("");
        setStatus("");
        setSelectedDates([]);
    }

    return (
        <div id="body">

            <NavigationBar></NavigationBar>

            <Box sx={{ position: 'absolute', top: 115, left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Text
                    className="title"
                >
                    My Forums
                </Text>
            </Box>

            <Box sx={{ width: '30%', position: 'absolute', top: 185, left: '50%', transform: 'translateX(-50%)', marginBottom: '20px', zIndex: 1 }}>

                <Search
                    label="Search for forum titles or descriptions"
                    searchTerm={searchTerm}
                    onSetSearch={handleSearch}
                    fullWidth
                    onButtonClick={loadgetForumsByUserID}
                    onResetSearch={handleRefreshSearch}
                />
                <Text
                    className="header"
                >
                    Filters
                </Text>
                <DropdownFilter
                    placeholder="Select a Forum Tag"
                    value={forumFilterTag}
                    onChange={handleForumFilterTag}
                    lists={forumTagList}
                />
                <DropdownFilter
                    placeholder="Select a Status"
                    value={status}
                    onChange={handleStatus}
                    lists={statusList}
                />
                <DateFilter
                    placeholder="Select a Date Range"
                    selectedDates={selectedDates}
                    onDateChange={(selectedDates) => setSelectedDates(selectedDates)}
                />
                <ClearFilters
                    onClick={() => handleRefreshFilter()}
                />


            </Box>

            <Box sx={{ position: 'absolute', top: 550, left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
                {forums.map((forum) => {
                    if (forumFilterTag && forum.forumTag !== forumFilterTag) {
                        return null;
                    }
                    if (status && forum.status !== status) {
                        return null;
                    }
                    if (selectedDates.length !== 0) {
                        const startDate = new Date(selectedDates[0]);
                        const endDate = new Date(selectedDates[1]);
                        const convertDate = (new Date(forum.dateTime).getTime() - (5 * 60 * 60 * 1000));
                        const forumDate = new Date(convertDate);

                        startDate.setHours(0, 0, 0, 0);
                        endDate.setHours(0, 0, 0, 0);
                        forumDate.setHours(0, 0, 0, 0);

                        if (!(forumDate >= startDate && forumDate <= endDate) &&
                            !(forumDate === startDate && forumDate >= startDate) &&
                            !(forumDate === endDate && forumDate <= endDate)) {
                            return null;
                        }
                    }

                    return (
                        <Card style={{ width: '600px', marginBottom: '8px', padding: '16px' }} key={forum.id}>
                            <Link to={`/forum/${forum.id}`} target="_blank">
                                <Text className="headerBig to-text">
                                    {forum.forumTitle}
                                </Text>
                            </Link>
                            {forum.forumTag &&
                                <Badge
                                    className="body"
                                    backgroundColor="#023679"
                                    color="#FFFFFF"
                                    marginTop="4px"
                                    textAlign="center"
                                    width="120px"
                                >
                                    {forum.forumTag}
                                </Badge>
                            }

                            <Text
                                className="header to-text"
                                marginTop="8px"
                            >
                                Posted on: {new Date(new Date(forum.dateTime).getTime() - (5 * 60 * 60 * 1000)).toLocaleDateString()}
                            </Text>

                            <Text
                                className="header to-text"
                                marginTop="8px"
                            >
                                By: {forum.creatorName}
                            </Text>

                            <Text
                                className="header to-text"
                                marginTop="8px"
                            >
                                Status: {forum.status}
                            </Text>

                            <Text
                                className="header to-text"
                                marginTop="8px"
                            >
                                Description:
                            </Text>
                            <Text
                                className="body to-text"
                                marginTop="2px"
                            >
                                {forum.description}
                            </Text>
                            {forum.status === "Active" &&
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    marginTop="16px"
                                >

                                    <Button
                                        className="button"
                                        onClick={() => handleOpenArchivelDialog(forum)}
                                        marginRight="8px"
                                    >
                                        Archive Forum
                                    </Button>

                                    <Button
                                        className="button"
                                        onClick={() => handleOpenDialog(forum)}
                                    >
                                        Edit Forum
                                    </Button>
                                </Box>
                            }
                        </Card>
                    );
                })}
            </Box>

            {selectedForum && (
                <Box>
                    {/* Archive forum diaglog */}
                    <Modal isOpen={isArchiveDialogOpen} onClose={handleCloseArchiveDialog}>
                        <ModalOverlay />
                        <ModalContent
                            style={{ width: '400px', padding: '16px' }}
                        >
                            <ModalHeader
                                className="headerBig"
                                textAlign="center"
                            >
                                Confirm Archival
                            </ModalHeader>

                            <Text className="header to-text">
                                Are you sure you want to archive this forum? This action is irreversible.
                            </Text>

                            <Box
                                display="flex"
                                flexDirection="row"
                                marginTop="16px"
                            >
                                <Button
                                    className="button"
                                    onClick={handleCloseArchiveDialog}
                                    marginRight="8px"
                                >
                                    No
                                </Button>
                                <Button
                                    className="button"
                                    onClick={handleArchiveForum}
                                >
                                    Yes
                                </Button>
                            </Box>
                        </ModalContent>
                    </Modal>

                    {/* Edit forum dialog */}
                    <Modal isOpen={isDialogOpen} onClose={handleCloseDialog}>
                        <ModalOverlay />
                        <ModalContent
                            style={{ width: '400px', padding: '16px' }}
                        >
                            <Text align="center" className="form-header">Edit Forum</Text>
                            <FormControl>
                                <FormControl
                                    isRequired
                                    marginTop="16px"
                                    isInvalid={forumTitleError}
                                >
                                    <FormLabel className="form-label">Name</FormLabel>
                                    <Input
                                        placeholder='Forum name'
                                        className="form-input"
                                        value={forumTitle}
                                        onChange={handleForumTitle}
                                        inputProps={{ maxLength: 350 }}
                                    />
                                    <FormHelperText className="form-helper-text">Enter the name of your forum.</FormHelperText>
                                    <FormErrorMessage className="form-helper-text">{{ forumTitleErrorText }}</FormErrorMessage>
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
                                    onClick={(event) => handleEditForum(event)}
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
                        <AlertDescription>Forum successfully edited.</AlertDescription>
                    </Alert>
                )
            }
            {
                showSuccessfulArchiveMsg && (
                    <Alert
                        status="success"
                        sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                        <AlertIcon />
                        <AlertDescription>Forum successfully archived.</AlertDescription>
                    </Alert>
                )
            }
        </div>
    )
}

export default MyForums;