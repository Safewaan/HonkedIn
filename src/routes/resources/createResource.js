const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('../../../config.js');

// Creates a resource by inserting values into the DB
router.post('/api/createResource', (req, res) => {

    let connection = mysql.createConnection(config);

    let sql = "INSERT INTO shchowdh.resources (creatorID, resourcesTitle, resourcesLink) VALUES (?, ?, ?)";
    //console.log(sql);
    let data = [req.body.creatorID, req.body.resourcesTitle, req.body.resourcesLink];
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