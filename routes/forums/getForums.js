const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../config.js');

//gets all forum info from forums table
router.get('/api/getForums', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = 
	`SELECT CONCAT(firstName, " ", lastName) AS creatorName, forumTitle, forums.description, forums.dateTime
    FROM forums, users
    WHERE creatorID = users.id;`; 
	
	//console.log(sql);

	connection.query(sql, (error, results, fields) => {
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