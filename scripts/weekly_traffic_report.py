#!/usr/bin/env python3
"""
週報生成器 — GENERATE-ONLY 版本
用法:
  python3 weekly_traffic_report.py --emit [--metrics-file FILE ...]
  python3 weekly_traffic_report.py --json  [--metrics-file FILE ...]

不連網、不碰憑證；由外部 MCP 呼叫者（mcp__z_app__z_insert）負責發布。
"""
import os
import re
import sys
import json
import argparse
import datetime
from dataclasses import dataclass, field
from typing import Optional

POSTS_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "content", "posts")

# ── local repo scan ──────────────────────────────────────────────────────────

def parse_mdx_frontmatter(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
        if not match:
            return {}
        data = {}
        for line in match.group(1).split("\n"):
            if ":" in line:
                k, v = line.split(":", 1)
                data[k.strip().strip("\"'")] = v.strip().strip("\"'")
        return data
    except Exception:
        return {}


def gather_local_stats():
    if not os.path.exists(POSTS_DIR):
        return {"total_posts": 0, "categories": {}, "latest_posts": []}
    posts, categories = [], {}
    for filename in os.listdir(POSTS_DIR):
        if not (filename.endswith(".mdx") or filename.endswith(".md")):
            continue
        meta = parse_mdx_frontmatter(os.path.join(POSTS_DIR, filename))
        if meta and meta.get("draft") != "true":
            cat = meta.get("category", "Uncategorized")
            categories[cat] = categories.get(cat, 0) + 1
            posts.append({
                "title": meta.get("title", "Untitled"),
                "slug": filename.rsplit(".", 1)[0],
                "published_at": meta.get("publishedAt", ""),
                "category": cat,
            })
    posts.sort(key=lambda p: p["published_at"], reverse=True)
    return {"total_posts": len(posts), "categories": categories, "latest_posts": posts[:3]}

# ── metrics loading ──────────────────────────────────────────────────────────

@dataclass
class TrafficBlock:
    status: str = "_pending_"
    queried_at: str = ""
    active_users_7d: Optional[int] = None
    page_views_7d: Optional[int] = None
    sessions_7d: Optional[int] = None
    active_users_30d: Optional[int] = None
    top_sources: list = field(default_factory=list)
    top_pages: list = field(default_factory=list)


@dataclass
class InteractionsBlock:
    status: str = "_pending_"
    queried_at: str = ""
    share_clicks: Optional[int] = None
    copy_link: Optional[int] = None
    post_reactions: Optional[int] = None


@dataclass
class BotBlock:
    status: str = "_pending_"
    queried_at: str = ""
    counts: list = field(default_factory=list)
    total: int = 0


def load_metrics(files):
    traffic = TrafficBlock()
    interactions = InteractionsBlock()
    bots = BotBlock()
    for path in files:
        try:
            with open(path) as f:
                data = json.load(f)
        except Exception as e:
            print(f"Warning: cannot read {path}: {e}", file=sys.stderr)
            continue
        if "traffic" in data:
            t = data["traffic"]
            traffic = TrafficBlock(
                status=t.get("status", "_pending_"),
                queried_at=t.get("queried_at", ""),
                active_users_7d=t.get("active_users_7d"),
                page_views_7d=t.get("page_views_7d"),
                sessions_7d=t.get("sessions_7d"),
                active_users_30d=t.get("active_users_30d"),
                top_sources=t.get("top_sources", []),
                top_pages=t.get("top_pages", []),
            )
        if "interactions" in data:
            i = data["interactions"]
            interactions = InteractionsBlock(
                status=i.get("status", "_pending_"),
                queried_at=i.get("queried_at", ""),
                share_clicks=i.get("share_clicks"),
                copy_link=i.get("copy_link"),
                post_reactions=i.get("post_reactions"),
            )
        if "ai_bots" in data:
            b = data["ai_bots"]
            bots = BotBlock(
                status=b.get("status", "_pending_"),
                queried_at=b.get("queried_at", ""),
                counts=b.get("counts", []),
                total=b.get("total", 0),
            )
    return traffic, interactions, bots

# ── pending_metrics (Data Provenance) ────────────────────────────────────────

@dataclass
class MetricBlock:
    name: str
    status: str           # measured / manual_required / _pending_
    source: str
    reason: str = ""      # only shown when status is not measured


def pending_metrics(traffic, bots):
    """Returns the provenance table rows."""
    rows = [
        MetricBlock("GA4 流量 + 互動", traffic.status, "Google Analytics 4 Data API"),
        MetricBlock("AI bot 計數", bots.status, "Cloudflare Worker + Analytics Engine"),
        MetricBlock("LinkedIn 成長", "manual_required", "LinkedIn Analytics",
                    reason="LinkedIn API 不開放第三方讀取"),
    ]
    return rows

# ── rendering ────────────────────────────────────────────────────────────────

def fmt(v, unit="", fallback="_pending_"):
    if v is None:
        return fallback
    return f"{v}{unit}"


def render_traffic(traffic):
    if traffic.status == "_pending_":
        return "流量資料：_pending_（GA4 查詢失敗或憑證未設定）\n"
    lines = []
    lines.append("### 網站流量")
    lines.append(f"_資料時間：{traffic.queried_at}_\n")
    lines.append("| 指標 | 本週 |")
    lines.append("|---|---|")
    lines.append(f"| 活躍使用者（7日）| {fmt(traffic.active_users_7d)} 人 |")
    lines.append(f"| 月活躍使用者（30日 MAU）| {fmt(traffic.active_users_30d)} 人 |")
    lines.append(f"| 瀏覽量（7日 PV）| {fmt(traffic.page_views_7d)} 次 |")
    lines.append(f"| 工作階段（7日）| {fmt(traffic.sessions_7d)} 次 |")
    lines.append("")
    if traffic.top_sources:
        lines.append("**主要流量來源：**")
        for s in traffic.top_sources:
            lines.append(f"- {s['source']}：{s['sessions']} sessions")
        lines.append("")
    if traffic.top_pages:
        lines.append("**熱門頁面（本週）：**")
        for p in traffic.top_pages:
            lines.append(f"- `{p['path']}`：{p['views']} 次瀏覽")
        lines.append("")
    return "\n".join(lines)


def render_interactions(interactions):
    if interactions.status == "_pending_":
        return "### 讀者互動\n_pending_（GA4 Data API 未接通）\n"
    lines = []
    lines.append("### 讀者互動")
    lines.append(f"_資料時間：{interactions.queried_at}_\n")

    share = fmt(interactions.share_clicks, " 次")
    copy = fmt(interactions.copy_link, " 次")
    react = fmt(interactions.post_reactions, " 次")

    lines.append("| 行為 | 次數 | 說明 |")
    lines.append("|---|---|---|")
    lines.append(f"| 分享點擊 | {share} | Facebook / X / LINE / LinkedIn |")
    lines.append(f"| 複製連結 | {copy} | Copy Link 按鈕 |")
    lines.append(f"| Post reactions | {react} | 如果 GA4 Data API 未接通此欄為 0 |")
    lines.append("")
    return "\n".join(lines)


def render_bots(bots):
    if bots.status == "_pending_":
        return "### AI Bot 流量（Cloudflare）\n_pending_（Analytics Engine 查詢失敗或憑證未設定）\n"
    lines = []
    lines.append("### AI Bot 流量（Cloudflare）")
    lines.append(f"_資料時間：{bots.queried_at}　｜　7 日合計：{bots.total} 次_\n")
    lines.append("| Bot | 本週請求數 |")
    lines.append("|---|---|")
    for entry in bots.counts:
        lines.append(f"| {entry['bot']} | {entry['requests']} |")
    lines.append("")
    return "\n".join(lines)


def render_provenance(rows):
    lines = []
    lines.append("### Data Provenance")
    lines.append("| 資料項目 | 狀態 | 來源 |")
    lines.append("|---|---|---|")
    for r in rows:
        if r.status == "measured":
            label = "✅ measured"
        elif r.status == "manual_required":
            label = "📋 manual_required"
        else:
            label = "_pending_"
        src = r.source
        if r.reason:
            src += f"（{r.reason}）"
        lines.append(f"| {r.name} | {label} | {src} |")
    return "\n".join(lines)


def compose_report(local_stats, traffic, interactions, bots):
    today = datetime.date.today()
    week_num = today.isocalendar()[1]

    sections = []
    sections.append(f"## 部落格週報 W{week_num}（{today}）\n")

    # Summary
    sections.append("### 摘要")
    sections.append(f"- 已發佈文章：{local_stats['total_posts']} 篇")
    if local_stats["latest_posts"]:
        latest = local_stats["latest_posts"][0]
        sections.append(f"- 最新文章：《{latest['title']}》（{latest['published_at'][:10]}）")
    sections.append("")

    sections.append(render_traffic(traffic))
    sections.append(render_interactions(interactions))
    sections.append(render_bots(bots))

    prov = pending_metrics(traffic, bots)
    sections.append(render_provenance(prov))
    sections.append("")
    sections.append("— Century")

    return "\n".join(sections)

# ── main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--emit", action="store_true", help="Print markdown to stdout")
    parser.add_argument("--json", action="store_true", help="Print JSON to stdout")
    parser.add_argument("--metrics-file", dest="metrics_files", action="append", default=[])
    args = parser.parse_args()

    print("Gathering local statistics...", file=sys.stderr)
    local_stats = gather_local_stats()
    print(f"Total local posts found: {local_stats['total_posts']}", file=sys.stderr)

    traffic, interactions, bots = load_metrics(args.metrics_files)

    report_md = compose_report(local_stats, traffic, interactions, bots)

    if args.json:
        print(json.dumps({
            "report": report_md,
            "posts": local_stats["total_posts"],
        }, ensure_ascii=False, indent=2))
    elif args.emit:
        print(report_md)
    else:
        print("Use --emit to print the report or --json for JSON output.", file=sys.stderr)


if __name__ == "__main__":
    main()
