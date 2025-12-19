import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExternalLink, Briefcase, Mic, Newspaper } from "lucide-react";

const workItems = [
  {
    title: "Capture App",
    description: {
      zh: "Capture 讓任何人都能創建和分享可驗證的數位媒體。它正在為選舉、新聞和 AI 生成內容提供溯源支持。",
      en: "Capture lets anyone create and share verifiable digital media. It's powering provenance in elections, journalism, and AI-generated content.",
    },
    link: "https://captureapp.xyz/",
    color: "from-violet-500/20 to-fuchsia-500/20",
  },
  {
    title: "Numbers Protocol",
    description: {
      zh: "一個區塊鏈解決方案，使數位內容可追溯、可信賴，並準備好進入合乎倫理的 AI 生態系統。我負責其全球成長和社群。",
      en: "A blockchain solution that makes digital content traceable, trustworthy, and ready for ethical AI ecosystems. I lead its global growth and community.",
    },
    link: "https://numbersprotocol.io/",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Creative Origin Alliance",
    description: {
      zh: "一個由創作者、技術專家和平台組成的網絡，從根本上建構負責任的 AI。我是創始成員和驕傲的麻煩製造者。",
      en: "A network of creators, technologists, and platforms building responsible AI from the ground up. I'm a founding member and proud troublemaker.",
    },
    link: "https://creativeorigin.ai/",
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    title: "DT42",
    description: {
      zh: "一家建構智慧邊緣解決方案的 AI 新創。我參與業務開發和策略成長，幫助塑造其在 AI 硬體領域的敘事。",
      en: "An AI startup building smart edge solutions. I contributed to business development and strategic growth, helping shape its narrative in the AI hardware space.",
    },
    link: "https://dt42.io/",
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    title: "AIKEA",
    description: {
      zh: "一個成功的 Kickstarter 項目，將私密 AI 驅動相機帶入家庭。我領導了產品發布和行銷活動，幫助達成募資目標。",
      en: "A successful Kickstarter project bringing private AI-powered cameras into homes. I led the product launch and marketing campaign that helped it reach its funding goal.",
    },
    link: "https://www.kickstarter.com/projects/aikea5/aikea-your-private-camera-at-home/description",
    color: "from-rose-500/20 to-pink-500/20",
  },
  {
    title: "Keke AI Shorts",
    description: {
      zh: "共同創建一個 YouTube 頻道，以簡短易懂的影片分享 AI 知識。讓 AI 對每個人都易於理解。",
      en: "Co-created a YouTube channel to share AI knowledge in short, easy-to-understand videos. Making AI accessible to everyone.",
    },
    link: "https://www.youtube.com/@kekeAIShorts",
    color: "from-red-500/20 to-rose-500/20",
  },
];

const speakingItems = [
  {
    title: {
      zh: "Surviving the AI Flood: A Fireside Chat on Trust & Revenue",
      en: "Surviving the AI Flood: A Fireside Chat on Trust & Revenue",
    },
    link: "https://numbersprotocol.github.io/numbers-ama/webinar/2025-12-06",
  },
  {
    title: {
      zh: "RightsCon 2025 (side event host + speaker)",
      en: "RightsCon 2025 (side event host + speaker)",
    },
    link: "https://international.thenewslens.com/article/187416",
  },
  {
    title: {
      zh: "2024 Meet Taipei (panelist)",
      en: "2024 Meet Taipei (panelist)",
    },
    link: "https://www.youtube.com/watch?v=h-CNy_IPJP4",
  },
  {
    title: {
      zh: "2024 Trust Valley Official Opening (panelist)",
      en: "2024 Trust Valley Official Opening (panelist)",
    },
    link: "https://events.trustvalley.tech/e/trust-village-official-opening",
  },
  {
    title: {
      zh: "Protecting Creativity in the Age of AI (panelist & speaker)",
      en: "Protecting Creativity in the Age of AI (panelist & speaker)",
    },
    link: "https://protectingcreativity.numbersprotocol.io/",
  },
  {
    title: {
      zh: "AI Meets Blockchain (moderator)",
      en: "AI Meets Blockchain (moderator)",
    },
    link: "https://www.youtube.com/watch?v=yN3nfFk2UJk",
  },
];

const mediaItems = [
  {
    title: {
      zh: "POLITICO：討論中國針對台灣選舉的假訊息攻勢",
      en: "Featured on POLITICO discussing China's disinformation campaign targeting Taiwan's election.",
    },
    source: "POLITICO",
    link: "https://www.politico.eu/article/china-bombards-taiwan-with-fake-news-ahead-of-election/",
  },
  {
    title: {
      zh: "AmCham：討論打擊選舉假訊息和數位驗證的重要性",
      en: "Discussing the fight against election disinformation and the importance of digital verification.",
    },
    source: "AmCham",
    link: "https://topics.amcham.com.tw/2024/11/the-fight-against-election-disinformation/",
  },
  {
    title: {
      zh: "Meet Global：分享區塊鏈技術和數位媒體驗證的見解",
      en: "Sharing insights on blockchain technology and digital media verification.",
    },
    source: "Meet Global",
    link: "https://meet-global.bnext.com.tw/articles/view/47895",
  },
];

const Career = () => {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="mb-12 animate-fade-up">
            <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">
              {t("career.title")}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t("career.description")}
            </p>
          </div>

          {/* Work Section - Square Cards */}
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
                  className="group relative aspect-square rounded-xl bg-card border border-border overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="relative h-full p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-lg font-medium mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed">
                        {item.description[language]}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {language === "zh" ? "查看更多" : "View more"}
                      </span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Speaking Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Mic className="w-5 h-5 text-muted-foreground" />
              </div>
              <h2 className="font-display text-2xl font-medium">
                {t("career.speaking")}
              </h2>
            </div>
            <div className="grid gap-3">
              {speakingItems.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-secondary/30 transition-all duration-300"
                >
                  <span className="font-medium text-sm group-hover:text-primary transition-colors">
                    {item.title[language]}
                  </span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
            </div>
          </section>

          {/* Media Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-muted-foreground" />
              </div>
              <h2 className="font-display text-2xl font-medium">
                {t("career.media")}
              </h2>
            </div>
            <div className="grid gap-4">
              {mediaItems.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-secondary/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-primary/70 uppercase tracking-wider mb-2 font-medium">
                        {item.source}
                      </p>
                      <p className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                        {item.title[language]}
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0 mt-1" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Career;
