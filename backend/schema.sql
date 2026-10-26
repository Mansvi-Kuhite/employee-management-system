USE employee_management;

ALTER TABLE employees RENAME COLUMN password TO password_hash;

ALTER TABLE employees
  ADD COLUMN email VARCHAR(150) UNIQUE AFTER employee_name,
  MODIFY department_id INT NULL,
  MODIFY designation_id INT NULL,
  MODIFY role ENUM('admin','manager','employee') NOT NULL DEFAULT 'employee',
  ADD COLUMN status ENUM('active','inactive','locked') NOT NULL DEFAULT 'active',
  ADD COLUMN failed_attempts INT NOT NULL DEFAULT 0,
  ADD COLUMN must_change_password BOOLEAN NOT NULL DEFAULT FALSE;