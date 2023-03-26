import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory, useParams } from "react-router-dom"
import { Card } from 'react-bootstrap';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    Badge,
    Box,
    Button,
    Input,
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
    Modal,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text
} from '@chakra-ui/react';

import NavigationBar from '../common/NavigationBar';

const { REACT_APP_API_ENDPOINT } = process.env;

const Forum = () => {

    const { currentUser } = useAuth();
    const history = useHistory();
    const [email, setEmail] = React.useState('');
    const [userID, setUserID] = React.useState('');
    const { forumID } = useParams();
    const [forum, setForum] = React.useState([]);

    // Comment states
    const [comments, setComments] = React.useState([]);
    const [newComment, setNewComment] = React.useState("");
    const handleNewComment = (forum) => {
        setNewComment(forum.target.value);
    }

    // Edit states 
    const [showSuccessfulCreateComment, setshowSuccessfulCreateComment] = React.useState(false);
    const [showEditAlertMessage, setShowEditAlertMessage] = React.useState(false);
    const [showSuccessfulDeleteComment, setShowSuccessfulDeleteComment] = React.useState(false);
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
            setForum(parsed[0]);

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
        setshowSuccessfulCreateComment(true);
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
        setShowSuccessfulDeleteComment(true);
        setTimeout(() => {
            window.location.reload();
        }, 3000);
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
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
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

    const handleOpenDeleteDialog = (event) => {
        setSelectedComment(event);
        setIsDeleteDialogOpen(true);

        // Update comment
        setComment(event.comment);
        setCommentError(false);
        setCommentErrorText('');

    };

    const handleCloseDeleteDialog = () => {
        setSelectedComment(null);
        setIsDeleteDialogOpen(false);
    };

    return (
        <div id="body">

            <NavigationBar></NavigationBar>

            <Box sx={{ position: 'absolute', top: 115, left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Text
                    className="title"
                >
                    {forum.forumTitle}
                </Text>
            </Box>

            <Box sx={{ position: 'absolute', top: 185, left: '50%', transform: 'translateX(-50%)' }}>

                <Card style={{ width: '1000px', marginBottom: '8px', padding: '16px' }} key={forum.id}>

                    <Text
                        className="header to-text"
                        marginTop="8px"
                    >
                        Posted on: {new Date(new Date(forum.dateTime).getTime() - (5 * 60 * 60 * 1000)).toLocaleDateString()}
                    </Text>

                    <Text
                        className="header to-text"
                        marginTop="8px"
                    >
                        By: {forum.creatorName}
                    </Text>

                    <Text
                        className="header to-text"
                        marginTop="8px"
                    >
                        Status: {forum.status}
                    </Text>

                    <Text
                        className="header to-text"
                        marginTop="8px"
                    >
                        Description:
                    </Text>
                    <Text
                        className="text to-text"
                        marginTop="2px"
                    >
                        {forum.description}
                    </Text>

                    {forum.status === "Active" &&
                        <Box
                            display="flex"
                            flexDirection="row"
                            marginTop="16px"
                        >
                            <Input
                                className="body"
                                placeholder="Add a comment"
                                value={newComment}
                                onChange={handleNewComment}
                                marginRight="8px"
                            />
                            <Button
                                className="button smaller-width"
                                onClick={handleApiAddComment}
                                style={{ width: "80px" }}
                            >
                                Submit
                            </Button>
                        </Box>
                    }
                    <Text
                        className="header to-text"
                        marginBottom="16px"
                        marginTop="16px"
                    >
                        Comments:
                    </Text>

                    {comments.map((comment) => (
                        <Card style={{ marginBottom: '8px', padding: '8px' }} key={comment.id}>
                            <Text className="header to-text">
                                User: {comment.firstName} {comment.lastName}
                            </Text>

                            <Text className="body to-text">
                                Comment Posted: {new Date(new Date(comment.commentDateTime).getTime() - (5 * 60 * 60 * 1000)).toLocaleString()}
                            </Text>
                            {comment.editedCommentDateTime &&
                                <Text className="body to-text">
                                    Comment Edited: {new Date(new Date(comment.editedCommentDateTime).getTime() - (5 * 60 * 60 * 1000)).toLocaleString()}
                                </Text>
                            }

                            <Text
                                className="body to-text"
                                marginTop="8px"
                            >
                                {comment.comment}
                            </Text>

                            {comment.userID === userID && (
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    marginTop="8px"
                                >
                                    <Link
                                        onClick={() => handleOpenDeleteDialog(comment)}
                                        className="link"
                                        style={{ color: "#FF4136", marginRight: "8px" }}
                                    >
                                        Delete
                                    </Link>
                                    <Link
                                        onClick={() => handleOpenDialog(comment)}
                                        className="link"
                                        style={{ color: "#023679" }}
                                    >
                                        Edit
                                    </Link>
                                </Box>
                            )}
                        </Card>
                    ))}
                </Card>
            </Box>

            {selectedComment && (
                <div>
                    {/* Delete comment diaglog */}
                    <Modal isOpen={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
                        <ModalOverlay />
                        <ModalContent
                            style={{ width: '400px', padding: '16px' }}
                        >
                            <ModalHeader
                                className="headerBig"
                                textAlign="center"
                            >
                                Confirm Deletion
                            </ModalHeader>

                            <Text className="header to-text">
                                Are you sure you want to delete this comment? This action is irreversible.
                            </Text>

                            <Box
                                display="flex"
                                flexDirection="row"
                                marginTop="16px"
                            >
                                <Button
                                    className="button"
                                    onClick={handleCloseDeleteDialog}
                                    marginRight="8px"
                                >
                                    No
                                </Button>
                                <Button
                                    className="button"
                                    onClick={() => handleApiDeleteComment(selectedComment.id)}
                                >
                                    Yes
                                </Button>
                            </Box>
                        </ModalContent>
                    </Modal>

                    {/* Edit comment diaglog */}
                    < Modal isOpen={isDialogOpen} onClose={handleCloseDialog}>
                        <ModalOverlay />
                        <ModalContent
                            style={{ width: '400px', padding: '16px' }}
                        >
                            <Text align="center" className="form-header">Edit Comment</Text>

                            <FormControl
                                isRequired
                                marginTop="16px"
                                isInvalid={commentError}
                            >
                                <FormLabel className="form-label">Name</FormLabel>
                                <Input
                                    placeholder='Forum name'
                                    className="form-input"
                                    value={comment}
                                    onChange={handleEditCommentBody}
                                    inputProps={{ maxLength: 350 }}
                                />
                                <FormHelperText className="form-helper-text">Enter the name of your forum.</FormHelperText>
                                <FormErrorMessage className="form-helper-text">{{ commentError }}</FormErrorMessage>
                            </FormControl>

                            <Box
                                display="flex"
                                flexDirection="row"
                                marginTop="8px"
                            >
                                <Button
                                    onClick={handleCloseDialog}
                                    className="button"
                                    marginRight="8px"
                                >
                                    Close</Button>
                                <Button
                                    onClick={handleEditComment}
                                    className="button"
                                >
                                    Edit</Button>
                            </Box>


                        </ModalContent>

                    </Modal>
                </div>
            )}

            showSuccessfulCreateComment

            {
                showSuccessfulCreateComment && (
                    <Alert
                        status="success"
                        sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                        <AlertIcon />
                        <AlertDescription>Comment successfully created.</AlertDescription>
                    </Alert>
                )
            }

            {
                showEditAlertMessage && (
                    <Alert
                        status="success"
                        sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                        <AlertIcon />
                        <AlertDescription>Comment successfully edited.</AlertDescription>
                    </Alert>
                )
            }

            {
                showSuccessfulDeleteComment && (
                    <Alert
                        status="success"
                        sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                        <AlertIcon />
                        <AlertDescription>Comment successfully deleted.</AlertDescription>
                    </Alert>
                )
            }
        </div >
    )
}

export default Forum; 