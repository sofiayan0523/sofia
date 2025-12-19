import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useMyBlogPosts, useDeleteBlogPost } from "@/hooks/useBlogPosts";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: posts, isLoading } = useMyBlogPosts();
  const deletePost = useDeleteBlogPost();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Redirect if not logged in
  if (!authLoading && !user) {
    navigate("/login");
    return null;
  }

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deletePost.mutateAsync(deleteId);
      toast({ title: "文章已刪除" });
    } catch (error) {
      toast({ title: "刪除失敗", variant: "destructive" });
    }
    setDeleteId(null);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-6">
          <div className="container max-w-5xl mx-auto flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="container max-w-5xl mx-auto">
          <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-muted-foreground uppercase tracking-widest text-xs font-medium mb-2">
                  CMS
                </p>
                <h1 className="font-display text-3xl md:text-4xl font-medium">
                  文章管理
                </h1>
              </div>
              <Link to="/admin/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  新增文章
                </Button>
              </Link>
            </div>

            {posts && posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div 
                    key={post.id}
                    className="bg-card rounded-xl p-6 shadow-card flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-display text-lg font-medium truncate">
                          {post.title}
                        </h3>
                        {post.published ? (
                          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                            <Eye className="w-3 h-3" />
                            已發布
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                            <EyeOff className="w-3 h-3" />
                            草稿
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {post.category} · {formatDate(post.created_at)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/edit/${post.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setDeleteId(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-xl shadow-card">
                <p className="text-muted-foreground mb-4">你還沒有任何文章。</p>
                <Link to="/admin/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    撰寫第一篇文章
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要刪除這篇文章嗎？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作無法復原，文章將被永久刪除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              確定刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
