const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

// Sets a user's status to "Archived".
router.post('/api/archiveUser', (req, res) => {
    let connection = mysql.createConnection(config);

    let sql = `UPDATE users SET status = "Archived" WHERE id = ?;`;
    let data = [req.body.userID];

    // console.log(sql);
    // console.log(data);

    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).send({ error: 'Error archiving user' });
            return;
        };

        res.send({ express: results });
    });

    connection.end();
});

module.exports = router;