import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/BlogCard";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { ArrowRight, Loader2 } from "lucide-react";
import { CaptureEye } from "@/components/CaptureEye";
import { useLanguage } from "@/contexts/LanguageContext";
import sofiaImg from "@/assets/sofia.png";

const Index = () => {
  const { data: posts, isLoading } = useBlogPosts();
  const { t } = useLanguage();
  const featuredPosts = posts?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="container max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12">
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
                      About Me
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <Link to="/blog">
                    <Button variant="outline" size="lg">
                      Read Blog
                    </Button>
                  </Link>
                </div>
              </div>

              <div
                className="w-48 md:w-64 rounded-xl overflow-hidden animate-fade-up flex-shrink-0"
                style={{ animationDelay: "200ms" }}
              >
                <CaptureEye
                  nid="bafybeigro6ao7gyxcjzfyvgicmmdl56iyuj2vbfdswbu4aicytv4efreo4"
                  src={sofiaImg}
                  imgClassName="w-full h-auto aspect-square object-cover object-top rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6 border-y border-border/50">
          <div className="container max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "50+", label: "Cities Explored" },
                { value: "10+", label: "Years in Tech" },
                { value: "20+", label: "Speaking Events" },
                { value: "∞", label: "Curiosity" },
              ].map((stat, i) => (
                <div key={i} className="animate-fade-up opacity-0" style={{ animationDelay: `${i * 100 + 200}ms` }}>
                  <p className="font-display text-3xl md:text-4xl font-medium">{stat.value}</p>
                  <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
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
                  Latest Writing
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-medium">From the Blog</h2>
              </div>
              <Link to="/blog">
                <Button variant="minimal" className="hidden md:flex">
                  View All
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
                <p>尚未發布任何文章。</p>
              </div>
            )}

            <div className="mt-8 text-center md:hidden">
              <Link to="/blog">
                <Button variant="outline">
                  View All Posts
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
              <h2 className="font-display text-2xl md:text-3xl font-medium mb-4">Let's Connect</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Whether you want to discuss ethical tech, share travel stories, or explore collaboration opportunities.
              </p>
              <a href="mailto:sag305320@gmail.com">
                <Button size="lg">
                  Get in Touch
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
