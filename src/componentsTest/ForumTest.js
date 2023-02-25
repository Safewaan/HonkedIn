import React, { useRef, useState, useEffect } from "react"
//import { useAuth } from "../contexts/AuthContext"
//import { Link, useHistory } from "react-router-dom"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Box from "@material-ui/core/Box";
import { useParams } from 'react-router-dom';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

const { REACT_APP_API_ENDPOINT } = process.env;

const Forum = ({ loadGetForumCommentsByForumID, comments }) => {

    //const { currentUser } = useAuth();
    //const history = useHistory();
    const [email, setEmail] = React.useState('');
    // const [userID, setUserID] = React.useState('');
    const { forumID } = 1;

    const [forums, setForums] = React.useState([]);

    // Comment states
    //const [comments, setComments] = React.useState([]);

    const [newComment, setNewComment] = React.useState("");
    const handleNewComment = (event) => {
        setNewComment(event.target.value);
    }

    React.useEffect(() => {
        //setEmail(currentUser.email);
        //loaduserSearchByEmail(currentUser.email);
        //loadGetForums(); 
    }, []);

    /* const loaduserSearchByEmail = (email) => {
         callApiGetuserSearchByEmail(email)
             .then(res => {
                 var parsed = JSON.parse(res.express);
                 //console.log(parsed[0].id);
                // setUserID(parsed[0].id);
             });
     }
     */

    /* const callApiGetuserSearchByEmail = async (email) => {
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
     */

    /*useEffect(() => {
        handleApiGetSelectedForum();
        handleApiLoadComments();
    }, []);
    */

    useEffect(() => {
        loadGetForumCommentsByForumID();
    }, [loadGetForumCommentsByForumID]);

    //API - Display the retrieved forum 
    const handleApiGetSelectedForum = async () => {
        try {
            const res = await callApiGetSelectedForum();
            const parsed = JSON.parse(res.express);
            setForums(parsed);

        } catch (error) {
            // console.error(error);
        }
    }

    const callApiGetSelectedForum = async () => {
        const url = `${REACT_APP_API_ENDPOINT}/getForumsByForumID`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                forumID: forumID
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }


    //API - Insert new comments 
    const handleApiAddComment = () => {
        callApiAddComment()
            .then(res => {
                console.log("callApiAddSubmission returned: ", res)
            })
    }


    const callApiAddComment = async () => {
        const url = `${REACT_APP_API_ENDPOINT}/createForumComment`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                forumID: forumID,
                //userID: userID,
                newComment: newComment
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    //API - Load comments for the forum
    const handleApiLoadComments = async () => {
        try {
            const res = await callApiLoadComments();
            const parsed = JSON.parse(JSON.stringify(res.express));
            //setComments(parsed);


        } catch (error) {
            //console.error(error);
        }
    }

    const callApiLoadComments = async () => {
        const url = `${REACT_APP_API_ENDPOINT}/getForumCommentsByForumID`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                forumID: forumID
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    //API - Delete your own comments 
    const handleApiDeleteComment = (commentID) => {
        callApiDeleteComment(commentID)
            .then(res => {
                console.log("callApiDeleteComment returned: ", res)
            })
        setTimeout(() => {
            window.location.reload();
        }, 100);
    }

    const callApiDeleteComment = async (commentID) => {
        const url = `${REACT_APP_API_ENDPOINT}/deleteForumComment`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                commentID: commentID
            })
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
                    <Card style={{ width: '1000px', marginBottom: '20px' }} key={event.id}>
                        <CardContent>
                            {/*<Link to={`/forum/${event.id}`} target="_blank">*/}
                            <Typography variant="h5" component="div">
                                {event.forumTitle}<br />
                            </Typography>
                            {/*</Link>*/}
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Posted on {new Date(event.dateTime).toLocaleDateString()}<br />
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                <br />{event.description}<br />
                            </Typography>
                            <form>
                                <TextField
                                    style={{ mb: 1.5, width: '350px' }}
                                    label="Add a comment"
                                    value={newComment}
                                    onChange={handleNewComment}
                                />
                                <Button type="submit" style={{ color: "white", backgroundColor: "seagreen", mb: 1.5 }}>Submit</Button>
                            </form>
                            <Typography sx={{ mb: 1.5 }} variant="h6" color="text.secondary">
                                <br />Comments:<br />
                            </Typography>
                            {comments.map((comment) => (
                                <Card style={{ width: '500px', marginBottom: '20px' }} key={comment.id}>
                                    <CardContent>
                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                            {comment.comment}<br />
                                        </Typography>
                                        <Typography style={{ mb: 1.5, fontSize: "12px" }} color="text.secondary">
                                            Comment Created:{new Date(new Date(comment.commentDateTime).getTime() - (5 * 60 * 60 * 1000)).toLocaleString()}<br />
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </div>
    )
}

export default Forum; 