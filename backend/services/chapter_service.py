import os
import re

from config.settings import (
    CHAPTER_FOLDER
)

# ============================================
# GET CHAPTER FILE
# ============================================

def get_chapter_file(chapter_num):

    chapter_num = int(chapter_num)

    if not os.path.exists(CHAPTER_FOLDER):

        return None

    files = os.listdir(CHAPTER_FOLDER)

    for file in files:

        match = re.match(
            r"^(\d+)-",
            file
        )

        if not match:
            continue

        num = int(match.group(1))

        if num == chapter_num:

            return os.path.join(
                CHAPTER_FOLDER,
                file
            )

    return None

# ============================================
# LOAD CHAPTER TEXT
# ============================================

def load_chapter_text(chapter_num):

    chapter_file = get_chapter_file(
        chapter_num
    )

    if not chapter_file:

        return None

    with open(
        chapter_file,
        "r",
        encoding="utf-8"
    ) as f:

        return f.read()

# ============================================
# SPLIT TEXT
# ============================================

import re

# ============================================
# BUILD SCENES
# ============================================
def build_scenes(text):

    # ========================================
    # CLEAN
    # ========================================

    text = text.replace(
        "\r",
        ""
    )

    paragraphs = [

        p.strip()

        for p in text.split("\n")

        if p.strip()

    ]

    scenes = []

    current_scene = ""

    for paragraph in paragraphs:

        # ====================================
        # KEEP ADDING
        # ====================================

        if len(current_scene) < 1800:

            current_scene += (
                "\n" + paragraph
            )

        # ====================================
        # SAVE
        # ====================================

        else:

            scenes.append(
                current_scene.strip()
            )

            current_scene = paragraph

    # ========================================
    # FINAL
    # ========================================

    if current_scene:

        scenes.append(
            current_scene.strip()
        )

    return scenes