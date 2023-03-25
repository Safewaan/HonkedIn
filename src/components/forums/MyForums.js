import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
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
import { Form } from "react-bootstrap"
import Search from '../common/Search';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import DropdownFilter from "../common/filters/DropdownFilter";
import ClearFilters from "../common/filters/ClearFilters";
import DateFilter from "../common/filters/DateFilter";
import Chip from '@material-ui/core/Chip';
import "react-datepicker/dist/react-datepicker.css";

import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Text
} from '@chakra-ui/react';

import NavigationBar from '../common/NavigationBar';

const { REACT_APP_API_ENDPOINT } = process.env;

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

    const [searchTerm, setSearchTerm] = React.useState("");
    const [refreshSearch, setRefreshSearch] = React.useState(1);
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

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
            const res = await CallApigetForumsByUserID(userID, searchTerm);
            const parsed = JSON.parse(res.express);
            setForums(parsed);
            setForumStatus(parsed.status);
        } catch (error) {
            console.error(error);
        }
    }

    const CallApigetForumsByUserID = async (userID, searchTerm) => {

        const url = `${REACT_APP_API_ENDPOINT}/getForumsByUserID?userID=${userID}&searchTerm=${searchTerm}`;
        console.log(url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const body = await response.json();
        console.log("got here");
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    useEffect(() => {
        loadgetForumsByUserID();
    }, [userID, refreshSearch]);

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
                forumTag: forumTag,
                forumID: selectedForum.id
            })
        });
        //console.log("forumID = " + selectedForum.id)
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

        // Update tag
        setForumTag(event.forumTag);

    };

    const handleCloseDialog = () => {
        setSelectedForum(null);
        setIsDialogOpen(false);
    };

    const handleRefreshSearch = async () => {
        setSearchTerm("");
        setRefreshSearch(refreshSearch + 1);
    }

    // Filters
    const [forumTag, setForumTag] = React.useState('');
    const forumTagList = ["School", "Co-op", "Funny", "Debate", "Rant", "Interview", "Class Review", "Good News"];

    const handleForumTag = (event) => {
        setForumTag(event.target.value);
    }

    //for filtering
    const [forumFilterTag, setForumFilterTag] = React.useState("");
    const handleForumFilterTag = (event) => {
        setForumFilterTag(event.target.value);
    }

    const [status, setStatus] = React.useState('');
    const statusList = ["Active", "Archived"];

    const handleStatus = (event) => {
        setStatus(event.target.value);
    }

    const [selectedDates, setSelectedDates] = React.useState([]);

    const handleRefreshFilter = async () => {
        setForumFilterTag("");
        setStatus("");
        setSelectedDates([]);
    }

    return (
        <div id="body">

            <NavigationBar></NavigationBar>

            <Box sx={{ position: 'absolute', top: 115, left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    component="div">
                    My Forums
                </Typography>
            </Box>

            <Box sx={{ width: '30%', position: 'absolute', top: 185, left: '50%', transform: 'translateX(-50%)', marginBottom: '20px', zIndex: 1 }}>

                <Search
                    label="Search for forum titles or descriptions"
                    searchTerm={searchTerm}
                    onSetSearch={handleSearch}
                    fullWidth
                    onButtonClick={loadgetForumsByUserID}
                    onResetSearch={handleRefreshSearch}
                />
                <Text
                    className="header"
                >
                    Filters
                </Text>
                <DropdownFilter
                    placeholder="Select a Forum Tag"
                    value={forumFilterTag}
                    onChange={handleForumFilterTag}
                    lists={forumTagList}
                />
                <DropdownFilter
                    placeholder="Select a Status"
                    value={status}
                    onChange={handleStatus}
                    lists={statusList}
                />
                <DateFilter
                    placeholder="Select a Date Range"
                    selectedDates={selectedDates}
                    onDateChange={(selectedDates) => setSelectedDates(selectedDates)}
                />
                <ClearFilters
                    onClick={() => handleRefreshFilter()}
                />


            </Box>

            <Box sx={{ position: 'absolute', top: 550, left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
                {forums.map((forum) => {
                    if (forumFilterTag && forum.forumTag !== forumFilterTag) {
                        return null;
                    }
                    if (status && forum.status !== status) {
                        return null;
                    }
                    if (selectedDates.length !== 0) {
                        const startDate = new Date(selectedDates[0]);
                        const endDate = new Date(selectedDates[1]);
                        const convertDate = (new Date(forum.dateTime).getTime() - (5 * 60 * 60 * 1000));
                        const forumDate = new Date(convertDate);

                        startDate.setHours(0, 0, 0, 0);
                        endDate.setHours(0, 0, 0, 0);
                        forumDate.setHours(0, 0, 0, 0);

                        if (!(forumDate >= startDate && forumDate <= endDate) &&
                            !(forumDate === startDate && forumDate >= startDate) &&
                            !(forumDate === endDate && forumDate <= endDate)) {
                            return null;
                        }
                    }

                    return (
                        <Card style={{ width: '800px', marginBottom: '20px' }} key={forum.id}>
                            <CardContent>
                                <Link to={`/forum/${forum.id}`} target="_blank">
                                    <Typography variant="h5" component="div">
                                        {forum.forumTitle}<br />
                                    </Typography>
                                </Link>
                                {forum.forumTag && <Chip
                                    key={forum.id}
                                    label={forum.forumTag}
                                    color="primary"
                                    size="small"
                                    style={{ marginRight: 8 }}
                                />}
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
                    );
                })}
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

                            <ForumTag
                                classes={classes}
                                forumTag={forumTag}
                                handleForumTag={handleForumTag}
                                forumTagList={forumTagList}
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
                <Alert
                    status="success"
                    sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                    <AlertIcon />
                    <AlertDescription>Forum successfully edited.</AlertDescription>
                </Alert>
            )}
            {showSuccessfulArchiveMsg && (
                <Alert
                    status="success"
                    sx={{ position: 'fixed', bottom: 0, right: 0, width: '25%', zIndex: 9999 }}>
                    <AlertIcon />
                    <AlertDescription>Forum successfully archived.</AlertDescription>
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

const ForumTag = ({ classes, forumTag, handleForumTag, forumTagList }) => {
    return (
        <Grid item>

            <FormControl className={classes.root}>
                <InputLabel id="Forum-Tag"> Tags </InputLabel>
                <Select
                    label="Forum Tag"
                    labelId="Forum-Tag"
                    id="Forum-Tag"
                    value={forumTag}
                    onChange={handleForumTag}
                >
                    {forumTagList.map((tag) => (
                        <MenuItem value={tag}> {tag} </MenuItem>
                    ))}
                </Select>

            </FormControl>
        </Grid>
    )
}

export default MyForums;