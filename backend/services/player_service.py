
import vlc
import threading
import time

from services.playback_state import (
    playback_state
)

# ============================================
# VLC
# ============================================

instance = vlc.Instance()

player = instance.media_player_new()

# ============================================
# GLOBALS
# ============================================

current_audio = None

monitor_thread = None

monitoring = False

# ============================================
# MONITOR PLAYER
# ============================================
def monitor_playback():

    global monitoring

    while monitoring:

        try:

            current = player.get_time()

            duration = player.get_length()

            if current >= 0:

                playback_state["current_time"] = (

                    current / 1000

                )

            if duration >= 0:

                playback_state["duration"] = (

                    duration / 1000

                )

            state = player.get_state()

            if str(state) == "State.Ended":

                playback_state["playing"] = False

                playback_state["paused"] = False

                monitoring = False

                break

            time.sleep(0.3)

        except Exception as e:

            print(e)
# ============================================
# START AUDIO
# ============================================
def start_audio(audio_path):

    global current_audio
    global monitor_thread
    global monitoring

    # ========================================
    # RESUME IF PAUSED
    # ========================================

    if playback_state["paused"]:

        player.pause()

        playback_state["paused"] = False

        playback_state["playing"] = True

        return

    # ========================================
    # AVOID RESTARTING SAME AUDIO
    # ========================================

    if (

        playback_state["playing"]

        and

        current_audio == str(audio_path)

    ):

        return

    current_audio = str(audio_path)

    media = instance.media_new(
        current_audio
    )

    player.set_media(media)

        
    player.play()

    # ========================================
    # WAIT FOR VLC TO LOAD
    # ========================================

    for _ in range(20):

        duration = player.get_length()

        if duration > 0:

            break

        time.sleep(0.2)


    playback_state["playing"] = True

    playback_state["paused"] = False

    # ========================================
    # START MONITOR THREAD
    # ========================================

    if not monitoring:

        monitoring = True

        monitor_thread = threading.Thread(

            target=monitor_playback,

            daemon=True

        )

        monitor_thread.start()
# ============================================
# PAUSE
# ============================================
def pause_audio():

    player.pause()

    # ========================================
    # TOGGLE
    # ========================================

    if playback_state["paused"]:

        playback_state["paused"] = False

        playback_state["playing"] = True

    else:

        playback_state["paused"] = True

        playback_state["playing"] = False

# ============================================
# SEEK
# ============================================

def seek(seconds):

    player.set_time(
        int(seconds * 1000)
    )

# ============================================
# VOLUME
# ============================================

def set_volume(volume):

    player.audio_set_volume(
        int(volume)
    )

# ============================================
# SPEED
# ============================================

def set_speed(speed):

    player.set_rate(
        float(speed)
    )

# ============================================
# GETTERS
# ============================================

def get_current_time():

    return playback_state[
        "current_time"
    ]

def get_duration():

    return playback_state[
        "duration"
    ]
