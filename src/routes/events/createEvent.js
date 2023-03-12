const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

// Creates an event in the events table. 
router.post('/api/createEvent', (req, res) => {

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

});

module.exports = router;