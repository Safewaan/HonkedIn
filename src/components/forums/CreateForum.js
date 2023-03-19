import React, { useRef, useState, useEffect } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns'
import { useAuth } from "../../contexts/AuthContext"
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import NavigationBar from '../common/NavigationBar';
import MuiAlert from '@mui/material/Alert';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

const { REACT_APP_API_ENDPOINT } = process.env;

const CreateForum = () => {

    const { currentUser } = useAuth();
    const history = useHistory()

    //const email = currentUser.email;
    const [email, setEmail] = React.useState('');
    const [userID, setUserID] = React.useState('');
    const [open, setOpen] = React.useState(false);


    React.useEffect(() => {
        setEmail(currentUser.email);
        loadUserEmailSearch(currentUser.email);
    }, []);

    const loadUserEmailSearch = (email) => {
        callApiGetUserEmailSearch(email)
            .then(res => {
                var parsed = JSON.parse(res.express);
                //console.log(parsed[0].id);
                setUserID(parsed[0].id);
            });
    }

    const callApiGetUserEmailSearch = async (email) => {
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

    const [forumName, setForumName] = React.useState('');
    const [forumNameError, setForumNameError] = React.useState('');
    const [forumNameErrorText, setForumNameErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleForumName = (event) => {
        setForumName(event.target.value);
        setForumNameError(false);
        setForumNameErrorText('');
    }

    const [forumDesc, setForumDesc] = React.useState('');
    const [forumDescError, setForumDescError] = React.useState('');
    const [forumDescErrorText, setForumDescErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleForumDesc = (event) => {
        setForumDesc(event.target.value);
        setForumDescError(false);
        setForumDescErrorText('');
    }

    const [forumTag, setForumTag] = React.useState('');
    const forumTagList = ["School", "Co-op", "Funny", "Debate", "Rant", "Interview", "Class Review", "Good News"];

    const handleForumTag = (event) => {
        setForumTag(event.target.value);
    }

    const [successfullSubmissionMsg, setsuccessfullSubmissionMsg] = React.useState(false);

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

    const resetForm = () => {
        setForumName('');
        setForumDesc('');
        setForumTag(''); 
    }

    const validateForum = () => {

        // console.log(" enableError is currently: " + enableError)

        if (forumName === '') {
            setForumNameError(true);
            setForumNameErrorText('Please enter your forum name');
            return false;
        } else if (forumDesc === '') {
            setForumDescError(true);
            setForumDescErrorText('Please enter a description of your forum');
            return false;
        } else {

            setOpen(true);

            var newForum = {
                forumName: forumName,
                forumDesc: forumDesc,
                forumTag: forumTag 
            }

            // console.log(format(eventDate))
            loadCreateForum();
            resetForm();
            setsuccessfullSubmissionMsg(true);
            setTimeout(() => {
                setsuccessfullSubmissionMsg(false);
            }, 3000);

            return false;
        }
    };

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

    const classes = useStyles();

    const loadCreateForum = () => {
        callApiCreateForum()
    }

    const callApiCreateForum = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/createForum`;
        console.log(url);
        //console.log(eventDate);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    forumTitle: forumName,
                    forumDesc: forumDesc,
                    creatorID: userID, 
                    forumTag: forumTag
                })
            });

            //console.log("got past the const response thing");
            if (!response.ok) {
                throw new Error(`${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <NavigationBar></NavigationBar>

            <Typography variant="h4" color="inherit" component="div" noWrap>
                Create Forum
            </Typography>

            <form className={classes.root} noValidate autoComplete="off">
                <ForumName
                    classes={classes}
                    forumName={forumName}
                    onEnterForumName={handleForumName}
                    forumNameError={forumNameError}
                    forumNameErrorText={forumNameErrorText}
                />
            </form>

            <form className={classes.root} noValidate autoComplete="off">
                <ForumDesc
                    classes={classes}
                    forumDesc={forumDesc}
                    onEnterForumDesc={handleForumDesc}
                    forumDescError={forumDescError}
                    forumDescErrorText={forumDescErrorText}
                />
            </form>

            <FormControl className={classes.root}>
                <InputLabel id="Forum-Tag"> Tags </InputLabel>
                <Select
                    labelId="Forum-Tag"
                    id="Forum-Tag"
                    value={forumTag}
                    onChange={handleForumTag}
                    fullWidth
                >
                    {forumTagList.map((tag) => (
                        <MenuItem value={tag}> {tag} </MenuItem>
                    ))}
                </Select>

            </FormControl>

            <Grid item>
                <SubmitButton
                    label={"SUBMIT"}
                    onButtonClick={validateForum}
                />
            </Grid>

            {successfullSubmissionMsg && (
                <Alert severity="success">
                    Forum Successfully created.
                </Alert>
            )}
        </div>
    )
}

const ForumName = ({ forumName, onEnterForumName, forumNameError, forumNameErrorText }) => {
    return (
        <Grid item>
            <TextField
                id="name-of-forum"
                label="Name"
                placeholder="Enter the forum name"
                value={forumName}
                onChange={onEnterForumName}
                error={forumNameError}
                fullWidth
            />
            <FormHelperText>{forumNameErrorText}</FormHelperText>
        </Grid>
    )
}

const ForumDesc = ({ forumDesc, onEnterForumDesc, forumDescError, forumDescErrorText }) => {
    return (
        <Grid item>
            <TextField
                id="desc-of-forum"
                label="Description"
                multiline
                minrows={4}
                placeholder="Enter a forum description"
                value={forumDesc}
                onChange={onEnterForumDesc}
                error={forumDescError}
                inputProps={{ maxLength: 1000 }}
                fullWidth
            />
            <FormHelperText>{forumDescErrorText}</FormHelperText>
        </Grid>
    )
}

const SubmitButton = ({ label, onButtonClick }) => (
    <Button
        variant="contained"
        color="secondary"
        onClick={(event) => onButtonClick(event)}
    >
        {label}
    </Button>
)

export default CreateForum;