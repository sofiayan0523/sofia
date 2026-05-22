#!/usr/bin/env python3
"""
Generate 5 inline charts for 'AI-Native' blog post.
All charts follow Numbers Protocol brand guideline:
- Palette: Black #1A1A1A, Cream #F4E9D5, Red #ED5D29, Dark Blue #2E52A0
- Display: Roboto Mono / CJK: Noto Sans CJK TC
- Subtle scan-line overlay
- Hairline grid layout
- 1200x630 (matches OG format, plays well as inline blog image)
"""

import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 1200, 630
ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT / "public" / "images" / "posts" / "ai-native-1000-club"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

FONTS_DIR = ROOT / "scripts" / "fonts"
RM_BOLD = FONTS_DIR / "RobotoMono-Bold.ttf"
RM_REG = FONTS_DIR / "RobotoMono-Regular.ttf"
CJK_BOLD = Path(os.path.expanduser("~/.local/share/fonts/noto-cjk/NotoSansCJKtc-Bold.otf"))
CJK_REG = Path(os.path.expanduser("~/.local/share/fonts/noto-cjk/NotoSansCJKtc-Regular.otf"))

BLACK = (26, 26, 26)
CREAM = (244, 233, 213)
RED = (237, 93, 41)
BLUE = (46, 82, 160)
GREEN = (127, 156, 126)
STONE = (206, 192, 163)


def f(path, size):
    return ImageFont.truetype(str(path), size=size)


def tw(d, text, font):
    bbox = d.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0]


def th(d, text, font):
    bbox = d.textbbox((0, 0), text, font=font)
    return bbox[3] - bbox[1]


def scanlines(img, opacity=8, spacing=3):
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for y in range(0, img.size[1], spacing):
        od.line([(0, y), (img.size[0], y)], fill=(26, 26, 26, opacity), width=1)
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def base_canvas(chart_no, kicker_cjk):
    """Standard canvas with top bar / bottom tagline / N mark."""
    img = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
    d = ImageDraw.Draw(img)

    # N mark + underline
    f_n = f(RM_BOLD, 36)
    d.text((60, 50), "N", font=f_n, fill=BLACK)
    n_w = tw(d, "N", f_n)
    d.rectangle([(60, 50 + 36 + 4), (60 + n_w, 50 + 36 + 7)], fill=BLACK)

    # Chart number indicator (top-right)
    f_no = f(RM_REG, 14)
    no_text = f"FIG. {chart_no}  /  AI-NATIVE 系列"
    # Mixed Latin + CJK — split
    en = f"FIG. {chart_no}  /  "
    en_w = tw(d, en, f_no)
    d.text((WIDTH - 60 - en_w - tw(d, "AI-NATIVE 系列", f(CJK_REG, 14)), 60),
           en, font=f_no, fill=BLACK)
    d.text((WIDTH - 60 - tw(d, "AI-NATIVE 系列", f(CJK_REG, 14)), 60),
           "AI-NATIVE 系列", font=f(CJK_REG, 14), fill=BLACK)

    # Top hairline
    d.rectangle([(60, 110), (WIDTH - 60, 111)], fill=BLACK)

    # Kicker (CJK title for the chart)
    d.text((60, 128), kicker_cjk, font=f(CJK_BOLD, 26), fill=BLACK)

    # Bottom hairline + tagline
    d.rectangle([(60, 562), (WIDTH - 60, 563)], fill=BLACK)
    d.text((60, 583), "SOFIA YAN  ·  NUMBERS PROTOCOL", font=f(RM_REG, 13), fill=BLACK)
    tag = "HUMAN TRUTH.  MACHINE PROOF."
    tag_w = tw(d, tag, f(RM_BOLD, 13))
    d.text((WIDTH - 60 - tag_w, 583), tag, font=f(RM_BOLD, 13), fill=RED)

    return img, d


def export(img, name):
    img = scanlines(img, opacity=6, spacing=3).convert("RGB")
    out = OUTPUT_DIR / f"{name}.png"
    img.save(out, format="PNG", optimize=True)
    img.save(out.with_suffix(".jpg"), format="JPEG", quality=92, optimize=True)
    print(f"Wrote: {out.name}")


# ───────────────────────────────────────────────────────────────────
# CHART 1: Three-stage timeline (Prompt → Context → Harness)
# ───────────────────────────────────────────────────────────────────
def chart1_timeline():
    img, d = base_canvas(1, "AI 導入演化的三個階段")

    # Three columns
    col_w = (WIDTH - 120) / 3
    col_y = 210
    col_h = 290

    stages = [
        {
            "years": "2023 ─ 2024",
            "title": "PROMPT",
            "subtitle": "ENGINEERING",
            "focus_cjk": "怎麼問？",
            "color": STONE,
            "items_cjk": [
                "prompt template",
                "few-shot 範例",
                "chain of thought",
                "比賽誰的 ChatGPT",
                "比較聰明",
            ],
            "broke_cjk": "斷點：prompt 寫再好，模型「看不到」就沒用",
        },
        {
            "years": "2024 ─ 2025",
            "title": "CONTEXT",
            "subtitle": "ENGINEERING",
            "focus_cjk": "模型看到什麼？",
            "color": GREEN,
            "items_cjk": [
                "RAG / vector DB",
                "資料結構化",
                "context window",
                "model 在對的時間",
                "拿到對的東西",
            ],
            "broke_cjk": "斷點：context 餵對了，agent 連續決策還是會壞",
        },
        {
            "years": "2025 ─ NOW",
            "title": "HARNESS",
            "subtitle": "ENGINEERING",
            "focus_cjk": "整個環境怎麼設計？",
            "color": RED,
            "items_cjk": [
                "TAEA framework",
                "agent ticket",
                "memory / boundary",
                "audit trail",
                "→ 水晶球 / Omni",
            ],
            "broke_cjk": "目前：公司本身對機器可讀（legibility）",
        },
    ]

    for i, s in enumerate(stages):
        cx = 60 + col_w * i
        # Colour band at top of column
        d.rectangle([(cx, col_y), (cx + col_w - 30, col_y + 8)], fill=s["color"])
        # Year
        d.text((cx, col_y + 20), s["years"], font=f(RM_REG, 13), fill=BLACK)
        # Title
        d.text((cx, col_y + 42), s["title"], font=f(RM_BOLD, 30), fill=BLACK)
        d.text((cx, col_y + 78), s["subtitle"], font=f(RM_REG, 16), fill=BLACK)
        # Focus question (CJK)
        d.text((cx, col_y + 112), s["focus_cjk"], font=f(CJK_BOLD, 19), fill=s["color"] if s["color"] != STONE else BLACK)
        # Items
        iy = col_y + 152
        for item in s["items_cjk"]:
            # Latin chunks render w/ Roboto Mono, CJK chunks w/ CJK font
            is_cjk = any('一' <= ch <= '鿿' for ch in item)
            font_use = f(CJK_REG, 14) if is_cjk else f(RM_REG, 14)
            d.text((cx + 12, iy), "·", font=f(RM_BOLD, 14), fill=BLACK)
            d.text((cx + 26, iy), item, font=font_use, fill=BLACK)
            iy += 22

    # Connecting arrows between columns
    for i in range(2):
        ax = 60 + col_w * (i + 1) - 22
        ay = col_y + 56  # arrow vertical center near title row
        # shaft
        d.rectangle([(ax - 14, ay - 2), (ax + 14, ay + 2)], fill=BLACK)
        # arrowhead
        d.polygon([(ax + 22, ay), (ax + 14, ay - 8), (ax + 14, ay + 8)], fill=BLACK)

    # Bottom note row (the "斷點" / "current" insight)
    note_y = col_y + col_h + 4
    d.rectangle([(60, note_y), (WIDTH - 60, note_y + 1)], fill=BLACK)
    for i, s in enumerate(stages):
        cx = 60 + col_w * i + 12
        d.text((cx, note_y + 12), s["broke_cjk"], font=f(CJK_REG, 12), fill=BLACK)

    export(img, "chart-1-timeline")


# ───────────────────────────────────────────────────────────────────
# CHART 2: Westworld metaphor — Assisted vs Native
# ───────────────────────────────────────────────────────────────────
def chart2_westworld():
    img, d = base_canvas(2, "AI-Assisted vs AI-Native：兩種架構，兩種公司")

    mid = WIDTH / 2
    # vertical divider
    d.rectangle([(mid - 1, 200), (mid + 1, 540)], fill=BLACK)

    # ===== LEFT: AI-Assisted =====
    lx = 80
    d.text((lx, 195), "AI-ASSISTED", font=f(RM_BOLD, 24), fill=BLACK)
    d.text((lx, 226), "員工有 AI", font=f(CJK_BOLD, 18), fill=BLACK)
    d.text((lx, 254), "每個員工配一個接待員", font=f(CJK_REG, 14), fill=BLACK)

    # Visual: 6 humans, each paired with an AI bubble
    grid_x0 = lx
    grid_y0 = 310
    pairs = [(0, 0), (1, 0), (2, 0), (0, 1), (1, 1), (2, 1)]
    for col, row in pairs:
        px = grid_x0 + col * 160
        py = grid_y0 + row * 100
        # Human (filled circle)
        d.ellipse([(px, py), (px + 28, py + 28)], fill=BLACK)
        # Connector dash
        d.rectangle([(px + 32, py + 12), (px + 60, py + 16)], fill=BLACK)
        # AI bubble (outlined square w/ "AI")
        d.rectangle([(px + 64, py), (px + 110, py + 28)], outline=BLACK, width=2)
        d.text((px + 72, py + 5), "AI", font=f(RM_BOLD, 14), fill=BLACK)

    # Annotation
    d.text((lx, 510), "→ 公司還是 human centric", font=f(CJK_BOLD, 14), fill=BLACK)

    # ===== RIGHT: AI-Native =====
    rx = int(mid) + 60
    d.text((rx, 195), "AI-NATIVE", font=f(RM_BOLD, 24), fill=RED)
    d.text((rx, 226), "公司有 AI", font=f(CJK_BOLD, 18), fill=BLACK)
    d.text((rx, 254), "中央水晶球 + 人類解 agent ticket", font=f(CJK_REG, 14), fill=BLACK)

    # Central "crystal ball" — layer-stack concentric rings (Numbers visual)
    cx_c, cy_c = rx + 220, 400
    for r, color in [(80, BLACK), (62, RED), (42, BLACK), (22, RED)]:
        d.ellipse([(cx_c - r, cy_c - r), (cx_c + r, cy_c + r)], outline=color, width=3)
    # Label
    d.text((cx_c - 30, cy_c - 8), "Omni", font=f(RM_BOLD, 18), fill=BLACK)

    # 6 humans arranged around, all connected to center
    import math
    n = 6
    radius_pos = 130
    for i in range(n):
        angle = math.pi * 2 * i / n - math.pi / 2
        hx = cx_c + int(radius_pos * math.cos(angle))
        hy = cy_c + int(radius_pos * math.sin(angle))
        # Connector line from human to center
        d.line([(cx_c, cy_c), (hx, hy)], fill=BLACK, width=1)
        # Human circle
        d.ellipse([(hx - 12, hy - 12), (hx + 12, hy + 12)], fill=BLACK)

    # Annotation
    d.text((rx, 510), "→ 公司本身就是 AI 的組織架構", font=f(CJK_BOLD, 14), fill=RED)

    export(img, "chart-2-westworld")


# ───────────────────────────────────────────────────────────────────
# CHART 3: Team composition before / after
# ───────────────────────────────────────────────────────────────────
def chart3_team():
    img, d = base_canvas(3, "Numbers Protocol 團隊組成的演化")

    mid = WIDTH / 2
    d.rectangle([(mid - 1, 200), (mid + 1, 540)], fill=BLACK)

    # ===== 2025 Q2 =====
    lx = 80
    d.text((lx, 195), "2025  Q2", font=f(RM_BOLD, 28), fill=BLACK)
    d.text((lx, 232), "人機並肩，AI 同事 hire/manage", font=f(CJK_REG, 14), fill=BLACK)

    rows_left = [
        ("6", "全職人類同事", BLACK, "filled"),
        ("15", "線上 AI 同事", BLACK, "outline"),
        ("8", "實習階段 AI 同事", BLACK, "outline-dashed"),
    ]
    ly = 285
    for count, label, color, style in rows_left:
        # Big count
        d.text((lx, ly), count, font=f(RM_BOLD, 56), fill=color)
        # Label
        d.text((lx + 110, ly + 18), label, font=f(CJK_REG, 16), fill=BLACK)
        # Sub
        d.text((lx + 110, ly + 42), {
            "filled": "human",
            "outline": "AI agent",
            "outline-dashed": "AI agent (intern)",
        }[style], font=f(RM_REG, 12), fill=BLACK)
        ly += 78

    # Footer numbers
    d.text((lx, 520), "MVP ≤ 24h  ·  SaaS 支出 -60%", font=f(RM_BOLD, 14), fill=BLACK)

    # ===== 2026 Q2 =====
    rx = int(mid) + 60
    d.text((rx, 195), "2026  Q2", font=f(RM_BOLD, 28), fill=RED)
    d.text((rx, 232), "Harness everything：人類設計，Omni 執行", font=f(CJK_REG, 14), fill=BLACK)

    # 6 humans line
    d.text((rx, 285), "6", font=f(RM_BOLD, 56), fill=BLACK)
    d.text((rx + 110, 303), "全職人類同事", font=f(CJK_REG, 16), fill=BLACK)
    d.text((rx + 110, 327), "human (set designers)", font=f(RM_REG, 12), fill=BLACK)

    # Omni — layer stack
    omni_y = 380
    d.rectangle([(rx, omni_y), (rx + 8, omni_y + 60)], fill=RED)
    d.text((rx + 28, omni_y + 4), "Omni", font=f(RM_BOLD, 22), fill=BLACK)
    d.text((rx + 28, omni_y + 32), "水晶球全知 AI", font=f(CJK_BOLD, 14), fill=BLACK)

    # Z — layer stack
    z_y = 455
    d.rectangle([(rx, z_y), (rx + 8, z_y + 60)], fill=BLUE)
    d.text((rx + 28, z_y + 4), "Z", font=f(RM_BOLD, 22), fill=BLACK)
    d.text((rx + 28, z_y + 32), "AI 原生資料流平台", font=f(CJK_BOLD, 14), fill=BLACK)

    # Footer
    d.text((rx, 535), "→ 3-5 agent tickets / 人 / 天", font=f(CJK_BOLD, 13), fill=RED)

    # Connecting arrow between halves
    arrow_y = 350
    ax = int(mid) - 30
    d.rectangle([(ax - 30, arrow_y - 2), (ax + 4, arrow_y + 2)], fill=BLACK)
    d.polygon([(ax + 12, arrow_y), (ax + 4, arrow_y - 6), (ax + 4, arrow_y + 6)], fill=BLACK)

    export(img, "chart-3-team")


# ───────────────────────────────────────────────────────────────────
# CHART 4: TAEA 2x2 framework
# ───────────────────────────────────────────────────────────────────
def chart4_taea():
    img, d = base_canvas(4, "TAEA Framework：AI-Native 的四個治理原則")

    # 2x2 grid
    pad_x = 80
    pad_top = 200
    pad_bottom = 80
    grid_w = WIDTH - pad_x * 2
    grid_h = HEIGHT - pad_top - pad_bottom
    cell_w = grid_w / 2
    cell_h = grid_h / 2

    quadrants = [
        {
            "letter": "T",
            "name": "TRANSPARENT",
            "cjk": "可被觀測",
            "desc_cjk": "所有 tool call 即時 streaming\n看得到 agent 在做什麼",
            "color": BLACK,
        },
        {
            "letter": "A",
            "name": "AUDITABLE",
            "cjk": "可被追溯",
            "desc_cjk": "每筆寫入都進 audit log\n誰、何時、改了什麼",
            "color": BLACK,
        },
        {
            "letter": "E",
            "name": "EXPLAINABLE",
            "cjk": "可被解釋",
            "desc_cjk": "agent 引用證據說明判斷\n不是黑箱猜測",
            "color": BLACK,
        },
        {
            "letter": "A",
            "name": "AGENTIC",
            "cjk": "可被授權",
            "desc_cjk": "在邊界內自主行動\n知道何時動手、何時問人",
            "color": RED,
        },
    ]

    for i, q in enumerate(quadrants):
        col = i % 2
        row = i // 2
        x0 = pad_x + col * cell_w
        y0 = pad_top + row * cell_h

        # Cell border
        d.rectangle([(x0, y0), (x0 + cell_w, y0 + cell_h)], outline=BLACK, width=1)
        # Big letter
        d.text((x0 + 24, y0 + 14), q["letter"], font=f(RM_BOLD, 100), fill=q["color"])
        # Name
        d.text((x0 + 24, y0 + 130), q["name"], font=f(RM_BOLD, 20), fill=BLACK)
        # CJK label
        d.text((x0 + 24, y0 + 158), q["cjk"], font=f(CJK_BOLD, 18), fill=q["color"])
        # Description
        dy = y0 + 12
        for line in q["desc_cjk"].split("\n"):
            d.text((x0 + 240, dy + 20), line, font=f(CJK_REG, 14), fill=BLACK)
            dy += 24

    export(img, "chart-4-taea")


# ───────────────────────────────────────────────────────────────────
# CHART 5: 6 questions checklist — 把流程當機器拆
# ───────────────────────────────────────────────────────────────────
def chart5_six_questions():
    img, d = base_canvas(5, "把流程當機器拆：診斷一個 agent-ready 流程的 6 個問題")

    questions = [
        ("01", "什麼會觸發它？", "trigger", "email / Slack / form / cron"),
        ("02", "需要哪些資料？", "inputs", "客戶歷史 / 政策 / 過去工單"),
        ("03", "會出現哪些決策？", "decisions", "哪些可逆 / 哪些要核准"),
        ("04", "成功會長什麼樣？", "success", "KPI / 品質指標 / 時間目標"),
        ("05", "錯誤通常發生在哪？", "failure", "過去 3 個月 incident log"),
        ("06", "人類知道什麼系統不知道？", "tacit", "← 最關鍵：隱性知識"),
    ]

    # 2 columns × 3 rows
    pad_x = 80
    pad_top = 200
    grid_w = WIDTH - pad_x * 2
    cell_w = grid_w / 2
    cell_h = 110

    for i, (no, q_cjk, tag, sample) in enumerate(questions):
        col = i % 2
        row = i // 2
        x0 = pad_x + col * cell_w
        y0 = pad_top + row * cell_h

        # number block
        d.rectangle([(x0, y0 + 12), (x0 + 64, y0 + 76)], outline=BLACK, width=2)
        d.text((x0 + 12, y0 + 24), no, font=f(RM_BOLD, 36), fill=RED if no == "06" else BLACK)
        # question
        d.text((x0 + 86, y0 + 14), q_cjk, font=f(CJK_BOLD, 20), fill=BLACK)
        # tag (latin)
        d.text((x0 + 86, y0 + 46), tag.upper(), font=f(RM_BOLD, 11), fill=RED if no == "06" else BLACK)
        # sample (CJK)
        d.text((x0 + 86, y0 + 64), sample, font=f(CJK_REG, 13), fill=BLACK)

    export(img, "chart-5-six-questions")


def main():
    chart1_timeline()
    chart2_westworld()
    chart3_team()
    chart4_taea()
    chart5_six_questions()


if __name__ == "__main__":
    main()
