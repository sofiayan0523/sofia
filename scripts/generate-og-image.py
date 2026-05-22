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
    img = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(img)

    # ----- TOP BAR -----
    draw_n_mark(draw, 60, 50, size=42, color=BLACK)
    f_top = f(ROBOTO_MONO_REG, 16)
    top_right = "PROVENANCE INFRASTRUCTURE FOR HUMANS & AI"
    tw = text_w(draw, top_right, f_top)
    draw.text((WIDTH - 60 - tw, 65), top_right, font=f_top, fill=BLACK)
    draw.rectangle([(60, 130), (WIDTH - 60, 131)], fill=BLACK)

    # ----- KICKER -----
    f_kick_en = f(ROBOTO_MONO_REG, 17)
    f_kick_cjk = f(CJK_REG, 17)
    kx, ky = 60, 158
    draw.text((kx, ky), "COFOUNDER NOTES  ·  ", font=f_kick_en, fill=BLACK)
    en_w = text_w(draw, "COFOUNDER NOTES  ·  ", f_kick_en)
    draw.text((kx + en_w, ky), "AI-Native 系列  ·  No. 01", font=f_kick_cjk, fill=BLACK)

    # ----- HERO: "0 → AI-NATIVE" -----
    # "0" in red at full hero size
    f_hero = f(ROBOTO_MONO_BOLD, 120)
    hx, hy = 60, 200
    draw.text((hx, hy), "0", font=f_hero, fill=RED)
    zero_w = text_w(draw, "0", f_hero)

    # Hand-drawn arrow (Roboto Mono lacks → glyph)
    ax = hx + zero_w + 30
    ay = hy + 70  # vertical center of the arrow
    arrow_len = 80
    # Horizontal shaft
    draw.rectangle([(ax, ay - 4), (ax + arrow_len, ay + 4)], fill=BLACK)
    # Arrowhead (triangle)
    draw.polygon([
        (ax + arrow_len + 24, ay),
        (ax + arrow_len, ay - 18),
        (ax + arrow_len, ay + 18),
    ], fill=BLACK)

    # AI-NATIVE
    f_native = f(ROBOTO_MONO_BOLD, 95)
    nx = ax + arrow_len + 50
    draw.text((nx, hy + 10), "AI-NATIVE", font=f_native, fill=BLACK)

    # ----- DIVIDER -----
    draw.rectangle([(60, 380), (140, 384)], fill=RED)

    # ----- CJK TITLE -----
    f_title = f(CJK_BOLD, 36)
    draw.text((60, 400), "從零開始的 AI 導入", font=f_title, fill=BLACK)
    f_sub = f(CJK_REG, 24)
    draw.text((60, 455), "我們花了兩年才知道自己在做的事叫 AI-Native", font=f_sub, fill=BLACK)

    # ----- THREE STAGES TIMELINE (horizontal, below CJK title) -----
    ty = 510
    f_stage_lbl = f(ROBOTO_MONO_BOLD, 11)
    f_stage_yr = f(ROBOTO_MONO_REG, 10)
    stages = [
        ("2023 ─ 2024", "PROMPT", BLACK),
        ("2024 ─ 2025", "CONTEXT", BLACK),
        ("2025 ─ NOW", "HARNESS", RED),
    ]
    # We hide this here — stages will live as a dedicated chart in the post body.
    # Keep clean OG with just hero + CJK title.

    # ----- BOTTOM BAR -----
    draw.rectangle([(60, 562), (WIDTH - 60, 563)], fill=BLACK)
    f_meta = f(ROBOTO_MONO_REG, 15)
    meta = "SOFIA YAN  ·  NUMBERS PROTOCOL  ·  2026.05.21"
    draw.text((60, 583), meta, font=f_meta, fill=BLACK)
    f_tag = f(ROBOTO_MONO_BOLD, 15)
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
