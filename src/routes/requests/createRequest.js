const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

router.post('/api/createRequest', (req, res) => {
    let connection = mysql.createConnection(config);

    let sql = "INSERT INTO shchowdh.requests (sender_id, receiver_id, body) VALUES (?, ?, ?)";
    let data = [req.body.senderID, req.body.receiverID, req.body.body];

    // console.log(sql);
    // console.log(data);

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