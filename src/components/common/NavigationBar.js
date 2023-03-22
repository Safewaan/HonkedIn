import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"

import {
  Image,
  Box,
  Button,
  Circle,
  Menu,
  MenuButton,
  MenuGroup,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  Link
} from "@chakra-ui/react";

import {
  AddIcon,
  ChevronDownIcon,
  SettingsIcon
} from "@chakra-ui/icons";

import {
  HOME_PAGE,
  LOGIN_PAGE,
  EVENTS_PAGE,
  CREATE_EVENT_PAGE,
  MY_EVENTS_PAGE,
  CREATE_FORUM_PAGE,
  FORUMS_PAGE,
  MY_FORUMS_PAGE,
  MY_PROFILE_PAGE,
  USER_SETTINGS_PAGE,
  CREATE_RESOURCE_PAGE,
  RESOURCES_PAGE,
  NETWORK_PAGE,
  ABOUT_US_PAGE
} from "../constants/Routes";

import "../../styles/navbar-style.css";

import GOOSE_IMAGE from "../../images/Goose.png"

export default function NavigationBar() {

  const history = useHistory();

  function redirectToPage(page) {
    return async function () {
      history.push(page);
    }
  }

  const handleHome = redirectToPage(HOME_PAGE);
  const handleSettings = redirectToPage(USER_SETTINGS_PAGE);
  const handleEvents = redirectToPage(EVENTS_PAGE);
  const handleMyEvents = redirectToPage(MY_EVENTS_PAGE);
  const handleCreateEvent = redirectToPage(CREATE_EVENT_PAGE);
  const handleMyProfile = redirectToPage(MY_PROFILE_PAGE);
  const handleCreateForum = redirectToPage(CREATE_FORUM_PAGE);
  const handleForums = redirectToPage(FORUMS_PAGE);
  const handleMyForums = redirectToPage(MY_FORUMS_PAGE);
  const handleCreateResources = redirectToPage(CREATE_RESOURCE_PAGE);
  const handleResources = redirectToPage(RESOURCES_PAGE);
  const handleNetwork = redirectToPage(NETWORK_PAGE);
  const handleAboutUs = redirectToPage(ABOUT_US_PAGE);

  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth();

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push(LOGIN_PAGE)
    } catch {
      setError("Failed to log out")
    }
  }

  return (
    <Box
      bg="#023679"
      color={useColorModeValue('gray', 'gray.800')}
      h='56px'
      py={{ base: 2 }}
      px={{ base: 4 }}
      borderBottom={1}
      display='flex'
      justifyContent='center'
      alignItems='center'
      position='fixed'
      top='0'
      left='0'
      width='100%'
      zIndex={2}
    >
      <Box
        mx="auto"
        my={2}
        w="1256px"
        display='flex'
        

      >
        <Image
          src={GOOSE_IMAGE}
          boxSize='40px'
          onClick={handleHome} />
        <Link
          className='navbar-title'
          onClick={handleHome}
          _hover={{ textDecoration: 'none' }}
        >
          HonkedIn
        </Link>

        <Button variant='ghost' className="navbar-text" marginLeft="32px" onClick={handleAboutUs}>
          About Us
        </Button>

        <Button variant='ghost' className="navbar-text" marginLeft="8px" onClick={handleNetwork}>
          Network
        </Button>

        <Menu>
          <MenuButton as={Button} variant='ghost' className="navbar-text" marginLeft="8px" _expanded={{ bg: '#214E89' }}>
            Events <ChevronDownIcon style={{ position: 'relative', top: '-1px' }} />
          </MenuButton>
          <MenuList>
            <MenuGroup >
              <MenuItem className="navbar-dropdown-text" onClick={handleEvents}>All Events</MenuItem>
              <MenuItem className="navbar-dropdown-text" onClick={handleMyEvents}>My Events</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup>
              <MenuItem
                className="navbar-dropdown-text"
                onClick={handleCreateEvent}
              >
                <AddIcon marginRight="8px" boxSize="10px" style={{ position: 'relative', top: '1.25px' }} /> Create Event
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton as={Button} variant='ghost' className="navbar-text" marginLeft="8px" _expanded={{ bg: '#214E89' }}>
            Forums <ChevronDownIcon style={{ position: 'relative', top: '-1px' }} />
          </MenuButton>
          <MenuList className="navbar-list">
            <MenuGroup>
              <MenuItem className="navbar-dropdown-text" onClick={handleForums} >All Forums</MenuItem>
              <MenuItem className="navbar-dropdown-text" onClick={handleMyForums}>My Forums</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup>
              <MenuItem
                className="navbar-dropdown-text"
                onClick={handleCreateForum}
              >
                <AddIcon marginRight="8px" boxSize="10px" style={{ position: 'relative', top: '1.25px' }} /> Create Forum
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton as={Button} variant='ghost' className="navbar-text" marginLeft="8px" _expanded={{ bg: '#214E89' }}>
            Resources <ChevronDownIcon style={{ position: 'relative', top: '-1px' }} />
          </MenuButton>
          <MenuList>
            <MenuGroup>
              <MenuItem className="navbar-dropdown-text" onClick={handleResources}>All Resources</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup>
              <MenuItem
                className="navbar-dropdown-text"
                onClick={handleCreateResources}
              >
                <AddIcon marginRight="8px" boxSize="10px" style={{ position: 'relative', top: '1.25px' }} /> Create Resource
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>

        <Stack
          flex={{ base: 1, md: "auto" }}
          justify='flex-end'
          direction='row'
          spacing={6}
          alignItems="center"
        >
          <Menu>
            <MenuButton as={Circle} size='32px' bg="#164684" color="#FFFFFF">
              <Box display="flex" justifyContent="center">
                <SettingsIcon />
              </Box>
            </MenuButton>
            <MenuList>
              <MenuGroup>
                <MenuItem className="navbar-dropdown-text" onClick={handleMyProfile}>Profile</MenuItem>
                <MenuItem className="navbar-dropdown-text" onClick={handleSettings}>Settings</MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup>
                <MenuItem className="navbar-dropdown-text" onClick={handleLogout}>Logout</MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </Stack>
      </Box>
    </Box>
  );
};