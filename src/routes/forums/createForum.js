const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

// Creates a forum by inserting values into the DB
router.post('/api/createForum', (req, res) => {

    let connection = mysql.createConnection(config);

    let sql = "INSERT INTO shchowdh.forums (forumTitle, description, creatorID, forumTag) VALUES (?, ?, ?, ?)";
    //console.log(sql);
    let data = [req.body.forumTitle, req.body.forumDesc, req.body.creatorID, req.body.forumTag];
    //console.log(data);

    connection.query(sql, data, (error, results, fields) => {

        if (error) {
            res.status(400).send(error.message);
            return console.error(error.message);
        }

        res.send({ express: results });
    });

    connection.end();

})

module.exports = router;