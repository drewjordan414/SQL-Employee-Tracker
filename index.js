// house keeping 
const sql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
// ddatabase conneciton 
const connection = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "employee_tracker_db"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});
// start function 
function start(){
    inquirer
    .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices:[
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
    .then(function(answer){
        switch (answer.action){
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
// functions for each choice 
function viewAllDepartments(){
    connection.query("SELECT * FROM department", function(err, res){
        if (err) throw err;
        console.table(res);
        start();
    })
};
function viewAllRoles(){
    connection.query("SELECT * FROM role", function(err, res){
        if (err) throw err;
        console.table(res);
        start();
    })
};
function viewAllEmployees(){
    connection.query("SELECT * FROM employee", function(err, res){
        if (err) throw err;
        console.table(res);
        start();
    })
};
function addDepartment(){
    inquirer
    .prompt({
        name: "department",
        type: "input",
        message: "Please enter the name of the department you would like to add."
    })
    .then(function(answer){
        connection.query("INSERT INTO department SET ?", {name: answer.department}, function(err, res){
            if (err) throw err;
            console.log("Department added successfully!");
            start();
        })
    })
};
function addRole(){
    inquirer
    .prompt({
        name: "title",
        type: "input",
        message: "Please enter the title of the role you would like to add."
    })
    .then(function(answer){
        connection.query("INSERT INTO role SET ?", {title: answer.title}, function(err, res){
            if (err) throw err;
            console.log("Role added successfully!");
            start();
        })
    })
};