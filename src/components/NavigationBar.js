import React, { useState } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
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

export default function NavigationBar() {

    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [anchorElUserEvents, setAnchorElUserEvents] = React.useState(null);
    const [anchorElUserForums, setAnchorElUserForums] = React.useState(null);

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

    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError("")

        try {
            await logout()
            history.push("/login")
        } catch {
            setError("Failed to log out")
        }
    }

    async function handleSettings() {
        history.push("/user-settings")
    }

    async function handleEvents() {
        history.push("/events")
    }

    async function handleCreateEvent() {
        history.push("/create-event")
    }

    async function handleCreateForum() {

        history.push("/create-forum")

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

                                    <MenuItem key="Create Forums" onClick={handleCreateForum}>
                                        <Typography textAlign="center">Create Forums</Typography>
                                    </MenuItem>

                                </Menu>
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



