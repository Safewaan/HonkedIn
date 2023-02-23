import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import NavigationBar from './NavigationBar';
import Box from "@material-ui/core/Box";

const { REACT_APP_API_ENDPOINT } = process.env;

const Forums = () => {

    const { currentUser } = useAuth();
    const history = useHistory();
    const [email, setEmail] = React.useState('');
    const [userID, setUserID] = React.useState('');

    const [forums, setForums] = React.useState([]);

    React.useEffect(() => {
        setEmail(currentUser.email);
        loaduserSearchByEmail(currentUser.email);
        //loadGetForums(); 
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

    useEffect(() => {
        loadGetForums();
    }, []);

    const loadGetForums = async () => {
        try {
            const res = await callApiGetForums();
            const parsed = JSON.parse(res.express);
            //console.log(parsed[0].forumTitle);
            setForums(parsed);
        } catch (error) {
            console.error(error);
        }
    }

    const callApiGetForums = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/getForums`;
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
        <div id="body">

            <NavigationBar></NavigationBar>

            <Box sx={{ position: 'absolute', top: 100, left: "35%" }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    component="div">
                    Forums
                </Typography>
            </Box>

            <Box sx={{ position: 'absolute', top: 150, left: "35%" }}>
            {forums.map((event) => (
                <Card style={{ width: '500px', marginBottom: '20px' }} key={event.id}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {event.forumTitle}<br />
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Posted on {new Date(event.dateTime).toLocaleDateString()} by {event.creatorName}<br />
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <br />{event.description}<br />
                        </Typography>
                    </CardContent>
                </Card>
            ))}
            </Box>
        </div>
    )
}

export default Forums; 