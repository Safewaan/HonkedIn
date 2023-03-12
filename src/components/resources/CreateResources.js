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

const { REACT_APP_API_ENDPOINT } = process.env;

const CreateResources = () => {

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

    const [resourcesTitle, setResourcesTitle] = React.useState('');
    const [resourcesTitleError, setResourcesTitleError] = React.useState('');
    const [resourcesTitleErrorText, setResourcesTitleErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleResourcesTitle = (event) => {
        setResourcesTitle(event.target.value);
        setResourcesTitleError(false);
        setResourcesTitleErrorText('');
    }

    const [resourcesLink, setResourcesLink] = React.useState('');
    const [resourcesLinkError, setResourcesLinkError] = React.useState('');
    const [resourcesLinkErrorText, setResourcesLinkErrorText] = React.useState(''); //ERROR EDITING IN RETURN BRACKETS
    const handleResourcesLink = (event) => {
        setResourcesLink(event.target.value);
        setResourcesLinkError(false);
        setResourcesLinkErrorText('');
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
        setResourcesTitle('');
        setResourcesLink('');
    }

    const validateResources = () => {

        // console.log(" enableError is currently: " + enableError)

        if (resourcesTitle === '') {
            setResourcesTitleError(true);
            setResourcesTitleErrorText('Please enter your resource title');
            return false;
        } else if (resourcesLink === '') {
            setResourcesLinkError(true);
            setResourcesLinkErrorText('Please enter the link to your resource');
            return false;
        } else {

            setOpen(true);

            var newResources = {
                resourcesTitle: resourcesTitle,
                resourcesLink: resourcesLink
            }

            // console.log(format(eventDate))
            loadCreateResources();
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

    const loadCreateResources = () => {
        callApiCreateResources()
    }

    const callApiCreateResources = async () => {

        const url = `${REACT_APP_API_ENDPOINT}/createResources`;
        console.log(url);
        //console.log(eventDate);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    creatorID: userID,
                    resourcesTitle: resourcesTitle,
                    resourcesLink: resourcesLink
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
                Create Resources
            </Typography>

            <form className={classes.root} noValidate autoComplete="off">
                <ResourceTitle
                    classes={classes}
                    resourceTitle={resourcesTitle}
                    onEnterResourceTitle={handleResourcesTitle}
                    resourceTitleError={resourcesTitleError}
                    resourceTitleErrorText={resourcesTitleErrorText}
                />
            </form>

            <form className={classes.root} noValidate autoComplete="off">
                <ResourceLink
                    classes={classes}
                    resourceLink={resourcesLink}
                    onEnterResourceLink={handleResourcesLink}
                    resourceLinkError={resourcesLinkError}
                    resourceLinkErrorText={resourcesLinkErrorText}
                />
            </form>

            <Grid item>
                <SubmitButton
                    label={"SUBMIT"}
                    onButtonClick={validateResources}
                />
            </Grid>

            {successfullSubmissionMsg && (
                <Alert severity="success">
                    Resource Successfully created.
                </Alert>
            )}
        </div>
    )
}

const ResourceTitle = ({ resourceTitle, onEnterResourceTitle, resourceTitleError, resourceTitleErrorText }) => {
    return (
        <Grid item>
            <TextField
                id="name-of-resource"
                label="Title"
                placeholder="Enter the resource name"
                value={resourceTitle}
                onChange={onEnterResourceTitle}
                error={resourceTitleError}
                fullWidth
            />
            <FormHelperText>{resourceTitleErrorText}</FormHelperText>
        </Grid>
    )
}

const ResourceLink = ({ resourceLink, onEnterResourceLink, resourceLinkError, resourceLinkErrorText }) => {
    return (
        <Grid item>
            <TextField
                id="link-of-resource"
                label="Link"
                multiline
                minrows={4}
                placeholder="Enter the link of the resource"
                value={resourceLink}
                onChange={onEnterResourceLink}
                error={resourceLinkError}
                inputProps={{ maxLength: 1000 }}
                fullWidth
            />
            <FormHelperText>{resourceLinkErrorText}</FormHelperText>
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

export default CreateResources;