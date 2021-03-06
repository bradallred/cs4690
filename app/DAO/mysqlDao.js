var express = require('express');
var mysql = require('mysql');

var router = express.Router();

var connection = mysql.createConnection({
    host: 'mysql',
    user: 'root',
    password: 'pass',
    database: 'siq'
});

connection.connect();

//REST API V1 calls go here.
router.get('/entries.json', function(req, res) {
    connection.query('select id, subject from entries', function(err, rows, fields){
        if(err) throw err;
        res.status(200).json(rows);
    });
});

// IDEMPOTENT - You can repeat the operation as many times as you want without changing state.
// Create
router.post('/entries.json', function(req, res){
    // Store new entry and return id.
    console.log(req.body);
    // {"subject":"Something else","contents":"This is the contents for 'Something else'"}
    var subject = connection.escape(req.body.subject);
    var contents = connection.escape(req.body.contents);
    console.log(`insert into entries(subject, contents) values (${subject}, ${contents})`);
    connection.query(`insert into entries(subject, contents) values (${subject}, ${contents})`, function(err, results){
        if(err) throw err;
        res.status(201).json(results.insertId);
    });
});

// Read
router.get('/entries/:id.json', function(req, res){
    var id = connection.escape(req.params.id);
    console.log(`select id, subject, contents from entries where id = ${id}`);
    connection.query(`select id, subject, contents from entries where id = ${id}`, function(err, row, fields){
        if(err) throw err;
        res.status(200).json(row[0]);
    });
});

// Update
router.put('/entries/:id.json', function(req, res){
    var id = connection.escape(req.params.id);
    var subject = connection.escape(req.body.subject);
    var contents = connection.escape(req.body.contents);

    connection.query(`update entries set subject = ${subject}, contents = ${contents} WHERE id = ${id}`, function(err, rows, fields){
        if(err) throw err;
        console.log(`update entries set subject = ${subject}, contents = ${contents} WHERE id = ${id}`);
    });
    console.log('Update called');
    res.sendStatus(204);
});

// Delete
router.delete('/entries/:id', function(req, res){
    var id = connection.escape(req.params.id);
    connection.query(`delete from entries where id = ${id}`, function(err, rows, fields){
        if(err) throw err;
    });
    console.log('Delete called');
    res.sendStatus(204);
});

module.exports = router;
// END API V1 METHODS

function gracefulShutdown(){
    console.log('\nStarting Shutdown');
    server.close(function(){
        connection.end();
        console.log('Shutdown complete.');
    });
}

process.on('SIGTERM', function(){
    gracefulShutdown();
});

process.on('SIGINT', function(){
    gracefulShutdown();
});
