const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

//retrives all forum data created by the given user id
router.get('/api/getForumsByUserID', (req, res) => {

    let connection = mysql.createConnection(config);

    let sql =
        `SELECT CONCAT(firstName, " ", lastName) AS creatorName,
            forums.id, forumTitle, forums.description, forums.forumTag, dateTime, forums.status
            FROM users, forums
            WHERE forums.creatorID = users.id
            AND users.id = ?
            AND (forumTitle like ? OR forums.description like ?)
            ORDER BY dateTime`;
    let searchTerm = req.query.searchTerm;
    let data = [req.query.userID, "%" + searchTerm + "%","%" + searchTerm + "%"];

     //console.log(sql);
     //console.log(data);

    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }

        let string = JSON.stringify(results);
        //let obj = JSON.parse(string);
        res.send({ express: string });

    });
    connection.end();
});

module.exports = router;