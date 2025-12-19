import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Moon, Sun, Menu, X, LogOut, Settings, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const Header = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: t("nav.home") },
    { path: "/about", label: t("nav.about") },
    { path: "/blog", label: t("nav.blog") },
    { path: "/career", label: t("nav.career") },
    { path: "/playground", label: t("nav.playground") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="font-display text-xl font-medium tracking-tight hover:opacity-70 transition-opacity"
        >
          Sofia Yan
        </Link>
        
        <nav className="hidden lg:flex items-center gap-4">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button 
                variant="nav" 
                size="sm"
                className={location.pathname === item.path ? "text-foreground" : ""}
              >
                {item.label}
              </Button>
            </Link>
          ))}
          
          {user && (
            <Link to="/admin">
              <Button variant="nav" size="sm" className={location.pathname.startsWith("/admin") ? "text-foreground" : ""}>
                <Settings className="w-4 h-4 mr-1" />
                {t("nav.cms")}
              </Button>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("zh")} className={language === "zh" ? "bg-secondary" : ""}>
                繁體中文
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-secondary" : ""}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {user ? (
            <Button variant="ghost" size="icon" onClick={signOut} title={t("nav.logout")}>
              <LogOut className="w-5 h-5" />
            </Button>
          ) : (
            <Link to="/login" className="hidden md:block">
              <Button variant="outline" size="sm">
                {t("nav.login")}
              </Button>
            </Link>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-b border-border">
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
                    {t("nav.cms")}
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("nav.logout")}
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  {t("nav.login")}
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
