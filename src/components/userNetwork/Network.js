import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import NavigationBar from '../common/NavigationBar';
import Box from "@material-ui/core/Box";
import Search from '../common/Search';
import { Select, Input } from '@chakra-ui/react'
import DropdownFilter from "../common/filters/DropdownFilter";
import InputFilter from "../common/filters/InputFilter";
import ClearFilters from "../common/filters/ClearFilters";

const { REACT_APP_API_ENDPOINT } = process.env;

const Network = () => {

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
    //console.log("The user name being searched is: " + userSearchTerm);
    callApiGetUsers(userSearchTerm)
      .then(res => {
        //console.log("callApiGetUsers returned: ", res)
        var parsed = JSON.parse(res.express);
        //console.log("callApiGetUsers parsed: ", parsed[0])
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
      //method: "POST",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
      /*, body: { 
        userSearchTerm: userSearchTerm
      }*/
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
        <Typography
          variant="h4"
          gutterBottom
          component="div">
          Find New Connections
        </Typography>
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
        <br />

        <Typography
          style={{ color: "black", mb: 2, fontSize: 14, align: 'right' }}
        >
          Filters
        </Typography>
        <DropdownFilter
          placeholder="Select a Year and Semester"
          value={yearSemester}
          onChange={handleYearSemester}
          lists={yearList}
        />
        <br />
        <InputFilter
          placeholder="Filter by Program Name"
          value={program}
          onChange={handleProgram}
        />
        <ClearFilters
          onClick={() => handleRefreshFilter()}
        />

      </Box>
      <br />
      <br />


      <Box sx={{ position: 'absolute', top: 400, left: '50%', transform: 'translateX(-50%)' }}>
        {profiles.map((profile) => {
          if (yearSemester && profile.yearSemester !== yearSemester) {
            return null;
          }
          if (program && !profile.program.toLowerCase().includes(program.toLowerCase())) {
            return null
          }
          return (
            <Card style={{ width: '600px', marginTop: '20px' }} key={profile.id}>
              <CardContent>
                <Link to={`/network-profile/${profile.userID}`} target="_blank">
                  <Typography variant="h5" component="div">
                    {profile.userName}
                  </Typography>
                </Link>
                <Chip
                  key={profile.userID}
                  label={profile.yearSemester}
                  color="primary"
                  size="small"
                  style={{ marginRight: 8 }}
                />

                <Chip
                  key={profile.id}
                  label={profile.program}
                  color="grey"
                  size="small"
                  style={{ marginRight: 8 }}
                />
              </CardContent>
              <br />
            </Card>
          );
        })}
      </Box>


    </div>
  )
}

export default Network; 