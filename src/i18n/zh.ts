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
  "about.headline": "我一直在做翻譯：把技術翻成人能相信的東西",
  "about.intro": "我原本學的是教育與華語文教學。後來一路走進 AI、新創、內容溯源與區塊鏈，才發現自己沒有真的離開原本的事：理解人怎麼學、怎麼相信、怎麼在陌生系統裡找到自己的位置。",
  "about.background": "現在我在 Numbers Protocol 做共同創辦人與成長策略長，參與建構內容來源與數位信任基礎建設。外面看起來是技術與市場；我實際上每天面對的是翻譯，把工程語言翻成使用者能採取行動的語言，也把人的猶豫翻回產品與策略。",
  "about.hobbies": "工作之外，我在台北抱石、測試新的 AI 工具、獨旅，也收藏一些看似不務正業的線索。那些路徑最後常常又繞回同一件事：人如何和不熟悉的世界建立關係。",
  "about.currentlyTitle": "目前",
  "about.current1": "定居台北",
  "about.current2": "接受演講邀約中",
  "about.current3": "寫企業 AI 導入、內容信任與旅行裡的觀察",
  "about.current4": "週末抱石中",
  "about.playgroundTitle": "旁枝",
  "about.playgroundDescription": "一些比較不像履歷、但很像我的入口。",

  // blog
  "blog.eyebrow": "Blog",
  "blog.headline": "故事與觀察",
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
