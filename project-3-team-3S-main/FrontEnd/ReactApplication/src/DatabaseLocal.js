const sqlite3 = require("sqlite3").verbose();

let sql;

//connect to DB
const db = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
})
//create table

//sql = 'CREATE TABLE users (id INTEGER PRIMARY KEY, first_name, last_name, username , password , email)';
//db.run(sql)

//drop table
//db.run("DROP TABLE users");
/*
sql = 'INSERT INTO USERS(first_name, last_name, username , password , email) VALUES (?,?,?,?,?)';
db.run(sql,["mike","michaelson","test","stuf","emailguy"],(err) =>{
   if (err) return console.error(err.message);
} );
*/

sql = 'SELECT * FROM users';
db.all(sql , [], (err,rows) =>{
    if (err) return console.error(err.message);
    rows.forEach((row)=>{
        console.log(row);
    })
})


sql = 'UPDATE users SET first_name = ? WHERE id = ?';

db.run(sql,['Jake',1], (err) => {
    if(err) return console.error(err.message);
});


