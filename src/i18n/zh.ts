export const zh = {
  // nav
  "nav.home": "首頁",
  "nav.about": "關於",
  "nav.blog": "部落格",
  "nav.career": "職涯",
  "nav.speaker": "演講",

  // home
  "home.eyebrow": "文組 AI 導入者 · Numbers Protocol 共同創辦人",
  "home.greeting": "嗨，我是 Sofia",
  "home.description": "我常坐在技術、營運和人之間，把企業 AI 導入、內容溯源與 AI 同事方法論，翻成團隊真的用得起來的日常語言。",
  "home.focus.ai": "企業 AI 導入",
  "home.focus.provenance": "內容溯源 / C2PA",
  "home.focus.coworker": "AI 同事方法論",
  "home.speakerBtn": "邀請演講",
  "home.aboutBtn": "了解 Sofia",
  "home.blogBtn": "閱讀文章",
  "home.stat.cities": "城市探索",
  "home.stat.tech": "科技年資",
  "home.stat.speaking": "演講活動",
  "home.stat.curiosity": "無限好奇",
  "home.latestEyebrow": "最新文章",
  "home.latestTitle": "來自部落格",
  "home.viewAll": "查看全部",
  "home.viewAllPosts": "查看所有文章",
  "home.empty": "尚未發布任何文章。",

  // about
  "about.eyebrow": "關於",
  "about.headline": "在 AI 時代建立信任",
  "about.intro": "純種文組人，誤打誤撞闖進科技新創，又陰錯陽差成了 Numbers Protocol 的 co-founder 兼成長策略長。",
  "about.background": "做區塊鏈驅動的「真相工具」讓創作有憑有據、讓數位信任可被驗證，也讓好的技術更好懂。我相信好的技術應該是可理解、以人為本，並且帶點叛逆精神的。",
  "about.hobbies": "不設限人生驚喜（嚇）包開箱中。環境友善支持者，貓奴。工作之外在台北抱石，AI 工具能玩就玩，熱愛獨旅，累積走過 50+ 城市。",
  "about.currentlyTitle": "目前",
  "about.current1": "定居台北",
  "about.current2": "接受演講邀約中",
  "about.current3": "撰寫關於旅行和 AI 工具的文章",
  "about.current4": "週末抱石中",
  "about.playgroundTitle": "探索",
  "about.playgroundDescription": "我的興趣與連結收藏",

  // blog
  "blog.eyebrow": "Blog",
  "blog.headline": "Stories & Insights",
  "blog.description": "旅行手記、AI 工具探索，以及生活中的隨想。",
  "blog.searchPlaceholder": "搜尋文章...",
  "blog.empty": "目前沒有這個分類的文章。",
  "blog.notFound": "找不到包含「{query}」的文章。",
  "blog.readMore": "閱讀全文",
  "blog.minRead": "分鐘閱讀",
  "blog.back": "返回文章列表",

  // categories
  "category.all": "全部文章",
  "category.travel": "旅行手記",
  "category.ai-insights": "AI Insights",
  "category.thoughts": "隨想",

  // career
  "career.title": "職涯",
  "career.description": "我的工作、演講和媒體報導",
  "career.work": "專案作品",
  "career.speaking": "演講活動",
  "career.media": "媒體報導",
  "career.podcast": "Podcast",

  // footer
  "footer.tagline": "Built with purpose, powered by trust.",
  "footer.navigate": "導航",
  "footer.connect": "連結",
  "footer.copyright": "© {year} Sofia Yan. Built with purpose, powered by trust.",

  // 404
  "notfound.title": "找不到頁面",
  "notfound.description": "你要找的頁面可能已被移除或不存在。",
  "notfound.home": "返回首頁",

  // common
  "common.loading": "載入中...",

  // share & react
  "share.title": "分享文章",
  "share.twitter": "分享到 X",
  "share.facebook": "分享到 Facebook",
  "share.linkedin": "分享到 LinkedIn",
  "share.line": "分享到 LINE",
  "share.copy": "複製連結",
  "share.copied": "已複製連結！",
  "react.title": "這篇文章對你有幫助嗎？",
  "react.claps": "鼓掌",
  "react.loves": "溫暖",
  "react.insights": "啟發",
  "react.amazes": "驚嘆",
} as const;

export type TranslationKey = keyof typeof zh;
