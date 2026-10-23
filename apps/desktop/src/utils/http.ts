const RAIL_API = "https://railspaapi.shohoz.com";
const GITHUB_RAW = "https://raw.githubusercontent.com";

export const normalizeAuthToken = (token: string): string => {
  let value = token.trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }
  if (value.toLowerCase().startsWith("bearer ")) {
    value = value.slice(7).trim();
  }
  return value;
};

export const railwayAuthHeaders = (auth: {
  token: string | null;
  ssdk: string | null;
  uudid: string | null;
}): HeadersInit => ({
  Accept: "application/json",
  Authorization: `Bearer ${normalizeAuthToken(auth.token || "")}`,
  "x-device-id": (auth.uudid || "").trim(),
  "x-device-key": (auth.ssdk || "").trim(),
});

const isTauriRuntime = (): boolean =>
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

const toBrowserUrl = (url: string): string => {
  if (url.startsWith(RAIL_API)) return `/railway-api${url.slice(RAIL_API.length)}`;
  if (url.startsWith(GITHUB_RAW)) return `/github-raw${url.slice(GITHUB_RAW.length)}`;
  return url;
};

export const appFetch = async (
  url: string,
  init?: RequestInit
): Promise<Response> => {
  if (isTauriRuntime()) {
    const { fetch } = await import("@tauri-apps/plugin-http");
    return fetch(url, init);
  }

  return window.fetch(toBrowserUrl(url), init);
};
