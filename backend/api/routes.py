from fastapi import APIRouter
import threading

from services.progress_service import (
    load_progress
)

from services.chapter_service import (
    load_chapter_text,
    build_scenes
)

from services.player_service import (
    start_player,
    toggle_pause,
    stop_player
)

from services.playback_state import (
    playback_state
)

router = APIRouter()

# ============================================
# STATUS
# ============================================

@router.get("/status")
def get_status():

    progress = load_progress()

    return {

        "playing": playback_state["playing"],

        "paused": playback_state["paused"],

        "chapter": playback_state["chapter"],

        "scene": playback_state["scene"],

        "saved_progress": progress

    }

# ============================================
# PLAY
# ============================================

@router.post("/play/{chapter}")
def play_chapter(chapter: int):

    text = load_chapter_text(
        chapter
    )

    if not text:

        return {
            "error": "Chapter not found"
        }

    scenes = build_scenes(text)

    indexed_scenes = list(
        enumerate(scenes)
    )

    threading.Thread(

        target=start_player,

        args=(
            indexed_scenes,
            chapter,
            len(scenes)
        )

    ).start()

    return {

        "message": (
            f"Playing chapter "
            f"{chapter}"
        )

    }

# ============================================
# PAUSE
# ============================================

@router.post("/pause")
def pause():

    toggle_pause()

    return {

        "paused": playback_state["paused"]

    }

# ============================================
# STOP
# ============================================

@router.post("/stop")
def stop():

    stop_player()

    return {
        "stopped": True
    }

# ============================================
# CONTINUE
# ============================================

@router.post("/continue")
def continue_playback():

    progress = load_progress()

    chapter = progress["chapter"]

    text = load_chapter_text(
        chapter
    )

    if not text:

        return {
            "error": "Chapter not found"
        }

    scenes = build_scenes(text)

    indexed_scenes = list(
        enumerate(scenes)
    )

    indexed_scenes = indexed_scenes[
        progress["chunk"]:
    ]

    threading.Thread(

        target=start_player,

        args=(
            indexed_scenes,
            chapter,
            len(scenes)
        )

    ).start()

    return {

        "message": (
            f"Continuing chapter "
            f"{chapter}"
        )

    }

# ============================================
# HEALTH
# ============================================

@router.get("/health")
def health():

    return {
        "healthy": True
    }