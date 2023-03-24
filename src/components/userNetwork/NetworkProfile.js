import React, { useState, useEffect } from "react"
import { Card } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { useParams } from 'react-router-dom';

import {
    Avatar,
    Badge,
    Box,
    Center,
    Heading,
    Text,
} from "@chakra-ui/react";

import NavigationBar from '../common/NavigationBar';

// Server URL
const { REACT_APP_API_ENDPOINT } = process.env;

const NetworkProfile = () => {

    //const { currentUser } = useAuth()
    //leaving this one for now, if have time at end, want to implement
    //logic to redirect to own editable profile page 
    //const [email, setEmail] = React.useState('');
    const { selectedUserID } = useParams();
    const [openDialog, setOpenDialog] = React.useState(false);

    useEffect(() => {
        //setEmail(currentUser.email);
        //console.log('selected user id is: ' + selectedUserID);
        handleAPIUserProfile(selectedUserID);
    }, []);

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
                </Card>
            </Box>
        </>
    );
}

export default NetworkProfile; 