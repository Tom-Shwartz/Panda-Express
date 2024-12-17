const { LocalDatabase } = require("./DatabaseAccess.js");

let sql;

//connect to DB 

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
const db = new LocalDatabase();


    //db.ShowAllTableItems('employee_data');
    
  
 

    db.AllSql('select count(*) from employee_data;');
    db.ShowAllTableItems('Employee_data');
    db.ShowAllTables();
  

//db.run(sql);

// Query to list all tables


//importCSVToSQLite()

/*
sql = "select * from combos"
db.all(sql, [], (err, rows) => {
    if (!err) {
    // Output the retrieved rows
    rows.forEach((row) => {
        console.log(row);
    });
    }
    else{
        return console.error(err.message);
    }


});
*/