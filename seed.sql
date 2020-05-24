DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;

CREATE TABLE department(
  id INT AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(30) NOT NULL, -- dept name
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL, -- role title
  salary DECIMAL(8,2) NOT NULL, -- salary
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) references department(id)
);

CREATE TABLE employee(
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department(department_name) VALUES ('Audit');
INSERT INTO department(department_name) VALUES ('Tax');
INSERT INTO department(department_name) VALUES ('Marketing');
INSERT INTO department(department_name) VALUES ('Admin');

INSERT INTO role(title, salary, department_id) VALUES ('Manager', 100000, 1);
INSERT INTO role(title, salary, department_id) VALUES ('Accountant', 80000, 2);
INSERT INTO role(title, salary, department_id) VALUES ('Intern', 40000, 3);
INSERT INTO role(title, salary, department_id) VALUES ('Payroll Officer', 60000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('Madhavi', 'Murali', 1, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('Andrew', 'Harris', 2, 2);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('Anna', 'Lee', 3, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('Richard', 'Davis', 4, 4);

SELECT * FROM employee;