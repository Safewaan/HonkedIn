const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

//gets list of all events according to search term
//if no search term, returns all events currently in the db
router.get('/api/getEvents', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = 
	`SELECT CONCAT(firstName, " ", lastName) as creatorName, 
	events.id, events.name, events.description, events.location, events.date, events.participants, events.totalParticipants, events.status
	FROM shchowdh.users, shchowdh.events
	WHERE events.creatorID = users.id
    AND (events.name like ? OR events.description like ? OR CONCAT(firstName, " ", lastName) like ?)
	ORDER BY date`; 
	let searchTerm = req.query.searchTerm; 
	let data = ["%" + searchTerm + "%","%" + searchTerm + "%", "%" + searchTerm + "%"];
	
	//console.log(sql);

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			res.status(400).send(error.message);
			return console.error(error.message);
		}

		let string = JSON.stringify(results);
		//let obj = JSON.parse(string);
		res.send({ express: string });

	});
	connection.end();
});

module.exports = router;