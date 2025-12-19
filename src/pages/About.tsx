import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CaptureEye } from "@/components/CaptureEye";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

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
              <CaptureEye
                nid="bafybeigro6ao7gyxcjzfyvgicmmdl56iyuj2vbfdswbu4aicytv4efreo4"
                src="https://sofiayan0523.github.io/sofia/assets/sofia.png"
                className="aspect-square [&_media-viewer]:object-cover [&_media-viewer]:object-left-top"
              />
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
