import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import NavigationBar from '../common/NavigationBar';
import Box from "@material-ui/core/Box";
import { useParams } from 'react-router-dom';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MuiAlert from '@mui/material/Alert';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';

const { REACT_APP_API_ENDPOINT } = process.env;

const Forum = () => {

    const Alert = React.forwardRef(function Alert(props, ref) {
        return (
            <MuiAlert
                elevation={6}
                ref={ref}
                variant="filled"
                {...props}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 9999
                }}
            />
        );
    });

    const { currentUser } = useAuth();
    const history = useHistory();
    const [email, setEmail] = React.useState('');
    const [userID, setUserID] = React.useState('');
    const { forumID } = useParams();
    const [forums, setForums] = React.useState([]);

    // Comment states
    const [comments, setComments] = React.useState([]);
    const [newComment, setNewComment] = React.useState("");
    const handleNewComment = (forum) => {
        setNewComment(forum.target.value);
    }

    // Edit states 
    const [showEditAlertMessage, setShowEditAlertMessage] = React.useState(false);
    const [comment, setComment] = React.useState('');
    const [commentError, setCommentError] = React.useState('');
    const [commentErrorText, setCommentErrorText] = React.useState('');
    const handleEditCommentBody = (comment) => {
        setComment(comment.target.value);
        setCommentError(false);
        setCommentErrorText('');

    }

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
        handleApiGetSelectedForum();
        handleApiLoadComments();
    }, []);

    //API - Display the retrieved forum 
    const handleApiGetSelectedForum = async () => {
        try {
            const res = await callApiGetSelectedForum();
            const parsed = JSON.parse(res.express);
            setForums(parsed);

        } catch (error) {
            console.error(error);
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
        setTimeout(() => {
            window.location.reload();
        }, 3000);
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
                userID: userID,
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
            setComments(parsed);


        } catch (error) {
            console.error(error);
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

    // API - Edit your own comments
    const handleEditComment = (selectedComment) => {
        if (comment === '') {
            setCommentError(true);
            setCommentErrorText('Please enter your comment');
            return false;
        } else {
            //console.log("about to call api edit forum");
            callApiEditComment(selectedComment);
            setShowEditAlertMessage(true);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    }

    const callApiEditComment = async () => {
        const url = `${REACT_APP_API_ENDPOINT}/editForumComment`;
        console.log(url);

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                comment: comment,
                id: selectedComment.id
            })
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedComment, setSelectedComment] = React.useState(null);

    const handleOpenDialog = (event) => {
        setSelectedComment(event);
        setIsDialogOpen(true);

        // Update comment
        setComment(event.comment);
        setCommentError(false);
        setCommentErrorText('');

    };

    const handleCloseDialog = () => {
        setSelectedComment(null);
        setIsDialogOpen(false);
    };

    return (
        <div id="body">

            <NavigationBar></NavigationBar>

            <Box sx={{ position: 'absolute', top: 110, left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    component="div">
                    Forums
                </Typography>
            </Box>

            <Box sx={{ position: 'absolute', top: 150, left: '50%', transform: 'translateX(-50%)' }}>
                {forums.map((forum) => (
                    <Card style={{ width: '1000px', marginBottom: '20px' }} key={forum.id}>
                        <CardContent>
                            <Link to={`/forum/${forum.id}`} target="_blank">
                                <Typography variant="h5" component="div">
                                    {forum.forumTitle}<br />
                                </Typography>
                            </Link>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Posted on {new Date(forum.dateTime).toLocaleDateString()} by {forum.creatorName}<br />
                            </Typography>
                            <Typography variant="subtitle2" sx={{ mb: 1.5 }} color="text.secondary">
                                Status: {forum.status}<br />
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                <br />{forum.description}<br />
                            </Typography>
                            {forum.status === "Active" &&
                                <div>
                                    <TextField
                                        style={{ mb: 1.5, width: '350px' }}
                                        label="Add a comment"
                                        value={newComment}
                                        onChange={handleNewComment}
                                    />
                                    <Button type="submit" style={{ color: "white", backgroundColor: "seagreen", mb: 1.5 }} onClick={handleApiAddComment}>Submit</Button>
                                </div>}
                            <Typography sx={{ mb: 1.5 }} variant="h6" color="text.secondary">
                                <br />Comments:<br />
                            </Typography>
                            {comments.map((comment) => (
                                <Card style={{ width: '500px', marginBottom: '20px' }} key={comment.id}>
                                    <CardContent>
                                        <Typography style={{ mb: 1.5, fontSize: "12px" }} color="text.secondary">
                                            <strong> User: </strong> {comment.firstName} {comment.lastName}<br />
                                        </Typography>
                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                            {comment.comment}<br />
                                        </Typography>
                                        <Typography style={{ mb: 1.5, fontSize: "12px" }} color="text.secondary">
                                            <strong> Comment Posted: </strong> {new Date(new Date(comment.commentDateTime).getTime() - (5 * 60 * 60 * 1000)).toLocaleString()} <br />
                                        </Typography>
                                        <Typography style={{ mb: 1.5, fontSize: "12px" }} color="text.secondary">
                                            {comment.editedCommentDateTime && <strong> Comment Edited: </strong>}
                                            {comment.editedCommentDateTime && new Date(new Date(comment.editedCommentDateTime).getTime() - (5 * 60 * 60 * 1000)).toLocaleString()}
                                            <br />
                                        </Typography>
                                        {comment.userID === userID && (
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <Typography
                                                    onClick={() => handleApiDeleteComment(comment.id)}
                                                    style={{ color: "red", mb: 1.5, cursor: 'pointer', fontSize: 12 }}
                                                >
                                                    Delete
                                                </Typography>
                                                <Typography
                                                    onClick={() => handleOpenDialog(comment)}
                                                    style={{ color: "blue", mb: 1.5, cursor: 'pointer', fontSize: 12 }}
                                                >
                                                    Edit
                                                </Typography>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </Box>
            {selectedComment && (
                <div>
                    {/* Edit comment diaglog */}
                    < Dialog open={isDialogOpen} onClose={handleCloseDialog} >
                        <DialogTitle>Edit Your Comment</DialogTitle>
                        <DialogContent>
                            <Comment
                                comment={comment}
                                onEnterComment={handleEditCommentBody}
                                commentError={commentError}
                                commentErrorText={commentErrorText}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Close</Button>
                            {<Button onClick={handleEditComment}>Edit Comment</Button>}
                        </DialogActions>
                    </Dialog>
                </div>
            )}

            {showEditAlertMessage && (
                <Alert severity="success">
                    Comment successfully edited.
                </Alert>
            )}
        </div>
    )
}
const Comment = ({ comment, onEnterComment, commentError, commentErrorText, defaultValue }) => {
    return (
        <Grid item>
            <TextField
                id="edit-comment"
                label="Edit Comment"
                placeholder="Enter Comment"
                value={comment}
                onChange={onEnterComment}
                error={commentError}
                fullWidth
            />
            <FormHelperText>{commentErrorText}</FormHelperText>
        </Grid>
    )
}

export default Forum; 