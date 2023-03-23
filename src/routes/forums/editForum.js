const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

//this edits an exising forum's information given the forum ID
router.post('/api/editForum', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = "UPDATE forums SET forumTitle = ?, description = ?, forumTag = ? WHERE id = ?;";
	//console.log(sql);
	let data = [req.body.forumTitle, req.body.forumDesc, req.body.forumTag, req.body.forumID];
	//console.log(data);

	connection.query(sql, data, (error, results, fields) => {

		if (error) {
			res.status(400).send(error.message);
			return console.error(error.message);
		}

		res.send({ express: results });
	});

	connection.end();

});

module.exports = router;