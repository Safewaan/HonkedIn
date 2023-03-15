const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

//this edits an exising forum's information given the forum ID
router.put('/api/editForumComment', (req, res) => {

	let connection = mysql.createConnection(config);
	let sql = `UPDATE forumComments SET 
    comment = ?, commentDateTime = now() 
    WHERE id = ?`;
	//console.log(sql);
	let data = [req.body.comment, req.body.id];
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