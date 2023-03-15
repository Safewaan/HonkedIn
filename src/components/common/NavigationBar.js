import React, { useState } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Menu from '@material-ui/core/Menu';
import Drawer from "@material-ui/core/Drawer";
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';

import {
    LOGIN_PAGE,
    EVENTS_PAGE,
    CREATE_EVENT_PAGE,
    MY_EVENTS_PAGE,
    CREATE_FORUM_PAGE,
    FORUMS_PAGE,
    MY_FORUMS_PAGE,
    MY_PROFILE_PAGE,
    USER_SETTINGS_PAGE,
    MY_COMMENTS_PAGE
    CREATE_RESOURCE_PAGE,
    RESOURCES_PAGE,
    NETWORK_PAGE, 
    NETWORK_PROFILE_PAGE
  } from "../constants/Routes";

export default function NavigationBar() {

    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [anchorElUserEvents, setAnchorElUserEvents] = React.useState(null);
    const [anchorElUserForums, setAnchorElUserForums] = React.useState(null);
    const [anchorElUserResources, setAnchorElUserResources] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenUserMenuEvents = (event) => {
        setAnchorElUserEvents(event.currentTarget);
    };

    const handleCloseUserMenuEvents = () => {
        setAnchorElUserEvents(null);
    };

    const handleOpenUserMenuForums = (event) => {
        setAnchorElUserForums(event.currentTarget);
    };

    const handleCloseUserMenuForums = () => {
        setAnchorElUserForums(null);
    };

    const handleOpenUserMenuResources = (event) => {
        setAnchorElUserResources(event.currentTarget);
    };

    const handleCloseUserMenuResources = () => {
        setAnchorElUserResources(null);
    };

    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError("")

        try {
            await logout()
            history.push(LOGIN_PAGE)
        } catch {
            setError("Failed to log out")
        }
    }

    async function handleSettings() {
        history.push(USER_SETTINGS_PAGE)
    }

    async function handleEvents() {
        history.push(EVENTS_PAGE)
    }

    async function handleMyEvents() {
        history.push(MY_EVENTS_PAGE)
    }

    async function handleCreateEvent() {
        history.push(CREATE_EVENT_PAGE)
    }

    async function handleMyProfile() {

        history.push(MY_PROFILE_PAGE)

    }

    async function handleCreateForum() {

        history.push(CREATE_FORUM_PAGE)

    }

    async function handleForums() {

        history.push(FORUMS_PAGE)

    }

    async function handleMyForums() {

        history.push(MY_FORUMS_PAGE)

    }


    async function handleMyComments() {

        history.push(MY_COMMENTS_PAGE)

    }

    async function handleCreateResources() {

        history.push(CREATE_RESOURCE_PAGE)

    }

    async function handleResources() {

        history.push(RESOURCES_PAGE)
    }

    async function handleNetwork() {

        history.push(NETWORK_PAGE)

    }

    return (
        <>
            <Paper>
                <AppBar position="fixed">
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                <Typography
                                    variant="h3"
                                    noWrap
                                    component="a"
                                    href="/"
                                    sx={{
                                        mr: 2,
                                        display: { xs: 'none', md: 'flex' },
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.3rem',
                                        color: 'inherit',
                                        textDecoration: 'none'
                                    }}
                                >
                                    HonkedIn
                                </Typography>
                            </Box>

                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                <Tooltip title="Events">
                                    <Button onClick={handleOpenUserMenuEvents} sx={{ p: 0 }}>
                                        Events
                                    </Button>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUserEvents}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUserEvents)}
                                    onClose={handleCloseUserMenuEvents}
                                >
                                    <MenuItem key="Events" onClick={handleEvents}>
                                        <Typography textAlign="center">Events</Typography>
                                    </MenuItem>

                                    <MenuItem key="Events" onClick={handleMyEvents}>
                                        <Typography textAlign="center">My Events</Typography>
                                    </MenuItem>

                                    <MenuItem key="Create Events" onClick={handleCreateEvent}>
                                        <Typography textAlign="center">Create Events</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>

                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                <Tooltip title="Forums">
                                    <Button onClick={handleOpenUserMenuForums} sx={{ p: 0 }}>
                                        Forums
                                    </Button>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUserForums}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUserForums)}
                                    onClose={handleCloseUserMenuForums}
                                >

                                    <MenuItem key="Forums" onClick={handleForums}>
                                        <Typography textAlign="center">Forums</Typography>
                                    </MenuItem>

                                    <MenuItem key="MyForums" onClick={handleMyForums}>
                                        <Typography textAlign="center">My Forums</Typography>
                                    </MenuItem>

                                    <MenuItem key="MyComments" onClick={handleMyComments}>
                                        <Typography textAlign="center">My Comments</Typography>
                                    </MenuItem>

                                    <MenuItem key="Create Forums" onClick={handleCreateForum}>
                                        <Typography textAlign="center">Create Forums</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>

                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                <Tooltip title="Resources">
                                    <Button onClick={handleOpenUserMenuResources} sx={{ p: 0 }}>
                                        Resources
                                    </Button>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUserResources}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUserResources)}
                                    onClose={handleCloseUserMenuResources}
                                >
                                    <MenuItem key="Resources" onClick={handleResources}>
                                        <Typography textAlign="center">Resources</Typography>
                                    </MenuItem>
                                    <MenuItem key="Resources" onClick={handleCreateResources}>
                                        <Typography textAlign="center">Create Resources</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>

                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                <Tooltip title="Network">
                                    <Button onClick={handleNetwork} sx={{ p: 0 }}>
                                        Explore Network
                                    </Button>
                                </Tooltip>
                            </Box>


                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="Profile" src="/static/images/avatar/2.jpg" />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem key="My Profile" onClick={handleMyProfile}>
                                        <Typography textAlign="center">My Profile</Typography>
                                    </MenuItem>

                                    <MenuItem key="Settings" onClick={handleSettings}>
                                        <Typography textAlign="center">Settings</Typography>
                                    </MenuItem>

                                    <MenuItem key="Logout" onClick={handleLogout}>
                                        <Typography textAlign="center">Log Out</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </Paper>
        </>
    )
}
