import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import NavigationBar from '../common/NavigationBar';
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

            <Box sx={{ position: 'absolute', top: 145, left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    component="div">
                    Forums
                </Typography>
            </Box>

    <Box sx={{ position: 'absolute', top: 180, left: '50%', transform: 'translateX(-50%)' }}>
        {forums.map((forum) => (
            <Card style={{ width: '800px', marginBottom: '20px' }} key={forum.id}>
                <CardContent>
                    <Link to={`/forum/${forum.id}`} target="_blank">
                        <Typography variant="h5" component="div">
                            {forum.forumTitle}<br />
                        </Typography>
                    </Link>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Posted on {new Date(new Date(forum.dateTime).getTime() - (5 * 60 * 60 * 1000)).toLocaleDateString()}<br />
                        by {forum.creatorName}<br />
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: 1.5 }} color="text.secondary">
                                Status: {forum.status}<br />
                            </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        <br />{forum.description}<br />
                    </Typography>
                </CardContent>
            </Card>
        ))}
        </Box>
    </div>
    )
}


export default Forums; 