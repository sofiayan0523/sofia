const SUPABASE_AUTH_TOKEN_KEY = /^sb-.+-auth-token$/;

const safeParse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getStoredSession = (storedValue: unknown) => {
  if (!storedValue || typeof storedValue !== "object") return null;

  const record = storedValue as Record<string, unknown>;
  const currentSession = record.currentSession;

  if (currentSession && typeof currentSession === "object") {
    return currentSession as Record<string, unknown>;
  }

  return record;
};

export const clearSupabaseAuthStorage = () => {
  if (typeof window === "undefined") return;

  Object.keys(window.localStorage)
    .filter((key) => SUPABASE_AUTH_TOKEN_KEY.test(key) || key === "supabase.auth.token")
    .forEach((key) => window.localStorage.removeItem(key));
};

export const clearMalformedSupabaseAuthStorage = () => {
  if (typeof window === "undefined") return;

  Object.keys(window.localStorage)
    .filter((key) => SUPABASE_AUTH_TOKEN_KEY.test(key) || key === "supabase.auth.token")
    .forEach((key) => {
      const rawValue = window.localStorage.getItem(key);
      if (!rawValue) return;

      const parsedValue = safeParse(rawValue);
      const session = getStoredSession(parsedValue);
      const accessToken = session?.access_token;
      const refreshToken = session?.refresh_token;

      const hasMalformedAccessToken =
        typeof accessToken === "string" && accessToken.split(".").length !== 3;
      const hasMalformedRefreshToken =
        typeof refreshToken === "string" && refreshToken.length < 20;
      const hasNoUsableToken = !accessToken && !refreshToken;

      if (!parsedValue || hasMalformedAccessToken || hasMalformedRefreshToken || hasNoUsableToken) {
        window.localStorage.removeItem(key);
      }
    });
};