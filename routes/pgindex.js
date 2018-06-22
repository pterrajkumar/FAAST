const express = require("express");
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://pwcadmin@azurepostgreappdynamics:Welcome12345@azurepostgreappdynamics.postgres.database.azure.com:5432/todo?ssl=false';

const config = {
  host: 'azurepostgreappdynamics.postgres.database.azure.com',
  user: 'pwcadmin@azurepostgreappdynamics',
  database: 'todo',
  password: 'Welcome12345',
  port: 5432,
  max: 10, // max number of connection can be open to database
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};

// pool takes the object above -config- as parameter
const pool = new pg.Pool(config);

router.post('/todos', (req, res, next) => {
  const results = [];
  console.log(req.body);
  // Grab data from http request
  const data = {text: req.body.text, complete: false};
  pool.connect(function (err, client, done) {
      // Handle connection errors
      if(err) {
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }
      // SQL Query > Insert Data
      client.query('INSERT INTO items(text, complete) values($1, $2)',
      [data.text, data.complete]);

      client.query('SELECT * FROM items ORDER BY id ASC', function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
      })
  })
});

router.get("/todos", (req, res, next) => {
  console.log("get todos");
  pool.connect(function (err, client, done) {
    // Handle connection errors
    if(err) {
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('SELECT * FROM items ORDER BY id ASC;', function (err, result) {
      done();
      if (err) {
          console.log(err);
          res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    })
  });
});  

//pool.end();

//DEPRECATED METHODS

router.post("/todosold", (req, res, next) => {
    const results = [];
    console.log(req.body);
    // Grab data from http request
    const data = {text: req.body.text, complete: false};
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
      // Handle connection errors
      if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }
      // SQL Query > Insert Data
      client.query('INSERT INTO items(text, complete) values($1, $2)',
      [data.text, data.complete]);
      // SQL Query > Select Data
      const query = client.query('SELECT * FROM items ORDER BY id ASC');
      // Stream results back one row at a time
      query.on('row', (row) => {
        results.push(row);
      });
      // After all data is returned, close connection and return results
      query.on('end', () => {
        done();
        return res.json(results);
      });
    });
});

router.get("/todosold", (req, res, next) => {
  console.log("get todos");
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

module.exports = router;