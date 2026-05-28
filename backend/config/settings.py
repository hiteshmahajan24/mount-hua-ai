from pathlib import Path

# ============================================
# ROOT
# ============================================

BASE_DIR = Path(__file__).resolve().parent.parent

# ============================================
# DATA
# ============================================

DATA_DIR = BASE_DIR / "data"

CHAPTER_FOLDER = (
    DATA_DIR / "chapters"
)

CACHE_FOLDER = (
    DATA_DIR / "cache"
)

PROGRESS_FOLDER = (
    DATA_DIR / "progress"
)

LOG_FOLDER = (
    DATA_DIR / "logs"
)

# ============================================
# PROGRESS FILE
# ============================================

PROGRESS_FILE = (
    PROGRESS_FOLDER / "progress.json"
)

# ============================================
# CREATE DIRECTORIES
# ============================================

for folder in [

    DATA_DIR,

    CHAPTER_FOLDER,

    CACHE_FOLDER,

    PROGRESS_FOLDER,

    LOG_FOLDER

]:

    folder.mkdir(
        parents=True,
        exist_ok=True
    )