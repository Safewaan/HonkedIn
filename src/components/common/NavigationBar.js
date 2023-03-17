import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"
import {
  Image,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuGroup,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  Text,
} from "@chakra-ui/react";

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
  CREATE_RESOURCE_PAGE,
  RESOURCES_PAGE,
  NETWORK_PAGE,
} from "../constants/Routes";

import "../../styles/navbar-style.css";

import GOOSE_IMAGE from "../../images/Goose.png"

export default function NavigationBar() {

  const history = useHistory()

  function redirectToPage(page) {
    return async function () {
      history.push(page);
    }
  }

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
      bg="#CAE7B9"
      color={useColorModeValue('gray', 'gray.800')}
      h='97px'
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
      zIndex={1}
    >
      <Box
        mx="auto"
        my={2}
        w="1720px"
        h="65px"
        display='flex'

      >
        <Image src={GOOSE_IMAGE}
          boxSize='80px' />
        <Text
          className='navbar-title'
        >
          HonkedIn
        </Text>

        <Stack
          flex={{ base: 1, md: "auto" }}
          justify='flex-end'
          direction='row'
          spacing={6}
          alignItems="center"
        >
          <Menu>
            <MenuButton as={Button} variant='ghost' className="navbar-text">
              Events
            </MenuButton>
            <MenuList>
              <MenuGroup title='Events'>
                <MenuItem onClick={handleCreateEvent}>Create an Event</MenuItem>
                <MenuItem onClick={handleEvents}>View Events</MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title="My Events">
                <MenuItem onClick={handleMyEvents}>View My Events</MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} variant='ghost' className="navbar-text">
              Forums
            </MenuButton>
            <MenuList>
              <MenuGroup title='Forums'>
                <MenuItem onClick={handleCreateForum}>Create a Forum</MenuItem>
                <MenuItem onClick={handleForums}>View Forums</MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title="My Forums">
                <MenuItem onClick={handleMyForums}>View My Forums</MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} variant='ghost' className="navbar-text">
              Resources
            </MenuButton>
            <MenuList>
              <MenuGroup title='Resources'>
                <MenuItem onClick={handleCreateResources}>Create a Resource</MenuItem>
                <MenuItem onClick={handleResources}>View Resources </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} variant='ghost' className="navbar-text">
              Settings
            </MenuButton>
            <MenuList>
              <MenuGroup title='Profile'>
                <MenuItem onClick={handleMyProfile}>My Profile</MenuItem>
                <MenuItem onClick={handleSettings}>Settings </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>

        </Stack>
      </Box>
    </Box>
  );
};

