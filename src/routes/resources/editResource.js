const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

//this edits an existing resource's information given the resource ID
router.put('/api/editResource', (req, res) => {

	let connection = mysql.createConnection(config);

	let sql = "UPDATE resources SET resourcesTitle = ?, resourcesLink = ?, mediaTag = ? WHERE id = ?;";
	//console.log(sql);
	let data = [req.body.resourceTitle, req.body.resourceLink, req.body.mediaTag, req.body.resourceID];
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