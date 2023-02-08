const express = require('express');
const app = express();
const port = 3000;

var mariadb = require('mariadb');
var pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sample',
    port: 3306,
    connectionLimit: 5
});

app.get('/', (req, res) => {
    res.send("Hello! Testing the api here!");
});

app.get('/customers', (req, res) => {
    pool.getConnection()
        .then(conn => {
            conn.query("SELECT * FROM customer")
                .then((rows) => {
                    console.log(rows);
                    res.setHeader('Content-Type', 'Application/json');
                    res.send(rows);
                })
                .catch(err => {
                    //handle error
                    res.status(404);
                    console.log(err);
                    conn.end();
                })
        }).catch(err => {
            //not connected
            console.log("connection error with db", err);
        });
});

// get agents
app.get('/agents', function (req, res) {
    pool.query('SELECT * FROM agents')
        .then((rows) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'Application/json');
            res.send(rows);
        })
        .catch(err => console.error('error with the db query', err.stack));
});

app.listen(port, () => {
    console.log(`Server listening at http://YOUR_PORT_NUMBER:${port}`)
});
