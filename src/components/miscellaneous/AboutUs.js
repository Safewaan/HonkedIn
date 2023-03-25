import React from "react"
import { Card } from "react-bootstrap"

import {
    Box,
    Text,
    Image,
    Link
} from '@chakra-ui/react';

import { ExternalLinkIcon } from '@chakra-ui/icons'

import NavigationBar from '../common/NavigationBar';

import GOOSE_IMAGE from "../../images/Goose.png"

import "../../styles/form-style.css";


const AboutUs = () => {

    return (
        <div>
            <NavigationBar></NavigationBar>

            <Box sx={{ position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)' }}>
                <Card style={{ padding: '16px', textAlign: 'center' }}>

                    <Text className="title">We are HonkedIn.</Text>

                    <Image
                        src={GOOSE_IMAGE}
                        mx="auto"
                        boxSize="200px"
                        alt="Goose Image"
                    />

                    <Text className="header">Made by students, for students.</Text>

                    <Text className="header">We aim to connect like-minded scholars at University of Waterloo.</Text>

                    <Text className="header" marginTop="16px">Want to learn more about how HonkedIn was built?</Text>

                    <Link className="header" href='https://github.com/Safewaan/HonkedIn' isExternal align="center" target="_blank">
                        Find out more here!
                        <ExternalLinkIcon mx='4px' mt='-3px'/>
                    </Link>

                    <Text className="header" marginTop="16px">Want to see HonkedIn in action?</Text>

                    <Link className="header" href='https://youtu.be/01CqZoxI3ps' isExternal align="center" target="_blank">
                        Check this out!<ExternalLinkIcon mx='4px' mt='-3px'/>
                    </Link>
                </Card>
            </Box>
        </div>
    )
}

export default AboutUs;