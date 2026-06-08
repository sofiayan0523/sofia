type AnalyticsStatus = "sent" | "dnt" | "no_gtag";

type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

export type ShareChannel = "x" | "facebook" | "linkedin" | "line";
export type ReactionType = "claps" | "loves" | "insights" | "amazes";

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params: AnalyticsParams) => void;
  }
}

function shouldRespectDoNotTrack() {
  if (typeof navigator === "undefined") return false;

  return (
    navigator.doNotTrack === "1" ||
    navigator.globalPrivacyControl === true ||
    window.doNotTrack === "1"
  );
}

function emitAnalyticsMirror(
  eventName: string,
  params: AnalyticsParams,
  status: AnalyticsStatus
) {
  window.dispatchEvent(
    new CustomEvent("sofia:analytics", {
      detail: {
        eventName,
        params,
        status,
      },
    })
  );
}

export function trackGa4(eventName: string, params: AnalyticsParams) {
  if (typeof window === "undefined") return false;

  const eventParams = {
    ...params,
    page_path: window.location.pathname,
  };

  if (shouldRespectDoNotTrack()) {
    emitAnalyticsMirror(eventName, eventParams, "dnt");
    return false;
  }

  if (typeof window.gtag !== "function") {
    emitAnalyticsMirror(eventName, eventParams, "no_gtag");
    return false;
  }

  window.gtag("event", eventName, eventParams);
  emitAnalyticsMirror(eventName, eventParams, "sent");
  return true;
}

export function trackShareClick(params: {
  channel: ShareChannel;
  slug: string;
  title: string;
  lang: "zh" | "en";
  targetUrl: string;
}) {
  return trackGa4("sofia_share_click", {
    event_category: "engagement",
    share_channel: params.channel,
    share_target: params.channel,
    post_slug: params.slug,
    post_title: params.title,
    language: params.lang,
    target_url: params.targetUrl,
  });
}

export function trackLinkCopied(params: {
  slug: string;
  title: string;
  lang: "zh" | "en";
  outcome: "success" | "clipboard_error";
}) {
  return trackGa4("sofia_link_copied", {
    event_category: "engagement",
    post_slug: params.slug,
    post_title: params.title,
    language: params.lang,
    outcome: params.outcome,
  });
}

export function trackPostReaction(params: {
  reactionType: ReactionType;
  slug: string;
  lang: "zh" | "en";
  reactionCount: number;
  persistenceMode: "supabase" | "local";
}) {
  return trackGa4("sofia_post_reaction", {
    event_category: "engagement",
    reaction_type: params.reactionType,
    post_slug: params.slug,
    language: params.lang,
    reaction_count: params.reactionCount,
    persistence_mode: params.persistenceMode,
  });
}
