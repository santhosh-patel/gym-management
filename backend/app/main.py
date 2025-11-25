from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import event
from sqlalchemy.engine import Engine
from . import models, database
from .routers import members, plans, subscriptions, attendance

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Service Membership System")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(members.router)
app.include_router(plans.router)
app.include_router(subscriptions.router)
app.include_router(attendance.router)

# SQLite Trigger
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

# Apply Triggers on Startup
@app.on_event("startup")
def on_startup():
    # Apply SQLite trigger
    if "sqlite" in str(database.engine.url):
        from sqlalchemy import text
        with database.engine.connect() as connection:
            connection.execute(text("""
            CREATE TRIGGER IF NOT EXISTS update_total_check_ins
            AFTER INSERT ON attendance
            BEGIN
                UPDATE members
                SET total_check_ins = total_check_ins + 1
                WHERE id = NEW.member_id;
            END;
            """))
    
    # Apply Postgres trigger
    if "postgresql" in str(database.engine.url):
        from sqlalchemy import text
        try:
            with open("triggers.sql", "r") as f:
                sql_script = f.read()
            with database.engine.connect() as connection:
                connection.execute(text(sql_script))
                connection.commit()
            print("PostgreSQL triggers applied successfully.")
        except Exception as e:
            print(f"Error applying PostgreSQL triggers: {e}")

@app.get("/mongo-test")
def test_mongo():
    try:
        database.mongo_db.command('ping')
        return {"status": "success", "message": "Connected to MongoDB!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
