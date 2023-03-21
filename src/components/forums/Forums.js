import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import NavigationBar from '../common/NavigationBar';
import Box from "@material-ui/core/Box";
import DropdownFilter from "../common/filters/DropdownFilter";
import ClearFilters from "../common/filters/ClearFilters";
import Chip from '@material-ui/core/Chip';
import Search from "../common/Search";

const { REACT_APP_API_ENDPOINT } = process.env;

const Forums = () => {

    const { currentUser } = useAuth();
    const history = useHistory();
    const [email, setEmail] = React.useState('');
    const [userID, setUserID] = React.useState('');

    const [forums, setForums] = React.useState([]);

    const [searchTerm, setSearchTerm] = React.useState("");
    const [refreshSearch, setRefreshSearch] = React.useState(1);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

    React.useEffect(() => {
        setEmail(currentUser.email);
        loaduserSearchByEmail(currentUser.email);
        //loadGetForums(searchTerm);
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

    React.useEffect(() => {
        loadGetForums(searchTerm);
    }, [refreshSearch]);

    const loadGetForums = async () => {
        try {
            const res = await callApiGetForums(searchTerm);
            const parsed = JSON.parse(res.express);
            setForums(parsed);

        } catch (error) {
            console.error(error);
        }
    }

    const callApiGetForums = async (searchTerm) => {

        const url = `${REACT_APP_API_ENDPOINT}/getForums?searchTerm=${searchTerm}`;
        console.log(url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        console.log("the searchTerm is " + searchTerm)
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    // Filters
    const [forumTag, setForumTag] = React.useState('');
    const forumTagList = ["School", "Co-op", "Funny", "Debate", "Rant", "Interview", "Class Review", "Good News"];

    const handleForumTag = (event) => {
        setForumTag(event.target.value);
    }

    const [status, setStatus] = React.useState('');
    const statusList = ["Active", "Archived"];

    const handleStatus = (event) => {
        setStatus(event.target.value);
    }

    const handleRefreshFilter = async () => {
        setForumTag("");
        setStatus("");
    }
    const handleRefreshSearch = async () => {
        setSearchTerm("");
        setRefreshSearch(refreshSearch + 1);
    }

    return (
        <div id="body">

            <NavigationBar></NavigationBar>

            <Box sx={{ position: 'absolute', top: 115, left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    component="div">
                    Forums
                </Typography>
            </Box>

            <Box sx={{ width: '30%', position: 'absolute', top: 185, left: '50%', transform: 'translateX(-50%)', marginBottom: '20px' }}>
                <Search
                    label="Search for forum titles, descriptions, or creators"
                    searchTerm={searchTerm}
                    onSetSearch={handleSearch}
                    fullWidth
                    onButtonClick={loadGetForums}
                    onResetSearch={handleRefreshSearch}
                />

                <br />
                <Typography
                    style={{ color: "black", mb: 2, fontSize: 14, align: 'right' }}
                >
                    Filters
                </Typography>
                <DropdownFilter
                    placeholder="Select a Forum Tag"
                    value={forumTag}
                    onChange={handleForumTag}
                    lists={forumTagList}
                />
                <br />
                <DropdownFilter
                    placeholder="Select the Status"
                    value={status}
                    onChange={handleStatus}
                    lists={statusList}
                />
                <ClearFilters
                    onClick={() => handleRefreshFilter()}
                />

            </Box>


            <Box sx={{ position: 'absolute', top: 450, left: '50%', transform: 'translateX(-50%)' }}>
                {forums.map((forum) => {
                    if (forumTag && forum.forumTag !== forumTag) {
                        return null;
                    }
                    if (status && forum.status !== status) {
                        return null;
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
                    );
                })}
            </Box>
        </div>
    )
}


export default Forums; 