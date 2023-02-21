const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../config.js');

router.get('/api/getUserProfile', (req, res) => {

	let connection = mysql.createConnection(config);
	let sql = "SELECT * FROM shchowdh.userProfiles WHERE userID = ? AND submissionDate IN (SELECT max(submissionDate) FROM shchowdh.userProfiles)"; 

    let data = [req.body.userID];
	console.log(data);
	
	//console.log(sql);

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