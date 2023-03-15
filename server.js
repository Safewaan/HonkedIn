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

const routesDir = './src/routes/';

// User APIs
const createUser = require(`${routesDir}user/createUser`);
const userSearchByEmail = require(`${routesDir}user/userSearchByEmail`);
const activateUser = require(`${routesDir}user/activateUser`);
const archiveUser = require(`${routesDir}user/archiveUser`);

app.use(createUser);
app.use(userSearchByEmail);
app.use(activateUser);
app.use(archiveUser);

// Event APIs
const createEvent = require(`${routesDir}events/createEvent`);
const getEvents = require(`${routesDir}events/getEvents`);
const getEventsByUser = require (`${routesDir}events/getEventsByUser`);
const joinEvent = require(`${routesDir}events/joinEvent`);
const editEvent = require(`${routesDir}events/editEvent`);
const cancelEvent = require(`${routesDir}events/cancelEvent`);

app.use(createEvent);
app.use(getEvents);
app.use(getEventsByUser);
app.use(joinEvent);
app.use(editEvent);
app.use(cancelEvent);

// Event Participants APIs
const getParticipants = require(`${routesDir}participants/getParticipants`);

app.use(getParticipants);

//Profile APIs
const createUserProfile = require(`${routesDir}userProfile/createUserProfile`);
const getUserProfile = require(`${routesDir}userProfile/getUserProfile`);
const editUserProfile = require(`${routesDir}userProfile/editUserProfile`);

app.use(createUserProfile);
app.use(getUserProfile);
app.use(editUserProfile);

// Forum APIs
const createForum = require(`${routesDir}forums/createForum`);
const getForums = require(`${routesDir}forums/getForums`);
const getForumsByUserID = require(`${routesDir}forums/getForumsByUserID`); 
const editForum = require(`${routesDir}forums/editForum`);
const getForumsByForumID = require(`${routesDir}forums/getForumsByForumID`);
const archiveForum = require(`${routesDir}forums/archiveForum`)

app.use(createForum);
app.use(getForums);
app.use(getForumsByUserID);
app.use(editForum); 
app.use(getForumsByForumID);
app.use(archiveForum);

// Forum Comments APIs
const createForumComment = require(`${routesDir}forumComments/createForumComment`);
const getForumCommentsByForumID = require(`${routesDir}forumComments/getForumCommentsByForumID`);
const deleteForumComment = require(`${routesDir}forumComments/deleteForumComment`);

app.use(createForumComment);
app.use(getForumCommentsByForumID);
app.use(deleteForumComment);

//User Network APIs
const getUsers = require(`${routesDir}user/getUsers`);

app.use(getUsers); 

// Resources APIs
const createResource = require(`${routesDir}resources/createResource`);
const getResources = require(`${routesDir}resources/getResources`);

app.use(createResource);
app.use(getResources);

// Dashboard APIs
const getRecentEvents= require(`${routesDir}dashboard/getRecentEvents`);

app.use(getRecentEvents);

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
//app.listen(port, '172.31.31.77'); //for the deployed version, specify the IP address of the server