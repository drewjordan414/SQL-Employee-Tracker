// housekeeping
const inquirer = require('inquirer');
const mysql = require('mysql');
const questions = require('./JS/questions');
const queries = require('./JS/query');


// create connection to db
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'employee_database'
    },
    console.log('\x1b[35m', 'Connected to the employee_database database.'),
    function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
    console.log("\x1b[31m", data)
})


async function init() {
    await delay(1000);
    inquirer.prompt(questions.questions)
        .then((data) => {
            console.log(`You selected: ${data.action}`)
            switch (data.action) {
                case 'View all departments':
                    db.query(queries.viewAllDepts, function (err, results) {
                        if (err) { console.log(err) }
                        console.table(results)

                    })
                    init();
                    break;
                case 'View all roles':
                    db.query(queries.allRoles, function (err, results) {
                        if (err) { console.log(err) }
                        console.table(results)
                    })
                    init();
                    break;
                case 'View all employees':
                    db.query(queries.employeeQuery, function (err, results) {
                        if (err) { console.log(err) }
                        console.table(results)
                    })
                    init();
                    break;
                case 'Add a department':
                    inquirer.prompt(questions.addDept)
                        .then((data) => {
                            async function addDept() {
                                db.query(queries.addDept, { name: data.dept }, function (err, results) {
                                    if (err) { console.log(err) }
                                    console.log(`Added ${data.dept} to departments.`)
                                    init();
                                })
                            }
                            addDept();
                        })

                    break;
                case 'Add a role':
                    inquirer.prompt(questions.addRole)
                        .then((data) => {
                            async function addRole() {
                                db.query(queries.addRole, { title: data.newRoleTitle, salary: data.newRoleSalary, department_id: data.newRoleDept }, function (err) {
                                    if (err) { console.log(err); }
                                    console.log(`Added ${data.newRoleTitle} to roles.`);
                                    init();
                                })
                            }
                            addRole();

                        })

                    break;
                case 'Add an employee':
                    inquirer.prompt(questions.addEmpQs)
                        .then((data) => {
                            async function addEmployee() {
                                db.query(queries.addEmployee, { first_name: data.newEmpFirst, last_name: data.newEmpLast, role_id: data.newEmpRole, manager_id: data.newEmpManager }, function (err) {
                                    if (err) { console.log(err) }
                                    console.log(`Added ${data.newEmpFirst} ${data.newEmpLast} to employees.`)
                                    init();
                                })
                            }
                            addEmployee();
                        })
                    break;
                case 'Update employee role':
                    inquirer.prompt(questions.updateEmpQs)
                        .then((data) => {
                            async function updateEmpRole() {
                                db.query(queries.updateEmployeeRole, [{ role_id: data.updateRole }, { id: data.updateEmp }], function (err, results) {
                                    if (err) { console.log(err) }
                                    console.log(`Updated employee #${data.updateEmp}'s role to Role #${data.updateRole}.`)
                                    init();
                                })
                            }
                            updateEmpRole();
                        })
                    break;
                case 'View employees by manager':
                    inquirer.prompt(questions.viewEmpByMgrQs)
                        .then((data) => {
                            async function viewByManager() {
                                db.query(`SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee WHERE manager_id = ${data.manager}`, function (err, results) {
                                    if (err) { console.log(err) }
                                    console.table(results)
                                    init();
                                })
                            }
                            viewByManager();
                        })
                    break;
                case 'View employees by department':
                    inquirer.prompt(questions.viewEmpByDeptQs)
                        .then((data) => {
                            async function viewByDept() {
                                db.query(`
                                SELECT
                                CONCAT(first_name, ' ', last_name) AS name
                                From employee
                                RIGHT JOIN role ON employee.role_id = role.id
                                WHERE role.department_id = ${data.department}`, function (err, results) {
                                    if (err) { console.log(err) }
                                    console.log(data.department)
                                    console.table(results)
                                    init();
                                })
                            }
                            viewByDept();
                        })
                    break;
                case 'Update employee manager':
                    inquirer.prompt(questions.updateEmpMgrQs)
                        .then((data) => {
                            async function updateEmpMgr() {
                                db.query(queries.updateEmployeeMgr, [{ manager_id: data.updateMgr }, { id: data.updateEmpMgr }], function (err, results) {
                                    if (err) { console.log(err) }
                                    console.log(`Updated employee #${data.updateEmpMgr}'s manager to manager #${data.updateMgr}.`)
                                    init();
                                })
                            }
                            updateEmpMgr();
                        })
                    break;
                case 'Quit':
                    console.log('\x1b[35m', 'Goodbye!')
                    db.end();
                    process.exit();
                    break;

            }

        })
}

init();