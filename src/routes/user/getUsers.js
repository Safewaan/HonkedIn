const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

//gets list of all users according to search term. If there is no search term
//returns all profiles currently in the db

//router.post('/api/getUsers', (req, res) => {
router.get('/api/getUsers', (req, res) => {

    let connection = mysql.createConnection(config);
    let sql = `SELECT * FROM users WHERE status = "Active" AND CONCAT(firstName, " ", lastName) like ?`
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