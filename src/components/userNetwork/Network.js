import React from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { Card } from "react-bootstrap"

import {
  Avatar,
  Badge,
  Box,
  Center,
  Flex,
  Text,
} from "@chakra-ui/react";

import NavigationBar from '../common/NavigationBar';
import Search from '../common/Search';
import DropdownFilter from "../common/filters/DropdownFilter";
import InputFilter from "../common/filters/InputFilter";
import ClearFilters from "../common/filters/ClearFilters";

const { REACT_APP_API_ENDPOINT } = process.env;

const Network = () => {

  // Store the user's history and currentUser
  const { currentUser } = useAuth()

  // API: Get the user's fullname for the title. 
  //Get the user's email and then get their full name
  const [email, setEmail] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [userID, setUserID] = React.useState('');

  // Get the current user's email. 
  React.useEffect(() => {

    setEmail(currentUser.email);
    handleUserSearchByEmail(currentUser.email);
  }, []);

  // Obtain the user ID, firstName and lastName from the query
  const handleUserSearchByEmail = (email) => {
    callApiGetUserSearchByEmail(email)
      .then(res => {
        var parsed = JSON.parse(res.express);
        //console.log(parsed[0].id);
        setUserID(parsed[0].id);
        setFirstName(parsed[0].firstName)
        setLastName(parsed[0].lastName)
      });
  }

  // Call the API to query with the user's email obtained from Firebase
  const callApiGetUserSearchByEmail = async (email) => {
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

  const [profiles, setProfiles] = React.useState([]);
  const [userSearchTerm, setUserSearchTerm] = React.useState('');
  const handleUserSearch = (event) => {
    setUserSearchTerm(event.target.value);
  }

  const [refreshSearch, setRefreshSearch] = React.useState(1);

  React.useEffect(() => {
    handleFindUser();
  }, [refreshSearch]);

  const handleFindUser = () => {
    callApiGetUsers(userSearchTerm)
      .then(res => {
        var parsed = JSON.parse(res.express);
        setProfiles(parsed);
      });
  }

  // Filters
  const [yearSemester, setYearSemester] = React.useState('');
  const handleYearSemester = (event) => {
    setYearSemester(event.target.value);
  }
  const yearList = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "Masters", "PHD", "Professor"];

  const [program, setProgram] = React.useState('');
  const handleProgram = (event) => {
    setProgram(event.target.value);
  }


  const callApiGetUsers = async (userSearchTerm) => {

    const url = `${REACT_APP_API_ENDPOINT}/getUsers?userSearchTerm=${userSearchTerm}`;
    //debug statement
    console.log(url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  const handleRefreshSearch = async () => {
    setUserSearchTerm("");
    setRefreshSearch(refreshSearch + 1);
  }

  const handleRefreshFilter = async () => {
    setYearSemester("");
    setProgram("");
  }


  return (
    <div id="body">

      <NavigationBar></NavigationBar>

      <Box sx={{ position: 'absolute', top: 110, left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Text
          className="title"
        >
          Find New Connections
        </Text>
      </Box>

      <Box sx={{ width: '30%', position: 'absolute', top: 150, left: '50%', transform: 'translateX(-50%)', marginBottom: '20px' }}>
        <Search
          label="Search for users"
          searchTerm={userSearchTerm}
          onSetSearch={handleUserSearch}
          fullWidth
          onButtonClick={handleFindUser}
          onResetSearch={handleRefreshSearch}
        />

        <Text
          className="header"
        >
          Filters
        </Text>
        <DropdownFilter
          placeholder="Select a Year and Semester"
          value={yearSemester}
          onChange={handleYearSemester}
          lists={yearList}
        />
        <InputFilter
          placeholder="Filter by Program Name"
          value={program}
          onChange={handleProgram}
        />
        <ClearFilters
          onClick={() => handleRefreshFilter()}
        />

      </Box>

      <Box sx={{ position: 'absolute', top: 420, left: '50%', transform: 'translateX(-50%)' }}>
        {profiles.map((profile) => {
          if (yearSemester && profile.yearSemester !== yearSemester) {
            return null;
          }
          if (program && !profile.program.toLowerCase().includes(program.toLowerCase())) {
            return null
          }
          return (
            <Card
              style={{
                padding: '16px',
                width: '500px',
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              key={profile.userID}>

              <Avatar
                size="xl"
                src={profile.pictureURL}
              />

              <Flex alignItems="center">
                <Flex flexDirection="column">

                  <Center>
                    {userID === profile.userID ? (
                      <Link to="/my-profile" target="_blank">
                        <Text className="headerBig to-text">{profile.userName}</Text>
                      </Link>
                    ) : (
                      <Link to={`/network-profile/${profile.userID}`} target="_blank">
                        <Text className="headerBig to-text">{profile.userName}</Text>
                      </Link>
                    )}
                  </Center>

                  <Center>
                    <Badge
                      className="body"
                      backgroundColor="#023679"
                      color="#FFFFFF"
                      marginTop="4px"
                    >
                      {profile.program}
                    </Badge>
                  </Center>

                  <Center>
                    <Badge
                      className="body"
                      backgroundColor="#023679"
                      color="#FFFFFF"
                      marginTop="4px"
                    >
                      {profile.yearSemester}
                    </Badge>
                  </Center>
                </Flex>
              </Flex>
            </Card>
          );
        })}
      </Box>
    </div>
  )
}

export default Network; 