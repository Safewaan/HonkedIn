const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../config.js');

//retrieves list of all participant names for all events
router.post('/api/getParticipants', (req, res) => {

    let connection = mysql.createConnection(config);

    let sql =
        `SELECT events.id, CONCAT(users.firstName, " ", users.lastName) AS participantName
    FROM eventParticipants, events, users
    WHERE participantID = users.id
    AND eventID = events.id 
    AND events.id = ?;`
    
    //ORDER BY events.id;
    //console.log("eventID getting to API is: " + req.body.eventID);

    let data = [req.body.eventID]; 
    //console.log(sql);
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