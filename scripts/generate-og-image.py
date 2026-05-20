#!/usr/bin/env python3
"""
Generate OG image for the AI-Native 1,000 Club blog post.
Brand colors:
- Pure Black #000000
- Pure White #ffffff
- New Numbers Blue #00C9FF
- New Capture Blue #0000D8

Output: 1200x630 PNG suitable for og:image, Twitter card, FB share.
"""

import os
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 1200, 630
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "posts" / "ai-native-1000-club"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_PATH = OUTPUT_DIR / "cover.png"

# Brand palette
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
NUMBERS_BLUE = (0, 201, 255)   # #00C9FF
CAPTURE_BLUE = (0, 0, 216)     # #0000D8
GREY = (160, 160, 160)


CJK_BOLD = os.path.expanduser("~/.local/share/fonts/noto-cjk/NotoSansCJKtc-Bold.otf")
CJK_REGULAR = os.path.expanduser("~/.local/share/fonts/noto-cjk/NotoSansCJKtc-Regular.otf")


def font(bold: bool, size: int):
    path = CJK_BOLD if bold else CJK_REGULAR
    try:
        return ImageFont.truetype(path, size=size)
    except Exception:
        # Fallback: search common locations
        candidates = []
        for d in ["/usr/share/fonts", "/usr/local/share/fonts",
                  os.path.expanduser("~/.fonts"),
                  os.path.expanduser("~/.local/share/fonts")]:
            for root, _, files in os.walk(d):
                for f in files:
                    candidates.append(os.path.join(root, f))
        keyword = "Bold" if bold else "Regular"
        for p in candidates:
            if "CJK" in p and keyword in p:
                try:
                    return ImageFont.truetype(p, size=size)
                except Exception:
                    continue
        return ImageFont.load_default()


def main():
    img = Image.new("RGB", (WIDTH, HEIGHT), BLACK)
    draw = ImageDraw.Draw(img)

    # Top-left brand mark band (Numbers Blue stripe)
    draw.rectangle([(0, 0), (24, HEIGHT)], fill=NUMBERS_BLUE)

    # Large "1,000" hero number
    font_huge = font(bold=True, size=180)
    font_label = font(bold=False, size=28)
    font_title = font(bold=True, size=46)
    font_sub = font(bold=False, size=24)
    font_byline = font(bold=False, size=24)

    # Label
    draw.text((80, 60), "全球只有", font=font_label, fill=GREY)

    # Hero number 1,000
    draw.text((80, 95), "1,000", font=font_huge, fill=NUMBERS_BLUE)

    # Subtitle line beside hero (clear of comma descender)
    draw.text((80, 320), "家真正的 AI-Native 公司", font=font_title, fill=WHITE)

    # Main title
    draw.text((80, 395), "你的新創如何擠進這份名單", font=font_title, fill=WHITE)

    # Decorative line separator
    draw.rectangle([(80, 490), (160, 494)], fill=NUMBERS_BLUE)

    # Byline / source
    draw.text((80, 515), "Sofia Yan  ·  6/3 AppWorks Keynote", font=font_byline, fill=NUMBERS_BLUE)
    draw.text((80, 555), "sofia-s-blog  ·  Numbers Protocol", font=font_sub, fill=GREY)

    # Save PNG (for inspection)
    img.save(OUTPUT_PATH, format="PNG", optimize=True)
    # Save JPG (smaller, recommended for og:image)
    jpg_path = OUTPUT_PATH.with_suffix(".jpg")
    img.convert("RGB").save(jpg_path, format="JPEG", quality=90, optimize=True)

    print(f"Wrote: {OUTPUT_PATH}")
    print(f"Wrote: {jpg_path}")


if __name__ == "__main__":
    main()
