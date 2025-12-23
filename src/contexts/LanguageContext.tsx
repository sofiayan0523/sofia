import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "zh" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    // Navigation
    "nav.home": "首頁",
    "nav.about": "關於我",
    "nav.blog": "部落格",
    "nav.career": "職涯",
    "nav.playground": "探索",
    "nav.login": "登入",
    "nav.logout": "登出",
    "nav.cms": "CMS 管理",
    
    // Footer
    "footer.navigate": "導航",
    "footer.connect": "連結",
    "footer.copyright": "© 2025 Sofia Yan. Built with purpose, powered by trust. Watched over by Zaza🐈& Piepie🐈‍⬛.",
    
    // Home
    "home.title": "數位策略家 & 創業者",
    "home.greeting": "嗨，我是 Sofia",
    "home.description": "我在 Numbers Protocol 建構區塊鏈驅動的真相工具。我寫關於旅行、科技和有意識生活的藝術。",
    "home.aboutBtn": "關於我",
    "home.blogBtn": "閱讀部落格",
    "home.stat1": "城市探索",
    "home.stat2": "科技年資",
    "home.stat3": "演講活動",
    "home.stat4": "無限好奇",
    "home.latestWriting": "最新文章",
    "home.fromBlog": "來自部落格",
    "home.viewAll": "查看全部",
    "home.viewAllPosts": "查看所有文章",
    "home.ctaTitle": "保持聯繫",
    "home.ctaDescription": "無論您想討論科技倫理、分享旅行故事，或探索合作機會。",
    "home.ctaBtn": "聯繫我",
    
    // About
    "about.label": "關於",
    "about.headline": "在 AI 時代建立信任",
    "about.intro": "純種文組人，誤打誤撞闖進科技新創，又陰錯陽差成了 <strong class=\"text-foreground\">Numbers Protocol</strong> 的 co-founder 兼成長策略長。",
    "about.background": "做區塊鏈驅動的「真相工具」讓創作有憑有據、讓數位信任可被驗證，也讓好的技術更好懂。我相信好的技術應該是可理解、以人為本，並且帶點叛逆精神的。",
    "about.hobbies": "不設限人生驚喜（嚇）包開箱中。環境友善支持者，貓奴。工作之外在台北抱石，AI 工具能玩就玩，熱愛獨旅，累積走過 50+ 城市。",
    "about.currentlyTitle": "目前",
    "about.current1": "定居台北",
    "about.current2": "接受演講邀約中",
    "about.current3": "撰寫關於旅行和 AI 工具的文章",
    "about.current4": "週末抱石中",
    
    // Blog
    "blog.title": "部落格",
    "blog.search": "搜尋文章...",
    "blog.noPosts": "尚無文章",
    "blog.readTime": "分鐘閱讀",
    
    // Career
    "career.title": "職涯",
    "career.description": "我的工作、演講和媒體報導",
    "career.work": "專案作品",
    "career.speaking": "演講活動",
    "career.media": "媒體報導",
    
    // Playground
    "playground.title": "探索",
    "playground.description": "我的興趣與連結收藏",
    
    // Common
    "common.loading": "載入中...",
    "common.error": "發生錯誤",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.blog": "Blog",
    "nav.career": "Career",
    "nav.playground": "Playground",
    "nav.login": "Login",
    "nav.logout": "Logout",
    "nav.cms": "CMS",
    
    // Footer
    "footer.navigate": "Navigate",
    "footer.connect": "Connect",
    "footer.copyright": "© 2025 Sofia Yan. Built with purpose, powered by trust. Watched over by Zaza🐈& Piepie🐈‍⬛.",
    
    // Home
    "home.title": "Digital Strategist & Startup Builder",
    "home.greeting": "Hi, I'm Sofia",
    "home.description": "I build blockchain-powered truth tools at Numbers Protocol. I write about travel, technology, and the art of living intentionally.",
    "home.aboutBtn": "About Me",
    "home.blogBtn": "Read Blog",
    "home.stat1": "Cities Explored",
    "home.stat2": "Years in Tech",
    "home.stat3": "Speaking Events",
    "home.stat4": "Curiosity",
    "home.latestWriting": "Latest Writing",
    "home.fromBlog": "From the Blog",
    "home.viewAll": "View All",
    "home.viewAllPosts": "View All Posts",
    "home.ctaTitle": "Let's Connect",
    "home.ctaDescription": "Whether you want to discuss ethical tech, share travel stories, or explore collaboration opportunities.",
    "home.ctaBtn": "Get in Touch",
    
    // About
    "about.label": "About",
    "about.headline": "Building trust in the AI era",
    "about.intro": "Hi, I'm Sofia — cofounder and Chief Growth Officer at <strong class=\"text-foreground\">Numbers Protocol</strong>, where we build blockchain-powered truth tools to protect creativity and build digital trust.",
    "about.background": "I'm a strategist with a creative soul, raised on code and campaigns. I've spent the past decade scaling startups, leading global marketing, and advocating for ethical tech. I believe good technology should be understandable, human-centered, and a little bit rebellious.",
    "about.hobbies": "Beyond work, I climb walls (literally — I boulder in Taipei), and tinker with every AI tool I can get my hands on. I love solo travel and have explored over 50 cities. Zaza and Piepie, my cats, ensure my decks are typo-free and my tweets are tasteful.",
    "about.speakAboutTitle": "I speak about",
    "about.topic1": "Building trust in the AI era",
    "about.topic2": "Blockchain for digital provenance",
    "about.topic3": "Ethical tech and media transparency",
    "about.topic4": "Growth strategies for Web3 and creative ecosystems",
    "about.currentlyTitle": "Currently",
    "about.current1": "Based in Taipei, Taiwan",
    "about.current2": "Available for speaking engagements",
    "about.current3": "Writing about travel & AI tools",
    "about.current4": "Bouldering on weekends",
    
    // Blog
    "blog.title": "Blog",
    "blog.search": "Search posts...",
    "blog.noPosts": "No posts yet",
    "blog.readTime": "min read",
    
    // Career
    "career.title": "Career",
    "career.description": "My work, speaking engagements, and media coverage",
    "career.work": "Work",
    "career.speaking": "Speaking",
    "career.media": "Media",
    
    // Playground
    "playground.title": "Playground",
    "playground.description": "My interests and curated links",
    
    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "zh";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
