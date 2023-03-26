import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { Card } from 'react-bootstrap';

import NavigationBar from '../common/NavigationBar';
import DropdownFilter from "../common/filters/DropdownFilter";
import ClearFilters from "../common/filters/ClearFilters";
import DateFilter from "../common/filters/DateFilter";
import Search from '../common/Search';

import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Badge,
    Box,
    Button,
    FormHelperText,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Text
} from '@chakra-ui/react';

const { REACT_APP_API_ENDPOINT } = process.env;

const Resources = () => {

    const { currentUser } = useAuth();
    const history = useHistory();
    const [email, setEmail] = React.useState('');
    const [userID, setUserID] = React.useState('');

    const [searchTerm, setSearchTerm] = React.useState("");
    const [refreshSearch, setRefreshSearch] = React.useState(1);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

    const [resources, setResources] = React.useState([]);

    // Filters
    const [mediaTag, setMediaTag] = React.useState('');
    const mediaTagList = ["Interview Tips", "Youtube", "Stack Overflow", "School", "Personal Website", "Spreadsheet"];

    const handleMediaTag = (event) => {
        setMediaTag(event.target.value);
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
        //console.log(url);

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
        loadGetResources(searchTerm);
    }, [refreshSearch]);

    const loadGetResources = async () => {
        try {
            const res = await callApiGetResources(searchTerm);
            const parsed = JSON.parse(res.express);
            setResources(parsed);

        } catch (error) {
            console.error(error);
        }
    }

    const callApiGetResources = async (searchTerm) => {

        const url = `${REACT_APP_API_ENDPOINT}/getResources?searchTerm=${searchTerm}`;
        console.log(url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        console.log("the searchTerm is " + searchTerm)
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    const [selectedDates, setSelectedDates] = React.useState([]);

    const handleRefreshFilter = async () => {
        setMediaTag("");
        setSelectedDates([]);
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
                    Resources
                </Text>
            </Box>

            <Box sx={{ width: '30%', position: 'absolute', top: 185, left: '50%', transform: 'translateX(-50%)', marginBottom: '20px', zIndex: 1 }}>
                <Search
                    label="Search for resource names or creators"
                    searchTerm={searchTerm}
                    onSetSearch={handleSearch}
                    fullWidth
                    onButtonClick={loadGetResources}
                    onResetSearch={handleRefreshSearch}
                />
                <Text
                    className="header"
                >
                    Filters
                </Text>
                <DropdownFilter
                    placeholder="Select a Media Type Tag"
                    value={mediaTag}
                    onChange={handleMediaTag}
                    lists={mediaTagList}
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


            <Box sx={{ position: 'absolute', top: 465, left: '50%', transform: 'translateX(-50%)' }}>
                {resources.map((resources) => {
                    if (mediaTag && resources.mediaTag !== mediaTag) {
                        return null;
                    }
                    
                    if (selectedDates.length !== 0) {
                        const startDate = new Date(selectedDates[0]);
                        const endDate = new Date(selectedDates[1]);
                        const convertDate = (new Date(resources.dateTime).getTime() - (5 * 60 * 60 * 1000));
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
                        <Card style={{ width: '600px', marginBottom: '8px', padding: '16px' }}>
                            <Text className="headerBig to-text">
                                {resources.resourcesTitle}
                            </Text>

                            {resources.mediaTag &&
                                <Badge
                                    className="body"
                                    backgroundColor="#023679"
                                    color="#FFFFFF"
                                    marginTop="4px"
                                    textAlign="center"
                                    width="140px"
                                >
                                    {resources.mediaTag}
                                </Badge>
                            }

                            <Text
                                className="header to-text"
                                marginTop="8px"
                            >
                                Posted on: {new Date(new Date(resources.dateTime).getTime() - (4 * 60 * 60 * 1000)).toLocaleDateString()}
                            </Text>

                            <Text
                                className="header to-text"
                                marginTop="8px"
                            >
                                By: {resources.creatorName}
                            </Text>

                            <Text
                                className="header to-text"
                                marginTop="8px"
                            >
                                Link to Resource:
                            </Text>
                            <a href={`${resources.resourcesLink}`} target="_blank">
                                <Text
                                    className="body to-text"
                                    marginTop="2px"
                                >
                                    {resources.resourcesLink}
                                </Text>
                            </a>
                        </Card>
                    );
                })}
            </Box>
        </div>
    )
}

export default Resources; 