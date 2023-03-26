import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import DatePicker from "react-datepicker";
import { Card } from 'react-bootstrap';

import Search from '../common/Search';
import DropdownFilter from "../common/filters/DropdownFilter";
import ClearFilters from "../common/filters/ClearFilters";
import NumberFilter from "../common/filters/NumberFilter";
import DateFilter from "../common/filters/DateFilter";

import { SingleDatepicker } from "chakra-dayzed-datepicker";

import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
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
    Text
} from '@chakra-ui/react'

import NavigationBar from '../common/NavigationBar';

const { REACT_APP_API_ENDPOINT } = process.env;

const MyEvents = () => {

    const { currentUser } = useAuth();
    const history = useHistory()

    const [searchTerm, setSearchTerm] = React.useState("");
    const [refreshSearch, setRefreshSearch] = React.useState(1);
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

    const [selectedEvent, setSelectedEvent] = React.useState(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false);
    const [isParticipantsListOpen, setIsParticipantsListOpen] = React.useState(false);
    const [showCancelAlertMessage, setShowCancelAlertMessage] = React.useState(false);
    const [showEditAlertMessage, setShowEditAlertMessage] = React.useState(false);

    const [email, setEmail] = React.useState('');
    const [userID, setUserID] = React.useState('');

    const [events, setEvents] = useState([]);

    const [eventName, setEventName] = React.useState('');
    const [eventNameError, setEventNameError] = React.useState('');
    const [eventNameErrorText, setEventNameErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleEventName = (event) => {
        setEventName(event.target.value);
        setEventNameError(false);
        setEventNameErrorText('');
    }

    const [eventDesc, setEventDesc] = React.useState('');
    const [eventDescError, setEventDescError] = React.useState('');
    const [eventDescErrorText, setEventDescErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleEventDesc = (event) => {
        setEventDesc(event.target.value);
        setEventDescError(false);
        setEventDescErrorText('');
    }

    const [eventLocation, setEventLocation] = React.useState('');
    const [eventLocationError, setEventLocationError] = React.useState('');
    const [eventLocationErrorText, setEventLocationErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleEventLocation = (event) => {
        setEventLocation(event.target.value);
        setEventLocationError(false);
        setEventLocationErrorText('');
    }

    const [eventCurrentParticipants, setEventCurrentParticipants] = React.useState('');
    const [eventCurrentParticipantsError, setEventCurrentParticipantsError] = React.useState(false);

    const [eventParticipants, setEventParticipants] = React.useState('');
    const [eventParticipantsError, setEventParticipantsError] = React.useState('');
    const [eventParticipantsErrorText, setEventParticipantsErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleEventParticipants = (valueString, valueAsNumber) => {
        // If the input is number, update the react state
        if (!isNaN(valueAsNumber)) {
            setEventParticipants(valueAsNumber);
            setEventParticipantsError(false);
            setEventParticipantsErrorText('');
        }
        // Catch where first number can't be deleted, reset the state
        else {
            setEventParticipants('');
            setEventParticipantsError('');
            setEventParticipantsErrorText('');
        }
    }

    const [eventDateOG, setEventDateOG] = React.useState(new Date());

    const handleOpenDialog = (event) => {
        setSelectedEvent(event);
        setIsDialogOpen(true);

        // Update event name
        setEventName(event.name);
        setEventNameError(false);
        setEventNameErrorText('');

        // Update event desc
        setEventDesc(event.description);
        setEventDescError(false);
        setEventDescErrorText('');

        // Update event location
        setEventLocation(event.location);
        setEventLocationError(false);
        setEventLocationErrorText('');

        // Update event current participants
        setEventCurrentParticipants(event.participants);

        // Update event participants
        setEventParticipants(parseInt(event.totalParticipants));
        setEventParticipantsError(false);
        setEventParticipantsErrorText('');

        // Update event date
        setEventDateOG(new Date(event.date));
    };

    const handleCloseDialog = () => {
        setSelectedEvent(null);
        setIsDialogOpen(false);
    };

    const handleOpenCancelDialog = (event) => {
        setSelectedEvent(event);
        setIsCancelDialogOpen(true);
    };

    const handleCloseCancelDialog = () => {
        setSelectedEvent(null);
        setIsCancelDialogOpen(false);
    };

    const [selectedEventParticipants, setSelectedEventParticipants] = React.useState([]);
    //const [currentEventID, setCurrentEventID] = React.useState(''); 
    var currentEventID = '';

    const handleOpenParticipantsDialog = (event) => {
        setSelectedEvent(event);
        //setCurrentEventID(event.id); 
        currentEventID = event.id;
        setIsParticipantsListOpen(true);
        handleGetParticipants();
        //old code if want to switch to one api call that pulls the list of all participants
        //setSelectedEventParticipants(participantsList.filter(x => x.id === event.id));
    };

    const handleCloseParticipantsDialog = () => {
        setSelectedEvent(null);
        setIsParticipantsListOpen(false);
        //resets the array so in the split second the api call is rendering the new list, the list appears empty
        //and doesn't show the list of the previous list
        setSelectedEventParticipants([]);
    };

    React.useEffect(() => {
        setEmail(currentUser.email);
        loaduserSearchByEmail(currentUser.email);
        loadGetEventsByUser(userID, searchTerm);
    }, []);



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
            });
    }

    const loadGetEventsByUser = async () => {
        try {
            const res = await CallApiGetEventsByUser(userID, searchTerm);
            const parsed = JSON.parse(res.express);
            setEvents(parsed);
        } catch (error) {
            console.error(error);
        }
    }

    const CallApiGetEventsByUser = async (userID, searchTerm) => {

        const url = `${REACT_APP_API_ENDPOINT}/getEventsByUser?userID=${userID}&searchTerm=${searchTerm}`;
        console.log(url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const body = await response.json();
        console.log(body);
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    const CallApiCancelEvents = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/cancelEvent`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                eventID: selectedEvent.id
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    const handleCancelEvent = () => {
        CallApiCancelEvents();
        setShowCancelAlertMessage(true);
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    };

    const CallApiEditEvent = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/editEvent`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                eventName: eventName,
                eventDesc: eventDesc,
                eventLocation: eventLocation,
                eventDate: new Date(eventDateOG).toISOString().slice(0, 19).replace('T', ' '),
                eventParticipants: eventParticipants,
                eventID: selectedEvent.id
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    const handleEditEvent = () => {
        if (eventName === '') {
            setEventNameError(true);
            setEventNameErrorText('Please enter your event name.');
            return false;
        } else if (eventDesc === '') {
            setEventDescError(true);
            setEventDescErrorText('Please enter a description of your event.');
            return false;
        } else if (eventLocation === '') {
            setEventLocationError(true);
            setEventLocationErrorText('Please enter the location of your event.');
            return false;
        } else if (eventParticipants === '') {
            setEventParticipantsError(true);
            setEventParticipantsErrorText('Please enter a valid number of maximum participants.');
            return false;
        } else if (eventParticipants < eventCurrentParticipants) {
            setEventCurrentParticipantsError(true);
            setTimeout(() => {
                setEventCurrentParticipantsError(false);
            }, 10000);
        } else {
            CallApiEditEvent();
            setEventCurrentParticipantsError(false);
            setShowEditAlertMessage(true);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    }

    const handleGetParticipants = () => {
        CallApiGetParticipants()
            .then(res => {
                var parsed = JSON.parse(res.express);
                setSelectedEventParticipants(parsed);
            });
    };

    const CallApiGetParticipants = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/getParticipants`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                eventID: currentEventID
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    React.useEffect(() => {
        loadGetEventsByUser(userID, searchTerm);
        //console.log("userId is: " + userID + "and" )
    }, [userID, refreshSearch]);

    const handleRefreshSearch = async () => {
        setSearchTerm("");
        setRefreshSearch(refreshSearch + 1);
    }

    // Filters
    const [status, setStatus] = React.useState('Active');
    const statusList = ["Active", "Cancelled"];

    const handleStatus = (event) => {
        setStatus(event.target.value);
    }
    const [filterParticipants, setFilterParticipants] = React.useState("");

    const handleFilterParticipants = (value) => {
        setFilterParticipants(value);
    }

    const [selectedDates, setSelectedDates] = React.useState([]);

    const handleRefreshFilter = async () => {
        setStatus("");
        setFilterParticipants("");
        setSelectedDates([]);
    }

    const dateToday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

    return (
        <div id="body">

            <NavigationBar></NavigationBar>

            <Box sx={{ position: 'absolute', top: 115, left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Text
                    className="title"
                >
                    My Events
                </Text>
            </Box>

            <Box sx={{ width: '600px', position: 'absolute', top: 150, left: '50%', transform: 'translateX(-50%)', marginBottom: '20px', zIndex: 1 }}>
                <Search
                    label="Search for event names or descriptions"
                    searchTerm={searchTerm}
                    onSetSearch={handleSearch}
                    fullWidth
                    onButtonClick={loadGetEventsByUser}
                    onResetSearch={handleRefreshSearch}
                />
                <Text
                    className="header"
                >
                    Filters
                </Text>
                <DropdownFilter
                    placeholder="Select a Status"
                    value={status}
                    onChange={handleStatus}
                    lists={statusList}
                />
                <NumberFilter
                    placeholder="Select the Maximum Number of Participants"
                    value={filterParticipants}
                    onChange={handleFilterParticipants}
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

            <Box sx={{ position: 'absolute', top: 525, left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
                {events.map((event) => {
                    if (status && event.status !== status) {
                        return null;
                    }
                    if (parseInt(filterParticipants) && (parseInt(event.totalParticipants) >= parseInt(filterParticipants) && parseInt(event.totalParticipants) !== parseInt(filterParticipants))) {
                        return null;
                    }
                    if (selectedDates.length !== 0) {
                        const startDate = new Date(selectedDates[0]);
                        const endDate = new Date(selectedDates[1]);
                        const convertDate = (new Date(event.date).getTime() - (5 * 60 * 60 * 1000));
                        const eventDate = new Date(convertDate);

                        startDate.setHours(0, 0, 0, 0);
                        endDate.setHours(0, 0, 0, 0);
                        eventDate.setHours(0, 0, 0, 0);

                        if (!(eventDate >= startDate && eventDate <= endDate) &&
                            !(eventDate === startDate && eventDate >= startDate) &&
                            !(eventDate === endDate && eventDate <= endDate)) {
                            return null;
                        }
                    }
                    return (
                        <Card style={{ width: '400px', marginBottom: '8px', padding: '16px' }} key={event.id}>
                            <Text className="header to-text">
                                {event.name}
                            </Text>

                            <Text className="body to-text" marginTop="8px">
                                Date: {new Date(new Date(event.date).getTime() - (5 * 60 * 60 * 1000)).toLocaleString()}
                            </Text>

                            <Text className="body to-text" marginTop="8px">
                                Participants: {event.participants} / {event.totalParticipants}
                            </Text>

                            <Text className="body to-text" marginTop="8px">
                                Status: {event.status}
                            </Text>

                            <Button
                                onClick={() => handleOpenParticipantsDialog(event)}
                                className="button"
                                marginTop="8px"
                            >
                                See Participants
                            </Button>

                            {event.status === "Active" &&
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    marginTop="8px"
                                >
                                    <Button
                                        onClick={() => handleOpenCancelDialog(event)}
                                        className="button"
                                        marginRight="8px"
                                    >
                                        Cancel Event
                                    </Button>

                                    <Button
                                        onClick={() => handleOpenDialog(event)}
                                        className="button"
                                    >
                                        Edit Event
                                    </Button>
                                </Box>}
                        </Card>
                    );
                })}
            </Box>

            {selectedEvent && (
                <Box>
                    {/* Cancel event diaglog */}
                    <Modal isOpen={isCancelDialogOpen} onClose={handleCloseCancelDialog}>
                        <ModalOverlay />
                        <ModalContent
                            style={{ width: '400px', padding: '16px' }}
                        >
                            <ModalHeader
                                className="bigHeader"
                                textAlign="center"
                            >
                                Confirm Cancellation
                            </ModalHeader>

                            <Text className="header to-text">
                                Are you sure you want to cancel this event? This action is irreversible.
                            </Text>

                            <Box
                                display="flex"
                                flexDirection="row"
                                marginTop="8px"
                            >
                                <Button
                                    className="button"
                                    onClick={handleCloseCancelDialog}
                                    marginRight="8px"
                                >
                                    No
                                </Button>
                                <Button
                                    className="button"
                                    onClick={handleCancelEvent}
                                >
                                    Yes
                                </Button>
                            </Box>
                        </ModalContent>
                    </Modal>

                    {/* Edit event dialog */}
                    <Modal isOpen={isDialogOpen} onClose={handleCloseDialog}>
                        <ModalOverlay />
                        <ModalContent
                            style={{ width: '400px', padding: '16px' }}
                        >
                            <Text align="center" className="form-header">Edit Event</Text>
                            <FormControl>
                                <FormControl
                                    isRequired
                                    marginTop="16px"
                                    isInvalid={eventNameError}
                                >
                                    <FormLabel className="form-label">Name</FormLabel>
                                    <Input
                                        placeholder='Event name'
                                        className="form-input"
                                        value={eventName}
                                        onChange={handleEventName}
                                        inputProps={{ maxLength: 200 }}
                                    />
                                    <FormHelperText className="form-helper-text">Enter the name of your event.</FormHelperText>
                                    <FormErrorMessage className="form-helper-text">{eventNameErrorText}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    isRequired
                                    marginTop="16px"
                                    isInvalid={eventDescError}>
                                    <FormLabel className="form-label">Description</FormLabel>
                                    <Input
                                        placeholder='Event description'
                                        className="form-input"
                                        value={eventDesc}
                                        onChange={handleEventDesc}
                                        inputProps={{ maxLength: 350 }}
                                    />
                                    <FormHelperText className="form-helper-text">Enter a description of your event.</FormHelperText>
                                    <FormErrorMessage className="form-helper-text">{eventDescErrorText}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    isRequired
                                    marginTop="16px"
                                    isInvalid={eventLocationError}>
                                    <FormLabel className="form-label">Location</FormLabel>
                                    <Input
                                        placeholder='Event location'
                                        className="form-input"
                                        value={eventLocation}
                                        onChange={handleEventLocation}
                                        inputProps={{ maxLength: 350 }}
                                    />
                                    <FormHelperText className="form-helper-text">Enter the location of your event.</FormHelperText>
                                    <FormErrorMessage className="form-helper-text">{eventLocationErrorText}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    isRequired
                                    marginTop="16px"
                                    isInvalid={eventParticipantsError}>
                                    <FormLabel className="form-label">Maximum Participants</FormLabel>
                                    <NumberInput
                                        max={1000}
                                        min={1}
                                        className="form-input"
                                        value={eventParticipants}
                                        onChange={handleEventParticipants}
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                    <FormHelperText className="form-helper-text">Enter the number of maximum participants of your event.</FormHelperText>
                                    <FormErrorMessage className="form-helper-text">{eventParticipantsErrorText}</FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    isRequired
                                    marginTop="16px"
                                >
                                    <FormLabel className="form-label">Date</FormLabel>
                                    <SingleDatepicker
                                        name="date-input"
                                        date={eventDateOG}
                                        minDate={dateToday}
                                        onDateChange={(eventDateOG) => setEventDateOG(eventDateOG)}
                                        propsConfigs={{
                                            dayOfMonthBtnProps: {
                                                defaultBtnProps: {
                                                    _hover: {
                                                        background: '#164684',
                                                        color: '#F0F6FF',
                                                    },
                                                    _active: {
                                                        background: '#214E89',
                                                    }
                                                },
                                                selectedBtnProps: {
                                                    background: '#023679',
                                                    color: '#F0F6FF',
                                                    _hover: {
                                                        background: '#164684',
                                                        color: '#F0F6FF',
                                                    },
                                                    _active: {
                                                        background: '#214E89',
                                                    }
                                                },
                                                todayBtnProps: {
                                                    borderColor: "#023679"
                                                },
                                            }
                                        }}
                                    />
                                    <FormHelperText className="form-helper-text">
                                        Enter the date of your event.
                                    </FormHelperText>
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
                                    onClick={(event) => handleEditEvent(event)}
                                >
                                    Edit
                                </Button>
                            </Box>
                        </ModalContent>
                    </Modal>

                    {/* See participants diaglog */}
                    <Modal isOpen={isParticipantsListOpen} onClose={handleCloseParticipantsDialog}>
                        <ModalOverlay />
                        <ModalContent
                            style={{ width: '400px', padding: '16px' }}
                        >
                            <ModalHeader
                                className="bigHeader"
                                textAlign="center"
                            >
                                Participants
                            </ModalHeader>

                            {selectedEventParticipants.map((event) => (
                                <Text className="header">
                                    {event.participantName}
                                </Text>
                            ))}

                            <Box
                                display="flex"
                                flexDirection="row"
                                marginTop="16px"
                            >
                                <Button
                                    className="button"
                                    onClick={handleCloseParticipantsDialog}
                                >
                                    Close
                                </Button>
                            </Box>
                        </ModalContent>
                    </Modal>
                </Box>
            )
            }

            {
                showCancelAlertMessage && (
                    <Alert
                        status="success"
                        sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                        <AlertIcon />
                        <AlertDescription>Event successfully cancelled.</AlertDescription>
                    </Alert>
                )
            }

            {
                showEditAlertMessage && (
                    <Alert
                        status="success"
                        sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                        <AlertIcon />
                        <AlertDescription>Event successfully editted.</AlertDescription>
                    </Alert>
                )
            }

            {
                eventCurrentParticipantsError && (
                    <Alert
                        status="error"
                        sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                        <AlertIcon />
                        <AlertDescription>You cannot set the maximum number of participants lower than your
                            current number of participants. This event currently has {eventCurrentParticipants}
                            &nbsp;participants.</AlertDescription>
                    </Alert>
                )
            }
        </div >
    )
}

export default MyEvents;