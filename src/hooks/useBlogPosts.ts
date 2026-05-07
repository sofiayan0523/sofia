import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { fallbackBlogPosts } from "@/data/fallbackBlogPosts";

export interface BlogPost {
  id: string;
  user_id: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string;
  cover_image: string | null;
  read_time: string | null;
  tags: string[] | null;
  published: boolean | null;
  created_at: string;
  updated_at: string;
}

const filterBlogPosts = (posts: BlogPost[], searchQuery?: string, category?: string) => {
  const normalizedSearch = searchQuery?.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesCategory = !category || category === "all" || post.category === category;
    const matchesSearch = !normalizedSearch || [post.title, post.excerpt, post.content]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(normalizedSearch));

    return matchesCategory && matchesSearch;
  });
};

export const useBlogPosts = (searchQuery?: string, category?: string) => {
  return useQuery({
    queryKey: ["blog-posts", searchQuery, category],
    queryFn: async () => {
      const fallbackPosts = filterBlogPosts(fallbackBlogPosts, searchQuery, category);

      try {
        let query = supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false });

        if (category && category !== "all") {
          query = query.eq("category", category);
        }

        if (searchQuery) {
          const safeSearchQuery = searchQuery.replace(/[,%]/g, "").trim();
          if (safeSearchQuery) {
            query = query.or(`title.ilike.%${safeSearchQuery}%,content.ilike.%${safeSearchQuery}%,excerpt.ilike.%${safeSearchQuery}%`);
          }
        }

        const { data, error } = await query;
        if (error) throw error;
        return (data?.length ? data : fallbackPosts) as BlogPost[];
      } catch (error) {
        console.warn("Live blog posts failed to load; using bundled public posts.", error);
        return fallbackPosts;
      }
    },
    placeholderData: () => filterBlogPosts(fallbackBlogPosts, searchQuery, category),
    retry: false,
  });
};

export const useMyBlogPosts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["my-blog-posts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
    enabled: !!user,
  });
};

export const useBlogPost = (id: string) => {
  return useQuery({
    queryKey: ["blog-post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as BlogPost | null;
    },
    enabled: !!id,
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (post: Omit<BlogPost, "id" | "user_id" | "created_at" | "updated_at"> & { created_at?: string }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("blog_posts")
        .insert({ ...post, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-blog-posts"] });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BlogPost> & { id: string }) => {
      const { data, error } = await supabase
        .from("blog_posts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-post", data.id] });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-blog-posts"] });
    },
  });
};
