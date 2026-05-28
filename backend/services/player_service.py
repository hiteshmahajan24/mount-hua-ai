import threading
import queue
import time

from services.tts_service import (
    generate_wavs
)

from services.audio_service import (
    play_wav,
    delete_wav,
    stop_audio
)

from services.progress_service import (
    save_progress
)

from services.playback_state import (
    playback_state
)

# ============================================
# SETTINGS
# ============================================

MAX_BUFFER_SIZE = 5

# ============================================
# GLOBALS
# ============================================

audio_queue = queue.Queue(
    maxsize=MAX_BUFFER_SIZE
)

paused = False

stopped = False

current_chunk = 0

last_saved_chunk = -1

total_chunks = 0

current_chapter = 0

# ============================================
# PRODUCER
# ============================================

def producer(chunks):

    global stopped

    for real_index, chunk in chunks:

        if stopped:
            break

        # ====================================
        # WAIT FOR BUFFER SPACE
        # ====================================

        while audio_queue.full():

            if stopped:
                return

            time.sleep(0.1)

        try:

            wav_paths = generate_wavs(
                chunk
            )

            for wav_path in wav_paths:

                audio_queue.put(
                    (real_index, wav_path)
                )

        except Exception as e:

            print(
                f"\nTTS Error: {e}"
            )

    audio_queue.put(None)

# ============================================
# CONSUMER
# ============================================

def consumer():

    global paused
    global stopped
    global current_chunk
    global total_chunks
    global last_saved_chunk

    while True:

        if stopped:

            while not audio_queue.empty():

                try:
                    audio_queue.get_nowait()

                except:
                    pass

            break

        while paused:

            time.sleep(0.1)

        item = audio_queue.get()

        if item is None:
            break

        real_index, wav_path = item

        current_chunk = real_index

        playback_state["scene"] = (
            real_index
        )

        # ====================================
        # PRINT ONLY ON NEW SCENE
        # ====================================

        if real_index != last_saved_chunk:

            status = (

                f"\r▶ Scene "
                f"{real_index + 1}/{total_chunks} | "

                f"Buffered: "
                f"{audio_queue.qsize()}      "

            )

            print(
                status,
                end="",
                flush=True
            )
        # ====================================
        # PLAY AUDIO
        # ====================================

        play_wav(wav_path)

        # ====================================
        # DELETE CACHE FILE
        # ====================================

        delete_wav(wav_path)

        # ====================================
        # SAVE PROGRESS
        # ====================================

        if real_index != last_saved_chunk:

            save_progress(
                current_chapter,
                real_index
            )

            last_saved_chunk = real_index

        audio_queue.task_done()

# ============================================
# START PLAYER
# ============================================

def start_player(
    indexed_chunks,
    chapter_num,
    total,
    
):

    global paused
    global stopped
    global current_chunk
    global current_chapter
    global total_chunks
    global last_saved_chunk

    paused = False

    stopped = False

    current_chunk = 0

    last_saved_chunk = -1

    current_chapter = chapter_num

    total_chunks = total

    playback_state["playing"] = True

    playback_state["paused"] = False

    playback_state["chapter"] = chapter_num

    # ========================================
    # CLEAR OLD QUEUE
    # ========================================

    while not audio_queue.empty():

        try:

            audio_queue.get_nowait()

        except:

            pass

    producer_thread = threading.Thread(
        target=producer,
        args=(indexed_chunks,)
    )

    consumer_thread = threading.Thread(
        target=consumer
    )

    producer_thread.start()

    consumer_thread.start()

    return producer_thread, consumer_thread

# ============================================
# CONTROLS
# ============================================

def toggle_pause():

    global paused

    paused = not paused

    playback_state["paused"] = paused

    if paused:

        print("\n⏸ PAUSED")

    else:

        print("\n▶ RESUMED")

def stop_player():

    global stopped

    stopped = True

    playback_state["playing"] = False

    playback_state["paused"] = False

    stop_audio()

    print("\n⏹ STOPPED")