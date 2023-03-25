const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

//gets list of all users according to search term. If there is no search term
//returns all profiles currently in the db

//router.post('/api/getUsers', (req, res) => {
router.get('/api/getUsers', (req, res) => {

    let connection = mysql.createConnection(config);
    let sql = `SELECT userProfiles.userID, userProfiles.aboutMe, userProfiles.yearSemester, userProfiles.program, userProfiles.interest, userProfiles.coop, userProfiles.pictureURL, CONCAT(users.firstName, " ", users.lastName) as userName 
    FROM userProfiles
    JOIN users ON userProfiles.userID = users.id
    WHERE users.status = "Active" AND CONCAT(users.firstName, " ", users.lastName) LIKE ?`
    //let userSearchTerm = req.body.userSearchTerm;
    let userSearchTerm = req.query.userSearchTerm;
    let data = ["%" + userSearchTerm + "%"]; 

    // Debug logs
    // console.log(sql);
    // console.log(data);
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