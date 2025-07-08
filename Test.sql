-- 1. Create the 'branches' table
CREATE TABLE branches (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    manager_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create the 'employees' table
CREATE TABLE employees (
    id VARCHAR(255) PRIMARY KEY,
    branch_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    position VARCHAR(100),
    hire_date DATE,
    salary DECIMAL(12, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- 3. Add the manager_id foreign key to the 'branches' table
-- This is done after 'employees' is created to resolve the circular dependency.
ALTER TABLE branches ADD CONSTRAINT fk_manager
FOREIGN KEY (manager_id) REFERENCES employees(id);

-- 4. Create the 'customers' table
CREATE TABLE customers (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    national_id VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    branch_id VARCHAR(255),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- 5. Create the 'accounts' table
CREATE TABLE accounts (
    id VARCHAR(255) PRIMARY KEY,
    customer_id VARCHAR(255) NOT NULL,
    account_number VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50),
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    opened_at DATE,
    interest_rate DECIMAL(5, 4),
    status VARCHAR(50),
    branch_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- 6. Create the 'transactions' table
CREATE TABLE transactions (
    id VARCHAR(255) PRIMARY KEY,
    account_id VARCHAR(255) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(50),
    description VARCHAR(255),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    employee_id VARCHAR(255),
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

