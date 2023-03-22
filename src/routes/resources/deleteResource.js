const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

//this deletes an existing resource given the resource ID
router.delete('/api/deleteResource', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = "DELETE FROM resources where id = ?;";
	//console.log(sql);
	let data = [req.body.resourceID];
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