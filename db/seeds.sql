
INSERT INTO department (dep_name) VALUES ("Management");
INSERT INTO department (dep_name) VALUES ("Coffee");
INSERT INTO department (dep_name) VALUES ("Kitchen");
INSERT INTO department (dep_name) VALUES ("Bar");


INSERT INTO roles (department_id, title, salary) VALUES (1, "General Manager", "30000.00");
INSERT INTO roles (department_id, title, salary) VALUES (1, "Assistent Manager", "24000.00");
INSERT INTO roles (department_id, title, salary) VALUES (1, "Supervisor", "20000.00");
INSERT INTO roles (department_id, title, salary) VALUES (2, "Barista", "18000.00");
INSERT INTO roles (department_id, title, salary) VALUES (3, "Chef", "22000.00");
INSERT INTO roles (department_id, title, salary) VALUES (4, "Bar Staff", "18000.00");


INSERT INTO employees (role_id, first_name, last_name) VALUES (1, "Ben", "Growcott");
INSERT INTO employees (role_id, manager_id, first_name, last_name) VALUES (2, 1, "Jak", "Bastable");
INSERT INTO employees (role_id, manager_id, first_name, last_name) VALUES (2, 1, "Larry", "David");
INSERT INTO employees (role_id, manager_id, first_name, last_name) VALUES (3, 2, "Jerry", "Seinfeld");
INSERT INTO employees (role_id, manager_id, first_name, last_name) VALUES (3, 2, "Charlie", "Kelly");
INSERT INTO employees (role_id, manager_id, first_name, last_name) VALUES (3, 3, "Dennis", "Reynolds");
INSERT INTO employees (role_id, manager_id, first_name, last_name) VALUES (4, 3, "Kate", "Blanchett");
INSERT INTO employees (role_id, manager_id, first_name, last_name) VALUES (4, 3, "Julia", "Dreyfus");
INSERT INTO employees (role_id, manager_id, first_name, last_name) VALUES (5, 1, "Amanda", "Haas");
INSERT INTO employees (role_id, manager_id, first_name, last_name) VALUES (5, 1, "Dee", "Reynolds");
INSERT INTO employees (role_id, manager_id, first_name, last_name) VALUES (6, 3, "Aaron", "Hickman");



