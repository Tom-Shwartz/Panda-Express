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




    const pool = new Pool({
        user: process.env.PSQL_USER,
        host: process.env.PSQL_HOST,
        database: process.env.PSQL_DATABASE,
        password: process.env.PSQL_PASSWORD,
        port: process.env.PSQL_PORT,
        ssl: {rejectUnauthorized: false}
    });

    app.use(cors());

    app.use(express.json());

    // Add process hook to shutdown pool
    process.on('SIGINT', function() {
        pool.end();
        console.log('Application successfully shutdown');
        process.exit(0);
    });
                    
    app.set("view engine", "ejs");

 
/*
    app.get('/api/test/:echo', (req, res) => {
        res.json({ echo: `${req.params.echo}` });
    });
    */

    // Used to get data from a full table
    app.get('/api/db/request/:table', async (req, res) => {
        const table = req.params.table;
        const query = `SELECT * FROM ${table}`;
        /*
        pool
            .query(query)
            .then(query_res => {
                res.json({output: query_res});
            })
            .catch(error => {
                console.error("Database error:", error);
                res.status(500).json({ error: "Database query failed" });
            });*/

        try{
            query_res = await pool.query(query);
            res.json({output: query_res.rows});
        }
        catch (error){
            res.status(500).json({error: 'Table Query Failed'});
        }
    });

    //Used to get data from a specific column
    app.get('/api/db/request/:table/:column', async (req, res) => {
        const table = req.params.table;
        const column = req.params.column;
        const query = `SELECT ${column} FROM ${table}`;

        /*
        row = [];
        pool
            .query(query)
            .then(query_res => {
                for (let i = 0; i < query_res.rowCount; i++){
                    row.push(query_res.rows[i]);
                    console.log(row[i]);
                }
                const data = {food_name : row};
                console.log(data.food_name);
                res.json({output: data});
            })
            .catch(error => {
                console.error("Database error:", error);
                res.status(500).json({ error: "Database query failed" });
            }); */

        try{
        query_res = await pool.query(query);
        res.json({output: {[column]: query_res.rows}});
        }
        catch (error){
            console.error("Database error", error);
            res.status(500).json({ error: "Database query failed" });
        }
            

    });

    app.get('/api/db/maxOrderId', async (req, res) =>{
        const query = `SELECT MAX(orderid) FROM order_history`;
        try{
            query_res = await pool.query(query);
            res.json({output: query_res.rows});
        }
        catch (error){
            console.error("Database error", error);
            res.status(500).json({ error: "Database query failed" });
        }
    });


    //gets data from a column given a specification (usually a where statement)
        //Used to get data from a specific column
        app.get('/api/db/request/:table/:column/:variable/:value', async (req, res) => {
            const table = req.params.table;
            const column = req.params.column;
            const variable = req.params.variable;
            const value = req.params.value;
            const query = `SELECT ${column} FROM ${table} WHERE ${variable} = ${value}`;
    
            try{
            query_res = await pool.query(query);
            res.json({output: {[column]: query_res.rows}});
            }
            catch (error){
                console.error("Database error", error);
                res.status(500).json({ error: "Database query failed" });
            }
                
    
        });

        
    //Used to get the latest orderID number
    app.get('/api/db/get/maxOrderID', async (req, res) => {
        const result = await pool.query(`SELECT MAX(orderid) FROM order_history;`);  
        res.json(result.rows);
    })
    
   /* //Used to send orders to orderhistory
    app.put('api/db/send/orderhistory/:orderid/:totalcost', (req, res) => {
        const orderid = req.params.orderid;
        const totalcost = req.params.totalcost;
        const date = new Date();
        const month = date.getMonth() + 1
        const timestamp = `${date.getFullYear()}-${month}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        const query = `INSERT INTO order_history (${orderid}), ${totalcost}, ${timestamp} `;
        pool.query()
    });        */
    
    //custom sql function 

    app.post('/api/db/request', async (req,res) =>{
        console.log(req.body);
        const { query } = req.body;

        if(!query){
            return res.status(400).json({error: 'No Query parameter was inputed'})
        }

        try{
            const result = await pool.query(query);
            res.json({output: result.rows});

        }
        catch (error){
            console.error('Database query error:', error);
            res.status(500).json({ error: 'Database query failed'});
        }
    })

    

    // Test function that only puts 1 value in a table
    app.post('/api/db/request/:table', async(req,res) => {
        const table = req.params.table;
        const {data} = req.body;
        const query = `INSERT INTO ${table} (name) VALUES ($1) RETURNING *`

        try {
            query_res = await pool.query(query);
            res.json({output: query.rows })
        } 
        catch (error) {
            console.error("Database error", error);
            res.status(500).json({ error: "Database query failed" }); 
        }
    });

    app.post('/api/db/send/orderhistory/', async(req, res) => {
        const {orderid} = req.body;
        const {totalCost} = req.body;
        console.log("orderid: ", orderid);
        console.log("totalCost: ", totalCost);
        const date = new Date();
        const month = date.getMonth() + 1
        const timestamp = `${date.getFullYear()}-${month}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        const query = `INSERT INTO order_history (orderid, totalcost, orderdate) VALUES(${orderid}, ${totalCost}, '${timestamp}')`;
        console.log(query);
        try {
            query_res = await pool.query(query);
            console.log("out: ", query_res);
            res.status(200).json({output: "Success" });
        } 
        catch (error) {
            console.error("Database error", error);
            res.status(500).json({ error: "Database query failed", query: `${query}` }); 
        }
    });

    /*app.post('/api/db/send/combo_items/', async(req, res) => {
        const {}
    });*/

    app.post('/api/db/send/orderitems/', async(req, res) => {
        const { orderid } = req.body;
        const { type } = req.body;
        const { item } = req.body;
        console.log("orderitems called");
        const query = `INSERT INTO order_items (orderid, item, type) VALUES('${orderid}', '${item}', '${type}')`;
        console.log("orderitems query: ", query);
        try {
            query_res = await pool.query(query);
            res.status(200).json({output: query.rows })
        } 
        catch (error) {
            console.error("Database error", error);
            console.log("Query: ", query);
            res.status(500).json({ error: "Database query failed-"}); 
        }
    })

    


    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });


    