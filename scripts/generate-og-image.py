#!/usr/bin/env python3
"""
Generate OG image for the AI-Native 1,000 Club blog post.

Follows Numbers Protocol official brand guideline:
- Palette: Black #1A1A1A, Cream #F4E9D5, Red #ED5D29 (accents only)
- Display: Roboto Mono Bold
- Detail: Instrument Sans
- CJK: Noto Sans CJK TC
- Tagline: "Human Truth. Machine Proof." (verbatim, never altered)
- Subtle scan-line overlay (Numbers state)
- Layer-stack metaphor (Capture / Metadata / Seal / Trace)

Output: 1200x630 PNG + JPG suitable for og:image, Twitter card, FB share.
"""

import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 1200, 630
ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT / "public" / "images" / "posts" / "ai-native-1000-club"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_PATH = OUTPUT_DIR / "cover.png"

FONTS_DIR = ROOT / "scripts" / "fonts"
ROBOTO_MONO_BOLD = FONTS_DIR / "RobotoMono-Bold.ttf"
ROBOTO_MONO_REG = FONTS_DIR / "RobotoMono-Regular.ttf"
INSTRUMENT_SANS_REG = FONTS_DIR / "InstrumentSans-Regular.ttf"
INSTRUMENT_SANS_ITA = FONTS_DIR / "InstrumentSans-Italic.ttf"
CJK_BOLD = Path(os.path.expanduser("~/.local/share/fonts/noto-cjk/NotoSansCJKtc-Bold.otf"))
CJK_REG = Path(os.path.expanduser("~/.local/share/fonts/noto-cjk/NotoSansCJKtc-Regular.otf"))

# Official Numbers Protocol brand palette
BLACK = (26, 26, 26)        # #1A1A1A
CREAM = (244, 233, 213)     # #F4E9D5
RED = (237, 93, 41)         # #ED5D29
DARK_BLUE = (46, 82, 160)   # #2E52A0
INK_70 = (26, 26, 26, 178)
INK_40 = (26, 26, 26, 102)


def f(path, size):
    return ImageFont.truetype(str(path), size=size)


def text_w(draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0]


def draw_scanlines(img, opacity=10, spacing=3):
    """Subtle horizontal scan-line overlay (Numbers visual state)."""
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    for y in range(0, img.size[1], spacing):
        odraw.line([(0, y), (img.size[0], y)], fill=(26, 26, 26, opacity), width=1)
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def draw_n_mark(draw, x, y, size=44, color=BLACK):
    """Minimal 'N' mark — Numbers Protocol logo placeholder.
    Uses Roboto Mono Bold N as approximation since the official mark file
    isn't on disk. Per guideline: mark must be Black #1A1A1A or White only.
    """
    font_mark = f(ROBOTO_MONO_BOLD, size)
    draw.text((x, y), "N", font=font_mark, fill=color)
    # Underline accent
    mark_w = text_w(draw, "N", font_mark)
    draw.rectangle([(x, y + size + 4), (x + mark_w, y + size + 8)], fill=color)


def draw_layer_dots(draw, x, y, color=BLACK, spacing=14, count=4, radius=4):
    """Vertical layer-stack indicator (Capture / Metadata / Seal / Trace)."""
    for i in range(count):
        cy = y + i * spacing
        # Concentric ring for visual texture
        draw.ellipse([(x - radius, cy - radius), (x + radius, cy + radius)],
                     outline=color, width=2)


def main():
    # 1. Base canvas — Cream background per brand
    img = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(img)

    # ---------- TOP BAR ----------
    # Left: Numbers N mark
    draw_n_mark(draw, 60, 50, size=42, color=BLACK)

    # Right: tagline (small caps, Roboto Mono)
    font_tagline_top = f(ROBOTO_MONO_REG, 16)
    tagline_top = "PROVENANCE INFRASTRUCTURE FOR HUMANS & AI"
    tw = text_w(draw, tagline_top, font_tagline_top)
    draw.text((WIDTH - 60 - tw, 65), tagline_top, font=font_tagline_top, fill=BLACK)

    # Hairline under top bar
    draw.rectangle([(60, 130), (WIDTH - 60, 131)], fill=BLACK)

    # ---------- KICKER ----------
    # Render mixed Latin + CJK with two fonts side by side
    font_kicker_en = f(ROBOTO_MONO_REG, 18)
    font_kicker_cjk = f(CJK_REG, 18)
    kx, ky = 60, 156
    draw.text((kx, ky), "ONLY  ·  ", font=font_kicker_en, fill=BLACK)
    en_w = text_w(draw, "ONLY  ·  ", font_kicker_en)
    draw.text((kx + en_w, ky), "全球只有", font=font_kicker_cjk, fill=BLACK)

    # ---------- HERO NUMBER ----------
    # Slightly smaller, lifted higher to clear CJK subtitle below
    font_hero = f(ROBOTO_MONO_BOLD, 200)
    hero = "1,000"
    draw.text((52, 188), hero, font=font_hero, fill=BLACK)

    # Right-side editorial label
    font_side = f(ROBOTO_MONO_REG, 17)
    side_lines = [
        "AI-NATIVE COMPANIES",
        "GLOBALLY  ($5M+ ARR)",
        "",
        "—  GREG ISENBERG",
    ]
    sy = 230
    for line in side_lines:
        draw.text((780, sy), line, font=font_side, fill=BLACK)
        sy += 24

    # Layer-stack dots (Numbers visual language)
    draw_layer_dots(draw, 1100, 235, color=BLACK, spacing=18, count=4, radius=5)

    # ---------- DIVIDER between hero and CJK title ----------
    draw.rectangle([(60, 432), (140, 434)], fill=RED)

    # ---------- CJK TITLE (clear of hero descenders) ----------
    font_title = f(CJK_BOLD, 40)
    draw.text((60, 450), "家真正的 AI-Native 公司", font=font_title, fill=BLACK)

    font_subtitle = f(CJK_BOLD, 32)
    draw.text((60, 506), "你的新創如何擠進這份名單", font=font_subtitle, fill=BLACK)

    # ---------- BOTTOM BAR ----------
    # Hairline above footer
    draw.rectangle([(60, 562), (WIDTH - 60, 563)], fill=BLACK)

    # Left: author + venue
    font_meta = f(ROBOTO_MONO_REG, 15)
    meta_left = "SOFIA YAN  ·  APPWORKS KEYNOTE  ·  2026.06.03"
    draw.text((60, 583), meta_left, font=font_meta, fill=BLACK)

    # Right: brand tagline in Red — verbatim per guideline
    font_tag = f(ROBOTO_MONO_BOLD, 15)
    tagline = "HUMAN TRUTH.  MACHINE PROOF."
    tlw = text_w(draw, tagline, font_tag)
    draw.text((WIDTH - 60 - tlw, 583), tagline, font=font_tag, fill=RED)

    # ---------- SCAN-LINE OVERLAY ----------
    img = draw_scanlines(img, opacity=8, spacing=3).convert("RGB")

    # ---------- EXPORT ----------
    img.save(OUTPUT_PATH, format="PNG", optimize=True)
    jpg_path = OUTPUT_PATH.with_suffix(".jpg")
    img.save(jpg_path, format="JPEG", quality=92, optimize=True)
    print(f"Wrote: {OUTPUT_PATH}")
    print(f"Wrote: {jpg_path}")


if __name__ == "__main__":
    main()
