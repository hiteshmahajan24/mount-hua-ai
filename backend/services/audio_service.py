import os
import gc
import numpy as np
import sounddevice as sd
import soundfile as sf

# ============================================
# GLOBAL VOLUME
# ============================================

current_volume = 1.0

# ============================================
# SET VOLUME
# ============================================

def set_volume(volume):

    global current_volume

    current_volume = volume

# ============================================
# GET VOLUME
# ============================================

def get_volume():

    return current_volume

# ============================================
# PLAY WAV
# ============================================

def play_wav(wav_path):

    data, samplerate = sf.read(
        wav_path
    )

    # ========================================
    # APPLY VOLUME BOOST
    # ========================================

    data = data * current_volume

    # Prevent clipping
    data = np.clip(data, -1.0, 1.0)

    sd.play(data, samplerate)

    sd.wait()

    del data

    gc.collect()

# ============================================
# STOP AUDIO
# ============================================

def stop_audio():

    sd.stop()

# ============================================
# DELETE WAV
# ============================================

def delete_wav(wav_path):

    try:

        if os.path.exists(wav_path):

            os.remove(wav_path)

    except Exception as e:

        print(
            f"\nDelete failed: "
            f"{wav_path}"
        )

        print(e)