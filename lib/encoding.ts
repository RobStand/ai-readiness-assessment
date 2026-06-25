/**
 * Encode/decode the answer map to a compact, URL-safe base64 string so that
 * results pages are shareable and bookmarkable. No server state required.
 */

function toBase64Url(input: string): string {
  let b64: string;
  if (typeof window === "undefined") {
    b64 = Buffer.from(input, "utf-8").toString("base64");
  } else {
    b64 = window.btoa(unescape(encodeURIComponent(input)));
  }
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  let b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4 !== 0) b64 += "=";
  if (typeof window === "undefined") {
    return Buffer.from(b64, "base64").toString("utf-8");
  }
  return decodeURIComponent(escape(window.atob(b64)));
}

export function encodeAnswers(answers: Record<string, number>): string {
  return toBase64Url(JSON.stringify(answers));
}

export function decodeAnswers(encoded: string): Record<string, number> {
  if (!encoded) return {};
  try {
    const parsed = JSON.parse(fromBase64Url(encoded));
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const result: Record<string, number> = {};
      for (const [key, value] of Object.entries(parsed)) {
        const num = Number(value);
        if (!Number.isNaN(num)) result[key] = num;
      }
      return result;
    }
    return {};
  } catch {
    return {};
  }
}
