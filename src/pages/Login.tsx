import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect if already logged in
  if (user) {
    navigate("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isLogin 
        ? await signIn(formData.email, formData.password)
        : await signUp(formData.email, formData.password);

      if (error) {
        toast({ 
          title: isLogin ? "登入失敗" : "註冊失敗", 
          description: error.message,
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: isLogin ? "登入成功" : "註冊成功",
          description: isLogin ? "歡迎回來！" : "帳號已建立，請登入。"
        });
        if (!isLogin) {
          setIsLogin(true);
        } else {
          navigate("/admin");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="container max-w-md mx-auto">
          <div className="animate-fade-up">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-medium mb-2">
                {isLogin ? "登入" : "註冊"}
              </h1>
              <p className="text-muted-foreground">
                {isLogin ? "登入以管理你的部落格" : "建立帳號開始寫作"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-card space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  密碼
                </label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isLogin ? "登入" : "註冊"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {isLogin ? "還沒有帳號？" : "已經有帳號了？"}
                </span>{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-foreground hover:underline font-medium"
                >
                  {isLogin ? "註冊" : "登入"}
                </button>
              </div>
            </form>

            <div className="text-center mt-6">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                返回首頁
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
