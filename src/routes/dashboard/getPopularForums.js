const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

// gets the top 5 popular forums based on comments
router.get('/api/getPopularForums', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = `SELECT forums.id, forumTitle, description, dateTime, status, count(forumComments.forumID) as 'valueOccurrence'
    FROM shchowdh.forums, shchowdh.forumComments
    WHERE forums.id = forumComments.forumid
    AND forums.status = 'Active'
    GROUP BY forumComments.forumID
    ORDER BY valueOccurrence DESC
    LIMIT 3;`;
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