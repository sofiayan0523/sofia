import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogCard } from "@/components/BlogCard";
import { SearchBar } from "@/components/SearchBar";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

const categories = [
  { id: 'all', name: '全部文章' },
  { id: 'travel', name: '旅行手記' },
  { id: 'ai-tools', name: 'AI 工具' },
  { id: 'thoughts', name: '隨想' },
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: posts, isLoading } = useBlogPosts(searchQuery, activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Blog"
        description="旅行手記、AI 工具探索，以及生活中的隨想。探索 Sofia 的科技觀察與旅行故事。"
        url="/blog"
      />
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

            {/* Search Bar */}
            <div className="max-w-md">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
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
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                {posts.map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <p>
                  {searchQuery 
                    ? `找不到包含「${searchQuery}」的文章。`
                    : "目前沒有這個分類的文章。"
                  }
                </p>
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
