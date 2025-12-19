import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExternalLink, Briefcase, Mic, Newspaper } from "lucide-react";
import { useEffect } from "react";

// Import logos
import captureLogo from "@/assets/capture-logo.png";
import numbersLogo from "@/assets/numbers-logo.png";
import coaLogo from "@/assets/coa-logo.png";
import dt42Logo from "@/assets/dt42-logo.png";
import aikeaLogo from "@/assets/aikea-logo.png";
import kekeAiLogo from "@/assets/keke-ai-shorts.png";
import sofiaSpeakImg from "@/assets/sofia-speak.jpg";

const workItems = [
  {
    title: "Capture App",
    description: {
      zh: "Capture 讓任何人都能創建和分享可驗證的數位媒體。它正在為選舉、新聞和 AI 生成內容提供溯源支持。",
      en: "Capture lets anyone create and share verifiable digital media. It's powering provenance in elections, journalism, and AI-generated content.",
    },
    link: "https://captureapp.xyz/",
    logo: captureLogo,
  },
  {
    title: "Numbers Protocol",
    description: {
      zh: "一個區塊鏈解決方案，使數位內容可追溯、可信賴，並準備好進入合乎倫理的 AI 生態系統。我負責其全球成長和社群。",
      en: "A blockchain solution that makes digital content traceable, trustworthy, and ready for ethical AI ecosystems. I lead its global growth and community.",
    },
    link: "https://numbersprotocol.io/",
    logo: numbersLogo,
  },
  {
    title: "Creative Origin Alliance",
    description: {
      zh: "一個由創作者、技術專家和平台組成的網絡，從根本上建構負責任的 AI。我是創始成員和驕傲的麻煩製造者。",
      en: "A network of creators, technologists, and platforms building responsible AI from the ground up. I'm a founding member and proud troublemaker.",
    },
    link: "https://creativeorigin.ai/",
    logo: coaLogo,
  },
  {
    title: "DT42",
    description: {
      zh: "一家建構智慧邊緣解決方案的 AI 新創。我參與業務開發和策略成長，幫助塑造其在 AI 硬體領域的敘事。",
      en: "An AI startup building smart edge solutions. I contributed to business development and strategic growth, helping shape its narrative in the AI hardware space.",
    },
    link: "https://dt42.io/",
    logo: dt42Logo,
  },
  {
    title: "AIKEA",
    description: {
      zh: "一個成功的 Kickstarter 項目，將私密 AI 驅動相機帶入家庭。我領導了產品發布和行銷活動，幫助達成募資目標。",
      en: "A successful Kickstarter project bringing private AI-powered cameras into homes. I led the product launch and marketing campaign that helped it reach its funding goal.",
    },
    link: "https://www.kickstarter.com/projects/aikea5/aikea-your-private-camera-at-home/description",
    logo: aikeaLogo,
  },
  {
    title: "Keke AI Shorts",
    description: {
      zh: "共同創建一個 YouTube 頻道，以簡短易懂的影片分享 AI 知識。讓 AI 對每個人都易於理解。",
      en: "Co-created a YouTube channel to share AI knowledge in short, easy-to-understand videos. Making AI accessible to everyone.",
    },
    link: "https://www.youtube.com/@kekeAIShorts",
    logo: kekeAiLogo,
  },
];

const speakingItems = [
  {
    title: "Surviving the AI Flood: A Fireside Chat on Trust & Revenue",
    link: "https://numbersprotocol.github.io/numbers-ama/webinar/2025-12-06",
  },
  {
    title: "RightsCon 2025 (side event host + speaker)",
    link: "https://international.thenewslens.com/article/187416",
  },
  {
    title: "2024 Meet Taipei (panelist)",
    link: "https://www.youtube.com/watch?v=h-CNy_IPJP4",
  },
  {
    title: "2024 Trust Valley Official Opening (panelist)",
    link: "https://events.trustvalley.tech/e/trust-village-official-opening",
  },
  {
    title: "Protecting Creativity in the Age of AI (panelist & speaker)",
    link: "https://protectingcreativity.numbersprotocol.io/",
  },
  {
    title: "AI Meets Blockchain (moderator)",
    link: "https://www.youtube.com/watch?v=yN3nfFk2UJk",
  },
];

const mediaItems = [
  {
    source: "POLITICO",
    title: {
      zh: "討論中國針對台灣選舉的假訊息攻勢",
      en: "Discussing China's disinformation campaign targeting Taiwan's election",
    },
    link: "https://www.politico.eu/article/china-bombards-taiwan-with-fake-news-ahead-of-election/",
  },
  {
    source: "AmCham",
    title: {
      zh: "討論打擊選舉假訊息和數位驗證的重要性",
      en: "The fight against election disinformation and digital verification",
    },
    link: "https://topics.amcham.com.tw/2024/11/the-fight-against-election-disinformation/",
  },
  {
    source: "Meet Global",
    title: {
      zh: "分享區塊鏈技術和數位媒體驗證的見解",
      en: "Insights on blockchain and digital media verification",
    },
    link: "https://meet-global.bnext.com.tw/articles/view/47895",
  },
];

const Career = () => {
  const { language, t } = useLanguage();

  useEffect(() => {
    const scriptId = "capture-eye-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "module";
      script.src = "https://cdn.jsdelivr.net/npm/@numbersprotocol/capture-eye@latest/dist/capture-eye.bundled.js";
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="mb-12 animate-fade-up flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">
                {t("career.title")}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t("career.description")}
              </p>
            </div>
            <div className="w-48 md:w-56 rounded-xl overflow-hidden flex-shrink-0">
              <capture-eye nid="bafkreia5ubvraec2kzmsgjon2kklua5fstlxs6ztbyf7i3exdy75hghgxy">
                <img 
                  src={sofiaSpeakImg} 
                  alt="Sofia speaking"
                  className="w-full h-auto"
                />
              </capture-eye>
            </div>
          </div>

          {/* Work Section - Square Cards with Logos */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
              </div>
              <h2 className="font-display text-2xl font-medium">
                {t("career.work")}
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {workItems.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-xl bg-card border border-border overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Content */}
                  <div className="relative p-5 flex flex-col">
                    {/* Logo */}
                    <div className="h-12 mb-4 flex items-center">
                      <img 
                        src={item.logo} 
                        alt={item.title}
                        className="max-h-10 max-w-full object-contain filter dark:brightness-0 dark:invert opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    
                    <div>
                      <h3 className="font-display text-base font-medium mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {item.description[language]}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-end pt-2">
                      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Speaking & Media - Two Column Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Speaking Section - Single Card */}
            <section className="h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Mic className="w-5 h-5 text-muted-foreground" />
                </div>
                <h2 className="font-display text-2xl font-medium">
                  {t("career.speaking")}
                </h2>
              </div>
              <div className="rounded-xl bg-card border border-border overflow-hidden flex-1">
                {/* Speaking List */}
                <ul className="p-5 space-y-3">
                  {speakingItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                      >
                        <span className="text-muted-foreground mt-1">•</span>
                        <span className="flex-1">{item.title}</span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Media Section - Single Card */}
            <section className="h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-muted-foreground" />
                </div>
                <h2 className="font-display text-2xl font-medium">
                  {t("career.media")}
                </h2>
              </div>
              <div className="rounded-xl bg-card border border-border p-5 flex-1">
                <ul className="space-y-4">
                  {mediaItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                      >
                        <p className="text-xs text-primary/70 uppercase tracking-wider mb-1 font-medium">
                          {item.source}
                        </p>
                        <p className="text-sm text-foreground/80 group-hover:text-primary transition-colors flex items-start gap-2">
                          <span className="flex-1">{item.title[language]}</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Career;
