from fastapi import APIRouter
from config.settings import CHAPTER_FOLDER
import os
import re

router = APIRouter()

@router.get("/chapters")
def get_chapters():

    chapters = []

    files = os.listdir(
        CHAPTER_FOLDER
    )

    for file in files:

        match = re.match(
            r"^(\d+)-(.*)\.txt$",
            file
        )

        if not match:
            continue

        chapter_num = int(
            match.group(1)
        )

        title = (
            match.group(2)
            .replace("-", " ")
            .title()
        )

        chapters.append({

            "chapter":
                chapter_num,

            "title":
                title

        })

    chapters.sort(

        key=lambda x:
            x["chapter"]

    )

    return chapters