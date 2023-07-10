const mysql = require('mysql');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'employees_db'
});

const questions = [
    {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update employee role',
            'View employees by manager',
            'View employees by department',
            'Update employee manager',
            'Quit'
        ]
    }
];

const addDept = [
    {
        type: 'input',
        name: 'dept',
        message: 'Enter the name of the new department:'
    }
];

const addRole = [
    {
        type: 'input',
        name: 'newRoleTitle',
        message: 'Enter the title of the new role:'
    },
    {
        type: 'input',
        name: 'newRoleSalary',
        message: 'Enter the salary of the new role:'
    },
    {
        type: 'list',
        name: 'newRoleDept',
        message: 'Select the department of the new role:',
        choices: function () {
            return new Promise((resolve, reject) => {
                db.query('SELECT id, name FROM department', function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        const choices = results.map(({ id, name }) => ({ name, value: id }));
                        resolve(choices);
                    }
                });
            });
        }
    }
];

const addEmployee = [
    {
        type: 'input',
        name: 'newEmpFirst',
        message: "What is the new employee's first name?"
    },
    {
        type: 'input',
        name: 'newEmpLast',
        message: "What is the new employee's last name?"
    },
    {
        type: 'list',
        name: 'newEmpRole',
        message: "What is the new employee's role?",
        choices: function () {
            return new Promise((resolve, reject) => {
                db.query('SELECT id, title FROM role', function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        const choices = results.map(({ id, title }) => ({ name: title, value: id }));
                        resolve(choices);
                    }
                });
            });
        }
    },
    {
        type: 'list',
        name: 'newEmpManager',
        message: "Who is the new employee's manager?",
        choices: function () {
            return new Promise((resolve, reject) => {
                db.query('SELECT id, first_name, last_name FROM employee', function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        const choices = results.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
                        choices.push({ name: 'None', value: null });
                        resolve(choices);
                    }
                });
            });
        }
    }
];

const viewEmployeeByManager = [
    {
        type: 'list',
        name: 'manager',
        message: "Which manager's employees would you like to view?",
        choices: function () {
            return new Promise((resolve, reject) => {
                db.query('SELECT id, first_name, last_name FROM employee WHERE manager_id IS NOT NULL', function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        const choices = results.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
                        resolve(choices);
                    }
                });
            });
        }
    }
];

const updateEmployee = [
    {
        type: 'list',
        name: 'updateEmp',
        message: "Which employee's role would you like to update?",
        choices: function () {
            return new Promise((resolve, reject) => {
                db.query('SELECT id, first_name, last_name FROM employee', function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        const choices = results.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
                        resolve(choices);
                    }
                });
            });
        }
    },
    {
        type: 'list',
        name: 'updateRole',
        message: "What is the employee's new role?",
        choices: function () {
            return new Promise((resolve, reject) => {
                db.query('SELECT id, title FROM role', function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        const choices = results.map(({ id, title }) => ({ name: title, value: id }));
                        resolve(choices);
                    }
                });
            });
        }
    }
];

const updateEmployeeManager = [
    {
        type: 'list',
        name: 'updateEmpMgr',
        message: "Which employee's manager would you like to update?",
        choices: function () {
            return new Promise((resolve, reject) => {
                db.query('SELECT id, first_name, last_name FROM employee', function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        const choices = results.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
                        resolve(choices);
                    }
                });
            });
        }
    },
    {
        type: 'list',
        name: 'updateMgr',
        message: "Who is the employee's new manager?",
        choices: function () {
            return new Promise((resolve, reject) => {
                db.query('SELECT id, first_name, last_name FROM employee WHERE manager_id IS NOT NULL', function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        const choices = results.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
                        choices.push({ name: 'None', value: null });
                        resolve(choices);
                    }
                });
            });
        }
    }
];

module.exports = {
    db,
    questions,
    addDept,
    addRole,
    addEmployee,
    viewEmployeeByManager,
    updateEmployee,
    updateEmployeeManager,
};
