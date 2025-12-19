import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExternalLink, Newspaper } from "lucide-react";

const mediaItems = [
  {
    title: {
      zh: "Numbers Protocol 獲選 Forbes 30 Under 30",
      en: "Numbers Protocol Selected for Forbes 30 Under 30",
    },
    source: "Forbes",
    date: "2024-01",
    link: "#",
  },
  {
    title: {
      zh: "區塊鏈如何解決假新聞問題",
      en: "How Blockchain Solves the Fake News Problem",
    },
    source: "TechCrunch",
    date: "2023-11",
    link: "#",
  },
  {
    title: {
      zh: "專訪：打造數位內容信任基礎設施",
      en: "Interview: Building Digital Content Trust Infrastructure",
    },
    source: "CoinDesk",
    date: "2023-09",
    link: "#",
  },
  {
    title: {
      zh: "台灣 Web3 新創的全球化之路",
      en: "Taiwan Web3 Startups Going Global",
    },
    source: "數位時代",
    date: "2023-06",
    link: "#",
  },
];

const Media = () => {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">
              {t("media.title")}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t("media.description")}
            </p>
          </div>

          <div className="grid gap-4">
            {mediaItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Newspaper className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-medium mb-1 truncate group-hover:text-primary transition-colors">
                    {item.title[language]}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {item.source} • {item.date}
                  </p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Media;
