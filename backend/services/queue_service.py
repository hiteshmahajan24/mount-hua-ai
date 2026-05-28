import threading
import queue

from services.tts_service import (
    generate_wav
)

from services.audio_service import (
    play_wav,
    delete_wav
)

# ============================================
# AUDIO QUEUE
# ============================================

audio_queue = queue.Queue()

# ============================================
# PRODUCER
# ============================================

def producer(chunks):

    for chunk in chunks:

        wav_path = generate_wav(chunk)

        audio_queue.put(wav_path)

    audio_queue.put(None)

# ============================================
# CONSUMER
# ============================================

def consumer():

    while True:

        wav_path = audio_queue.get()

        if wav_path is None:
            break

        play_wav(wav_path)

        delete_wav(wav_path)

# ============================================
# START STREAM
# ============================================

def start_streaming(chunks):

    producer_thread = threading.Thread(
        target=producer,
        args=(chunks,)
    )

    consumer_thread = threading.Thread(
        target=consumer
    )

    producer_thread.start()

    consumer_thread.start()

    producer_thread.join()

    consumer_thread.join()