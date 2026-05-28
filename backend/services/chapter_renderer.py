import os
import json
import time
import numpy as np
import soundfile as sf

from pydub import AudioSegment

from config.settings import (
    DATA_DIR
)

from services.chapter_service import (
    load_chapter_text,
    build_scenes
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

from services.kokoro_service import (
    get_pipeline
)

# ============================================
# RENDER PATH
# ============================================

RENDER_DIR = (
    DATA_DIR / "rendered"
)

RENDER_DIR.mkdir(
    exist_ok=True
)

# ============================================
# RENDER CHAPTER
# ============================================

def render_chapter(chapter_num):

    print(
        f"\nRendering "
        f"Chapter {chapter_num}"
    )

    pipeline = get_pipeline()

    text = load_chapter_text(
        chapter_num
    )

    if not text:

        print("Chapter not found.")

        return False

    scenes = build_scenes(text)

    chapter_folder = (
        RENDER_DIR / str(chapter_num)
    )

    chapter_folder.mkdir(
        exist_ok=True
    )

    final_audio = AudioSegment.empty()

    timestamps = []

    current_time = 0

    # ========================================
    # PROCESS SCENES
    # ========================================

    for scene_index, scene in enumerate(scenes):

        print(
            f"Scene "
            f"{scene_index + 1}/"
            f"{len(scenes)}"
        )

        analyzed = analyze_scene(
            scene
        )

        for segment in analyzed:

            try:

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

                speed = get_emotion_speed(
                    emotion
                )

                generator = pipeline(

                    text,

                    voice=segment["voice"],

                    speed=speed

                )

                audio_parts = []

                for gs, ps, audio in generator:

                    audio_parts.append(
                        audio
                    )

                if not audio_parts:
                    continue

                final_np = np.concatenate(
                    audio_parts
                )

                temp_path = (
                    chapter_folder
                    / f"temp_{time.time_ns()}.wav"
                )

                sf.write(

                    temp_path,

                    final_np,

                    24000

                )

                segment_audio = AudioSegment.from_wav(
                    temp_path
                )

                duration = (
                    len(segment_audio)
                    / 1000
                )

                # ================================
                # TIMESTAMPS
                # ================================

                timestamps.append({

                    "start": current_time,

                    "end": (
                        current_time
                        + duration
                    ),

                    "speaker": segment["speaker"],

                    "text": text,

                    "emotion": emotion

                })

                current_time += duration

                final_audio += segment_audio

                os.remove(temp_path)

            except Exception as e:

                print(
                    f"\nRender Error: {e}"
                )

    # ========================================
    # EXPORT FINAL AUDIO
    # ========================================

    output_audio = (
        chapter_folder
        / "audio.wav"
    )

    final_audio.export(

        output_audio,

        format="wav"

    )

    # ========================================
    # SAVE TIMESTAMPS
    # ========================================

    timestamp_path = (
        chapter_folder
        / "timestamps.json"
    )

    with open(

        timestamp_path,

        "w",

        encoding="utf-8"

    ) as f:

        json.dump(

            timestamps,

            f,

            indent=4,

            ensure_ascii=False

        )

    print(
        "\nRendering Complete."
    )

    return True