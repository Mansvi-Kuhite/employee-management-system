# Employee Management System (EMS)

An Employee Management System with authentication, role-based access control, and password management.

## Setup Instructions

### Step 1: Create the Database

- Create a MySQL database named `employee_management`.
- Run the `schema.sql` file to create the required tables and columns.

### Step 2: Configure Environment Variables

- Copy `.env.example` to `.env` inside the `backend` folder.
- Copy `.env.example` to `.env` inside the `frontend` folder.
- Update both `.env` files with the required configuration values.

### Step 3: Start the Backend

```bash
cd backend
npm install
npm run dev
```

### Step 4: Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend URL displayed in the terminal to access the application.