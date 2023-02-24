import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import NavigationBar from './NavigationBar';
import Box from "@material-ui/core/Box";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MuiAlert from '@mui/material/Alert';
import { Form } from "react-bootstrap"

const { REACT_APP_API_ENDPOINT } = process.env;

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

const MyForums = () => {

    const useStyles = makeStyles((theme) => ({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '50ch',
            },
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
        },
    }));


    const { currentUser } = useAuth();
    const history = useHistory()
    const [email, setEmail] = React.useState('');
    const [userID, setUserID] = React.useState('');
    const [forums, setForums] = useState([]);
    const [selectedForum, setSelectedForum] = React.useState(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [showEditAlertMessage, setShowEditAlertMessage] = React.useState(false);
    const classes = useStyles();

    const [forumStatus, setForumStatus] = React.useState('');
    const [showSuccessfulArchiveMsg, setshowSuccessfulArchiveMsg] = React.useState(false);

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

    React.useEffect(() => {
        setEmail(currentUser.email);
        loaduserSearchByEmail(currentUser.email);
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
        console.log(url);

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

    const loadgetForumsByUserID = async () => {
        try {
            const res = await CallApigetForumsByUserID();
            const parsed = JSON.parse(res.express);
            setForums(parsed);
            setForumStatus(parsed.status);
        } catch (error) {
            console.error(error);
        }
    }

    const CallApigetForumsByUserID = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/getForumsByUserID`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userID: userID
            })
        });
        const body = await response.json();
        console.log("got here");
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    useEffect(() => {
        loadgetForumsByUserID();
    }, [userID]);

    const callApiArchiveForum = async (forumID) => {
        const url = `${REACT_APP_API_ENDPOINT}/archiveForum`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: forumID
            })
        });

        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    async function handleArchiveForum(forumID) {
        await loaduserSearchByEmail(currentUser.email);
        setshowSuccessfulArchiveMsg(true);
        callApiArchiveForum(forumID);
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }

    const CallApiEditForum = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/editForum`;
        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                forumTitle: forumTitle,
                forumDesc: forumDesc,
                forumID: selectedForum.id
            })
        });

        console.log("forumDesc = " + forumDesc)
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    const [forumTitle, setForumTitle] = React.useState('');
    const [forumTitleError, setForumTitleError] = React.useState('');
    const [forumTitleErrorText, setForumTitleErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleForumTitle = (forum) => {
        setForumTitle(forum.target.value);
        setForumTitleError(false);
        setForumTitleErrorText('');
    }

    const [forumDesc, setForumDesc] = React.useState('');
    const [forumDescError, setForumDescError] = React.useState('');
    const [forumDescErrorText, setForumDescErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleForumDesc = (event) => {
        setForumDesc(event.target.value);
        setForumDescError(false);
        setForumDescErrorText('');
    }

    const handleEditForum = () => {
        if (forumTitle === '') {
            setForumTitleError(true);
            setForumTitleErrorText('Please enter your forum title');
            return false;
        } else if (forumDesc === '') {
            setForumDescError(true);
            setForumDescErrorText('Please enter a conversation starter');
            return false;
        } else {
            //console.log("about to call api edit forum");
            CallApiEditForum();
            setShowEditAlertMessage(true);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    }

    const handleOpenDialog = (event) => {
        setSelectedForum(event);
        setIsDialogOpen(true);

        // Update forum title
        setForumTitle(event.forumTitle);
        setForumTitleError(false);
        setForumTitleErrorText('');

        // Update forum desc
        setForumDesc(event.description);
        setForumDescError(false);
        setForumDescErrorText('');

    };

    const handleCloseDialog = () => {
        setSelectedForum(null);
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
                    My Forums
                </Typography>
            </Box>

            <Box sx={{ position: 'absolute', top: 150, left: '50%', transform: 'translateX(-50%)' }}>
                {forums.map((forum) => (
                    <Card style={{ width: '800px', marginBottom: '20px' }} key={forum.id}>
                        <CardContent>
                            <Link to={`/forum/${forum.id}`} target="_blank">
                                <Typography variant="h5" component="div">
                                    {forum.forumTitle}<br />
                                </Typography>
                            </Link>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Posted on {new Date(forum.dateTime).toLocaleDateString()}<br />
                            </Typography>
                            <Typography variant="subtitle2" sx={{ mb: 1.5 }} color="text.secondary">
                                Status: {forum.status}<br />
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                <br />{forum.description}<br />
                            </Typography>

                        </CardContent>
                        <CardActions>
                            {forum.status === "Active" && <Button onClick={() => handleOpenDialog(forum)}>Edit Forum</Button>}
                            {forum.status === 'Active' && (<Button onClick={() => handleArchiveForum(forum.id)}>Archive Forum</Button>)}
                        </CardActions>
                    </Card>
                ))}
            </Box>

            {selectedForum && (
                <div>
                    {/* Edit forum diaglog */}
                    < Dialog open={isDialogOpen} onClose={handleCloseDialog} >
                        <DialogTitle>{selectedForum.forumTitle}</DialogTitle>
                        <DialogContent>
                            <ForumTitle
                                classes={classes}
                                forumTitle={forumTitle}
                                onEnterForumTitle={handleForumTitle}
                                forumTitleError={forumTitleError}
                                forumTitleErrorText={forumTitleErrorText}
                            />

                            <ForumDesc
                                classes={classes}
                                forumDesc={forumDesc}
                                onEnterForumDesc={handleForumDesc}
                                forumDescError={forumDescError}
                                forumDescErrorText={forumDescErrorText}
                            />

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Close</Button>
                            {<Button onClick={handleEditForum}>Edit Forum</Button>}
                        </DialogActions>
                    </Dialog>
                </div>
            )}

            {showEditAlertMessage && (
                <Alert severity="success">
                    Event successfully edited.
                </Alert>
            )}
            {showSuccessfulArchiveMsg && (
                <Alert severity="success">
                    Forum archived.
                </Alert>
            )}
        </div >
    )


}

const ForumTitle = ({ forumTitle, onEnterForumTitle, forumTitleError, forumTitleErrorText, defaultValue }) => {
    return (
        <Grid item>
            <TextField
                id="forum-title"
                label="Title"
                placeholder="Enter the title of your forum"
                value={forumTitle}
                onChange={onEnterForumTitle}
                error={forumTitleError}
                fullWidth
            />
            <FormHelperText>{forumTitleErrorText}</FormHelperText>
        </Grid>
    )
}

const ForumDesc = ({ forumDesc, onEnterForumDesc, forumDescError, forumDescErrorText, defaultValue }) => {
    return (
        <Grid item>
            <TextField
                id="desc-of-forum"
                label="Description"
                multiline
                minrows={4}
                placeholder="Enter a conversation starter for your forum"
                value={forumDesc}
                onChange={onEnterForumDesc}
                error={forumDescError}
                inputProps={{ maxLength: 200 }}
                fullWidth
            />
            <FormHelperText>{forumDescErrorText}</FormHelperText>
        </Grid>
    )
}


export default MyForums;