const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

// Loads the existing comments for a forum
router.post('/api/getForumCommentsByForumID', (req, res) => {

    let connection = mysql.createConnection(config);

    let sql = 
    `SELECT forumComments.id, forumComments.forumID, forumComments.userID, forumComments.commentDateTime, forumComments.editedCommentDateTime, forumComments.comment, users.firstName, users.lastName
    FROM shchowdh.forumComments
    LEFT JOIN users ON forumComments.userID = users.id
    WHERE forumID = ?;`;
    // console.log(sql);
    let data = [req.body.forumID];
    // console.log(data);

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