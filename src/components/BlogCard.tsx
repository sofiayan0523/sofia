import { Link } from "react-router-dom";
import type { BlogPost } from "@/hooks/useBlogPosts";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

const categoryLabels: Record<string, string> = {
  'travel': '旅行',
  'ai-tools': 'AI 工具',
  'thoughts': '隨想'
};

export const BlogCard = ({ post, index }: BlogCardProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link 
      to={`/blog/${post.id}`}
      className="group block"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <article className="animate-fade-up opacity-0 bg-card rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-500 hover:-translate-y-1">
        {post.cover_image && (
          <div className="aspect-[16/10] overflow-hidden">
            <img 
              src={post.cover_image} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}
        
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 bg-secondary rounded-full text-secondary-foreground font-medium">
              {categoryLabels[post.category] || post.category}
            </span>
            <span className="text-muted-foreground">{post.read_time}</span>
          </div>
          
          <h3 className="font-display text-xl font-medium leading-snug group-hover:text-muted-foreground transition-colors">
            {post.title}
          </h3>
          
          {post.excerpt && (
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-wrap gap-2">
              {post.tags?.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(post.created_at)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};
