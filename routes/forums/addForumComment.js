const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../config.js');

// Adds a comment on the selected Forum
router.post('/api/addForumComment', (req, res) => {

    let connection = mysql.createConnection(config);

    let sql = "INSERT INTO shchowdh.forumComments (forumID, userID, comment) VALUES (?, ?, ?)";
    //console.log(sql);
    let data = [req.body.forumID, req.body.userID, req.body.newComment];
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