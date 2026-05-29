#!/usr/bin/env python3
"""Weekly blog traffic & content report.

Reads credentials from environment variables — refuses to fall back on
hardcoded secrets. If GA4 / Cloudflare Analytics is not yet wired, the
report explicitly shows a "pending" state instead of fabricated numbers.

Honest-by-default per harness plan §1.1 Analyst boundary:
    "不得把 mock data 當真實數據"

Required env vars:
    Z_GATEWAY_URL       — Z App agent gateway base URL
    Z_API_KEY           — Z App API key (Bearer token)
    Z_WORKSPACE_ID      — target workspace UUID

Optional env vars (enable real traffic metrics when set):
    GA4_PROPERTY_ID                 — Google Analytics 4 property
    GA4_SERVICE_ACCOUNT_JSON        — path to service account JSON
    CF_API_TOKEN                    — Cloudflare API token
    CF_ZONE_TAG                     — Cloudflare zone tag for sofiayan.cc

Fallback:
    If env vars are missing, the script will also try to load them from
    `.omni/harness/secrets.env` (key=value lines) relative to the workspace
    root, then from `.env` in the script directory. This lets the schedule
    pre_check work without modifying the Omni scheduler host env.

Exit codes:
    0 — report posted successfully
    1 — Z gateway returned non-2xx, or network error
    2 — required env vars missing (refuses to post)
"""
import os
import re
import sys
import datetime
import requests

# ---------------------------------------------------------------------------
# Credential loading (env → workspace secrets.env → script-dir .env)
# ---------------------------------------------------------------------------

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
WORKSPACE_ROOT = os.path.abspath(os.path.join(REPO_ROOT, ".."))


def _load_dotenv(path):
    """Parse `key=value` lines into os.environ if the key is not already set."""
    if not path or not os.path.isfile(path):
        return
    try:
        with open(path, "r", encoding="utf-8") as f:
            for raw in f:
                line = raw.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, val = line.split("=", 1)
                key = key.strip()
                val = val.strip().strip('"').strip("'")
                if key and key not in os.environ:
                    os.environ[key] = val
    except Exception as e:
        print(f"warn: failed to load env file {path}: {e}", file=sys.stderr)


_load_dotenv(os.path.join(WORKSPACE_ROOT, ".omni", "harness", "secrets.env"))
_load_dotenv(os.path.join(SCRIPT_DIR, ".env"))

Z_GATEWAY_URL = os.environ.get("Z_GATEWAY_URL", "").strip()
Z_API_KEY = os.environ.get("Z_API_KEY", "").strip()
Z_WORKSPACE_ID = os.environ.get("Z_WORKSPACE_ID", "").strip()

GA4_PROPERTY_ID = os.environ.get("GA4_PROPERTY_ID", "").strip()
GA4_SERVICE_ACCOUNT_JSON = os.environ.get("GA4_SERVICE_ACCOUNT_JSON", "").strip()
CF_API_TOKEN = os.environ.get("CF_API_TOKEN", "").strip()
CF_ZONE_TAG = os.environ.get("CF_ZONE_TAG", "").strip()

POSTS_DIR = os.path.join(REPO_ROOT, "src", "content", "posts")

# ---------------------------------------------------------------------------
# Local content stats (no external services required)
# ---------------------------------------------------------------------------


def parse_mdx_frontmatter(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
        if not match:
            return {}
        frontmatter_text = match.group(1)
        data = {}
        for line in frontmatter_text.split("\n"):
            if ":" in line:
                parts = line.split(":", 1)
                key = parts[0].strip().strip("\"'")
                val = parts[1].strip().strip("\"'")
                data[key] = val
        return data
    except Exception as e:
        print(f"warn: parse {file_path}: {e}", file=sys.stderr)
        return {}


def gather_local_stats():
    if not os.path.exists(POSTS_DIR):
        return {"total_posts": 0, "categories": {}, "latest_posts": []}

    posts = []
    categories = {}
    for filename in os.listdir(POSTS_DIR):
        if not (filename.endswith(".mdx") or filename.endswith(".md")):
            continue
        path = os.path.join(POSTS_DIR, filename)
        meta = parse_mdx_frontmatter(path)
        if not meta or meta.get("draft") == "true":
            continue
        pub_at = meta.get("publishedAt", meta.get("date", ""))
        cat = meta.get("category", "Uncategorized")
        categories[cat] = categories.get(cat, 0) + 1
        posts.append({
            "title": meta.get("title", "Untitled"),
            "slug": filename.rsplit(".", 1)[0],
            "published_at": pub_at,
            "category": cat,
        })

    posts.sort(key=lambda p: p["published_at"], reverse=True)
    return {
        "total_posts": len(posts),
        "categories": categories,
        "latest_posts": posts[:3],
    }


# ---------------------------------------------------------------------------
# Traffic metrics — real numbers OR explicit pending state.
# Honest reporting per harness plan §1.1 — never fabricate.
# ---------------------------------------------------------------------------


def get_traffic_metrics():
    ga4_available = bool(GA4_PROPERTY_ID and GA4_SERVICE_ACCOUNT_JSON)
    cf_available = bool(CF_API_TOKEN and CF_ZONE_TAG)

    pending = []
    if not ga4_available:
        pending.append(
            "GA4 Data API 尚未串接：需設定 `GA4_PROPERTY_ID` + `GA4_SERVICE_ACCOUNT_JSON`"
        )
    if not cf_available:
        pending.append(
            "Cloudflare Analytics 尚未串接：需設定 `CF_API_TOKEN` + `CF_ZONE_TAG`"
        )

    # TODO(Phase 2): wire real GA4 runReport + Cloudflare GraphQL queries when
    #   credentials become available. Until then, return None for every metric
    #   so the report renders explicit `_pending_` cells instead of fake values.

    return {
        "ga4_available": ga4_available,
        "cf_available": cf_available,
        "pending_reasons": pending,
        "dau": None,
        "pv": None,
        "session_duration": None,
        "bounce_rate": None,
        "top_sources": [],
        "top_pages": [],
    }


# ---------------------------------------------------------------------------
# Markdown report renderer
# ---------------------------------------------------------------------------


def _cell(value, suffix=""):
    if value is None or value == "":
        return "_pending_"
    return f"{value}{suffix}"


def generate_markdown_report(local_stats, traffic):
    tz_tw = datetime.timezone(datetime.timedelta(hours=8))
    today = datetime.datetime.now(tz=tz_tw)
    today_str = today.strftime("%Y-%m-%d")

    cat_summary = ", ".join(
        [f"`{k}` ({v})" for k, v in local_stats["categories"].items()]
    ) or "（尚無分類資料）"

    latest_str = "\n".join([
        f"- **{p['title']}**（發佈於 `{(p['published_at'][:10] if p.get('published_at') else 'unknown')}`）"
        for p in local_stats["latest_posts"]
    ]) or "_（尚無已發佈文章）_"

    sources_active = bool(traffic["top_sources"])
    pages_active = bool(traffic["top_pages"])

    if sources_active:
        sources_section = "\n".join(
            [f"| {s['source']} | {s['percentage']} |" for s in traffic["top_sources"]]
        )
    else:
        sources_section = "| _pending — 待 GA4 / Cloudflare 串接後填入_ | — |"

    if pages_active:
        pages_section = "\n".join(
            [
                f"{i+1}. **{p['title']}**（`{p['path']}`）— **{p['views']}** PV"
                for i, p in enumerate(traffic["top_pages"])
            ]
        )
    else:
        pages_section = "_pending — 待 GA4 串接後填入_"

    if traffic.get("ga4_available") or traffic.get("cf_available"):
        active = []
        if traffic.get("ga4_available"):
            active.append("GA4")
        if traffic.get("cf_available"):
            active.append("Cloudflare Analytics")
        data_status = "✅ 已串接資料來源：" + "、".join(active)
    else:
        reasons = traffic.get("pending_reasons", [])
        data_status = (
            "⚠️ **流量資料來源尚未串接**\n\n" + "\n".join([f"- {r}" for r in reasons])
        )

    content = f"""進度更新日期 -- {today_str} @Sofia

### 流量資料來源狀態
{data_status}

### 部落格內容資產狀態
- **已發佈文章總數**：{local_stats["total_posts"]} 篇（本地 repo 實測）
- **文章分類分佈**：{cat_summary}
- **最新發佈的文章**：
{latest_str}

### 網站核心流量指標（本週）
| 指標項目 | 數據值 |
|:---|:---:|
| 每日活躍用戶 (DAU) | {_cell(traffic["dau"], " 人")} |
| 單週總瀏覽量 (PV) | {_cell(traffic["pv"], " 次")} |
| 平均停留時間 | {_cell(traffic["session_duration"])} |
| 跳出率 | {_cell(traffic["bounce_rate"])} |

### 主要流量來源
| 流量管道 | 佔比 |
|:---|:---:|
{sources_section}

### 熱門文章排行（本週 Top 3）
{pages_section}

---
此報告由 Omni AI 自動產生。流量指標需 GA4 / Cloudflare Analytics 串接後才會顯示真實值；
未串接時以 `_pending_` 標示，不以模擬數據替代（依 harness plan §1.1 Analyst boundary）。
"""
    return content


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main():
    missing = [
        name for name, val in [
            ("Z_GATEWAY_URL", Z_GATEWAY_URL),
            ("Z_API_KEY", Z_API_KEY),
            ("Z_WORKSPACE_ID", Z_WORKSPACE_ID),
        ] if not val
    ]
    if missing:
        print(
            "ERROR: missing required env vars: " + ", ".join(missing),
            file=sys.stderr,
        )
        print(
            "This script refuses to run with hardcoded credentials. "
            "Set them in the environment, in .omni/harness/secrets.env, "
            "or in sofia/scripts/.env and retry.",
            file=sys.stderr,
        )
        sys.exit(2)

    print("Gathering local statistics...")
    local_stats = gather_local_stats()
    print(f"Total local posts found: {local_stats['total_posts']}")

    print("Fetching traffic metrics (real or explicit pending state)...")
    traffic = get_traffic_metrics()
    if not (traffic.get("ga4_available") or traffic.get("cf_available")):
        print(
            "note: no analytics source wired; report will show '_pending_' "
            "for traffic cells (per harness §1.1 honest-by-default).",
            file=sys.stderr,
        )

    print("Composing markdown report...")
    report_content = generate_markdown_report(local_stats, traffic)

    print("Sending report to Z App Gateway...")
    today_str = datetime.date.today().isoformat()
    body = {
        "action": "insert",
        "payload": {
            "table": "posts",
            "data": {
                "title": f"📈 部落格週報（{today_str}）",
                "content": report_content,
                "date": today_str,
                "workspace_id": Z_WORKSPACE_ID,
            },
        },
    }
    headers = {
        "Authorization": f"Bearer {Z_API_KEY}",
        "Content-Type": "application/json",
    }

    try:
        resp = requests.post(Z_GATEWAY_URL, headers=headers, json=body, timeout=30)
    except Exception as e:
        print(f"ERROR: network error contacting Z gateway: {e}", file=sys.stderr)
        sys.exit(1)

    if resp.status_code in (200, 201):
        posted_id = ""
        try:
            posted_id = resp.json().get("id", "")
        except Exception:
            pass
        print(f"Success! Report posted to Z App feed (ID: {posted_id})")
        sys.exit(0)

    print(
        f"ERROR: Z gateway returned {resp.status_code}",
        file=sys.stderr,
    )
    print("Response:", resp.text, file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()
