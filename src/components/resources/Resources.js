import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import NavigationBar from '../common/NavigationBar';
import Box from "@material-ui/core/Box";
import Chip from '@material-ui/core/Chip';
import { Select } from '@chakra-ui/react'
import DropdownFilter from "../common/filters/DropdownFilter";
import ClearFilters from "../common/filters/ClearFilters";
import Search from '../common/Search';

const { REACT_APP_API_ENDPOINT } = process.env;

const Resources = () => {

    const { currentUser } = useAuth();
    const history = useHistory();
    const [email, setEmail] = React.useState('');
    const [userID, setUserID] = React.useState('');

    const [searchTerm, setSearchTerm] = React.useState("");
    const [refreshSearch, setRefreshSearch] = React.useState(1);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

    const [resources, setResources] = React.useState([]);

    // Filters
    const [mediaTag, setMediaTag] = React.useState('');
    const mediaTagList = ["Interview Tips", "Youtube", "Stack Overflow", "School", "Personal Website", "Spreadsheet"];

    const handleMediaTag = (event) => {
        setMediaTag(event.target.value);
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
        loadGetResources(searchTerm);
    }, [refreshSearch]);

    const loadGetResources = async () => {
        try {
            const res = await callApiGetResources(searchTerm);
            const parsed = JSON.parse(res.express);
            setResources(parsed);

        } catch (error) {
            console.error(error);
        }
    }

    const callApiGetResources = async (searchTerm) => {

        const url = `${REACT_APP_API_ENDPOINT}/getResources?searchTerm=${searchTerm}`;
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

    const handleRefreshFilter = async () => {
        setMediaTag("");
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
                    Resources
                </Typography>
            </Box>

            <Box sx={{ width: '30%', position: 'absolute', top: 185, left: '50%', transform: 'translateX(-50%)', marginBottom: '20px' }}>
                <Search
                    label="Search for resource names or creators"
                    searchTerm={searchTerm}
                    onSetSearch={handleSearch}
                    fullWidth
                    onButtonClick={loadGetResources}
                    onResetSearch={handleRefreshSearch}
                />

                <br />
                <Typography
                    style={{ color: "black", mb: 2, fontSize: 14, align: 'right' }}
                >
                    Filters
                </Typography>
                <DropdownFilter
                    placeholder="Select a Media Type Tag"
                    value={mediaTag}
                    onChange={handleMediaTag}
                    lists={mediaTagList}
                />
                <ClearFilters
                    onClick={() => handleRefreshFilter()}
                />

            </Box>


            <Box sx={{ position: 'absolute', top: 390, left: '50%', transform: 'translateX(-50%)' }}>
                {resources.map((resources) => {
                    if (mediaTag && resources.mediaTag !== mediaTag) {
                        return null;
                    }
                    return (
                        <Card style={{ width: '800px', marginBottom: '20px' }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {resources.resourcesTitle}<br />
                                </Typography>
                                {resources.mediaTag && <Chip
                                    key={resources.id}
                                    label={resources.mediaTag}
                                    color="primary"
                                    size="small"
                                    style={{ marginRight: 8 }}
                                />}
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Posted on {new Date(new Date(resources.dateTime).getTime() - (5 * 60 * 60 * 1000)).toLocaleDateString()}<br />
                                    by {resources.creatorName}<br />
                                </Typography>
                                <a href={`${resources.resourcesLink}`} target="_blank">
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        <br />{resources.resourcesLink}<br />
                                    </Typography>
                                </a>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>
        </div>
    )
}

export default Resources; 