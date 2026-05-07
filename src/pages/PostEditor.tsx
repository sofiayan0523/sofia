import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useAuth } from "@/contexts/auth";
import { useBlogPost, useCreateBlogPost, useUpdateBlogPost } from "@/hooks/useBlogPosts";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye, Upload, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  { id: 'travel', name: '旅行手記' },
  { id: 'ai-tools', name: 'AI 工具' },
  { id: 'thoughts', name: '隨想' },
];

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { uploadImage, uploading } = useImageUpload();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!id;
  const { data: existingPost, isLoading } = useBlogPost(id || "");
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();

const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "thoughts",
    cover_image: "",
    read_time: "5 min",
    tags: [] as string[],
    published: false,
    created_at: "",
  });
  const [tagsInput, setTagsInput] = useState("");

  // Load existing post data
  useEffect(() => {
    if (existingPost) {
      setFormData({
        title: existingPost.title,
        excerpt: existingPost.excerpt || "",
        content: existingPost.content,
        category: existingPost.category,
        cover_image: existingPost.cover_image || "",
        read_time: existingPost.read_time || "5 min",
        tags: existingPost.tags || [],
        published: existingPost.published || false,
        created_at: existingPost.created_at ? existingPost.created_at.split("T")[0] : "",
      });
      setTagsInput((existingPost.tags || []).join(", "));
    }
  }, [existingPost]);

  // Redirect if not logged in
  if (!authLoading && !user) {
    navigate("/login");
    return null;
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file);
    if (url) {
      setFormData({ ...formData, cover_image: url });
      toast({ title: "封面圖片已上傳" });
    } else {
      toast({ title: "上傳失敗", variant: "destructive" });
    }
  };

  const handleSubmit = async (publish: boolean) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({ title: "請填寫標題和內容", variant: "destructive" });
      return;
    }

    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    const basePostData = { 
      title: formData.title,
      content: formData.content,
      category: formData.category,
      read_time: formData.read_time,
      tags, 
      published: publish,
      excerpt: formData.excerpt || null,
      cover_image: formData.cover_image || null,
    };
    
    // Only include created_at if user specified a date
    const postData = formData.created_at 
      ? { ...basePostData, created_at: new Date(formData.created_at).toISOString() }
      : basePostData;

    try {
      if (isEditing && id) {
        await updatePost.mutateAsync({ id, ...postData });
        toast({ title: publish ? "文章已發布" : "草稿已儲存" });
      } else {
        await createPost.mutateAsync(postData);
        toast({ title: publish ? "文章已發布" : "草稿已儲存" });
      }
      navigate("/admin");
    } catch (error) {
      toast({ title: "儲存失敗", variant: "destructive" });
    }
  };

  if (authLoading || (isEditing && isLoading)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-6">
          <div className="container max-w-3xl mx-auto flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isSaving = createPost.isPending || updatePost.isPending;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="container max-w-3xl mx-auto">
          <div className="animate-fade-up">
            <Button 
              variant="minimal" 
              onClick={() => navigate('/admin')}
              className="mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回文章列表
            </Button>

            <h1 className="font-display text-3xl font-medium mb-8">
              {isEditing ? "編輯文章" : "撰寫新文章"}
            </h1>

            <div className="space-y-6">
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium mb-2">封面圖片</label>
                {formData.cover_image ? (
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-secondary mb-2">
                    <img 
                      src={formData.cover_image} 
                      alt="Cover" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-4 right-4"
                      onClick={() => coverInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                      更換圖片
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-border hover:border-muted-foreground transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    {uploading ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8" />
                        <span>上傳封面圖片</span>
                      </>
                    )}
                  </button>
                )}
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">標題</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="文章標題"
                  className="text-lg"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium mb-2">摘要</label>
                <Input
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="簡短描述這篇文章..."
                />
              </div>

              {/* Category & Read Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">分類</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">閱讀時間</label>
                  <Input
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                    placeholder="5 min"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">標籤（用逗號分隔）</label>
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="旅行, 日本, 美食"
                />
              </div>

              {/* Publish Date */}
              <div>
                <label className="block text-sm font-medium mb-2">發布日期（可自訂舊文章日期）</label>
                <Input
                  type="date"
                  value={formData.created_at}
                  onChange={(e) => setFormData({ ...formData, created_at: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">留空則使用目前時間</p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">內容</label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleSubmit(false)}
                  disabled={isSaving}
                >
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" />
                  儲存草稿
                </Button>
                <Button 
                  onClick={() => handleSubmit(true)}
                  disabled={isSaving}
                >
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Eye className="w-4 h-4 mr-2" />
                  {formData.published ? "更新文章" : "發布文章"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostEditor;
