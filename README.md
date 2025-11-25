# Service Membership System

A robust full-stack application for managing service memberships (gyms, salons, coaching centers). It features a **FastAPI** backend, a **React** frontend, and supports multiple databases (**SQLite**, **PostgreSQL**, **MongoDB**) with automated database triggers.

##  Features

- **Member Management**: Register and track members.
- **Membership Plans**: Create flexible plans with duration and pricing.
- **Subscriptions**: Assign plans to members; automatically calculates expiry.
- **Attendance System**: Check-in members and validate active subscriptions.
- **Automated Triggers**: Automatically increments member check-in counts upon attendance.
- **Multi-Database Support**:
  - **SQLite**: Default, zero-configuration.
  - **PostgreSQL**: Production-ready relational DB.
  - **MongoDB**: For logging or auxiliary data (connection ready).
- **Modern UI**: Clean, responsive interface built with React and Vite.

##  Tech Stack

- **Backend**: Python 3.9+, FastAPI, SQLAlchemy, Pydantic
- **Frontend**: React 18, Vite, CSS Modules / Vanilla CSS
- **Database**: SQLite (default), PostgreSQL, MongoDB
- **DevOps**: Docker, Docker Compose

---

## Installation & Setup

### Option 1: Local Setup (Recommended for Development)

#### Backend
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Start the server:
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```
    The API will be available at `http://localhost:8000`.

#### Frontend
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The UI will be available at `http://localhost:5173`.

### Option 2: Docker Setup

If you have Docker installed, you can run the entire stack with one command.

1.  Run Docker Compose:
    ```bash
    docker-compose up --build
    ```
    - **Frontend**: `http://localhost:5173`
    - **Backend**: `http://localhost:8000`
    - **PostgreSQL**: Port `5432`

---

##  Database Configuration

### 1. SQLite (Default)
The application uses SQLite by default (`gym.db`). No configuration is needed. The database trigger for `total_check_ins` is automatically applied on application startup.

### 2. PostgreSQL
To use PostgreSQL:
1.  Set the `DATABASE_URL` environment variable in `backend/app/database.py` or your shell.
    ```bash
    export DATABASE_URL="postgresql://user:password@localhost/dbname"
    ```
2.  **Triggers**: The application attempts to apply the Postgres trigger automatically on startup. Alternatively, you can manually apply it using the provided SQL script:
    ```bash
    psql -U user -d dbname -f backend/triggers.sql
    ```

### 3. MongoDB
The application connects to MongoDB using the `MONGO_URI` environment variable.
- Default URI: `mongodb+srv://alex_forger:xetImrkz9bEF1txU@test.g3pyyfm.mongodb.net/?appName=test`
- **Test Endpoint**: `GET /mongo-test` verifies the connection.

---

## API Endpoints

Interactive documentation is available at `http://localhost:8000/docs`.

### Members
- `GET /members`: List all members.
- `POST /members`: Register a new member.
- `GET /members/{id}/attendance`: Get attendance history.
- `GET /members/{id}/current-subscription`: Get active subscription details.

### Plans
- `GET /plans`: List available membership plans.
- `POST /plans`: Create a new plan.

### Subscriptions
- `GET /subscriptions`: List all subscriptions.
- `POST /subscriptions`: Assign a plan to a member.

### Attendance
- `POST /attendance/check-in`: Check in a member.
  - **Logic**: Verifies if the member has an active subscription. If yes, records attendance and increments `total_check_ins`.

---

## Database Triggers

The system implements a database-level trigger to maintain data integrity for `total_check_ins`.

**Logic:**
- **Event**: `AFTER INSERT` on `attendance` table.
- **Action**: `UPDATE members SET total_check_ins = total_check_ins + 1 WHERE id = NEW.member_id`

**Implementation:**
- **SQLite**: Defined in `backend/app/main.py` (applied via SQLAlchemy event listener).
- **PostgreSQL**: Defined in `backend/triggers.sql`.

---

## Verification

A test script is included to verify the entire flow (Create Plan -> Create Member -> Subscribe -> Check-in -> Verify Trigger).

Run the test script:
```bash
python test_flow.py
```

**Expected Output:**
```
Starting verification...
Creating Plan...
Plan created: ...
Creating Member...
Member: ...
Creating Subscription...
Subscription created.
Checking In...
Check-in successful.
Verifying Trigger...
SUCCESS: Trigger worked!
Listing Subscriptions...
SUCCESS: Listed subscriptions.
```
