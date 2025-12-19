import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExternalLink, Music, Book, Camera, Gamepad2, Palette, Film } from "lucide-react";

const categories = [
  {
    title: { zh: "音樂", en: "Music" },
    icon: Music,
    links: [
      { name: "Spotify", url: "https://spotify.com" },
      { name: "SoundCloud", url: "https://soundcloud.com" },
    ],
  },
  {
    title: { zh: "閱讀", en: "Reading" },
    icon: Book,
    links: [
      { name: "Goodreads", url: "https://goodreads.com" },
      { name: "Medium", url: "https://medium.com" },
    ],
  },
  {
    title: { zh: "攝影", en: "Photography" },
    icon: Camera,
    links: [
      { name: "Unsplash", url: "https://unsplash.com" },
      { name: "500px", url: "https://500px.com" },
    ],
  },
  {
    title: { zh: "遊戲", en: "Gaming" },
    icon: Gamepad2,
    links: [
      { name: "Steam", url: "https://store.steampowered.com" },
      { name: "Nintendo", url: "https://nintendo.com" },
    ],
  },
  {
    title: { zh: "藝術", en: "Art" },
    icon: Palette,
    links: [
      { name: "Behance", url: "https://behance.net" },
      { name: "Dribbble", url: "https://dribbble.com" },
    ],
  },
  {
    title: { zh: "電影", en: "Film" },
    icon: Film,
    links: [
      { name: "Letterboxd", url: "https://letterboxd.com" },
      { name: "IMDb", url: "https://imdb.com" },
    ],
  },
];

const Playground = () => {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">
              {t("playground.title")}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t("playground.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h2 className="font-display text-lg font-medium">
                      {category.title[language]}
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {category.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary transition-colors text-sm"
                      >
                        <span>{link.name}</span>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Playground;
