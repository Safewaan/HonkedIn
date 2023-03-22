const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

//gets all forum info from forums table
router.get('/api/getForums', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = 
	`SELECT CONCAT(firstName, " ", lastName) as creatorName, 
	forumTitle, forums.description, forums.dateTime, forums.id, forums.status, forums.forumTag
	FROM forums, users
	WHERE forums.creatorID = users.id
    AND (forumTitle like ? OR forums.description like ? OR CONCAT(firstName, " ", lastName) like ?)`; 
	let searchTerm = req.query.searchTerm; 
	let data =["%" + searchTerm + "%","%" + searchTerm + "%", "%" + searchTerm + "%"]
	
	//console.log(sql);

	connection.query(sql, data,(error, results, fields) => {
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