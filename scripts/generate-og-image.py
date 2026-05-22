#!/usr/bin/env python3
"""
Generate OG image for 'AI-Native 1,000 Club' blog post.
Follows Numbers Protocol official brand guideline:
- Palette: Black #1A1A1A, Cream #F4E9D5, Red #ED5D29
- Display: Roboto Mono Bold
- Tagline (verbatim): "Human Truth. Machine Proof."
- N mark: Black or White only
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
CJK_BOLD = Path(os.path.expanduser("~/.local/share/fonts/noto-cjk/NotoSansCJKtc-Bold.otf"))
CJK_REG = Path(os.path.expanduser("~/.local/share/fonts/noto-cjk/NotoSansCJKtc-Regular.otf"))

BLACK = (26, 26, 26)
CREAM = (244, 233, 213)
RED = (237, 93, 41)


def f(path, size):
    return ImageFont.truetype(str(path), size=size)


def text_w(draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0]


def draw_scanlines(img, opacity=8, spacing=3):
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for y in range(0, img.size[1], spacing):
        od.line([(0, y), (img.size[0], y)], fill=(26, 26, 26, opacity), width=1)
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def draw_n_mark(draw, x, y, size=42, color=BLACK):
    f_mark = f(ROBOTO_MONO_BOLD, size)
    draw.text((x, y), "N", font=f_mark, fill=color)
    w = text_w(draw, "N", f_mark)
    draw.rectangle([(x, y + size + 4), (x + w, y + size + 8)], fill=color)


def main():
    """
    Safe-area design:
    - Card thumbnails crop to ~aspect-[16/10] = 1.6:1, losing ~12% on each side.
    - All critical content lives in central 800px (x=200..1000).
    - Decorative brand elements (N mark, top tagline, bottom meta) sit in the
      outer 200px on each edge — OK if they get cropped on cards.
    """
    img = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(img)

    # Safe-area boundaries (visual debug — uncomment to inspect)
    # draw.rectangle([(200, 0), (1000, HEIGHT)], outline=(255, 0, 0, 128), width=1)

    # ----- DECORATIVE TOP BAR (outer area, may crop) -----
    draw_n_mark(draw, 60, 50, size=38, color=BLACK)
    f_top = f(ROBOTO_MONO_REG, 14)
    top_right = "PROVENANCE INFRASTRUCTURE FOR HUMANS & AI"
    tw = text_w(draw, top_right, f_top)
    draw.text((WIDTH - 60 - tw, 65), top_right, font=f_top, fill=BLACK)
    draw.rectangle([(60, 130), (WIDTH - 60, 131)], fill=BLACK)

    # ----- KICKER (within safe area) -----
    f_kick_en = f(ROBOTO_MONO_REG, 16)
    f_kick_cjk = f(CJK_REG, 16)
    kx, ky = 200, 158
    draw.text((kx, ky), "COFOUNDER NOTES  ·  ", font=f_kick_en, fill=BLACK)
    en_w = text_w(draw, "COFOUNDER NOTES  ·  ", f_kick_en)
    draw.text((kx + en_w, ky), "AI-Native 系列", font=f_kick_cjk, fill=BLACK)

    # ----- HERO: "0 → AI-NATIVE" (centered in safe area) -----
    # Pre-measure to center within safe zone x=200..1000 (width=800)
    f_hero_0 = f(ROBOTO_MONO_BOLD, 110)
    f_hero_native = f(ROBOTO_MONO_BOLD, 78)
    zero_w = text_w(draw, "0", f_hero_0)
    arrow_len = 64
    arrowhead_w = 20
    gap = 24
    native_w = text_w(draw, "AI-NATIVE", f_hero_native)
    total_w = zero_w + gap + arrow_len + arrowhead_w + gap + native_w
    # Center within x=200..1000 (i.e. start at x = 200 + (800-total_w)/2)
    hx = 200 + max(0, int((800 - total_w) / 2))
    hy = 220

    # "0" in red
    draw.text((hx, hy), "0", font=f_hero_0, fill=RED)

    # Arrow (drawn manually since Roboto Mono lacks → glyph)
    ax = hx + zero_w + gap
    ay = hy + 60  # vertical center
    draw.rectangle([(ax, ay - 3), (ax + arrow_len, ay + 3)], fill=BLACK)
    draw.polygon([
        (ax + arrow_len + arrowhead_w, ay),
        (ax + arrow_len, ay - 14),
        (ax + arrow_len, ay + 14),
    ], fill=BLACK)

    # AI-NATIVE
    nx = ax + arrow_len + arrowhead_w + gap
    draw.text((nx, hy + 18), "AI-NATIVE", font=f_hero_native, fill=BLACK)

    # ----- DIVIDER -----
    div_x = 200 + max(0, int((800 - 80) / 2))
    draw.rectangle([(div_x, 388), (div_x + 80, 392)], fill=RED)

    # ----- CJK TITLE (centered, within safe area) -----
    f_title = f(CJK_BOLD, 36)
    title_text = "從零開始的 AI 導入"
    title_w = text_w(draw, title_text, f_title)
    tx = 200 + max(0, int((800 - title_w) / 2))
    draw.text((tx, 410), title_text, font=f_title, fill=BLACK)

    f_sub = f(CJK_REG, 22)
    sub_text = "我們花了兩年才知道自己在做的事叫 AI-Native"
    sub_w = text_w(draw, sub_text, f_sub)
    sx = 200 + max(0, int((800 - sub_w) / 2))
    draw.text((sx, 466), sub_text, font=f_sub, fill=BLACK)

    # ----- DECORATIVE BOTTOM BAR (outer area, may crop) -----
    draw.rectangle([(60, 562), (WIDTH - 60, 563)], fill=BLACK)
    f_meta = f(ROBOTO_MONO_REG, 13)
    meta = "SOFIA YAN  ·  NUMBERS PROTOCOL  ·  2026.05.21"
    draw.text((60, 583), meta, font=f_meta, fill=BLACK)
    f_tag = f(ROBOTO_MONO_BOLD, 13)
    tag = "HUMAN TRUTH.  MACHINE PROOF."
    tlw = text_w(draw, tag, f_tag)
    draw.text((WIDTH - 60 - tlw, 583), tag, font=f_tag, fill=RED)

    img = draw_scanlines(img, opacity=8, spacing=3).convert("RGB")
    img.save(OUTPUT_PATH, format="PNG", optimize=True)
    img.save(OUTPUT_PATH.with_suffix(".jpg"), format="JPEG", quality=92, optimize=True)
    print(f"Wrote: {OUTPUT_PATH}")
    print(f"Wrote: {OUTPUT_PATH.with_suffix('.jpg')}")


if __name__ == "__main__":
    main()
