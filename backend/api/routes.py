from fastapi import APIRouter


from services.progress_service import (
    load_progress
)
from services.player_service import (

    get_current_time,
    get_duration,
    seek,
    set_volume,
    set_speed

)


from services.render_service import (
    ensure_rendered
)

from services.player_service import (
    start_audio,
    pause_audio
)

from config.settings import (
    DATA_DIR
)

from services.playback_state import (
    playback_state
)

router = APIRouter()

# ============================================
# STATUS
# ============================================

from fastapi.responses import FileResponse

@router.get("/audio/{chapter}")
def get_audio(chapter: int):

    audio_path = (
        DATA_DIR
        / "rendered"
        / str(chapter)
        / "audio.wav"
    )

    return FileResponse(
        audio_path,
        media_type="audio/wav"
    )


from fastapi.responses import FileResponse

@router.get("/timestamps/{chapter}")
def get_timestamps(chapter: int):

    timestamp_path = (
        DATA_DIR
        / "rendered"
        / str(chapter)
        / "timestamps.json"
    )

    return FileResponse(
        timestamp_path,
        media_type="application/json"
    )

@router.get("/status")
def get_status():

    progress = load_progress()

    return {

    "playing": playback_state["playing"],

    "paused": playback_state["paused"],

    "chapter": playback_state["chapter"],

    "current_time": get_current_time(),

    "duration": get_duration(),

    "volume": playback_state["volume"],

    "speed": playback_state["speed"],

    "saved_progress": progress

    }


@router.post("/prepare/{chapter}")
def prepare_chapter(chapter: int):

    success = ensure_rendered(chapter)

    if not success:

        return {
            "error": "Render failed"
        }

    return {

        "audio_url":
        f"/audio/{chapter}",

        "timestamps_url":
        f"/timestamps/{chapter}"

    }

# ============================================
# PLAY
# ============================================


@router.post("/play/{chapter}")
def play_chapter(chapter: int):

    success = ensure_rendered(
        chapter
    )

    if not success:

        return {
            "error": "Render failed"
        }

    audio_path = (

        DATA_DIR
        / "rendered"
        / str(chapter)
        / "audio.wav"

    )

    playback_state["chapter"] = (
        chapter
    )

    start_audio(audio_path)

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

    pause_audio()

    return {

        "paused": playback_state["paused"]

    }


# ============================================
# HEALTH
# ============================================

@router.get("/health")
def health():

    return {
        "healthy": True
    }


# ============================================
# SET VOLUME
# ============================================

@router.post("/volume/{volume}")
def change_volume(volume: int):

    set_volume(volume)

    playback_state["volume"] = volume

    return {

        "volume": volume

    }


# ============================================
# SET SPEED
# ============================================

@router.post("/speed/{speed}")
def change_speed(speed: float):

    set_speed(speed)

    playback_state["speed"] = speed

    return {

        "speed": speed

    }


# ============================================
# SEEK
# ============================================

@router.post("/seek/{seconds}")
def seek_audio(seconds: int):

    seek(seconds)

    return {

        "seeked_to": seconds

    }