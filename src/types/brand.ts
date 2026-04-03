export interface Brand {
  id: string;
  name: string;
  url: string;
  domain: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  industry: string;
  tone: string;
  createdAt: string;
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    // If URL parsing fails, try basic extraction
    return url
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0]
      .split("?")[0]
      .toLowerCase();
  }
}
