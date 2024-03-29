const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

router.get('/api/getEventsByUser', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql =
		`SELECT CONCAT(firstName, " ", lastName) as creatorName, 
		events.id, events.name, events.description, events.location, events.date, events.participants, events.totalParticipants, events.status
		FROM shchowdh.users, shchowdh.events
		WHERE events.creatorID = users.id
		AND users.id = ?
		AND (events.name like ? OR events.description like ?)
		ORDER BY date`;
	let searchTerm = req.query.searchTerm; 
	let data = [req.query.userID, "%" + searchTerm + "%","%" + searchTerm + "%"];

	// console.log(sql);
	// console.log(data);

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}

		let string = JSON.stringify(results);
		//let obj = JSON.parse(string);
		res.send({ express: string });

	});
	connection.end();
});

module.exports = router;