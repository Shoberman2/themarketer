import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RecommendationCard } from "./recommendation-card";
import { AdRecommendation } from "@/types/recommendation";
import { BrandProfile } from "@/types/analysis";

const mockBrand: BrandProfile = {
  name: "Acme Fitness",
  tagline: "Get fit fast",
  primaryColor: "#e63946",
  secondaryColor: "#1d3557",
  accentColor: "#f1faee",
  industry: "Fitness",
  tone: "Energetic",
};

const mockRecommendation: AdRecommendation = {
  platform: "Instagram",
  platformReasoning: "Instagram has highest engagement for fitness brands.",
  postingTime: "7:00 PM",
  postingTimeReasoning: "Evening posts get 23% more reach.",
  messageAngle: "social-proof",
  template: "hero-cta",
  adSize: { width: 1080, height: 1080, label: "Square" },
  headline: "Transform Your Body",
  subheadline: "Join 2000+ members",
  bodyText: "Get fit in 30 minutes.",
  ctaText: "Start Free Trial",
  bulletPoints: ["Fast results", "Expert trainers"],
  caption: "Transform your body today! #fitness #HIIT",
  confidence: 8,
};

describe("RecommendationCard", () => {
  it("renders with full recommendation data", () => {
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        imageData="fakebase64data"
        brand={mockBrand}
        onSeeFullPlan={() => {}}
      />
    );

    expect(screen.getByText("Your first ad is ready")).toBeInTheDocument();
    expect(screen.getByText(/Post this to Instagram at 7:00 PM/)).toBeInTheDocument();
    expect(screen.getByText(/Instagram has highest engagement/)).toBeInTheDocument();
    expect(screen.getByText(/Evening posts get 23% more reach/)).toBeInTheDocument();
    expect(screen.getByText(/Transform your body today!/)).toBeInTheDocument();
    expect(screen.getByText("Download & Copy Caption")).toBeInTheDocument();
    expect(screen.getByText("Open Instagram")).toBeInTheDocument();
  });

  it("shows low-confidence disclaimer when confidence < 6", () => {
    render(
      <RecommendationCard
        recommendation={{ ...mockRecommendation, confidence: 4 }}
        imageData="fakebase64data"
        brand={mockBrand}
        onSeeFullPlan={() => {}}
      />
    );

    expect(screen.getByText(/starting point/)).toBeInTheDocument();
  });

  it("does not show disclaimer when confidence >= 6", () => {
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        imageData="fakebase64data"
        brand={mockBrand}
        onSeeFullPlan={() => {}}
      />
    );

    expect(screen.queryByText(/starting point/)).not.toBeInTheDocument();
  });

  it("shows fallback message when imageData is null", () => {
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        imageData={null}
        brand={mockBrand}
        onSeeFullPlan={() => {}}
      />
    );

    expect(screen.getByText(/Couldn't generate preview/)).toBeInTheDocument();
    expect(screen.getByText("Download & Copy Caption")).toBeDisabled();
  });

  it("calls onSeeFullPlan when link is clicked", () => {
    const onSeeFullPlan = vi.fn();
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        imageData="fakebase64data"
        brand={mockBrand}
        onSeeFullPlan={onSeeFullPlan}
      />
    );

    fireEvent.click(screen.getByText("See full 30-day campaign plan"));
    expect(onSeeFullPlan).toHaveBeenCalledOnce();
  });
});
