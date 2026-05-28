import re

from services.character_db import (
    CHARACTERS
)

from services.conversation_state import (
    ConversationState
)

# ============================================
# GLOBAL CONVERSATION STATE
# ============================================

state = ConversationState()

# ============================================
# FIND CHARACTER
# ============================================

def find_character(text):

    text = text.lower()

    for character in CHARACTERS:

        if character in text:

            return character

    return None

# ============================================
# IS DIALOGUE
# ============================================

def is_dialogue(text):

    return (

        (
            text.startswith('"')
            and text.endswith('"')
        )

        or

        (
            text.startswith('“')
            and text.endswith('”')
        )

    )

# ============================================
# ANALYZE SCENE
# ============================================

def analyze_scene(scene):

    # ========================================
    # SPLIT KEEPING QUOTES
    # ========================================

    pattern = r'([“"].*?[”"])'

    parts = re.split(
        pattern,
        scene
    )

    segments = []

    previous_narration = ""

    for part in parts:

        part = part.strip()

        if not part:
            continue

        # ====================================
        # DIALOGUE
        # ====================================

        if is_dialogue(part):

            detected_character = (
                find_character(
                    previous_narration
                )
            )

            if detected_character:

                state.set_speaker(
                    detected_character
                )

            active_speaker = (
                state.get_speaker()
            )

            # ========================================
            # SOFT SPEAKER ALTERNATION
            # ========================================

            if (

                state.last_was_dialogue

                and

                state.get_streak() >= 2

                and

                state.get_previous_speaker()

            ):

                # ====================================
                # ONLY SWITCH IF NO STRONG DETECTION
                # ====================================

                if not detected_character:

                    active_speaker = (

                        state.get_previous_speaker()

                    )
            # =================================
            # VOICE
            # =================================

            if (
                active_speaker
                and active_speaker
                in CHARACTERS
            ):

                voice = CHARACTERS[
                    active_speaker
                ]["voice"]

            else:

                voice = CHARACTERS[
                    "male"
                ]["voice"]

            state.mark_narration()

            segments.append({

                "type": "dialogue",

                "speaker": (
                    active_speaker
                    or "unknown"
                ),

                "voice": voice,

                "text": part

            })

        # ====================================
        # NARRATION
        # ====================================

        else:

            previous_narration = part

            detected_character = (
                find_character(part)
            )

            if detected_character:

                state.set_speaker(
                    detected_character
                )

            segments.append({

                "type": "narration",

                "speaker": "narrator",

                "voice": CHARACTERS[
                    "narrator"
                ]["voice"],

                "text": part

            })

    return segments