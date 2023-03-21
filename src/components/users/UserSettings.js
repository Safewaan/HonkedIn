import React, { useRef, useState } from "react"
import { Card } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import NavigationBar from '../common/NavigationBar';

import {
    Button,
    Text
} from "@chakra-ui/react";

import {
    UPDATE_CREDENTIALS_PAGE,
    UPDATE_STATUS_PAGE
} from "../constants/Routes";

import "../../styles/style.css"

export default function UpdateCredentials() {
    const history = useHistory();

    async function redirectUpdateCredentials() {
        history.push(UPDATE_CREDENTIALS_PAGE);
    }

    async function redirectUpdateStatus() {
        history.push(UPDATE_STATUS_PAGE);
    }

    return (
        <>
            <NavigationBar></NavigationBar>
            <Card>
                <Card.Body>
                    <Text className="header">User Settings</Text>
                    <Button
                        onClick={redirectUpdateCredentials}
                        className="button"
                        type="submit"
                        marginTop="16px"
                    >
                        Update Credentials
                    </Button>

                    <Button
                        onClick={redirectUpdateStatus}
                        className="button"
                        type="submit"
                        marginTop="8px"
                    >
                        Update Account Status
                    </Button>
                </Card.Body>
            </Card>
        </>
    )
}
