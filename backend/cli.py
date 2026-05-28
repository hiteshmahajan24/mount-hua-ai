from services.chapter_service import (
    load_chapter_text,
    build_scenes
)

from services.progress_service import (
    load_progress,
    save_progress
)

from services.player_service import (
    start_player,
    toggle_pause,
    stop_player
)

from services.kokoro_service import (
    initialize_pipeline
)


from services.audio_service import (
    set_volume,
    get_volume
)

# ============================================
# INITIALIZE KOKORO
# ============================================

initialize_pipeline()



# ============================================
# PLAY CHAPTER
# ============================================

def play_chapter(chapter_num):

    while True:

        progress = load_progress()

        saved_chunk = 0

        if (
            progress["chapter"]
            == chapter_num
        ):

            saved_chunk = progress["chunk"]

        text = load_chapter_text(
            chapter_num
        )

        if not text:

            print(
                f"\nChapter "
                f"{chapter_num} "
                f"not found."
            )

            return

        chunks = build_scenes(text)

        indexed_chunks = list(
            enumerate(chunks)
        )

        indexed_chunks = indexed_chunks[
            saved_chunk:
        ]

        print(
            f"\nNow Playing "
            f"Chapter {chapter_num}"
        )

        print(
            f"Resuming from "
            f"chunk {saved_chunk + 1}"
        )


        print(
            f"Volume: "
            f"{int(get_volume()*100)}%"
        )

        producer_thread, consumer_thread = (
            start_player(
                indexed_chunks,
                chapter_num,
                len(chunks)
            )
        )

        while consumer_thread.is_alive():

            try:

                command = input(
                    "\n[P] Pause | [S] Stop\n> "
                ).lower().strip()

                if command == "p":

                    toggle_pause()

                elif command == "s":

                    stop_player()

                    break

            except KeyboardInterrupt:

                stop_player()

                break

        print(
            f"\nFinished "
            f"Chapter {chapter_num}"
        )

        chapter_num += 1

        save_progress(
            chapter_num,
            0
        )

        print(
            f"\nAuto-starting "
            f"Chapter {chapter_num}..."
        )

# ============================================
# MENU
# ============================================

while True:

    print("\n====================")
    print("MOUNT HUA AI")
    print("====================")

    print("1. Continue")
    print("2. Choose Chapter")
    print("3. Volume")
    print("4. Exit")

    choice = input("\nSelect: ")

    # ========================================
    # CONTINUE
    # ========================================

    if choice == "1":

        progress = load_progress()

        play_chapter(
            progress["chapter"]
        )

    # ========================================
    # CHOOSE CHAPTER
    # ========================================

    elif choice == "2":

        try:

            chap = int(
                input(
                    "\nEnter chapter number: "
                )
            )

            play_chapter(chap)

        except Exception as e:

            print(e)

    # ========================================
    # VOLUME
    # ========================================

    elif choice == "3":

        print("\nVolume Levels:")

        print("1. 100%")
        print("2. 150%")
        print("3. 200%")
        print("4. 300%")

        volume_choice = input(
            "\nChoose volume: "
        )

        volume_map = {
            "1": 1.0,
            "2": 1.5,
            "3": 2.0,
            "4": 3.0
        }

        if volume_choice in volume_map:

            set_volume(
                volume_map[volume_choice]
            )

            print(
                f"\nVolume set to "
                f"{int(get_volume()*100)}%"
            )

        else:

            print("Invalid volume.")

    # ========================================
    # EXIT
    # ========================================

    elif choice == "4":

        break

    # ========================================
    # INVALID
    # ========================================

    else:

        print("Invalid option.")