let mysql = require('mysql');
let config = require('./config.js');
const fetch = require('node-fetch');
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const { response } = require('express');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// User APIs
const createUser = require('./routes/user/createUser');
const userSearchByEmail = require('./routes/user/userSearchByEmail');
const activateUser = require('./routes/user/activateUser');
const archiveUser = require('./routes/user/archiveUser');

app.use(createUser);
app.use(userSearchByEmail);
app.use(activateUser);
app.use(archiveUser);

// Event APIs
const createEvent = require('./routes/events/createEvent');
const getEvents = require('./routes/events/getEvents');
const getEventsByUser = require ('./routes/events/getEventsByUser');
const joinEvent = require('./routes/events/joinEvent');
const editEvent = require('./routes/events/editEvent');
const cancelEvent = require('./routes/events/cancelEvent');
const getParticipants = require('./routes/events/getParticipants');

app.use(createEvent);
app.use(getEvents);
app.use(getEventsByUser);
app.use(joinEvent);
app.use(editEvent);
app.use(cancelEvent);
app.use(getParticipants);

//Profile APIs
const createUserProfile = require('./routes/profile/createUserProfile');
const getUserProfile = require('./routes/profile/getUserProfile');
const editUserProfile = require('./routes/profile/editUserProfile');

app.use(createUserProfile);
app.use(getUserProfile);
app.use(editUserProfile);

// Forum APIs
const createForum = require('./routes/forums/createForum');
const getForums = require('./routes/forums/getForums');
const getForumsByUser = require('./routes/forums/getForumsByUser'); 

app.use(createForum);
app.use(getForums);
app.use(getForumsByUser);

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
//app.listen(port, '172.31.31.77'); //for the deployed version, specify the IP address of the server
