const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

router.post('/api/editEvent', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = "UPDATE events SET name = ?, description =? , location = ?, date = ?, totalParticipants = ? WHERE id = ?;";
	console.log(sql);
	let data = [req.body.eventName, req.body.eventDesc, req.body.eventLocation, req.body.eventDate, req.body.eventParticipants, req.body.eventID];
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