#!/usr/bin/env python3
"""
Generate OG covers for Sofia's AI series posts.

Follows the Numbers brand palette and typography already used by
generate-og-image.py, but parameterizes post-specific copy.
"""

import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 1200, 630
ROOT = Path(__file__).resolve().parent.parent
FONTS_DIR = ROOT / "scripts" / "fonts"

ROBOTO_MONO_BOLD = FONTS_DIR / "RobotoMono-Bold.ttf"
ROBOTO_MONO_REG = FONTS_DIR / "RobotoMono-Regular.ttf"
CJK_BOLD = Path(os.path.expanduser("~/.local/share/fonts/noto-cjk/NotoSansCJKtc-Bold.otf"))
CJK_REG = Path(os.path.expanduser("~/.local/share/fonts/noto-cjk/NotoSansCJKtc-Regular.otf"))

BLACK = (26, 26, 26)
CREAM = (244, 233, 213)
GREEN = (127, 156, 126)
YELLOW = (216, 183, 106)
RED = (237, 93, 41)
BLUE = (46, 82, 160)


POSTS = [
    {
        "slug": "humanities-ai-expert",
        "kicker": "COFOUNDER NOTES  /  AI ADOPTION",
        "label": "HUMANITIES",
        "title": ["文組人不是", "AI 時代的弱勢"],
        "subtitle": "企業 AI 導入裡常被漏看的角色",
        "accent": GREEN,
    },
    {
        "slug": "ai-anxiety-survival-guide",
        "kicker": "COFOUNDER NOTES  /  AI ANXIETY",
        "label": "8% / 92%",
        "title": ["AI 焦慮", "也許是一種提醒"],
        "subtitle": "不要把價值綁在可以被自動化的事情上",
        "accent": RED,
    },
    {
        "slug": "why-95-percent-ai-adoption-fails",
        "kicker": "COFOUNDER NOTES  /  ENTERPRISE AI",
        "label": "95%",
        "title": ["AI pilot 失敗", "不是工具不夠多"],
        "subtitle": "讀 MIT GenAI Divide 報告後想到的幾個企業現場",
        "accent": BLUE,
    },
]


def font(path, size):
    return ImageFont.truetype(str(path), size=size)


def text_w(draw, text, fnt):
    bbox = draw.textbbox((0, 0), text, font=fnt)
    return bbox[2] - bbox[0]


def draw_scanlines(img, opacity=8, spacing=3):
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for y in range(0, img.size[1], spacing):
        od.line([(0, y), (img.size[0], y)], fill=(26, 26, 26, opacity), width=1)
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def draw_n_mark(draw, x, y, size=38, color=BLACK):
    f_mark = font(ROBOTO_MONO_BOLD, size)
    draw.text((x, y), "N", font=f_mark, fill=color)
    w = text_w(draw, "N", f_mark)
    draw.rectangle([(x, y + size + 4), (x + w, y + size + 8)], fill=color)


def centered(draw, text, fnt, y, fill, left=200, width=800):
    w = text_w(draw, text, fnt)
    x = left + max(0, int((width - w) / 2))
    draw.text((x, y), text, font=fnt, fill=fill)


def generate(post):
    out_dir = ROOT / "public" / "images" / "posts" / post["slug"]
    out_dir.mkdir(parents=True, exist_ok=True)
    out_png = out_dir / "cover.png"
    out_jpg = out_dir / "cover.jpg"

    img = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(img)

    draw_n_mark(draw, 60, 50)
    f_top = font(ROBOTO_MONO_REG, 14)
    top_right = "HUMAN TRUTH. MACHINE PROOF."
    draw.text((WIDTH - 60 - text_w(draw, top_right, f_top), 65), top_right, font=f_top, fill=BLACK)
    draw.rectangle([(60, 130), (WIDTH - 60, 131)], fill=BLACK)

    f_kick = font(ROBOTO_MONO_REG, 16)
    draw.text((200, 160), post["kicker"], font=f_kick, fill=BLACK)

    f_label = font(ROBOTO_MONO_BOLD, 82)
    label_w = text_w(draw, post["label"], f_label)
    label_x = 200 + max(0, int((800 - label_w) / 2))
    label_y = 205
    pad_x, pad_y = 24, 10
    draw.rectangle(
        [(label_x - pad_x, label_y - 2), (label_x + label_w + pad_x, label_y + 94)],
        fill=post["accent"],
    )
    draw.text((label_x, label_y), post["label"], font=f_label, fill=CREAM)

    f_title = font(CJK_BOLD, 44)
    centered(draw, post["title"][0], f_title, 350, BLACK)
    centered(draw, post["title"][1], f_title, 405, BLACK)

    draw.rectangle([(560, 474), (640, 478)], fill=post["accent"])
    f_sub = font(CJK_REG, 22)
    centered(draw, post["subtitle"], f_sub, 500, BLACK)

    draw.rectangle([(60, 562), (WIDTH - 60, 563)], fill=BLACK)
    f_meta = font(ROBOTO_MONO_REG, 13)
    meta = f"SOFIA YAN  /  NUMBERS PROTOCOL  /  {post['slug'].upper()}"
    draw.text((60, 583), meta, font=f_meta, fill=BLACK)
    tag = "PROVENANCE INFRASTRUCTURE FOR HUMANS & AI"
    draw.text((WIDTH - 60 - text_w(draw, tag, f_meta), 583), tag, font=f_meta, fill=post["accent"])

    final = draw_scanlines(img, opacity=8, spacing=3).convert("RGB")
    final.save(out_png, format="PNG", optimize=True)
    final.save(out_jpg, format="JPEG", quality=92, optimize=True)
    print(out_png)
    print(out_jpg)


def main():
    for post in POSTS:
        generate(post)


if __name__ == "__main__":
    main()
