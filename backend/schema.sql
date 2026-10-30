
USE employee_management;

-- Rename existing password column
ALTER TABLE employees
RENAME COLUMN password TO password_hash;

-- Add authentication and account management columns
ALTER TABLE employees
    ADD COLUMN email VARCHAR(150) UNIQUE AFTER employee_name,
    MODIFY department_id INT NULL,
    MODIFY designation_id INT NULL,
    MODIFY role ENUM('admin', 'manager', 'employee')
        NULL DEFAULT 'employee',
    ADD COLUMN status ENUM('active', 'inactive', 'locked')
        NOT NULL DEFAULT 'active',
    ADD COLUMN failed_attempts INT NOT NULL DEFAULT 0,
    ADD COLUMN must_change_password BOOLEAN NOT NULL DEFAULT FALSE;

-- Create password reset table
CREATE TABLE IF NOT EXISTS password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE CASCADE
);
