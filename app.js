const inquirer = require("inquirer");
const mysql = require("mysql2");

// Create a connection to the database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Bounty_county23",
    database: "employees_db"
});

// Start the application
function start() {
    console.log("Welcome to the Employee Management System!");

    // Prompt user to choose option
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Exit"
        ]
    })
    .then(answer => { // Switch statement to call function based on user option
        switch(answer.action) {
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "View all employees":
                viewEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an employee role":
                updateEmployeeRole();
                break;
            case "Exit":
                console.log("Thank you for using the Employee Management System!");
                process.exit();
        }
    });
}

