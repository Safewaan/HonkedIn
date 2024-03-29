import React, { useRef, useState, useEffect } from "react"
// import { useAuth } from "../../contexts/AuthContext"
// import { Link, useHistory } from "react-router-dom"
import { Card } from 'react-bootstrap';

// import NavigationBar from '../common/NavigationBar';
// import DropdownFilter from "../common/filters/DropdownFilter";
// import ClearFilters from "../common/filters/ClearFilters";
// import DateFilter from "../common/filters/DateFilter";
// import Search from "../common/Search";

// import "react-datepicker/dist/react-datepicker.css";

import {
    Badge,
    Box,
    Text
} from '@chakra-ui/react';


const { REACT_APP_API_ENDPOINT } = process.env;

const Forums = ({ loadGetForums, forums }) => {

    // const { currentUser } = useAuth();
    // const history = useHistory();
    const [email, setEmail] = React.useState('');
    const [userID, setUserID] = React.useState('');

    // const [forums, setForums] = React.useState([]);

    const [searchTerm, setSearchTerm] = React.useState("");
    const [refreshSearch, setRefreshSearch] = React.useState(1);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

    React.useEffect(() => {
        // setEmail(currentUser.email);
        // loaduserSearchByEmail(currentUser.email);
        loadGetForums(searchTerm);
    }, []);

    // const loaduserSearchByEmail = (email) => {
    //     callApiGetuserSearchByEmail(email)
    //         .then(res => {
    //             var parsed = JSON.parse(res.express);
    //             //console.log(parsed[0].id);
    //             setUserID(parsed[0].id);
    //         });
    // }

    // const callApiGetuserSearchByEmail = async (email) => {
    //     const url = `${REACT_APP_API_ENDPOINT}/userSearchByEmail`;
    //     //console.log(url);

    //     const response = await fetch(url, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             email: email
    //         })
    //     });
    //     const body = await response.json();
    //     if (response.status !== 200) throw Error(body.message);
    //     return body;
    // }

    React.useEffect(() => {
        loadGetForums(searchTerm);
    }, [refreshSearch]);

    // const loadGetForums = async () => {
    //     try {
    //         const res = await callApiGetForums(searchTerm);
    //         const parsed = JSON.parse(res.express);
    //         setForums(parsed);

    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // const callApiGetForums = async (searchTerm) => {

    //     const url = `${REACT_APP_API_ENDPOINT}/getForums?searchTerm=${searchTerm}`;
    //     console.log(url);

    //     const response = await fetch(url, {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //         }
    //     });
    //     console.log("the searchTerm is " + searchTerm)
    //     const body = await response.json();
    //     if (response.status !== 200) throw Error(body.message);
    //     return body;
    // }

    // Filters
    const [forumTag, setForumTag] = React.useState('');
    const forumTagList = ["School", "Co-op", "Funny", "Debate", "Rant", "Interview", "Class Review", "Good News"];

    const handleForumTag = (event) => {
        setForumTag(event.target.value);
    }

    const [status, setStatus] = React.useState('');
    const statusList = ["Active", "Archived"];

    const handleStatus = (event) => {
        setStatus(event.target.value);
    }

    const [selectedDates, setSelectedDates] = React.useState([]);

    const handleRefreshFilter = async () => {
        setForumTag("");
        setStatus("");
        setSelectedDates([]);
    }
    const handleRefreshSearch = async () => {
        setSearchTerm("");
        setRefreshSearch(refreshSearch + 1);
    }

    return (
        <div id="body">

            {/* <NavigationBar></NavigationBar> */}

            <Box sx={{ position: 'absolute', top: 115, left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Text
                    className="title"
                >
                    Forums
                </Text>
            </Box>

            <Box sx={{ width: '30%', position: 'absolute', top: 185, left: '50%', transform: 'translateX(-50%)', marginBottom: '20px', zIndex: 1 }}>
                {/* <Search
                    label="Search for forum titles, descriptions, or creators"
                    searchTerm={searchTerm}
                    onSetSearch={handleSearch}
                    fullWidth
                    onButtonClick={loadGetForums}
                    onResetSearch={handleRefreshSearch}
                />
                <Text
                    className="header"
                >
                    Filters
                </Text>
                <DropdownFilter
                    placeholder="Select a Forum Tag"
                    value={forumTag}
                    onChange={handleForumTag}
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
                /> */}

            </Box>

            <Box sx={{ position: 'absolute', top: 550, left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
                {forums.map((forum) => {
                    if (forumTag && forum.forumTag !== forumTag) {
                        return null;
                    }
                    if (status && forum.status !== status) {
                        return null;
                    }
                    if (selectedDates.length !== 0) {
                        const startDate = new Date(selectedDates[0]);
                        const endDate = new Date(selectedDates[1]);
                        const convertDate = (new Date(forum.dateTime).getTime() - (4 * 60 * 60 * 1000));
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
                            {/* <Link to={`/forum/${forum.id}`} target="_blank"> */}
                                <Text className="headerBig to-text">
                                    {forum.forumTitle}
                                </Text>
                            {/* </Link> */}
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
                                Posted on: {new Date(new Date(forum.dateTime).getTime() - (4 * 60 * 60 * 1000)).toLocaleDateString()}
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
                        </Card>
                    );
                })}
            </Box>
        </div>
    )
}


export default Forums; 