const inquirer = require('inquirer');
const mysql = require('mysql2');
const { db, questions, addDept, addRole, addEmployee, viewEmployeeByManager, updateEmployee, updateEmployeeManager } = require('./JS/questions');

// create connection to db
const connection = db;

async function init() {
    inquirer.prompt(questions)
        .then((data) => {
            console.log(`You selected: ${data.action}`)
            switch (data.action) {
                case 'View all departments':
                    connection.query('SELECT * FROM department', function (err, results) {
                        if (err) { console.log(err) }
                        console.table(results)
                        init();
                    })
                    break;
                // similar changes for all other case statements, replace hardcoded queries with appropriate queries
                case 'Add a department':
                    inquirer.prompt(addDept)
                        .then((data) => {
                            connection.query('INSERT INTO department SET ?', { name: data.dept }, function (err, results) {
                                if (err) { console.log(err) }
                                console.log(`Added ${data.dept} to departments.`)
                                init();
                            })
                        })
                    break;
                case 'Add a role':
                    inquirer.prompt(addRole)
                        .then((data) => {
                            connection.query('INSERT INTO role SET ?', { title: data.newRoleTitle, salary: data.newRoleSalary, department_id: data.newRoleDept }, function (err) {
                                if (err) { console.log(err); }
                                console.log(`Added ${data.newRoleTitle} to roles.`);
                                init();
                            })
                        })
                    break;
                // And so on for the remaining cases...
            }
        })
}

init();
