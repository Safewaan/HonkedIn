import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Image,
  Button,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

// import {
//   HOME_PAGE,
//   RESIDENT_DIRECTORY_PAGE,
//   EMPLOYEE_DIRECTORY_PAGE
// } from "../../constants/Routes";

import "../../styles/index.css";

import Goose from "../../images/Goose.png"

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
    >
      <Box
        mx="auto"
        my={2}
        w="1720px"
        h="65px"
        display='flex'

      >
        <Image src={Goose}
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

          <NavButton
            onClick={handleOpenUserMenuEvents}
            text="Network"
          >
          </NavButton>

          <NavButton
            onClick={handleOpenUserMenuEvents}
            text="Events"
          >
          </NavButton>

          <NavButton
            onClick={handleOpenUserMenuEvents}
            text="Forums"
          >
          </NavButton>

          <NavButton
            onClick={handleOpenUserMenuEvents}
            text="Resources"
          >
          </NavButton>

          <NavButton
            onClick={handleOpenUserMenuEvents}
            text="Settings"
          >
          </NavButton>

        </Stack>
      </Box>
    </Box>
  );
};

function NavButton(props) {
  return (
    <Button
      variant='link'
      className='navbar-text'
      onClick={props.onClick}
    >
      {props.text}
    </Button>
  );
}

