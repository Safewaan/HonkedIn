const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../config.js');

// Sets a user's status to "Active"
router.post('/activateUser', (req, res) => {
    let connection = mysql.createConnection(config);

    let sql = `UPDATE users SET status = "Active" WHERE id = ?;`;
    let data = [req.userID];

    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).send({ error: 'Error activating user' });
            return;
        };

        res.send({ express: results });
    });

    connection.end();
});

module.exports = router;