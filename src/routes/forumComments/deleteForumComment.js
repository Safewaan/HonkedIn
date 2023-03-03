const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

//Delete only your own comments
router.post('/api/deleteForumComment', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = "DELETE FROM `shchowdh`.`forumComments` WHERE id = ?;"; 
	
    let data = [req.body.commentID];
; 
   //console.log(sql);
   //console.log(data)

	connection.query(sql, data, (error, results, fields) => {

        if (!req.body.commentID) {
			res.status(400).send("CommentID cannot be null.");
			return console.error("CommentID cannot be null.");
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