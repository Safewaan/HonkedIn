const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

// gets the top 5 recent events based on dates
router.get('/api/getRecentEvents', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql =
		`SELECT events.name, events.description, events.location, events.date
	FROM shchowdh.events
	ORDER BY date desc
    LIMIT 5`;
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