import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/BlogCard";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Loader2 } from "lucide-react";

const Index = () => {
  const { data: posts, isLoading } = useBlogPosts();
  const { t } = useLanguage();
  const featuredPosts = posts?.slice(0, 3) || [];

  const stats = [
    { value: "70+", labelKey: "home.stat1" },
    { value: "10+", labelKey: "home.stat2" },
    { value: "50+", labelKey: "home.stat3" },
    { value: "∞", labelKey: "home.stat4" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="container max-w-5xl mx-auto">
            <div className="max-w-2xl space-y-6 animate-fade-up">
              <p className="text-muted-foreground uppercase tracking-widest text-xs font-medium">
                {t("home.title")}
              </p>
              
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight">
                {t("home.greeting")}
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                {t("home.description")}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/about">
                  <Button variant="default" size="lg">
                    {t("home.aboutBtn")}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button variant="outline" size="lg">
                    {t("home.blogBtn")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6 border-y border-border/50">
          <div className="container max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, i) => (
                <div 
                  key={i} 
                  className="animate-fade-up opacity-0"
                  style={{ animationDelay: `${i * 100 + 200}ms`, animationFillMode: 'forwards' }}
                >
                  <p className="font-display text-3xl md:text-4xl font-medium">{stat.value}</p>
                  <p className="text-muted-foreground text-sm mt-1">{t(stat.labelKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-20 px-6">
          <div className="container max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-muted-foreground uppercase tracking-widest text-xs font-medium mb-2">
                  {t("home.latestWriting")}
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-medium">
                  {t("home.fromBlog")}
                </h2>
              </div>
              <Link to="/blog">
                <Button variant="minimal" className="hidden md:flex">
                  {t("home.viewAll")}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : featuredPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPosts.map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>{t("blog.noPosts")}</p>
              </div>
            )}

            <div className="mt-8 text-center md:hidden">
              <Link to="/blog">
                <Button variant="outline">
                  {t("home.viewAllPosts")}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="container max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl p-8 md:p-12 text-center shadow-soft">
              <h2 className="font-display text-2xl md:text-3xl font-medium mb-4">
                {t("home.ctaTitle")}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {t("home.ctaDescription")}
              </p>
              <a href="mailto:sag305320@gmail.com">
                <Button size="lg">
                  {t("home.ctaBtn")}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
