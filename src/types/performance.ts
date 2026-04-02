export interface PerformanceReport {
  id: string;
  recommendationId: string;
  platform: string;
  template: string;
  messageAngle: string;
  postedAt: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number | null;
  userNotes: string;
  reportedAt: string;
  engagementRate: number | null;
}

export interface PerformanceSummary {
  totalReports: number;
  byTemplate: { template: string; avgEngagementRate: number | null; count: number }[];
  byPlatform: { platform: string; avgEngagementRate: number | null; count: number }[];
  byAngle: { angle: string; avgEngagementRate: number | null; count: number }[];
  byTimeBucket: { bucket: string; avgEngagementRate: number | null; count: number }[];
  trend: { date: string; engagementRate: number | null }[];
}

export interface SavedRecommendation {
  id: string;
  url: string;
  analysis: string;
  recommendation: string;
  imageData: string | null;
  createdAt: string;
  reported: boolean;
}

export function getTimeBucket(hour: number): string {
  if (hour >= 6 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 18) return "Afternoon";
  if (hour >= 18 && hour < 24) return "Evening";
  return "Night";
}

export function computeEngagementRate(
  likes: number,
  comments: number,
  shares: number,
  reach: number | null
): number | null {
  if (reach === null || reach === 0) return null;
  return (likes + comments + shares) / reach;
}
