import os
import re
import time
import random
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

# =========================================================
# SETTINGS
# =========================================================

PROJECT_URL = (
    "https://skydemonorder.com/projects/"
    "3801994495-return-of-the-mount-hua-sect"
)

BASE_DOMAIN = "https://skydemonorder.com"

START_CHAPTER = 285
END_CHAPTER = 1268

SAVE_FOLDER = "chapters"

HEADLESS = False

BREAK_EVERY = 15
BREAK_TIME = 60

# =========================================================
# CREATE SAVE FOLDER
# =========================================================

os.makedirs(SAVE_FOLDER, exist_ok=True)

# =========================================================
# CLEAN FILENAMES
# =========================================================

def clean_filename(name):

    return re.sub(
        r'[\\/*?:"<>|]',
        "",
        name
    )

# =========================================================
# FILTER BAD TEXT
# =========================================================

BAD_TEXT = [
    "404",
    "Cloudflare",
    "Discover translated novels",
    "Premium",
    "Show all",
    "JavaScript",
    "This content is intended for adults only"
]

def valid_text(text):

    if len(text) < 20:
        return False

    for bad in BAD_TEXT:

        if bad in text:
            return False

    return True

# =========================================================
# START PLAYWRIGHT
# =========================================================

with sync_playwright() as p:

    browser = p.chromium.launch(
        headless=HEADLESS,
        slow_mo=50,
        args=[
            "--disable-blink-features=AutomationControlled",
            "--start-maximized"
        ]
    )

    context = browser.new_context(
        user_agent=(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/122.0.0.0 Safari/537.36"
        ),
        viewport={
            "width": 1366,
            "height": 768
        },
        locale="en-US",
        timezone_id="Asia/Kolkata"
    )

    page = context.new_page()

    # =====================================================
    # OPEN PROJECT PAGE
    # =====================================================

    print("\nOpening project page...")

    page.goto(
        PROJECT_URL,
        timeout=60000,
        wait_until="networkidle"
    )

    page.wait_for_timeout(8000)

    # =====================================================
    # CLICK SHOW ALL
    # =====================================================

    try:

        print("\nClicking Show All...")

        page.locator("text=Show all").click(
            timeout=10000
        )

        page.wait_for_timeout(10000)

        print("Expanded chapter list.")

    except Exception as e:

        print("\nCould not click Show All")
        print(e)

    # =====================================================
    # SCROLL TO LOAD ALL CHAPTERS
    # =====================================================

    print("\nScrolling page...")

    previous_height = 0

    for _ in range(40):

        page.mouse.wheel(0, 25000)

        page.wait_for_timeout(
            random.randint(500, 1500)
        )

        current_height = page.evaluate(
            "document.body.scrollHeight"
        )

        if current_height == previous_height:
            break

        previous_height = current_height

    print("\nCollecting chapter URLs...")

    # =====================================================
    # COLLECT LINKS
    # =====================================================

    chapter_links = page.locator(
        "a[href*='return-of-the-mount-hua-sect']"
    )

    count = chapter_links.count()

    print(f"Found {count} visible links")

    chapter_map = {}

    for i in range(count):

        try:

            link = chapter_links.nth(i)

            href = link.get_attribute("href")

            if not href:
                continue

            if "/projects/" not in href:
                continue

            text = link.text_content(timeout=300)

            if not text:
                continue

            match = re.search(
                r'Ch\.\s*(\d+)',
                text
            )

            if not match:
                continue

            chapter_num = int(match.group(1))

            if not (
                START_CHAPTER <= chapter_num <= END_CHAPTER
            ):
                continue

            # Build full URL
            if href.startswith("/"):

                href = BASE_DOMAIN + href

            chapter_map[chapter_num] = href

            print(
                f"Collected Chapter "
                f"{chapter_num}"
            )

        except:
            continue

    # =====================================================
    # SORT FORWARD
    # =====================================================

    sorted_chapters = sorted(
        chapter_map.items(),
        key=lambda x: x[0]
    )

    print(
        f"\nCollected "
        f"{len(sorted_chapters)} chapters total."
    )

    # =====================================================
    # DOWNLOAD CHAPTERS
    # =====================================================

    downloaded = 0

    for chapter_num, chapter_url in sorted_chapters:

        try:

            slug = chapter_url.split("/")[-1]

            filename = (
                clean_filename(slug)
                + ".txt"
            )

            filepath = os.path.join(
                SAVE_FOLDER,
                filename
            )

            # =============================================
            # SKIP EXISTING
            # =============================================

            if os.path.exists(filepath):

                print(
                    f"\nSkipping existing "
                    f"Chapter {chapter_num}"
                )

                continue

            print(
                f"\nOpening Chapter "
                f"{chapter_num}"
            )

            print(chapter_url)

            # =============================================
            # OPEN CHAPTER PAGE
            # =============================================

            page.goto(
                chapter_url,
                timeout=60000,
                wait_until="networkidle"
            )

            page.wait_for_timeout(
                random.randint(4000, 7000)
            )

            # =============================================
            # SCROLL FOR LAZY LOAD
            # =============================================

            for _ in range(3):

                page.mouse.wheel(0, 15000)

                page.wait_for_timeout(
                    random.randint(800, 2000)
                )

            # =============================================
            # GET HTML
            # =============================================

            html = page.content()

            soup = BeautifulSoup(
                html,
                "html.parser"
            )

            paragraphs = soup.find_all("p")

            chapter_text = []

            for p_tag in paragraphs:

                text = p_tag.get_text(
                    strip=True
                )

                if valid_text(text):

                    chapter_text.append(text)

            if not chapter_text:

                print(
                    "No valid text found."
                )

                continue

            # =============================================
            # SAVE CHAPTER
            # =============================================

            final_text = "\n\n".join(
                chapter_text
            )

            with open(
                filepath,
                "w",
                encoding="utf-8"
            ) as f:

                f.write(final_text)

            print(
                f"Saved: {filename}"
            )

            downloaded += 1

            # =============================================
            # TAKE BREAKS
            # =============================================

            if downloaded % BREAK_EVERY == 0:

                print(
                    f"\nResting for "
                    f"{BREAK_TIME} seconds..."
                )

                time.sleep(BREAK_TIME)

        except Exception as e:

            print(
                f"\nFAILED Chapter "
                f"{chapter_num}"
            )

            print(e)

            continue

    browser.close()

print("\nDONE.")