const inquirer = require("inquirer");
const mysql = require("mysql2");
require('console.table');



const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'pass1',
  database: 'company_db',
});
// Get a connection from the pool
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
  // Release the connection after checking

});


function startApp() {
  console.log('hello')
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'Choose an option:',
      choices: [
        'Viewalldepartments',
        'Viewallroles',
        'Viewallemployees',
        'Addadepartment',
        'Addarole',
        'Addanemployee',
        'Updateanemployeerole',
        'Exit',
      ],
    
    })
    .then((answer) => {
      switch (answer.action) {
        case 'Viewalldepartments':
          viewAllDepartments();
          break;
        case 'Viewallroles':
          viewAllRoles();
          break;
        case 'Viewallemployees':
          viewAllEmployees();
          break;
        case 'Addadepartment':
          addDepartment();
          break;
        case 'Addarole':
          addRole();
          break;
        case 'Addanemployee':
          addEmployee();
          break;
        case 'Updateanemployeerole':
          updateEmployeeRole();
          break;
        case 'Exit':
          // Handle exit
          console.log('Exiting the application.');
          // Close the database connection if needed
          break;
        default:
          console.log('Invalid choice. Please try again.');
          startApp();
      }
    });
}

function viewAllDepartments() {
  const query = 'SELECT * FROM departments';

  pool.query(query, (err, results) => {
    if (err) throw err;

    // Display results in a formatted table
    console.table(results),

    // After displaying data, call startApp() to return to the main menu
    startApp();
  });
}

function viewAllRoles() {
  const query = 'SELECT * FROM roles';

  pool.query(query, (err, results) => {
    if (err) throw err;

    // Display results in a formatted table
    console.table(results),

    // After displaying data, call startApp() to return to the main menu
    startApp();
  });
}


function viewAllEmployees() {
  const query = 'SELECT * FROM employees';

  pool.query(query, (err, results) => {
    if (err) throw err;

    // Display results in a formatted table
    console.table(results),

    // After displaying data, call startApp() to return to the main menu
    startApp();
  });
}


function addDepartment() {
  inquirer
    .prompt({
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the department:',
    })
    .then((answer) => {
      const query = 'INSERT INTO departments (name) VALUES (?)';

      pool.query(query, [answer.departmentName], (err, results) => {
        if (err) throw err;

        console.log(`Department '${answer.departmentName}' added successfully.`);
        startApp();
      });
    });
}


function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'roleTitle',
        message: 'Enter the title of the role:',
      },
      {
        type: 'input',
        name: 'roleSalary',
        message: 'Enter the salary for the role:',
      },
      {
        type: 'input',
        name: 'departmentId',
        message: 'Enter the department id for the role:',
      },
    ])
    .then((answers) => {
      const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';

      pool.query(query, [answers.roleTitle, answers.roleSalary, answers.departmentId], (err, results) => {
        if (err) throw err;

        console.log(`Role '${answers.roleTitle}' added successfully.`);
        startApp();
      });
    });
}


function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'Enter the employee\'s first name:',
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter the employee\'s last name:',
      },
      {
        type: 'input',
        name: 'roleId',
        message: 'Enter the role id for the employee:',
      },
      {
        type: 'input',
        name: 'managerId',
        message: 'Enter the manager id for the employee:',
      },
    ])
    .then((answers) => {
      const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';

     pool.query(query, [answers.firstName, answers.lastName, answers.roleId, answers.managerId], (err, results) => {
        if (err) throw err;

        console.log(`Employee '${answers.firstName} ${answers.lastName}' added successfully.`);
        startApp();
      });
    });
}


function updateEmployeeRole() {
  // Fetch existing employee data for user selection
  const query = 'SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employees';

  pool.query(query, (err, results) => {
    if (err) throw err;

    const employees = results.map((employee) => ({
      name: employee.employee_name,
      value: employee.id,
    }));

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select the employee to update:',
          choices: employees,
        },
        {
          type: 'input',
          name: 'newRoleId',
          message: 'Enter the new role id for the employee:',
        },
      ])
      .then((answers) => {
        const updateQuery = 'UPDATE employees SET role_id = ? WHERE id = ?';

        pool.query(updateQuery, [answers.newRoleId, answers.employeeId], (updateErr, updateResults) => {
          if (updateErr) throw updateErr;

          console.log(`Employee role updated successfully.`);
          startApp();
        });
      });
  });
}


// You would need to call startApp() to begin the application
startApp();



function backToMainMenu() {
  inquirer
    .prompt({
      type: 'confirm',
      name: 'back',
      message: 'Return to the main menu?',
      default: true,
    })
    .then((answer) => {
      if (answer.back) {
        startApp();
      } else {
        console.log('Exiting the application.');
      }
    });
}

console.table(results);
backToMainMenu();

// Close the database connection when the application is finished
process.on('exit', () => {
  console.log('Closing the database connection.');
  connection.end();
});
