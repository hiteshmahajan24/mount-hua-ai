
import subprocess
import sys
import os
import shutil

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
# RUN COMMAND
# ============================================

def run(command, cwd=None):

    result = subprocess.run(

        command,

        cwd=cwd,

        shell=True

    )

    if result.returncode != 0:

        print(
            f"\nFAILED: {command}"
        )

        sys.exit(1)

# ============================================
# CHECK PYTHON
# ============================================

print("\nChecking Python...\n")

run("python --version")

# ============================================
# INSTALL BACKEND REQUIREMENTS
# ============================================

print("\nInstalling Backend Requirements...\n")

run(

    "pip install -r requirements.txt",

    cwd=ROOT

)

# ============================================
# INSTALL FRONTEND
# ============================================

print("\nInstalling Frontend Dependencies...\n")

run(

    "npm install",

    cwd=FRONTEND

)

# ============================================
# CHECK FFMPEG
# ============================================

print("\nChecking FFmpeg...\n")

if shutil.which("ffmpeg") is None:

    print(
        "\nFFmpeg not found."
    )

    print(
        "Install FFmpeg and add to PATH."
    )

    sys.exit(1)

print("\nFFmpeg OK.\n")

# ============================================
# START APP
# ============================================

print("\nLaunching Mount Hua AI...\n")

run(
    "python auto_run.py",
    cwd=ROOT
)
