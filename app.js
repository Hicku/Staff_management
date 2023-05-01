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

    // Prompt the user to choose an option
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
    .then(answer => {
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

// View all departments
function viewDepartments() {
    db.query("SELECT * FROM department", (err, results) => {
        if (err) throw err;
        console.table(results);
        start();
    });
}

// View all roles
function viewRoles() {
    db.query("SELECT roles.id, roles.title, roles.salary, department.dep_name AS department FROM roles JOIN department ON roles.department_id = department.id", (err, results) => {
        if (err) throw err;
        console.table(results);
        start();
    });
}

// View all employees
function viewEmployees() {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dep_name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id", (err, results) => {
        if (err) throw err;
        console.table(results);
        start();
    });
}

// Add a department
function addDepartment() {
    inquirer.prompt({
        name: "dep_name",
        type: "input",
        message: "What is the name of the new department?"
    })
    .then(answer => {
        db.query("INSERT INTO department SET ?", { dep_name: answer.dep_name }, (err, results) => {
            if (err) throw err;
            console.log("The new department has been added.");
            start();
        });
    });
}

// Add a role
function addRole() {
    db.query("SELECT * FROM department", (err, results) => {
        if (err) throw err;

        // Prompt the user to enter the new role details
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "What is the name of the new role?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary for this role?",
            },
            {
                type: "list",
                message: "Select the department for the new role:",
                name: "department_id",
                choices: results.map((department) => ({
                    value: department.id,
                    name: department.dep_name,
                })),
            },
        ]).then((answer) => {
            db.query(
                "INSERT INTO roles SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department_id,
                },
                (err, results) => {
                    if (err) throw err;
                    console.log("The new role has been added.");
                    start();
                }
            );
        });
    });
}