const sql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All departments",
                "View All roles",
                "View All employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All departments":
                    viewAllDepartments();
                    break;
                case "View All roles":
                    viewAllRoles();
                    break;
                case "View All employees":
                    viewAllEmployees();
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
                    connection.end();
                    break;
            }
        })
}

function viewAllDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    })
}

function viewAllRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    })
}

function viewAllEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    })
}

function addDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "Please enter the name of the department you would like to add."
        })
        .then(function (answer) {
            connection.query("INSERT INTO department SET ?", { name: answer.department }, function (err, res) {
                if (err) throw err;
                console.log("Department added successfully!");
                start();
            })
        })
}

function addRole() {
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "Please enter the title of the role you would like to add."
            },
            {
                name: "salary",
                type: "input",
                message: "Please enter the salary for the role."
            },
            {
                name: "department_id",
                type: "input",
                message: "Please enter the department ID the role belongs to."
            }
        ])
        .then(function (answer) {
            connection.query("INSERT INTO role SET ?", 
                { 
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department_id
                }, 
                function (err, res) {
                    if (err) throw err;
                    console.log("Role added successfully!");
                    start();
                }
            )
        })
}

function addEmployee() {
    inquirer
        .prompt([
            {
                name: "first_name",
                type: "input",
                message: "Please enter the first name of the employee you would like to add."
            },
            {
                name: "last_name",
                type: "input",
                message: "Please enter the last name of the employee you would like to add."
            },
            {
                name: "role_id",
                type: "input",
                message: "Please enter the role ID for the employee."
            },
            {
                name: "manager_id",
                type: "input",
                message: "Please enter the manager ID for the employee."
            }
        ])
        .then(function (answer) {
            connection.query("INSERT INTO employee SET ?", 
                { 
                    first_name: answer.first_name, 
                    last_name: answer.last_name,
                    role_id: answer.role_id,
                    manager_id: answer.manager_id
                }, 
                function (err, res) {
                    if (err) throw err;
                    console.log("Employee added successfully!");
                    start();
                }
            )
        })
}

function updateEmployeeRole() {
    connection.query("SELECT * FROM employee", function(err, employees) {
        if (err) throw err;
        
        inquirer.prompt([
            {
                name: 'employeeId',
                type: 'list',
                message: 'Which employee\'s role do you want to update?',
                choices: employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
            },
            {
                name: 'roleId',
                type: 'input',
                message: 'Which role ID do you want to assign to the selected employee?'
            }
        ])
        .then(function (answer) {
            connection.query('UPDATE employee SET ? WHERE ?', [{ role_id: answer.roleId }, { id: answer.employeeId }], function (err) {
                if (err) throw err;
                console.log('Updated employee\'s role successfully!');
                start();
            });
        });
    });
}
