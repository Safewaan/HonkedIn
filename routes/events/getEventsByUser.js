const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../config.js');

router.post('/api/getEventsByUser', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql =
		`SELECT firstName, lastName, 
	events.id, events.name, events.description, events.location, events.date, events.participants, events.totalParticipants, events.status
	FROM shchowdh.users, shchowdh.events
	WHERE events.creatorID = users.id
	AND users.id = ?
	ORDER BY date`;
	let data = [req.body.userID];

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