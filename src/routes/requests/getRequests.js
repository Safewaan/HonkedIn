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

    let sql =
        `SELECT r.request_id, concat(u1.firstName," ", u1.lastName) AS sender_name, concat(u2.firstName," ", u2.lastName) AS receiver_name, r.body
    FROM requests r
    INNER JOIN users u1 ON r.sender_id = u1.id
    INNER JOIN users u2 ON r.receiver_id = u2.id`
    let data = [];

    if (req.query.senderID) {
        sql += " WHERE sender_ID = ?";
        data = [req.query.senderID];
    }

    if (req.query.receiverID) {
        if (sql.includes("WHERE sender_ID = ?")) {
            sql += " AND"
            data = [req.query.senderID, req.query.receiverID];
        } else {
            sql += " WHERE"
            data = [req.query.receiverID];
        }
        
        sql += " receiver_ID = ?";
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
        console.log({ express: string });
    });
    connection.end();

});

module.exports = router;