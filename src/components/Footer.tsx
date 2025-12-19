import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border py-12 mt-24">
      <div className="container max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <Link to="/" className="font-display text-lg font-medium">
              Sofia Yan
            </Link>
            <p className="text-muted-foreground text-sm mt-2 max-w-xs">
              Digital strategist & startup builder focused on ethical tech and creativity.
            </p>
          </div>
          
          <div className="flex gap-12 text-sm">
            <div className="space-y-3">
              <p className="text-muted-foreground uppercase tracking-wider text-xs">{t("footer.navigate")}</p>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">{t("nav.home")}</Link>
                <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">{t("nav.about")}</Link>
                <Link to="/blog" className="text-foreground/80 hover:text-foreground transition-colors">{t("nav.blog")}</Link>
                <Link to="/career" className="text-foreground/80 hover:text-foreground transition-colors">{t("nav.career")}</Link>
                <Link to="/playground" className="text-foreground/80 hover:text-foreground transition-colors">{t("nav.playground")}</Link>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-muted-foreground uppercase tracking-wider text-xs">{t("footer.connect")}</p>
              <div className="flex flex-col gap-2">
                <a href="https://x.com/sofia_numbers" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-foreground transition-colors">Twitter</a>
                <a href="https://www.linkedin.com/in/sofia-yan-b6318a31/" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-foreground transition-colors">LinkedIn</a>
                <a href="https://github.com/sofiayan0523" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-foreground transition-colors">GitHub</a>
                <a href="mailto:sag305320@gmail.com" className="text-foreground/80 hover:text-foreground transition-colors">Email</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border/50 text-center text-muted-foreground text-xs">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
};
