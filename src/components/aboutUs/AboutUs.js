import React, { useRef, useState, useEffect } from "react"
import { Form, Button, Card } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
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
    Image
} from '@chakra-ui/react';

import NavigationBar from '../common/NavigationBar';

import GOOSE_IMAGE from "../../images/Goose.png"

import "../../styles/form-style.css";

const { REACT_APP_API_ENDPOINT } = process.env;

const CreateResource = () => {

    return (
        <div>
            <NavigationBar></NavigationBar>

            <Card style={{ padding: '16px' }}>
                <Text noOfLines={1} align="center" fontSize='5xl'>We are HonkedIn.</Text>
                <Image
                    src={GOOSE_IMAGE}
                    mx="auto"
                    boxSize="200px"
                    alt="Goose Image"
                />
                <Text align="center" fontSize='2xl'>We aim to connect students and scholars in the University of Waterloo Region.</Text>
                <br></br>
                <Text align="center" fontSize='2xl'>Want to learn more about how HonkedIn was built?</Text>
                <Link href='https://github.com/Safewaan/HonkedIn' isExternal align="center" target="_blank">
                    Find out more here! <ExternalLinkIcon mx='2px' />
                </Link>

            </Card>


        </div>
    )
}

export default CreateResource;