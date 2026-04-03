export interface InfluencerRecommendation {
  platform: string;
  name: string;
  niche: string;
  followerRange: string;
  whyRelevant: string;
  partnershipIdea: string;
  profileUrl?: string;
  email?: string;
  openToPartnerships?: boolean;
}

export function getProfileUrl(platform: string, name: string): string {
  // Generate likely profile URL based on platform and name
  const handle = name
    .replace(/\s*\(.*?\)\s*/g, "") // Remove parenthetical names
    .replace(/\s+/g, "")
    .toLowerCase();

  const urls: Record<string, string> = {
    Instagram: `https://www.instagram.com/${handle}`,
    TikTok: `https://www.tiktok.com/@${handle}`,
    YouTube: `https://www.youtube.com/@${handle}`,
    LinkedIn: `https://www.linkedin.com/in/${handle}`,
    "Twitter/X": `https://twitter.com/${handle}`,
    Pinterest: `https://www.pinterest.com/${handle}`,
  };
  return urls[platform] || "#";
}

export function getDMUrl(platform: string, profileUrl: string): string {
  // Deep link to DM/message on each platform
  if (platform === "Instagram") return profileUrl; // DM from profile
  if (platform === "Twitter/X") {
    const handle = profileUrl.split("/").pop() || "";
    return `https://twitter.com/messages/compose?recipient_id=${handle}`;
  }
  if (platform === "LinkedIn") return profileUrl; // Message from profile
  return profileUrl; // Default to profile
}
