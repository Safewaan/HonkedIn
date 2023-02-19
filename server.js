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

app.post('/api/createUser', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = "INSERT INTO shchowdh.users (firstName, lastName, email) VALUES (?, ?, ?)";
	let data = [req.body.firstName, req.body.lastName, req.body.email];

	connection.query(sql, data, (error, results, fields) => {

		if (!req.body.firstName) {
			res.status(400).send("First name cannot be null.");
			return console.error("First name cannot be null.");
		};

		if (!req.body.lastName) {
			res.status(400).send("Last name cannot be null.");
			return console.error("Last name cannot be null.");
		};


		if (!req.body.email) {
			res.status(400).send("Email cannot be null.");
			return console.error("Email cannot be null.");
		};


		if (error) {
			res.status(400).send(error.message);
			return console.error(error.message);
		}

		res.send({ express: results });
	});

	connection.end();
});

app.post('/api/createEvent', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = "INSERT INTO shchowdh.events (name, description, location, date, creatorID, totalParticipants) VALUES (?, ?, ?, ?, ?, ?)";
	console.log(sql);
	let data = [req.body.eventName, req.body.eventDesc, req.body.eventLocation, req.body.eventDate, req.body.userID, req.body.eventParticipants];
	console.log(data);

	connection.query(sql, data, (error, results, fields) => {

		if (error) {
			res.status(400).send(error.message);
			return console.error(error.message);
		}

		res.send({ express: results });
	});

	connection.end();

})

app.get('/api/getEvents', (req, res) => {

	let connection = mysql.createConnection(config);
	//will prob need to edit sql statement to account for search features later
	//may need to modify later so that won't load them all as an array 
	//need to make more efficient 
	let sql = 
	`SELECT firstName, lastName, 
	events.id, events.name, events.description, events.location, events.date, events.participants, events.totalParticipants, events.status
	FROM shchowdh.users, shchowdh.events
	WHERE events.creatorID = users.id
	ORDER BY date`; 
	
	//console.log(sql);

	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		let string = JSON.stringify(results);
		//let obj = JSON.parse(string);
		res.send({ express: string });

	});
	connection.end();
});

app.post('/api/joinEvent', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql1 = "SELECT id, participants, totalParticipants FROM events WHERE id = ?";
	let data1 = [req.body.eventID];

	let sql2 = "SELECT * FROM eventParticipants WHERE eventID = ? AND participantID = ?";
	let data2 = [req.body.eventID, req.body.participantID];

	let sql3 = "INSERT INTO eventParticipants (`eventID`, `participantID`) VALUES (?, ?)"
	let data3 = data2; // can use the same data as before

	let sql4 = "UPDATE events SET participants = participants + 1 WHERE id = ?"
	let data4 = data1; // can use the same data as before

	// Execute all the queries in sequence
	connection.query(sql1, data1, (error, results, fields) => {
		if (error) {
			res.status(400).send(error.message);
			console.error(error.message);
			connection.end();
			return; // exit out of the function
		}

		// First, check if there's room to join the event
		if (results[0].participants === results[0].totalParticipants) {
			res.status(403).send({ message: "The event is full." });
			console.error("The event is full.");
			connection.end();
			return; // exit out of the function
		}

		connection.query(sql2, data2, (error, results, fields) => {
			if (error) {
				res.status(400).send(error.message);
				console.error(error.message);
				connection.end();
				return; // exit out of the function
			}

			// Next, check if the user has already joined the event
			if (results.length > 0) {
				res.status(403).send({ message: "The user has already joined the event."});
				console.error("The user has already joined the event.");
				connection.end();
				return; // exit out of the function
			}

			// Finally, allow the user to join the event
			connection.query(sql3, data3, (error, results, fields) => {
				if (error) {
					res.status(400).send(error.message);
					console.error(error.message);
					connection.end();
					return; // exit out of the function
				}

				// Increment the event's participants by 1
				connection.query(sql4, data4, (error, results, fields) => {
					if (error) {
						res.status(400).send(error.message);
						console.error(error.message);
						connection.end();
						return; // exit out of the function
					}

					// All queries have completed successfully
					res.send({ message: "The user joined the event successfully." });
					connection.end();
				});
			});
		});
	});
});

app.post('/api/userEmailSearch', (req, res) => {


	let connection = mysql.createConnection(config);

	let sql = "SELECT * FROM users WHERE email = ?";
	let data = [req.body.email];

	// Debug logs
	// console.log(sql);
	// console.log(data);

	connection.query(sql, data, (error, results, fields) => {

		if (!req.body.email) {
			res.status(400).send("Email cannot be null.");
			return console.error("Email cannot be null.");
		};

		if (error) {
			res.status(400).send(error.message);
			return console.error(error.message);
		}

		let string = JSON.stringify(results);

		res.send({ express: string });

	});

	connection.end();
});

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
//app.listen(port, '172.31.31.77'); //for the deployed version, specify the IP address of the server
