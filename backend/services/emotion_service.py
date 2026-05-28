import re

# ============================================
# DETECT EMOTION
# ============================================

def detect_emotion(text):

    text_lower = text.lower()

    # ========================================
    # SHOUTING
    # ========================================

    if (

        text.isupper()

        or

        "!" in text

    ):

        return "angry"

    # ========================================
    # SAD
    # ========================================

    sad_words = [

        "sigh",
        "sob",
        "pain",
        "hurt",
        "tears",
        "weakly"

    ]

    if any(

        word in text_lower

        for word in sad_words

    ):

        return "sad"

    # ========================================
    # HAPPY
    # ========================================

    happy_words = [

        "haha",
        "laughed",
        "smiled",
        "grinned"

    ]

    if any(

        word in text_lower

        for word in happy_words

    ):

        return "happy"

    # ========================================
    # SHOCK
    # ========================================

    shock_words = [

        "what",
        "impossible",
        "how",
        "no way"

    ]

    if any(

        word in text_lower

        for word in shock_words

    ):

        return "shocked"

    # ========================================
    # CALM
    # ========================================

    return "neutral"

# ============================================
# APPLY EMOTION
# ============================================

def apply_emotion(text, emotion):

    # ========================================
    # ANGRY
    # ========================================

    if emotion == "angry":

        text = text.replace(
            "!",
            "!!"
        )

        text += "!"

    # ========================================
    # SAD
    # ========================================

    elif emotion == "sad":

        text = (
            "... "
            + text
        )

    # ========================================
    # HAPPY
    # ========================================

    elif emotion == "happy":

        text = text.replace(
            ".",
            "..."
        )

    # ========================================
    # SHOCKED
    # ========================================

    elif emotion == "shocked":

        text = text.replace(
            "?",
            "?!"
        )

    return text

# ============================================
# GET EMOTION SPEED
# ============================================

def get_emotion_speed(emotion):

    speeds = {

        # ====================================
        # FAST
        # ====================================

        "angry": 1.20,

        "happy": 1.10,

        "shocked": 1.15,

        # ====================================
        # SLOW
        # ====================================

        "sad": 0.88,

        # ====================================
        # NORMAL
        # ====================================

        "neutral": 1.0

    }

    return speeds.get(
        emotion,
        1.0
    )