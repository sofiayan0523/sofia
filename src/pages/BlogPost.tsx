import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/lib/blogData";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-6">
          <div className="container max-w-3xl mx-auto text-center">
            <h1 className="font-display text-3xl font-medium mb-4">找不到文章</h1>
            <p className="text-muted-foreground mb-8">這篇文章可能已被移除或不存在。</p>
            <Link to="/blog">
              <Button>返回部落格</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryLabels = {
    'travel': '旅行',
    'ai-tools': 'AI 工具',
    'thoughts': '隨想'
  };

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];
    
    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 text-foreground/80">
            {listItems.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={i} className="font-display text-3xl md:text-4xl font-medium mt-8 mb-4">
            {trimmed.slice(2)}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={i} className="font-display text-2xl font-medium mt-8 mb-3">
            {trimmed.slice(3)}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={i} className="font-display text-xl font-medium mt-6 mb-2">
            {trimmed.slice(4)}
          </h3>
        );
      } else if (trimmed.startsWith('- ')) {
        listItems.push(trimmed.slice(2));
      } else if (trimmed.match(/^\d+\. /)) {
        listItems.push(trimmed.replace(/^\d+\. /, ''));
      } else if (trimmed === '') {
        flushList();
      } else {
        flushList();
        elements.push(
          <p key={i} className="text-foreground/80 leading-relaxed">
            {trimmed}
          </p>
        );
      }
    });
    
    flushList();
    return elements;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <article className="container max-w-3xl mx-auto">
          <div className="animate-fade-up">
            {/* Back button */}
            <Button 
              variant="minimal" 
              onClick={() => navigate('/blog')}
              className="mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回文章列表
            </Button>

            {/* Header */}
            <header className="space-y-4 mb-8">
              <div className="flex items-center gap-4 text-sm">
                <span className="px-3 py-1 bg-secondary rounded-full text-secondary-foreground font-medium">
                  {categoryLabels[post.category]}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString('zh-TW')}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>

              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium leading-tight">
                {post.title}
              </h1>

              <p className="text-lg text-muted-foreground">
                {post.excerpt}
              </p>
            </header>

            {/* Cover Image */}
            <div className="aspect-[16/9] rounded-xl overflow-hidden mb-12">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="prose-container space-y-4">
              {renderContent(post.content)}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
              {post.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-secondary rounded-full text-sm text-secondary-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
