const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

//gets the selected forum onto the new rendered page
router.post('/api/getForumsByForumID', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = 
	`SELECT CONCAT(firstName, " ", lastName) AS creatorName, forumTitle, forums.description, forums.dateTime, forums.id, forums.status
    FROM forums, users
    WHERE creatorID = users.id
    AND forums.id = ?;`; 
	
    let data = [req.body.forumID];
	//console.log(sql);

	connection.query(sql, data, (error, results, fields) => {

        if (!req.body.forumID) {
			res.status(400).send("ForumID cannot be null.");
			return console.error("ForumID cannot be null.");
		};
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