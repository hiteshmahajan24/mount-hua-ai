from pathlib import Path

from config.settings import (
    DATA_DIR
)

from services.chapter_renderer import (
    render_chapter
)

# ============================================
# RENDERED PATH
# ============================================

RENDER_DIR = (
    DATA_DIR / "rendered"
)

# ============================================
# ENSURE RENDER
# ============================================

def ensure_rendered(chapter_num):

    chapter_path = (
        RENDER_DIR
        / str(chapter_num)
    )

    audio_file = (
        chapter_path
        / "audio.wav"
    )

    timestamps_file = (
        chapter_path
        / "timestamps.json"
    )

    # ========================================
    # ALREADY EXISTS
    # ========================================

    if (

        audio_file.exists()

        and

        timestamps_file.exists()

    ):

        return True

    # ========================================
    # RENDER NOW
    # ========================================

    return render_chapter(
        chapter_num
    )