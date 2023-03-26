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

const MyComments = () => {

    const { currentUser } = useAuth();
    const history = useHistory();
    const [email, setEmail] = React.useState('');
    const [userID, setUserID] = React.useState('');

    const [myComments, setMyComments] = React.useState([]);

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
        loadGetCommentsByUserID();
    }, [userID]);

    const loadGetCommentsByUserID = async () => {
        try {
            const res = await CallApiGetCommentsByUserID(userID);
            const parsed = res.express;
            setMyComments(parsed);
        } catch (error) {
            console.error(error);
        }
    }

    const CallApiGetCommentsByUserID = async (userID) => {

        const url = `${REACT_APP_API_ENDPOINT}/getForumCommentsByUserID?userID=${userID}`;
        console.log(url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            /*body: JSON.stringify({
                userID: userID
            })*/
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    return (
        <div id="body">

            <NavigationBar></NavigationBar>

            <Box sx={{ position: 'absolute', top: 110, left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    component="div">
                    My Comments
                </Typography>
            </Box>

    <Box sx={{ position: 'absolute', top: 150, left: '50%', transform: 'translateX(-50%)' }}>
        {myComments.map((comment) => (
            <Card style={{ width: '800px', marginBottom: '20px' }} key={comment.id}>
                <CardContent>
                    <Link to={`/forum/${comment.forumID}`} target="_blank">
                        <Typography variant="h5" component="div">
                            {comment.forumTitle}<br />
                        </Typography>
                    </Link>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Commented on {new Date(new Date(comment.commentDateTime).getTime() - (5 * 60 * 60 * 1000)).toLocaleString()}<br />
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        <br />{comment.comment}<br />
                    </Typography>
                </CardContent>
            </Card>
        ))}
        </Box>
    </div>
    )
}

export default MyComments; 