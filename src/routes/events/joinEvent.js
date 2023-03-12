const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

// Creates an entry in the eventParticipants table. Users can join if and only if:
// 1. There's room to join the event
// 2. User has not joined the event
// 3. The event is not cancelled (handled on the front-end)
router.post('/api/joinEvent', (req, res) => {

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

module.exports = router;