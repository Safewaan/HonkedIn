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

app.get('/api/userEmailSearch', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = "SELECT * FROM users WHERE email = ?";
	let data = [req.body.email];

	connection.query(sql, data, (error, results, fields) => {

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

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
//app.listen(port, '172.31.31.77'); //for the deployed version, specify the IP address of the server
