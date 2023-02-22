const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../config.js');

/*
Purpose of API: This API will update the user's profile, and save their changes in the SQL database. 
*/

router.post('/api/editUserProfile', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = "UPDATE shchowdh.userProfiles SET aboutMe = ?, yearSemester = ?, program = ?, interest = ?, coop = ? WHERE `userID` = ?;";
	//console.log(sql);
	let data = [req.body.aboutMe, req.body.yearSemester, req.body.program, req.body.interest,req.body.coop, req.body.userID];
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