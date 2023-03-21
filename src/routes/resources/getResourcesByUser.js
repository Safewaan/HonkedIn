const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

router.get('/api/getResourcesByUser', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql =
		`SELECT CONCAT(firstName, " ", lastName) AS creatorName, resources.resourcesTitle, resources.resourcesLink, resources.dateTime
        FROM resources, users
        WHERE creatorID = users.id
        AND creatorID = ? 
        AND (resourcesTitle like ?)`;
	let searchTerm = req.query.searchTerm; 
	let data = [req.query.userID, "%" + searchTerm + "%"];

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