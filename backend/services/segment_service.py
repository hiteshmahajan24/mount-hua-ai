import re

# ============================================
# SPLIT INTO SEGMENTS
# ============================================

def segment_text(text):

    pattern = r'(".*?")'

    parts = re.split(
        pattern,
        text
    )

    segments = []

    for part in parts:

        part = part.strip()

        if not part:
            continue

        # ====================================
        # DIALOGUE
        # ====================================

        if (
            part.startswith('"')
            and part.endswith('"')
        ):

            segments.append({

                "type": "dialogue",

                "text": part

            })

        # ====================================
        # NARRATION
        # ====================================

        else:

            segments.append({

                "type": "narration",

                "text": part

            })

    return segments