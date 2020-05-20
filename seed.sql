DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employeess_db;
USE employees_db;

CREATE TABLE department(
  id INT AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(30), -- dept name
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