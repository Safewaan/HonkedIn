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

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });  

app.post('/api/createUser', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = "INSERT INTO shchowdh.users (firstName, lastName, email) VALUES (?, ?, ?)";
	let data = [req.body.firstName, req.body.lastName, req.body.email];

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		res.send({ express: results });
	});

	connection.end();
});

app.post('/api/createEvent', (req,res) => { 


	let connection = mysql.createConnection(config);
	let sql = "INSERT INTO shchowdh.events (name, description, location, date, creatorID) VALUES (?, ?, ?, ?, ?)";
	console.log(sql);
	let data = [req.body.eventName, req.body.eventDesc, req.body.eventLocation, req.body.eventDate, req.body.userID];
	console.log(data);

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		res.send({ express: results });
	});

	connection.end();

})

app.post('/api/getEvents', (req, res) => {

	let connection = mysql.createConnection(config);
	//will prob need to edit sql statement to account for search features later
	//may need to modify later so that won't load them all as an array 
	//need to make more efficient 
	let sql = `SELECT * FROM shchowdh.events`; 
	console.log(sql);

	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		let string = JSON.stringify(results);
		let obj = JSON.parse(string);
		res.send({ express: string });

	});
	connection.end();
});

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
//app.listen(port, '172.31.31.77'); //for the deployed version, specify the IP address of the server
