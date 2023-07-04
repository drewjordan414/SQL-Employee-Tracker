function viewAllEmployees() {
    const query = `
        SELECT employee.id, employee.first_name, employee.last_name, role.title as job_title, department.name as department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) as manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON manager.id = employee.manager_id
    `;
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    })
}