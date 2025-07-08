import csv
import random
import uuid
from datetime import datetime
from faker import Faker

# --- Configuration: Number of records to generate ---
NUM_BRANCHES = 50
NUM_EMPLOYEES = 500
NUM_CUSTOMERS = 8000
NUM_ACCOUNTS = 12000
NUM_TRANSACTIONS = 40000
BATCH_SIZE = 500  # How many rows to insert per statement

# --- Initialize Faker ---
fake = Faker()

# --- Helper function to format values for SQL ---
def format_sql_value(value):
    if value is None:
        return 'NULL'
    if isinstance(value, (int, float)):
        return str(value)
    # Escape single quotes for SQL
    clean_value = str(value).replace("'", "''")
    return f"'{clean_value}'"

# --- Main generation logic ---
def generate_sql_inserts():
    # To store generated primary keys for relational integrity
    branch_ids = []
    employee_ids = []
    customer_ids = []
    account_ids = []

    # Prepare data storage
    branches_data = []
    employees_data = []
    customers_data = []
    accounts_data = []
    transactions_data = []

    print("Generating mock data...")

    # 1. Branches
    for _ in range(NUM_BRANCHES):
        branch_id = str(uuid.uuid4())
        branch_ids.append(branch_id)
        branches_data.append({
            'id': branch_id,
            'name': f"{fake.city()} Central Branch",
            'address': fake.street_address(),
            'city': fake.city(),
            'state': fake.state_abbr(),
            'zip_code': fake.zipcode(),
            'manager_id': None,
            'created_at': fake.past_datetime(),
            'updated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })

    # 2. Employees
    positions = ['Teller', 'Loan Officer', 'Branch Manager', 'Personal Banker', 'Customer Service Rep']
    for _ in range(NUM_EMPLOYEES):
        employee_id = str(uuid.uuid4())
        employee_ids.append(employee_id)
        employees_data.append({
            'id': employee_id,
            'branch_id': random.choice(branch_ids),
            'name': fake.name(),
            'email': fake.unique.email(),
            'phone': fake.phone_number(),
            'position': random.choice(positions),
            'hire_date': fake.date_between(start_date='-10y', end_date='today'),
            'salary': round(random.uniform(40000, 150000), 2),
            'created_at': fake.past_datetime(),
            'updated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })

    # 3. Assign Managers to Branches (Post-processing)
    update_statements = []
    for branch in branches_data:
        manager = random.choice(employees_data)
        branch['manager_id'] = manager['id']
        update_statements.append(f"UPDATE branches SET manager_id = '{manager['id']}' WHERE id = '{branch['id']}';")


    # 4. Customers
    genders = ['Male', 'Female', 'Other']
    for _ in range(NUM_CUSTOMERS):
        customer_id = str(uuid.uuid4())
        customer_ids.append(customer_id)
        customers_data.append({
            'id': customer_id,
            'email': fake.unique.email(),
            'phone': fake.phone_number(),
            'address': fake.address().replace('\n', ', '),
            'first_name': fake.first_name(),
            'last_name': fake.last_name(),
            'date_of_birth': fake.date_of_birth(minimum_age=18, maximum_age=90),
            'gender': random.choice(genders),
            'national_id': fake.unique.ssn(),
            'created_at': fake.past_datetime(),
            'updated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'branch_id': random.choice(branch_ids)
        })

    # 5. Accounts
    account_types = ['Checking', 'Savings', 'Money Market', 'Certificate of Deposit']
    statuses = ['Active', 'Dormant', 'Closed']
    for _ in range(NUM_ACCOUNTS):
        account_id = str(uuid.uuid4())
        account_ids.append(account_id)
        accounts_data.append({
            'id': account_id,
            'customer_id': random.choice(customer_ids),
            'account_number': fake.unique.bban(),
            'type': random.choice(account_types),
            'balance': round(random.uniform(50, 25000), 2),
            'opened_at': fake.date_between(start_date='-15y', end_date='today'),
            'interest_rate': round(random.uniform(0.0001, 0.0525), 4),
            'status': random.choice(statuses),
            'branch_id': random.choice(branch_ids),
            'created_at': fake.past_datetime(),
            'updated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })

    # 6. Transactions
    transaction_types = ['Deposit', 'Withdrawal', 'Transfer', 'Payment', 'Fee']
    tx_statuses = ['Completed', 'Pending', 'Failed']
    descriptions = ['ATM Withdrawal', 'Online Shopping', 'Salary Deposit', 'Bill Payment', 'Bank Fee']
    for _ in range(NUM_TRANSACTIONS):
        transactions_data.append({
            'id': str(uuid.uuid4()),
            'account_id': random.choice(account_ids),
            'transaction_date': fake.date_time_between(start_date='-2y', end_date='now'),
            'amount': round(random.uniform(-5000, 5000), 2),
            'type': random.choice(transaction_types),
            'description': random.choice(descriptions),
            'status': random.choice(tx_statuses),
            'employee_id': random.choice(employee_ids) if random.random() < 0.2 else None,
            'created_at': fake.past_datetime(),
            'updated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
    
    print("Writing data to full_data_inserts.sql...")
    with open('full_data_inserts.sql', 'w') as f:
        # Dictionary of all data sets to iterate through
        all_data = {
            'branches': branches_data,
            'employees': employees_data,
            'customers': customers_data,
            'accounts': accounts_data,
            'transactions': transactions_data
        }

        for table_name, data in all_data.items():
            f.write(f"\n-- Inserting data into {table_name} --\n")
            # For branches, we need to insert without manager_id first
            if table_name == 'branches':
                for i in range(0, len(data), BATCH_SIZE):
                    batch = data[i:i + BATCH_SIZE]
                    columns = ['id', 'name', 'address', 'city', 'state', 'zip_code', 'manager_id', 'created_at', 'updated_at']
                    f.write(f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES\n")
                    value_strings = []
                    for row in batch:
                        # Set manager_id to NULL for initial insert
                        row_copy = row.copy()
                        row_copy['manager_id'] = None
                        value_strings.append(f"({', '.join([format_sql_value(row_copy.get(col)) for col in columns])})")
                    f.write(',\n'.join(value_strings) + ';\n')
                # Add the update statements after branches are inserted
                f.write(f"\n-- Updating manager_id for branches --\n")
                f.write('\n'.join(update_statements) + '\n')
            else:
                for i in range(0, len(data), BATCH_SIZE):
                    batch = data[i:i + BATCH_SIZE]
                    columns = list(batch[0].keys())
                    f.write(f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES\n")
                    value_strings = [f"({', '.join([format_sql_value(row.get(col)) for col in columns])})" for row in batch]
                    f.write(',\n'.join(value_strings) + ';\n')

    print("✅ Successfully created full_data_inserts.sql")

# --- Run the generator ---
if __name__ == "__main__":
    generate_sql_inserts()
