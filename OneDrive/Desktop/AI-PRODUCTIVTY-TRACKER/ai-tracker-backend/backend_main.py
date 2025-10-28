import sqlite3
import time
import threading
from datetime import datetime, timedelta
import fastapi
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import psutil
import win32gui
import win32process
import logging

# --- Configuration ---
DATABASE_FILE = "productivity_log.db"
LOG_INTERVAL_SECONDS = 5  # Check activity every 5 seconds
API_PORT = 8000
# Allow requests from the default Vite dev server port
ALLOWED_ORIGINS = ["http://localhost:5173"]

# Basic classification rules (expandable)
PRODUCTIVE_APPS = ["code", "pycharm", "word", "excel", "powerpnt", "notepad", "sublime", "cmd", "powershell", "explorer", "devenv"] # Added devenv for Visual Studio
UNPRODUCTIVE_KEYWORDS = ["youtube", "netflix", "spotify", "discord", "instagram", "whatsapp", "facebook", "reddit", "twitter"]

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Database Setup ---
def init_db():
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME NOT NULL,
            process_name TEXT,
            window_title TEXT,
            classification TEXT -- 'Productive', 'Unproductive', 'Neutral'
        )
    """)
    conn.commit()
    conn.close()
    logging.info("Database initialized.")

# --- Activity Tracking ---
def get_active_window_info():
    """Gets the process name and window title of the foreground window."""
    try:
        hwnd = win32gui.GetForegroundWindow()
        if not hwnd:
            return "idle", "No active window"
        _, pid = win32process.GetWindowThreadProcessId(hwnd)
        process = psutil.Process(pid)
        process_name = process.name().lower().replace(".exe", "") # Clean up process name
        window_title = win32gui.GetWindowText(hwnd)
        return process_name, window_title
    except (psutil.NoSuchProcess, psutil.AccessDenied, pywintypes.error) as e:
        logging.warning(f"Could not get window info: {e}")
        return "unknown", "Error fetching title"
    except Exception as e:
        logging.error(f"Unexpected error getting window info: {e}", exc_info=True)
        return "unknown", "Unknown Error"

def classify_activity(process_name, window_title):
    """Classifies activity based on simple rules."""
    if process_name == "idle" or not window_title or window_title == "No active window":
        return "Idle" # Or 'Neutral' if preferred

    if process_name in PRODUCTIVE_APPS:
        return "Productive"

    title_lower = window_title.lower()
    for keyword in UNPRODUCTIVE_KEYWORDS:
        if keyword in title_lower or keyword in process_name:
            return "Unproductive"

    # Default to Neutral if no specific rule matches
    return "Neutral"

def log_activity(conn, process_name, window_title, classification):
    """Inserts the current activity into the database."""
    cursor = conn.cursor()
    timestamp = datetime.now()
    try:
        cursor.execute("""
            INSERT INTO activities (timestamp, process_name, window_title, classification)
            VALUES (?, ?, ?, ?)
        """, (timestamp, process_name, window_title, classification))
        conn.commit()
        logging.debug(f"Logged: {timestamp} - {process_name} - {classification}")
    except sqlite3.Error as e:
        logging.error(f"Database error during insert: {e}")

# --- Background Task ---
stop_event = threading.Event()

def log_activity_periodically():
    """Background task to log activity at regular intervals."""
    last_process = None
    last_title = None
    conn = sqlite3.connect(DATABASE_FILE, check_same_thread=False)
    logging.info("Activity logging thread started.")
    while not stop_event.is_set():
        try:
            process_name, window_title = get_active_window_info()

            # Log only if the window/process has changed to avoid redundant entries
            if process_name != last_process or window_title != last_title:
                classification = classify_activity(process_name, window_title)
                log_activity(conn, process_name, window_title, classification)
                last_process, last_title = process_name, window_title
            else:
                 logging.debug("Activity unchanged, skipping log.")

            time.sleep(LOG_INTERVAL_SECONDS)
        except Exception as e:
            logging.error(f"Error in logging loop: {e}", exc_info=True)
            time.sleep(LOG_INTERVAL_SECONDS * 2) # Wait longer after an error
    conn.close()
    logging.info("Activity logging thread stopped.")

# --- FastAPI Application ---
app = fastapi.FastAPI(title="Productivity Tracker Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_db()
    # Start the background logging thread
    log_thread = threading.Thread(target=log_activity_periodically, daemon=True)
    log_thread.start()
    logging.info("FastAPI app started, logging thread initiated.")

@app.on_event("shutdown")
def shutdown_event():
    stop_event.set()
    logging.info("Shutdown signal received, stopping logging thread.")

@app.get("/api/logs")
async def get_logs(limit: int = 100):
    """Returns the most recent activity logs."""
    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = sqlite3.Row # Return results as dict-like rows
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT id, timestamp, process_name, window_title, classification
            FROM activities
            ORDER BY timestamp DESC
            LIMIT ?
        """, (limit,))
        logs = cursor.fetchall()
        return [dict(log) for log in logs] # Convert rows to dictionaries
    except sqlite3.Error as e:
        logging.error(f"Database error fetching logs: {e}")
        raise fastapi.HTTPException(status_code=500, detail="Database error fetching logs")
    finally:
        conn.close()

@app.get("/api/summary")
async def get_summary(days: int = 1):
    """Calculates and returns a summary of productive/unproductive/neutral time."""
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()
    end_time = datetime.now()
    start_time = end_time - timedelta(days=days)

    summary = {"Productive": 0, "Unproductive": 0, "Neutral": 0, "Idle": 0}
    total_seconds = 0

    try:
        # Fetch logs within the specified time range
        cursor.execute("""
            SELECT timestamp, classification
            FROM activities
            WHERE timestamp BETWEEN ? AND ?
            ORDER BY timestamp ASC
        """, (start_time, end_time))
        logs = cursor.fetchall()

        if not logs:
            return {"message": "No activity logged in the specified period.", "summary": summary, "total_seconds": 0}

        # Calculate time difference between consecutive logs
        last_time = datetime.fromisoformat(logs[0][0])
        for i in range(1, len(logs)):
            current_time = datetime.fromisoformat(logs[i][0])
            duration = (current_time - last_time).total_seconds()

            # Cap duration at a reasonable maximum to avoid huge gaps counting as one activity
            # e.g. if the tracker was off overnight. Max interval * 3 seems reasonable.
            duration = min(duration, LOG_INTERVAL_SECONDS * 3)

            classification = logs[i-1][1] # Attribute duration to the *previous* log's classification
            if classification in summary:
                summary[classification] += duration
            total_seconds += duration
            last_time = current_time

        # Convert seconds to hours for readability (optional)
        summary_hours = {k: round(v / 3600, 2) for k, v in summary.items()}

        return {"summary_seconds": summary, "summary_hours": summary_hours, "total_seconds_tracked": total_seconds}

    except sqlite3.Error as e:
        logging.error(f"Database error fetching summary: {e}")
        raise fastapi.HTTPException(status_code=500, detail="Database error fetching summary")
    except Exception as e:
        logging.error(f"Error calculating summary: {e}", exc_info=True)
        raise fastapi.HTTPException(status_code=500, detail=f"Error calculating summary: {e}")
    finally:
        conn.close()

# --- Run the App ---
if __name__ == "__main__":
    # Import pywintypes here to handle potential import issues early
    try:
        import pywintypes
    except ImportError:
        logging.error("pywintypes could not be imported. Ensure pywin32 is installed correctly.")
        exit(1)

    print(f"Starting backend server on http://localhost:{API_PORT}")
    uvicorn.run(app, host="0.0.0.0", port=API_PORT)
