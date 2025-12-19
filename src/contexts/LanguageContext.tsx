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
    "nav.work": "專案",
    "nav.speaking": "演講",
    "nav.media": "媒體報導",
    "nav.playground": "探索",
    "nav.contact": "聯絡",
    "nav.login": "登入",
    "nav.logout": "登出",
    "nav.cms": "CMS 管理",
    
    // Footer
    "footer.navigate": "導航",
    "footer.connect": "連結",
    "footer.copyright": "© 2025 Sofia Yan. Built with purpose, powered by trust. Watched over by Zaza🐈& Piepie🐈‍⬛.",
    
    // Home
    "home.title": "數位策略家 & 創業者",
    "home.subtitle": "專注於科技倫理與創意的交匯處",
    "home.latestPosts": "最新文章",
    "home.viewAll": "查看全部",
    "home.readMore": "閱讀更多",
    
    // About
    "about.title": "關於我",
    "about.intro": "我是 Sofia Yan，一位數位策略家和創業者。",
    
    // Blog
    "blog.title": "部落格",
    "blog.search": "搜尋文章...",
    "blog.noPosts": "尚無文章",
    "blog.readTime": "分鐘閱讀",
    
    // Work
    "work.title": "專案作品",
    "work.description": "我參與過的專案與產品",
    
    // Speaking
    "speaking.title": "演講活動",
    "speaking.description": "我曾經分享過的講座與活動",
    
    // Media
    "media.title": "媒體報導",
    "media.description": "相關的媒體採訪與報導",
    
    // Playground
    "playground.title": "探索",
    "playground.description": "我的興趣與連結收藏",
    
    // Contact
    "contact.title": "聯絡我",
    "contact.name": "姓名",
    "contact.email": "電子郵件",
    "contact.message": "訊息",
    "contact.send": "發送訊息",
    
    // Common
    "common.loading": "載入中...",
    "common.error": "發生錯誤",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.blog": "Blog",
    "nav.work": "Work",
    "nav.speaking": "Speaking",
    "nav.media": "Word & Media",
    "nav.playground": "Playground",
    "nav.contact": "Contact",
    "nav.login": "Login",
    "nav.logout": "Logout",
    "nav.cms": "CMS",
    
    // Footer
    "footer.navigate": "Navigate",
    "footer.connect": "Connect",
    "footer.copyright": "© 2025 Sofia Yan. Built with purpose, powered by trust. Watched over by Zaza🐈& Piepie🐈‍⬛.",
    
    // Home
    "home.title": "Digital Strategist & Startup Builder",
    "home.subtitle": "Focused on ethical tech and creativity",
    "home.latestPosts": "Latest Posts",
    "home.viewAll": "View All",
    "home.readMore": "Read More",
    
    // About
    "about.title": "About Me",
    "about.intro": "I'm Sofia Yan, a digital strategist and startup builder.",
    
    // Blog
    "blog.title": "Blog",
    "blog.search": "Search posts...",
    "blog.noPosts": "No posts yet",
    "blog.readTime": "min read",
    
    // Work
    "work.title": "Work",
    "work.description": "Projects and products I've worked on",
    
    // Speaking
    "speaking.title": "Speaking",
    "speaking.description": "Talks and events I've participated in",
    
    // Media
    "media.title": "Word & Media",
    "media.description": "Press coverage and interviews",
    
    // Playground
    "playground.title": "Playground",
    "playground.description": "My interests and curated links",
    
    // Contact
    "contact.title": "Contact",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.message": "Message",
    "contact.send": "Send Message",
    
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
