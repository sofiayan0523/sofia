import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import { ExternalLink } from "lucide-react";
import sofiaImg from "@/assets/sofia.png";

const playgroundItems = [
  {
    emoji: "🐾",
    title: { zh: "Cat Reviews", en: "Cat Reviews" },
    description: {
      zh: "從鮪魚到 Twitter 討論串——來自這對貓咪的聲音。",
      en: "From tuna to Twitter threads — hear it from the duo.",
    },
    link: "https://x.com/sofia_numbers",
  },
  {
    emoji: "🎵",
    title: { zh: "Coding Playlist", en: "Coding Playlist" },
    description: {
      zh: "我工作時聽的音樂",
      en: "Music I build to",
    },
    link: "https://open.spotify.com/playlist/37i9dQZF1DWVidGk00tysG?si=b6b00b9e03b24a59",
  },
  {
    emoji: "📚",
    title: { zh: "Book Stack", en: "Book Stack" },
    description: {
      zh: "從 AI 倫理到 zine 設計",
      en: "From AI ethics to zine design",
    },
    link: "https://wecollect.fun/home/pP5lSFvUzlHHo1oBkbF9",
  },
  {
    emoji: "🧗",
    title: { zh: "Climbing Log", en: "Climbing Log" },
    description: {
      zh: "台北岩館 + 我最新的路線",
      en: "Taipei gyms + my latest sends",
    },
    link: "https://www.instagram.com/shiji_zapie/reels/",
  },
  {
    emoji: "🌍",
    title: { zh: "City List", en: "City List" },
    description: {
      zh: "我獨自探索過的 70+ 個城市——還在增加中",
      en: "70+ cities I've solo-explored — and counting",
    },
    link: "https://www.tripadvisor.com.tw/TravelMap-a_uid.62D80D5A0D26371C51F8738A6E080B84",
  },
];

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "capture-eye": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { nid: string },
        HTMLElement
      >;
    }
  }
}

const About = () => {
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
      
      <main className="pt-32 pb-20 px-6">
        <div className="container max-w-3xl mx-auto">
          <div className="animate-fade-up space-y-8">
            <div>
              <p className="text-muted-foreground uppercase tracking-widest text-xs font-medium mb-4">
                {t("about.label")}
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-medium leading-tight">
                {t("about.headline")}
              </h1>
            </div>

            <div className="w-64 md:w-80 rounded-xl overflow-hidden">
              <capture-eye nid="bafybeigro6ao7gyxcjzfyvgicmmdl56iyuj2vbfdswbu4aicytv4efreo4">
                <img 
                  src={sofiaImg}
                  alt="Sofia Yan"
                  className="w-full h-auto aspect-square object-cover object-top"
                />
              </capture-eye>
            </div>

            <div className="prose prose-neutral max-w-none space-y-6 text-foreground/80 leading-relaxed">
              <p className="text-lg" dangerouslySetInnerHTML={{ __html: t("about.intro") }} />
              <p>{t("about.background")}</p>
              <p>{t("about.hobbies")}</p>

              <h2 className="font-display text-2xl font-medium text-foreground pt-8">
                {t("about.speakAboutTitle")}
              </h2>
              
              <ul className="space-y-2">
                <li>{t("about.topic1")}</li>
                <li>{t("about.topic2")}</li>
                <li>{t("about.topic3")}</li>
                <li>{t("about.topic4")}</li>
              </ul>

              <h2 className="font-display text-2xl font-medium text-foreground pt-8">
                {t("about.currentlyTitle")}
              </h2>
              
              <ul className="space-y-2">
                <li>🏠 {t("about.current1")}</li>
                <li>🎤 {t("about.current2")}</li>
                <li>✍️ {t("about.current3")}</li>
                <li>🧗‍♀️ {t("about.current4")}</li>
              </ul>

              <h2 className="font-display text-2xl font-medium text-foreground pt-8">
                {t("playground.title")}
              </h2>
              <p className="text-muted-foreground">{t("playground.description")}</p>
            </div>
          </div>

          {/* Playground Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {playgroundItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{item.emoji}</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-display text-lg font-medium mb-2 group-hover:text-primary transition-colors">
                  {item.title[language]}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description[language]}
                </p>
              </a>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
