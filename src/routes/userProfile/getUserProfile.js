const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

//Purpose of API: This API will retrieve the user's existing profile, if there is one and display it on their myProfile page.  
router.post('/api/getUserProfile', (req, res) => {

	let connection = mysql.createConnection(config);
	let sql = `SELECT userID, aboutMe, yearSemester, program, interest, coop, CONCAT(firstName, " ", lastName) as userName 
	FROM userProfiles, users WHERE userID = users.id AND userID = ?`; 

    let data = [req.body.selectedUserID];

	//console.log(data);
	//console.log(sql);

	connection.query(sql, data, (error, results, fields) => {

        if (!req.body.selectedUserID) {
			res.status(400).send("UserID cannot be null.");
			return console.error("UserID cannot be null.");
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