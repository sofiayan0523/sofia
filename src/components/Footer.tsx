import { Link } from "react-router-dom";

export const Footer = () => {
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
              <p className="text-muted-foreground uppercase tracking-wider text-xs">Navigate</p>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">Home</Link>
                <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">About</Link>
                <Link to="/blog" className="text-foreground/80 hover:text-foreground transition-colors">Blog</Link>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-muted-foreground uppercase tracking-wider text-xs">Connect</p>
              <div className="flex flex-col gap-2">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-foreground transition-colors">Twitter</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-foreground transition-colors">LinkedIn</a>
                <a href="mailto:hello@example.com" className="text-foreground/80 hover:text-foreground transition-colors">Email</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border/50 text-center text-muted-foreground text-xs">
          © {new Date().getFullYear()} Sofia Yan. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
