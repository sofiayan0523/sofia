import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/BlogCard";
import { blogPosts, categories } from "@/lib/blogData";
import { Button } from "@/components/ui/button";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPosts = activeCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="container max-w-5xl mx-auto">
          <div className="animate-fade-up space-y-8">
            <div className="max-w-2xl">
              <p className="text-muted-foreground uppercase tracking-widest text-xs font-medium mb-4">
                Blog
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-medium leading-tight">
                Stories & Insights
              </h1>
              <p className="text-muted-foreground mt-4 text-lg">
                旅行手記、AI 工具探索，以及生活中的隨想。
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 pt-4">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat.id)}
                  className="rounded-full"
                >
                  {cat.name}
                </Button>
              ))}
            </div>

            {/* Posts Grid */}
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              {filteredPosts.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i} />
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                <p>目前沒有這個分類的文章。</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
