import mysql from 'mysql';
import inquirer from 'inquirer';




const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pass1',
  database: '',
});

function connectToDatabase() {
  // Connect to the database
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      process.exit(1); // Exit the application if there's an error connecting to the database
    }
    console.log('Connected to the database');
    startApp(); // Move this line here to ensure it's called after the connection is established
  });
}

// Call the connectToDatabase function to start the application
connectToDatabase();


function startApp() {
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'Choose an option:',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
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

  connection.query(query, (err, results) => {
    if (err) throw err;

    // Display results in a formatted table
    console.table(results);

    // After displaying data, call startApp() to return to the main menu
    startApp();
  });
}

function viewAllRoles() {
  const query = 'SELECT * FROM roles';

  connection.query(query, (err, results) => {
    if (err) throw err;

    // Display results in a formatted table
    console.table(results);

    // After displaying data, call startApp() to return to the main menu
    startApp();
  });
}


function viewAllEmployees() {
  const query = 'SELECT * FROM employees';

  connection.query(query, (err, results) => {
    if (err) throw err;

    // Display results in a formatted table
    console.table(results);

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

      connection.query(query, [answer.departmentName], (err, results) => {
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

      connection.query(query, [answers.roleTitle, answers.roleSalary, answers.departmentId], (err, results) => {
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

      connection.query(query, [answers.firstName, answers.lastName, answers.roleId, answers.managerId], (err, results) => {
        if (err) throw err;

        console.log(`Employee '${answers.firstName} ${answers.lastName}' added successfully.`);
        startApp();
      });
    });
}


function updateEmployeeRole() {
  // Fetch existing employee data for user selection
  const query = 'SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employees';

  connection.query(query, (err, results) => {
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

        connection.query(updateQuery, [answers.newRoleId, answers.employeeId], (updateErr, updateResults) => {
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
