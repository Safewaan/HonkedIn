const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

// get 5 upcoming events the user has RSVPed to
router.post('/api/getMyEvents', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql =
    `Select firstName, lastName, 
	events.id, events.name, events.description, events.location, events.date, events.participants, events.totalParticipants, events.status
	FROM shchowdh.users, shchowdh.events,shchowdh.eventParticipants
    WHERE events.id = eventParticipants.eventID
    AND users.id = eventParticipants.participantID
    AND users.id = ?
    AND events.date > now()
    AND events.status = "Active"
	ORDER BY events.date
    LIMIT 5;`;
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