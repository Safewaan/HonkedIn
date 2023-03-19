const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

// Loads the existing comments for a forum
router.get('/api/getForumCommentsByUserID', (req, res) => {

    let connection = mysql.createConnection(config);

    let sql = 
    `SELECT forumComments.id, forumComments.forumID, forumComments.userID, forumComments.commentDateTime, forumComments.comment, forums.forumTitle
    FROM shchowdh.forumComments
    LEFT JOIN forums ON forumComments.forumID = forums.id
    WHERE userID = ?
    ORDER BY forumComments.commentDateTime DESC;`;
    //console.log(sql);
    let data = [req.query.userID];
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