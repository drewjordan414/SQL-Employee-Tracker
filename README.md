# SQL-Employee-Tracker

## Description

This is a command-line application to manage a company's employee database, using Node.js, Inquirer, and MySQL. The application presents a solution for managing a company's employees using node, inquirer, and MySQL.

## Features

- View departments, roles, employees
- Add departments, roles, employees
- Update employee roles

## Installation

To install the necessary dependencies, run the following command:

```
npm install mysql inquirer console.table
```


## Usage

To use the application, run the following command:

```
node index.js
```

You will then be presented with a series of options to view, add, or update departments, roles, and employees.

## Database

The database schema contains three tables:

- `departments`: Contains `id` and `name` of the departments.
- `roles`: Contains `id`, `title`, `salary`, and `department_id` for each role.
- `employees`: Contains `id`, `first_name`, `last_name`, `role_id`, and `manager_id` for each employee.

## Seed Data

You can quickly populate your database with test data by running the seeds file: 

```
mysql -u root -p < db/seed.sql

```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database
```

I plan to revisit this project in the future to resolve this issue and complete the project. 

## License

This project is licensed under the MIT license.
