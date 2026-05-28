
import subprocess
import time
import webbrowser
import os

# ============================================
# ROOT
# ============================================

ROOT = os.path.dirname(
    os.path.abspath(__file__)
)

BACKEND = os.path.join(
    ROOT,
    "backend"
)

FRONTEND = os.path.join(
    ROOT,
    "frontend"
)

# ============================================
# START BACKEND
# ============================================

print("\nStarting Backend...\n")

backend_process = subprocess.Popen(

    "uvicorn main:app --reload",

    cwd=BACKEND,

    shell=True

)

# ============================================
# START FRONTEND
# ============================================

print("\nStarting Frontend...\n")

frontend_process = subprocess.Popen(

    "npm run dev",

    cwd=FRONTEND,

    shell=True

)

# ============================================
# WAIT
# ============================================

time.sleep(5)

# ============================================
# OPEN BROWSER
# ============================================

webbrowser.open(
    "http://localhost:5173"
)

print("\nMount Hua AI Running.\n")

# ============================================
# KEEP ALIVE
# ============================================

backend_process.wait()

frontend_process.wait()
