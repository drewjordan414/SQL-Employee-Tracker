const sql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");


const connection = sql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
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
                "Update an employee manager",
                "View employees by manager",
                "Delete a department",
                "Delete a role",
                "Delete an employee",
                "View department budget",
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
                case "Update an employee manager":
                    updateEmployeeManager();
                    break;
                case "View employees by manager":
                    viewEmployeesByManager();
                    break;
                case "Delete a department":
                    deleteDepartment();
                    break;
                case "Delete a role":
                    deleteRole();
                    break;
                case "Delete an employee":
                    deleteEmployee();
                    break;
                case "View department budget":
                    viewDepartmentBudget();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
}

function viewAllDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    })
}

function viewAllRoles() {
    const query = `
        SELECT roles.id, title, salary, departments.name as department
        FROM roles
        INNER JOIN departments ON roles.department_id = departments.id
    `;
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    })
}

function viewAllEmployees() {
    const query = `
        SELECT employees.id, employees.first_name, employees.last_name, roles.title as job_title, departments.name as department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) as manager
        FROM employees
        LEFT JOIN roles ON employees.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees manager ON manager.id = employees.manager_id
    `;
    connection.query(query, function (err, res) {
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

// code for the bonus points 
function updateEmployeeManager() {
    inquirer
        .prompt([
            {
                name: "employee_id",
                type: "input",
                message: "Enter the ID of the employee whose manager you want to update."
            },
            {
                name: "manager_id",
                type: "input",
                message: "Enter the new manager ID."
            }
        ])
        .then(function (answer) {
            connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [answer.manager_id, answer.employee_id], function (err, res) {
                if (err) throw err;
                console.log("Employee's manager updated successfully!");
                start();
            });
        });
}

function viewEmployeesByManager() {
    inquirer
        .prompt([
            {
                name: "manager_id",
                type: "input",
                message: "Enter the manager ID to view their employees."
            }
        ])
        .then(function (answer) {
            connection.query("SELECT * FROM employee WHERE manager_id = ?", [answer.manager_id], function (err, res) {
                if (err) throw err;
                console.table(res);
                start();
            });
        });
}

function deleteDepartment() {
    inquirer
        .prompt([
            {
                name: "department_id",
                type: "input",
                message: "Enter the ID of the department you wish to delete."
            }
        ])
        .then(function (answer) {
            connection.query("DELETE FROM departments WHERE id = ?", [answer.department_id], function (err, res) {
                if (err) throw err;
                console.log("Department deleted successfully!");
                start();
            });
        });
}

function deleteRole() {
    inquirer
        .prompt([
            {
                name: "role_id",
                type: "input",
                message: "Enter the ID of the role you wish to delete."
            }
        ])
        .then(function (answer) {
            connection.query("DELETE FROM roles WHERE id = ?", [answer.role_id], function (err, res) {
                if (err) throw err;
                console.log("Role deleted successfully!");
                start();
            });
        });
}

function deleteEmployee() {
    inquirer
        .prompt([
            {
                name: "employee_id",
                type: "input",
                message: "Enter the ID of the employee you wish to delete."
            }
        ])
        .then(function (answer) {
            connection.query("DELETE FROM employees WHERE id = ?", [answer.employee_id], function (err, res) {
                if (err) throw err;
                console.log("Employee deleted successfully!");
                start();
            });
        });
}

function viewDepartmentBudget() {
    inquirer
        .prompt([
            {
                name: "department_id",
                type: "input",
                message: "Enter the ID of the department to view its budget."
            }
        ])
        .then(function (answer) {
            connection.query(
                `SELECT SUM(roles.salary) AS 'Budget'
                 FROM employees
                 JOIN roles ON employees.role_id = roles.id
                 WHERE roles.department_id = ?`, 
                [answer.department_id], 
                function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    start();
                }
            );
        });
}