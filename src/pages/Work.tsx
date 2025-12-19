import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Numbers Protocol",
    description: {
      zh: "區塊鏈數位內容溯源協議，讓每張照片和影片都有可驗證的來源",
      en: "Blockchain-based digital content provenance protocol for verifiable photo and video origins",
    },
    link: "https://numbersprotocol.io",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600",
  },
  {
    title: "Capture App",
    description: {
      zh: "數位資產管理應用程式，幫助創作者保護和管理他們的作品",
      en: "Digital asset management app helping creators protect and manage their work",
    },
    link: "https://captureapp.xyz",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600",
  },
  {
    title: "Starling Lab",
    description: {
      zh: "與史丹佛大學合作的數位真實性研究實驗室",
      en: "Digital authenticity research lab in collaboration with Stanford University",
    },
    link: "https://www.starlinglab.org",
    image: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=600",
  },
];

const Work = () => {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">
              {t("work.title")}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t("work.description")}
            </p>
          </div>

          <div className="grid gap-8">
            {projects.map((project, index) => (
              <a
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col md:flex-row gap-6 p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className="md:w-1/3 aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="md:w-2/3 flex flex-col justify-center">
                  <h2 className="font-display text-2xl font-medium mb-3 flex items-center gap-2">
                    {project.title}
                    <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h2>
                  <p className="text-muted-foreground">
                    {project.description[language]}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Work;
