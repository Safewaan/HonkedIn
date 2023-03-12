const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

router.post('/api/getUserByEmail', (req, res) => {
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

module.exports = router;