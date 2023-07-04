function viewAllRoles() {
    const query = `
        SELECT role.id, title, salary, department.name as department
        FROM role
        INNER JOIN department ON role.department_id = department.id
    `;
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    })
}
