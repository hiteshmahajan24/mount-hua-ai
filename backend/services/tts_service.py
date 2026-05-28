import os
import time
import numpy as np
import soundfile as sf

from config.settings import (
    CACHE_FOLDER
)

from services.kokoro_service import (
    get_pipeline
)

from services.scene_analyzer import (
    analyze_scene
)
from services.text_normalizer import (
    normalize_text
)
from services.emotion_service import (
    detect_emotion,
    apply_emotion,
    get_emotion_speed
)

# ============================================
# GENERATE WAVS
# ============================================

def generate_wavs(scene):

    pipeline = get_pipeline()

    analyzed = analyze_scene(
        scene
    )

    # ========================================
    # MERGE SAME-VOICE SEGMENTS
    # ========================================

    merged_segments = []

    current = None

    for segment in analyzed:

        if (
            current
            and current["voice"]
            == segment["voice"]
        ):

            current["text"] += (
                " " + segment["text"]
            )

        else:

            if current:

                merged_segments.append(
                    current
                )

            current = segment

    if current:

        merged_segments.append(current)

    analyzed = merged_segments

    wav_files = []

    # ========================================
    # GENERATE AUDIO
    # ========================================

    for segment in analyzed:

        text = normalize_text(

            segment["text"]

        )

        emotion = detect_emotion(
            text
        )

        text = apply_emotion(
            text,
            emotion
        )

        if not text:
            continue

        temp_wav = os.path.join(

            CACHE_FOLDER,

            f"temp_{time.time_ns()}.wav"

        )

        try:

            speed = get_emotion_speed(
                emotion
            )

            generator = pipeline(

                text,

                voice=segment["voice"],

                speed=speed

            )

            # =================================
            # COLLECT ALL AUDIO CHUNKS
            # =================================

            audio_parts = []

            for gs, ps, audio in generator:

                audio_parts.append(
                    audio
                )

            # =================================
            # MERGE ALL AUDIO
            # =================================

            if not audio_parts:
                continue

            final_audio = np.concatenate(
                audio_parts
            )

            # =================================
            # SAVE COMPLETE AUDIO
            # =================================

            sf.write(
                temp_wav,
                final_audio,
                24000
            )

            wav_files.append(
                temp_wav
            )

        except Exception as e:

            print(
                f"\nKokoro Error: {e}"
            )

    return wav_files