const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const cors = require('cors');
const CorsOptions = {
    origin: ["http://localhost:3000"]
};

// Create express app
const app = express();
const port = 8080;

// Create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

app.use(cors());

// Add process hook to shutdown pool
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});
	 	 	 	
app.set("view engine", "ejs");



app.get('/api/test/:echo', (req, res) => {
    res.json({ echo: `${req.params.echo}` });
});

// Used to get data from a full table
app.get('/api/db/request/:table', (req, res) => {
    const table = req.params.table;
    const query = `SELECT * FROM ${table}`;
    row = [];
    pool
        .query(query)
        .then(query_res => {
            for(let i = 0; i < query_res.rows.length; i++){
                row.push(query_res.rows[i]);
            }
            const data = {item : row};
            res.json({output: row});
        })
        .catch(error => {
            console.error("Database error:", error);
            res.status(500).json({ error: "Database query failed" });
        });
});

//Used to get data from a specific column
app.get('/api/db/request/:table/:column', (req, res) => {
    const table = req.params.table;
    const column = req.params.column;
    const query = `SELECT ${column} FROM ${table}`;
    row = [];
    pool
        .query(query)
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                row.push(query_res.rows[i]);
            }
            res.json({output: row});
        })
        .catch(error => {
            console.error("Database error:", error);
            res.status(500).json({ error: "Database query failed" });
        });
});




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

