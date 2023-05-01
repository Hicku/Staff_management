const express = require("express"); 
const mysql = require("mysql2");
const inquirer = require("inquirer");


const  PORT = process.env.PORT || 3000
const app = express();

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public'));
app.use(function(req, res, next) {
  console.log('A request was made to the server');
  next();
});

app.get('/', function(req, res) {
    res.send('Hello World!');
  });

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Bounty_county23",
    database: "employees_db"
})

db.connect(function(err) {
    if (err) throw err;
    console.log('Connected to the database.');
  });



app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Connected to port ${PORT}`);
} )

module.exports = app;