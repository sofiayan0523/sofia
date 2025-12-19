import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Moon, Sun, Menu, X, LogOut, Settings } from "lucide-react";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/blog", label: "Blog" },
  { path: "/contact", label: "Contact" },
];

export const Header = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="font-display text-xl font-medium tracking-tight hover:opacity-70 transition-opacity"
        >
          Sofia Yan
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button 
                variant="nav" 
                className={location.pathname === item.path ? "text-foreground" : ""}
              >
                {item.label}
              </Button>
            </Link>
          ))}
          
          {user && (
            <Link to="/admin">
              <Button variant="nav" className={location.pathname.startsWith("/admin") ? "text-foreground" : ""}>
                <Settings className="w-4 h-4 mr-1" />
                CMS
              </Button>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {user ? (
            <Button variant="ghost" size="icon" onClick={signOut} title="登出">
              <LogOut className="w-5 h-5" />
            </Button>
          ) : (
            <Link to="/login" className="hidden md:block">
              <Button variant="outline" size="sm">
                登入
              </Button>
            </Link>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <nav className="container max-w-5xl mx-auto px-6 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${location.pathname === item.path ? "bg-secondary" : ""}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    CMS 管理
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  登出
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  登入
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
