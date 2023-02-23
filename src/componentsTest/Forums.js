import React, { useRef, useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Box from "@material-ui/core/Box";

const { REACT_APP_API_ENDPOINT } = process.env;

const Forums = () => {

    
    const history = useHistory();
    const [email, setEmail] = React.useState('');
    const [userID, setUserID] = React.useState('');

    const [forums, setForums] = React.useState([]);

   

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


            <Box sx={{ position: 'absolute', top: 110, left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    component="div">
                    Forums
                </Typography>
            </Box>

    <Box sx={{ position: 'absolute', top: 150, left: '50%', transform: 'translateX(-50%)' }}>
        {forums.map((event) => (
            <Card style={{ width: '800px', marginBottom: '20px' }} key={event.id}>
                <CardContent>
                    <Link to={`/forum/${event.id}`} target="_blank">
                        <Typography variant="h5" component="div">
                            {event.forumTitle}<br />
                        </Typography>
                    </Link>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Posted on {new Date(new Date(event.dateTime).getTime() - (5 * 60 * 60 * 1000)).toLocaleDateString()}<br />
                        &nbsp; by {event.creatorName}<br />
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