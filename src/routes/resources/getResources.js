const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

//gets all resource info from resources table
router.get('/api/getResources', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = 
	`SELECT CONCAT(firstName, " ", lastName) AS creatorName, resources.resourcesTitle, resources.resourcesLink, resources.dateTime, resources.mediaTag
    FROM resources, users
    WHERE creatorID = users.id
	AND (resourcesTitle like ? OR CONCAT(firstName, " ", lastName) like ?)`;
	let searchTerm = req.query.searchTerm
	let data = ["%" + searchTerm + "%", "%" + searchTerm + "%"]
	
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