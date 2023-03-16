import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import NavigationBar from '../common/NavigationBar';
import Box from "@material-ui/core/Box";
import Search from '../common/Search';
import SubmitButton from '../common/SubmitButton';


const { REACT_APP_API_ENDPOINT } = process.env;

const Network = () => {

  const [profiles, setProfiles] = React.useState([]);
  const [userSearchTerm, setUserSearchTerm] = React.useState('');
  const handleUserSearch = (event) => {
    setUserSearchTerm(event.target.value);
  }

  React.useEffect(() => {
    handleFindUser();
  }, []);

  const handleFindUser = () => {
    console.log("The user name being searched is: " + userSearchTerm);
    callApiGetUsers(userSearchTerm)
      .then(res => {
        console.log("callApiGetUsers returned: ", res)
        var parsed = JSON.parse(res.express);
        console.log("callApiGetUsers parsed: ", parsed[0])
        setProfiles(parsed);
      });
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
          handlerFindUser={handleFindUser}
        />
      </Box>
        <br/>
        <br/>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '30%', position: 'absolute', top: 210, left: '50%', transform: 'translateX(-50%)', marginBottom: '20px' }}>
        <SubmitButton
          label={"SEARCH"}
          onButtonClick={handleFindUser}
          position='absolute'
        />

      </Box>


      <Box sx={{ position: 'absolute', top: 260, left: '50%', transform: 'translateX(-50%)' }}>
        {profiles.map((profile) => (
          <Card style={{ width: '600px', marginTop: '20px' }} key={profile.id}>
            <CardContent>
            <Link to={`/network-profile/${profile.id}`} target="_blank">
              <Typography variant="h5" component="div">
                {profile.firstName} {profile.lastName}
              </Typography>
              </Link>
            </CardContent>
            <br />
          </Card>
        ))}
      </Box>

    </div>
  )
}

export default Network; 