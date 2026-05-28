import os
import re
import random
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

# =========================
# SETTINGS
# =========================

PROJECT_URL = "https://skydemonorder.com/projects/3801994495-return-of-the-mount-hua-sect"

START_CHAPTER = 285
END_CHAPTER = 1268

SAVE_FOLDER = "chapters"

HEADLESS = False

# =========================
# CREATE FOLDER
# =========================

os.makedirs(SAVE_FOLDER, exist_ok=True)

# =========================
# CLEAN FILENAMES
# =========================

def clean_filename(name):
    return re.sub(r'[\\/*?:"<>|]', "", name)

# =========================
# START
# =========================

with sync_playwright() as p:

    browser = p.chromium.launch(
        headless=HEADLESS,
        slow_mo=100,
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
        viewport={"width": 1366, "height": 768},
        locale="en-US",
        timezone_id="Asia/Kolkata"
    )

    page = context.new_page()

    print("\nOpening project page...")

    page.goto(
        PROJECT_URL,
        timeout=60000,
        wait_until="networkidle"
    )

    page.wait_for_timeout(8000)

    # =========================
    # CLICK SHOW ALL
    # =========================

    try:

        print("\nClicking Show All...")

        page.locator("text=Show all").click()

        page.wait_for_timeout(10000)

    except Exception as e:

        print("Show All failed:")
        print(e)

    # =========================
    # FIND CHAPTER ELEMENTS
    # =========================

    print("\nGetting visible chapter links...")

    # Get only REAL visible links
    chapter_links = page.locator("a[href*='return-of-the-mount-hua-sect']")

    count = chapter_links.count()

    print(f"\nFound {count} links")

    visited = set()

    for i in range(count):

        try:

            link = chapter_links.nth(i)

            # Skip hidden elements
            if not link.is_visible():
                continue

            text = link.inner_text(timeout=2000)

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

            href = link.get_attribute("href")

            if not href:
                continue

            # Build full URL
            if href.startswith("/"):

                chapter_url = (
                    "https://skydemonorder.com"
                    + href
                )

            else:
                chapter_url = href

            # Skip duplicates
            if chapter_url in visited:
                continue

            visited.add(chapter_url)

            print(f"\nOpening Chapter {chapter_num}")
            print(chapter_url)

            slug = chapter_url.split("/")[-1]

            filename = clean_filename(slug) + ".txt"

            filepath = os.path.join(
                SAVE_FOLDER,
                filename
            )

            # Skip existing
            if os.path.exists(filepath):

                print("Already exists.")
                continue

            # Open chapter directly
            page.goto(
                chapter_url,
                timeout=60000,
                wait_until="networkidle"
            )

            page.wait_for_timeout(
                random.randint(5000, 9000)
            )

            # Scroll for lazy loading
            page.mouse.wheel(0, 8000)

            page.wait_for_timeout(
                random.randint(2000, 4000)
            )

            html = page.content()

            soup = BeautifulSoup(
                html,
                "html.parser"
            )

            paragraphs = soup.find_all("p")

            chapter_text = []

            for p_tag in paragraphs:

                ptext = p_tag.get_text(strip=True)

                if (
                    len(ptext) > 20
                    and "404" not in ptext
                    and "Cloudflare" not in ptext
                    and "Discover translated novels" not in ptext
                    and "Premium" not in ptext
                ):

                    chapter_text.append(ptext)

            if chapter_text:

                final_text = "\n\n".join(chapter_text)

                with open(
                    filepath,
                    "w",
                    encoding="utf-8"
                ) as f:

                    f.write(final_text)

                print(f"Saved: {filename}")

            else:

                print("No text found.")

            # Return to project page
            page.goto(
                PROJECT_URL,
                timeout=60000,
                wait_until="networkidle"
            )

            page.wait_for_timeout(5000)

        except Exception as e:

            print("\nFAILED:")
            print(e)

            try:

                page.goto(
                    PROJECT_URL,
                    timeout=60000,
                    wait_until="networkidle"
                )

            except:
                pass