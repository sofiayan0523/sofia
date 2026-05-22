import React, { useState, useEffect } from "react";

interface ReactionsProps {
  slug: string;
  lang?: "zh" | "en";
}

interface ReactionCounts {
  claps: number;
  loves: number;
  insights: number;
  amazes: number;
}

const REACTION_TYPES = [
  { key: "claps", label_zh: "鼓掌", label_en: "Clap", emoji: "👏", col: "claps", activeBg: "bg-[#7F9C7E]/15 border-[#7F9C7E] text-[#7F9C7E]" },
  { key: "loves", label_zh: "溫暖", label_en: "Love", emoji: "❤️", col: "loves", activeBg: "bg-[#F9C6C0]/20 border-[#F9C6C0] text-[#ED5D29]" },
  { key: "insights", label_zh: "啟發", label_en: "Insightful", emoji: "💡", col: "insights", activeBg: "bg-[#D8B76A]/15 border-[#D8B76A] text-[#D8B76A]" },
  { key: "amazes", label_zh: "驚嘆", label_en: "Amazed", emoji: "😮", col: "amazes", activeBg: "bg-[#C1E1DC]/20 border-[#C1E1DC] text-[#2E52A0]" },
] as const;

export default function Reactions({ slug, lang = "zh" }: ReactionsProps) {
  const [counts, setCounts] = useState<ReactionCounts>({
    claps: 0,
    loves: 0,
    insights: 0,
    amazes: 0,
  });
  const [userReactions, setUserReactions] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [animatingKey, setAnimatingKey] = useState<string | null>(null);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const hasSupabase = !!(supabaseUrl && supabaseKey);

  // Local Storage Keys
  const storageKey = `sofia_blog_reactions_${slug}`;

  useEffect(() => {
    // 1. Load user's previous reactions from LocalStorage
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setUserReactions(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to read localStorage:", e);
    }

    // 2. Fetch reaction counts from Supabase
    if (!hasSupabase) {
      setLoading(false);
      return;
    }

    async function fetchCounts() {
      try {
        const res = await fetch(
          `${supabaseUrl}/rest/v1/post_reactions?slug=eq.${encodeURIComponent(slug)}&select=claps,loves,insights,amazes`,
          {
            headers: {
              apikey: supabaseKey!,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        if (data && data.length > 0) {
          setCounts({
            claps: data[0].claps || 0,
            loves: data[0].loves || 0,
            insights: data[0].insights || 0,
            amazes: data[0].amazes || 0,
          });
        }
      } catch (err) {
        console.warn("Supabase reaction fetch failed (using local fallback):", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, [slug]);

  const handleReact = async (key: typeof REACTION_TYPES[number]["key"], col: string) => {
    const isClap = key === "claps";
    const currentReactionCount = userReactions[key] || 0;

    // Limit claps to 10 max per reader, and other reactions to 1 max
    if (isClap && currentReactionCount >= 10) return;
    if (!isClap && currentReactionCount >= 1) return;

    // 1. Instant optimistic local UI update
    setCounts((prev) => ({
      ...prev,
      [key]: prev[key] + 1,
    }));

    const updatedUserReactions = {
      ...userReactions,
      [key]: currentReactionCount + 1,
    };
    setUserReactions(updatedUserReactions);

    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedUserReactions));
    } catch (e) {
      console.error(e);
    }

    // Trigger bounce animation
    setAnimatingKey(key);
    setTimeout(() => setAnimatingKey(null), 300);

    // 2. Persist in Supabase
    if (!hasSupabase) return;

    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/rpc/increment_post_reaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey!,
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          post_slug: slug,
          reaction_col: col,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      console.warn("Could not sync reaction to database:", err);
    }
  };

  const reactTitle = lang === "zh" ? "這篇文章對你有幫助嗎？" : "Did you enjoy this post?";

  return (
    <div class="space-y-3">
      <p class="text-xs uppercase tracking-wider text-muted-foreground font-display font-medium">
        {reactTitle}
      </p>
      <div class="flex items-center gap-3 flex-wrap">
        {REACTION_TYPES.map(({ key, label_zh, label_en, emoji, col, activeBg }) => {
          const count = counts[key];
          const userCount = userReactions[key] || 0;
          const isReacted = userCount > 0;
          const isClap = key === "claps";
          const canClick = isClap ? userCount < 10 : userCount < 1;
          const isAnimating = animatingKey === key;
          const label = lang === "zh" ? label_zh : label_en;

          return (
            <button
              key={key}
              onClick={() => handleReact(key, col)}
              disabled={!canClick}
              class={`px-3 py-2 rounded-lg border text-sm transition-all flex items-center gap-2 font-display ${
                isReacted
                  ? activeBg
                  : "border-border bg-card text-foreground hover:bg-secondary/50"
              } ${
                isAnimating ? "scale-125 rotate-3" : "scale-100 rotate-0"
              } ${
                !canClick && !isClap ? "opacity-90 cursor-default" : "cursor-pointer active:scale-95"
              }`}
              title={`${label}${isClap ? ` (${userCount}/10)` : ""}`}
            >
              <span class={`text-base ${isAnimating ? "animate-ping" : ""}`}>{emoji}</span>
              <span class="font-medium">{count}</span>
              {isClap && userCount > 0 && (
                <span class="text-[10px] px-1 bg-[#7F9C7E]/20 text-[#7F9C7E] rounded-md font-bold">
                  +{userCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
