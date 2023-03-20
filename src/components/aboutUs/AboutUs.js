import React, { useRef, useState, useEffect } from "react"
import { Form, Button, Card } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../contexts/AuthContext"
import Typography from "@material-ui/core/Typography";

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

            <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
                <Text noOfLines={1} align="center" fontSize='5xl'>We are HonkedIn.</Text>
                <Image
                    src={GOOSE_IMAGE}
                    align="center"
                    boxSize='200px' />
                <Text align="center" fontSize='2xl'>We aim to connect students and scholars in the University of Waterloo Region.</Text>

            </Box>


        </div>
    )
}

export default CreateResource;