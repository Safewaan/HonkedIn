import React, { useRef, useState, useEffect } from "react"
import { Form, Button, Card } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../contexts/AuthContext"
import Typography from "@material-ui/core/Typography";
import { ExternalLinkIcon } from '@chakra-ui/icons'

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
    Text,
    Image,
    Link
} from '@chakra-ui/react';

import NavigationBar from '../common/NavigationBar';

import GOOSE_IMAGE from "../../images/Goose.png"

import "../../styles/form-style.css";

const { REACT_APP_API_ENDPOINT } = process.env;

const CreateResource = () => {

    return (
        <div>
            <NavigationBar></NavigationBar>

            <Box sx={{ position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)' }}>
                <Card style={{ padding: '16px' }}>
                    <Text noOfLines={1} align="center" fontSize='4xl'>We are HonkedIn.</Text>
                    <Image
                        src={GOOSE_IMAGE}
                        mx="auto"
                        boxSize="200px"
                        alt="Goose Image"
                    />
                    <Text align="center" fontSize='4xl' as='i'>Made by students, for students.</Text>
                    <Text align="center" fontSize='2xl'>We aim to connect like-minded scholars at University of Waterloo.</Text>
                </Card>
                <br></br>
                <Card style={{ padding: '16px' }}>
                    <Text align="center" fontSize='2xl'>Want to learn more about how HonkedIn was built?</Text>
                    <Link href='https://github.com/Safewaan/HonkedIn' isExternal align="center" target="_blank">
                        Find out more here!<ExternalLinkIcon mx='2px' />
                    </Link>
                    <br></br>
                    <Text align="center" fontSize='2xl'>Want to see HonkedIn in action?</Text>
                    <Link href='https://youtu.be/01CqZoxI3ps' isExternal align="center" target="_blank">
                        Check this out!<ExternalLinkIcon mx='2px' />
                    </Link>
                </Card>
            </Box>

        </div>
    )
}

export default CreateResource;