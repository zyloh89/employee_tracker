const util = require("util");
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

//Connection

const connection = mysql.createConnection({ 
    host: 'localhost',
    user: 'root',
    password: 'Iamadog89!', //DELETE
    database: 'employees_db'
 });

connection.connect(function (err) {
    if (err) throw err;
    console.log('Connected as id ' + connection.threadId);
    console.log("Welcome to Employee Tracker");
    start();
});

connection.query = util.promisify(connection.query);

//Prompt

function start() {
    inquirer.prompt(
        {
            type: 'list',
            name: 'mainpage',
            message: "What would you like to do to the employee database?",
            choices: [
                "Add departments, roles, employees",
                "View departments, roles, employees",
                "Update employee roles",
                "Exit"
            ]
    }).then(function(result) {
        if(result.mainpage === "Add departments, roles, employees") {
            addFunction();
        }
        else if(result.mainpage === "View departments, roles, employees") {
            viewFunction();
        }
        else if(result.mainpage === "Update employee roles") {
            updateFunction();
        }
        else {
            console.log("Exit")
            connection.end();
        }
    });
};

// Add Function

function addFunction() {
    inquirer.prompt(
        {
            type: "list",
            name: "addfunction",
            message: "What would you like to add to the database?",
            choices: [
                "department",
                "role",
                "employee",
                "cancel"
            ]
        }).then(function(result) {
            if(result.addfunction === "department") {
                inquirer.prompt(
                    {
                        type: "input",
                        name: "department_name",
                        message: "What is the department name?"
                    }).then(function(result) {
                        addDepartment(result.department_name);
                    });
            }
            else if (result.addfunction === "role") {
                inquirer.prompt([            
                    {
                        type: "input",
                        name: "title",
                        message: "What is the title for the role?"
                    },
                    {
                        type: "input",
                        name: "salary",
                        message: "What is the salary for the role?"
                    },
                    {
                        type: "input",
                        name: "department",
                        message: "Which department does the role fall into? Please enter department id."
                    }
                ]).then(function(result) {
                    addRole(result.title, result.salary, result.department);
                })
            }
            else if (result.addfunction === "employee") {
                inquirer.prompt([
                    {
                        type: "input",
                        name: "firstname",
                        message: "What is the first name of the employee?"
                    },
                    {
                        type: "input",
                        name: "lastname",
                        message: "What is the last name of the employee?"
                    },
                    {
                        type: "input",
                        name: "role",
                        message: "What is the role of the employee? Please enter role id."
                    },
                    {
                        type: "input",
                        name: "manager",
                        message: "Who is the manager of the employee? Please enter manager id, if required."
                    }
                ]).then(function(result) {
                    addEmployee(result.firstname, result.lastname, result.role, result.manager);
                    });
            } else {
                start(); 
            }      
        });
}

// View Function

function viewFunction() {
    inquirer.prompt(
        {
            type: "list",
            name: "viewtables",
            message: "Which database table would you like to view?",
            choices: [
                "department",
                "role",
                "employee",
                "cancel view"
            ]
    }).then (function(result) {
        if (result.viewtables === "cancel view") {
            start();
        }
        else {
            viewTables(result.viewtables)
        }
    })
}


// Update Function

function updateFunction() {
    inquirer.prompt({
        type: "list",
        name: "updateDb",
        message: "What would you like to update?",
        choices: ["role", "cancel update"]
    }).then(function (result) {
        if (answer.updateDb === "cancel update") {
            start();
        }
        else {
            connection.query("SELECT * FROM employee", function (err, data) {
                if (err) throw err;
                if (answer.updateDb === "role") {
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "choice",
                            message:  "Which employee id needs to be updated?",
                            choices: renderEmployeeId(data)
                        },
                        {
                            type: "input",
                            name: "role",
                            message: "What is the new role of the employee? Please enter new role id."
                        }
                    ]).then(function (result) {
                        let newRoleId = setNewRoleId(data, result);
                        updateRole(data.role, newRoleId.id);
                    });
                }
            })
        }
    })
}

// Employee Id Array
function renderEmployeeId (result) {
    let employeeIdArray = [];
    for (var i = 0; i < result.length; i++) {
        employeeIdArray.push(result[i].id);
    }
    return employeeIdArray;
}

// Update new employee role ID
function setNewRoleId(data, result) {
    let newRoleId;
    for (var i = 0; i < result.length; i++) {
        if (result[i].id === data.choice) {
            newRoleId = result[i];
        }
    }
    return newRoleId;
}

// Add Department Query

function addDepartment(name) {
    connection.query("INSERT INTO department SET ?", 
    {
        department_name: name
    },
    function (err) {
        if (err) throw err;
        console.log(name + " department added to database");
        start();
    });
}

// Add Role Query
function addRole(title, salary, department) {
    const role = {
        title: title,
        salary: salary,
        department_id: department
    }
    connection.query("INSERT INTO role SET ?", role, function (err) {
        if (err) throw err;
        console.log(title + " role added to database");
        start();
    });
}


// Add Employee Query
function addEmployee(firstname, lastname, role, manager) {
    const employee = {
        first_name: firstname,
        last_name: lastname,
        role_id: role,
        manager_id: manager
    }
    connection.query("INSERT INTO employee SET ?", employee, function (err) {
        if (err) throw err;
        console.log(firstname + " " + lastname + " new employee added to database")
        start();
    })

}

// View Database Tables

function viewTables(table) {
    connection.query("SELECT * FROM " + table, function (err, result) {
        if (err) throw err;
        console.table(result);
        start();
    });
}