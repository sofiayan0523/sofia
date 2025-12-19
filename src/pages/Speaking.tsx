import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

const talks = [
  {
    title: {
      zh: "區塊鏈與數位內容真實性",
      en: "Blockchain and Digital Content Authenticity",
    },
    event: "Web Summit",
    date: "2024-11",
    location: "Lisbon, Portugal",
    link: "#",
  },
  {
    title: {
      zh: "AI 時代的內容溯源",
      en: "Content Provenance in the AI Era",
    },
    event: "Consensus",
    date: "2024-05",
    location: "Austin, USA",
    link: "#",
  },
  {
    title: {
      zh: "建構可信賴的數位生態系",
      en: "Building a Trustworthy Digital Ecosystem",
    },
    event: "ETH Taipei",
    date: "2024-03",
    location: "Taipei, Taiwan",
    link: "#",
  },
  {
    title: {
      zh: "從 Web2 到 Web3 的創業之路",
      en: "Entrepreneurship Journey from Web2 to Web3",
    },
    event: "AppWorks Demo Day",
    date: "2023-12",
    location: "Taipei, Taiwan",
    link: "#",
  },
];

const Speaking = () => {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">
              {t("speaking.title")}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t("speaking.description")}
            </p>
          </div>

          <div className="space-y-6">
            {talks.map((talk, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-medium mb-2">
                      {talk.title[language]}
                    </h2>
                    <p className="text-primary font-medium mb-2">{talk.event}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {talk.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {talk.location}
                      </span>
                    </div>
                  </div>
                  <a
                    href={talk.link}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {language === "zh" ? "查看詳情" : "View Details"}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Speaking;
