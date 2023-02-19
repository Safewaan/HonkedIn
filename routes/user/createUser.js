const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../config.js');

router.post('/createUser', (req, res) => {
    let connection = mysql.createConnection(config);

    let sql = "INSERT INTO shchowdh.users (firstName, lastName, email) VALUES (?, ?, ?)";
    let data = [req.body.firstName, req.body.lastName, req.body.email];

    connection.query(sql, data, (error, results, fields) => {
        if (!req.body.firstName) {
            res.status(400).send("First name cannot be null.");
            return console.error("First name cannot be null.");
        };

        if (!req.body.lastName) {
            res.status(400).send("Last name cannot be null.");
            return console.error("Last name cannot be null.");
        };


        if (!req.body.email) {
            res.status(400).send("Email cannot be null.");
            return console.error("Email cannot be null.");
        };


        if (error) {
            res.status(400).send(error.message);
            return console.error(error.message);
        }

        res.send({ express: results });
    });

    connection.end();
});

module.exports = router;