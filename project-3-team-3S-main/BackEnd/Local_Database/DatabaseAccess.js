const sqlite3 = require('../../FrontEnd/ReactApplication/node_modules/sqlite3').verbose();
const fs = require('fs');
const csv = require('../../FrontEnd/ReactApplication/node_modules/csv-parser');
class LocalDatabase{
    static db;
    constructor(){

        this.db = new sqlite3.Database('./LocalDatabase.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) return console.error(err.message);
        })
       
    }



    ShowAllTableItems(table){
        var sql = "select * from " + table +";"

        this.db.all(sql,[],(err,rows) => {
            if(err){
                console.log(err.message);
            }
            else{
                console.log(rows);
            }
        });

    }

    ShowAllTables(){
        var sql = "SELECT name FROM sqlite_master WHERE type='table';";
        this.db.all(sql,[],(err,rows) => {
            if(err){
                console.log(err.message);
            }
            else{
                console.log(rows);
            }
        });

    }

    AllSql(sql){
        this.db.all(sql,[],(err,rows) => {
            if(err){
                console.log(err.message);
            }
            else{
                console.log(rows);
            }
        });
    }
    RunSql(sql){
        this.db.run(sql,(err) => {
            if(err){
              console.log(err.message);  
            }
        })
    }
}   



    module.exports = {
        LocalDatabase
    };