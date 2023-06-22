use employee_db;

INSERT INTO departments (name) VALUES ('Sales'), ('Engineering'), ('Finance');

--roles
INSERT INTO roles (title, salary, department_id) VALUES ('Sales Executive', 70000.00, (SELECT id FROM departments WHERE name='Sales'));
INSERT INTO roles (title, salary, department_id) VALUES ('Software Engineer', 80000.00, (SELECT id FROM departments WHERE name='Engineering'));
INSERT INTO roles (title, salary, department_id) VALUES ('Accountant', 60000.00, (SELECT id FROM departments WHERE name='Finance'));

--employees
INSERT INTO employees (first_name, last_name, role_id) VALUES ('John', 'Doe', (SELECT id FROM roles WHERE title='Sales Executive'));
INSERT INTO employees (first_name, last_name, role_id) VALUES ('Jane', 'Smith', (SELECT id FROM roles WHERE title='Software Engineer'));
INSERT INTO employees (first_name, last_name, role_id) VALUES ('Bob', 'Johnson', (SELECT id FROM roles WHERE title='Accountant'));