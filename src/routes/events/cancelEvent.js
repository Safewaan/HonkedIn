const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

router.post('/api/cancelEvent', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = `UPDATE events SET STATUS = "Cancelled" WHERE id = ?`;
	let data = [req.body.eventID];

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