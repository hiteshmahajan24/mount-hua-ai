import os
import json

from config.settings import (
    PROGRESS_FILE
)

# ============================================
# DEFAULT PROGRESS
# ============================================

DEFAULT_PROGRESS = {
    "chapter": 285,
    "chunk": 0
}

# ============================================
# LOAD PROGRESS
# ============================================

def load_progress():

    if not os.path.exists(PROGRESS_FILE):

        save_progress(285, 0)

        return DEFAULT_PROGRESS

    try:

        with open(PROGRESS_FILE, "r") as f:

            data = json.load(f)

        # Ensure keys exist
        if "chapter" not in data:

            data["chapter"] = 285

        if "chunk" not in data:

            data["chunk"] = 0

        return data

    except:

        save_progress(285, 0)

        return DEFAULT_PROGRESS

# ============================================
# SAVE PROGRESS
# ============================================

def save_progress(chapter, chunk):

    with open(PROGRESS_FILE, "w") as f:

        json.dump(
            {
                "chapter": chapter,
                "chunk": chunk
            },
            f,
            indent=4
        )