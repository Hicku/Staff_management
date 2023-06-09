const inquirer = require("inquirer");
const mysql = require("mysql2");
const express = require("express"); 

const PORT = process.env.PORT || 3000
const app = express();

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public'));
app.use(function(req, res, next) {
  console.log('A request was made to the server');
  next();
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
    db.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, department.dep_name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employees manager ON employees.manager_id = manager.id", (err, results) => {
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

function addEmployee() {
    // Query the database for the available roles and managers
    db.query("SELECT id, title FROM roles", (err, roleResults) => {
        if (err) throw err;

        db.query("SELECT id, CONCAT(first_name, ' ', last_name) AS manager FROM employees", (err, employeeResults) => {
            if (err) throw err;

            // Add a "None" option to the list of managers
            employeeResults.unshift({ id: null, manager: "None" });

            // Prompt the user for the new employee's details
            inquirer.prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "What is the employee's first name?",
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What is the employee's last name?",
                },
                {
                    name: "role_id",
                    type: "list",
                    message: "What is the employee's role?",
                    choices: roleResults.map((role) => ({
                        value: role.id,
                        name: role.title,
                    })),
                },
                {
                    name: "manager_id",
                    type: "list",
                    message: "Who is the employee's manager?",
                    choices: employeeResults.map((employee) => ({
                        value: employee.id,
                        name: employee.manager,
                    })),
                },
            ]).then((answer) => {
                db.query(
                    "INSERT INTO employees SET ?",
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: answer.role_id,
                        manager_id: answer.manager_id,
                    },
                    (err, results) => {
                        if (err) throw err;
                        console.log("The new employee has been added.");
                        start();
                    }
                );
            });
        });
    });
}

function updateEmployeeRole() {
    // Query the database for the available employees and roles
    db.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees", (err, employeeResults) => {
        if (err) throw err;

        db.query("SELECT id, title FROM roles", (err, roleResults) => {
            if (err) throw err;

            // Prompt the user for the employee and role to update
            inquirer.prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "Which employee's role do you want to update?",
                    choices: employeeResults.map(employees => ({ value: employees.id, name: employees.name }))
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is the employee's new role?",
                    choices: roleResults.map(role => ({ value: role.id, name: role.title }))
                }
            ]).then(answer => {
                // Update the employee's role in the database
                db.query(
                    "UPDATE employees SET role_id = ? WHERE id = ?",[answer.role, answer.employee], (err, results) => {
                        if (err) throw err;
                        console.log("The employee's role has been updated.");
                        start();
                    }
                );
            });
        });
    });
}

start();

app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Connected to port ${PORT}`);
} )
