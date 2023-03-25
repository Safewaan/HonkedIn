const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

// gets requests 
// returns requests sent by user if senderID is given
// returns requests received from other users if receiverID is given
// returns all requests otherwise
router.get('/api/getRequests', (req, res) => {

    let connection = mysql.createConnection(config);

    let sql = `SELECT * FROM requests`
    let data = [];

    if (req.query.senderID) {
        sql += " WHERE sender_ID = ?";
        data = [req.query.senderID];
    }

    if (req.query.receiverID) {
        sql += " WHERE receiver_ID = ?";
        data = [req.query.receiverID];
    }

    // Debug logs
    console.log(sql);
    console.log(data);
    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            res.status(400).send(error.message);
            return console.error(error.message);
        }
        let string = JSON.stringify(results);
        res.send({ express: string });
    });
    connection.end();

});

module.exports = router;