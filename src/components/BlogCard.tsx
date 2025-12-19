import { Link } from "react-router-dom";
import type { BlogPost } from "@/lib/blogData";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export const BlogCard = ({ post, index }: BlogCardProps) => {
  const categoryLabels = {
    'travel': '旅行',
    'ai-tools': 'AI 工具',
    'thoughts': '隨想'
  };

  return (
    <Link 
      to={`/blog/${post.id}`}
      className="group block"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <article className="animate-fade-up opacity-0 bg-card rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-500 hover:-translate-y-1">
        <div className="aspect-[16/10] overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 bg-secondary rounded-full text-secondary-foreground font-medium">
              {categoryLabels[post.category]}
            </span>
            <span className="text-muted-foreground">{post.readTime}</span>
          </div>
          
          <h3 className="font-display text-xl font-medium leading-snug group-hover:text-muted-foreground transition-colors">
            {post.title}
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
          
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
};
