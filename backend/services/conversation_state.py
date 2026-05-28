# ============================================
# CONVERSATION STATE
# ============================================

class ConversationState:

    def __init__(self):

        self.current_speaker = None

        self.previous_speaker = None

        self.dialogue_streak = 0

        self.last_was_dialogue = False

    # ========================================
    # SET SPEAKER
    # ========================================

    def set_speaker(self, speaker):

        if speaker != self.current_speaker:

            self.previous_speaker = (
                self.current_speaker
            )

        self.current_speaker = speaker

    # ========================================
    # GET CURRENT SPEAKER
    # ========================================

    def get_speaker(self):

        return self.current_speaker

    # ========================================
    # GET PREVIOUS SPEAKER
    # ========================================

    def get_previous_speaker(self):

        return self.previous_speaker

    # ========================================
    # DIALOGUE START
    # ========================================

    def mark_dialogue(self):

        self.dialogue_streak += 1

        self.last_was_dialogue = True

    # ========================================
    # NARRATION RESET
    # ========================================

    def mark_narration(self):

        self.dialogue_streak = 0

        self.last_was_dialogue = False

    # ========================================
    # GET STREAK
    # ========================================

    def get_streak(self):

        return self.dialogue_streak