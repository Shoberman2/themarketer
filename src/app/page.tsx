"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UrlInput } from "@/components/url-input";
import { AnalysisProgress } from "@/components/analysis-progress";
import { PlatformSelector } from "@/components/platform-selector";
import { SocialProfilesForm } from "@/components/social-profiles-form";
import { WebsiteAnalysis } from "@/types/analysis";
import { SocialProfile } from "@/types/social-profile";

type FlowState =
  | "idle"
  | "analyzing"
  | "select-platforms"
  | "social-profiles"
  | "generating"
  | "done";

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
        <path d="M11 8v6M8 11h6" />
      </svg>
    ),
    title: "Brand Analysis",
    description:
      "Scrapes your website, extracts colors, tone, features, testimonials, pricing, and audience. Understands your brand like a strategist would.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M3 10h18" />
        <path d="M10 4v18" />
      </svg>
    ),
    title: "30-Day Campaign Calendar",
    description:
      "A structured 4-week plan — Awareness, Consideration, Social Proof, Conversion — with daily themed tasks, real dates, and weekly goals.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="m6 8 3 3 2-2 4 4" />
      </svg>
    ),
    title: "Ad Creative Generation",
    description:
      "8 professional templates — hero CTAs, feature grids, testimonials, comparisons, stats banners, and more — rendered as download-ready PNGs in multiple sizes.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838.838-2.872a2 2 0 0 1 .506-.854z" />
      </svg>
    ),
    title: "AI-Written Ad Copy",
    description:
      "Headlines, subheadlines, body text, CTAs, and bullet points for every task — written to sound like top-performing real ads, not generic fluff.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h2" />
        <path d="M8 17h2" />
        <path d="M14 13h2" />
        <path d="M14 17h2" />
      </svg>
    ),
    title: "Implementation Guides",
    description:
      "Step-by-step instructions for every task: when to post, which hashtags to use, who to target, and tips to maximize engagement.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    title: "Multi-Platform Targeting",
    description:
      "Pick from Facebook, Instagram, LinkedIn, Twitter/X, TikTok, Pinterest, YouTube, and Google Ads. Content is tailored to each platform's strengths.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Influencer Recommendations",
    description:
      "AI-suggested creators for each platform — with niche, follower range, why they fit your brand, and a specific partnership idea.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    title: "Social Profile Integration",
    description:
      "Connect your accounts with follower counts and engagement rates. The AI tailors content to your actual audience size and reach.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        <path d="m9 16 2 2 4-4" />
      </svg>
    ),
    title: "60-Day Plan Extension",
    description:
      "One click extends your plan to 60 days with retention, engagement, scaling, and optimization phases. Keep the momentum going.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    title: "One-Click Downloads",
    description:
      "Every ad renders as a production-ready PNG in multiple sizes — Square, Landscape, Story — across 3 style variants. Download one or all at once.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
      </svg>
    ),
    title: "Light & Dark Mode",
    description:
      "Full theme support across the entire platform. Work comfortably in any lighting. Your brand colors stay accurate in both.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z" />
        <path d="M9 7h6M9 11h6M9 15h4" />
      </svg>
    ),
    title: "Saved Campaigns",
    description:
      "All plans persist to a local database. Come back anytime, browse your history, re-open any campaign, or delete ones you no longer need.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Paste your URL",
    description:
      "Enter your website. Our scraper extracts headings, copy, images, colors, pricing, testimonials, CTAs — everything that defines your brand.",
  },
  {
    step: "02",
    title: "AI analyzes your brand",
    description:
      "GPT-4o identifies your industry, tone, value propositions, target audience, key features, and competitive advantages. It picks brand colors and builds a complete profile.",
  },
  {
    step: "03",
    title: "Choose your platforms",
    description:
      "Select which social media and ad platforms you want to target. Optionally connect your social profiles for personalized content.",
  },
  {
    step: "04",
    title: "Get your 30-day plan",
    description:
      "A day-by-day calendar with themed tasks, professional ad copy, implementation guides, posting times, hashtags, audience targeting, and influencer recommendations.",
  },
  {
    step: "05",
    title: "Generate & download ads",
    description:
      "Click a day, generate production-ready ad creatives in multiple sizes and styles, and download them instantly. Extend to 60 days when you're ready for more.",
  },
];

const STATS = [
  { value: "20", label: "Ad Templates" },
  { value: "8", label: "Platforms" },
  { value: "30-60", label: "Day Plans" },
  { value: "9", label: "Ad Variants per Task" },
  { value: "12", label: "Industry Templates" },
  { value: "1", label: "Click to Generate" },
];

export default function Home() {
  const router = useRouter();
  const [flowState, setFlowState] = useState<FlowState>("idle");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  async function handleSubmit(inputUrl: string) {
    setUrl(inputUrl);
    setFlowState("analyzing");
    setError("");
    setStep(0);

    try {
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      });

      if (!analyzeRes.ok) {
        const data = await analyzeRes.json();
        throw new Error(data.error || "Analysis failed");
      }

      const { analysis: analysisData } = await analyzeRes.json();
      setAnalysis(analysisData);
      setStep(2);
      setFlowState("select-platforms");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setFlowState("idle");
    }
  }

  async function handlePlatformSelect(platforms: string[]) {
    setSelectedPlatforms(platforms);
    setFlowState("social-profiles");
  }

  async function handleSocialProfiles(profiles: SocialProfile[]) {
    await generatePlan(profiles);
  }

  async function handleSkipProfiles() {
    await generatePlan([]);
  }

  async function generatePlan(socialProfiles: SocialProfile[]) {
    setFlowState("generating");
    setStep(2);

    try {
      const planRes = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          analysis,
          platforms: selectedPlatforms,
          socialProfiles,
        }),
      });

      if (!planRes.ok) {
        const data = await planRes.json();
        throw new Error(data.error || "Plan generation failed");
      }

      const { plan } = await planRes.json();
      setStep(3);
      setFlowState("done");

      localStorage.setItem(
        `plan-${plan.id}`,
        JSON.stringify({ plan, analysis })
      );

      setTimeout(() => router.push(`/plan/${plan.id}`), 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setFlowState("idle");
    }
  }

  if (flowState !== "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-16">
        {flowState === "analyzing" && (
          <div className="text-center space-y-10">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">
                Building your campaign
              </h2>
              <p className="text-sm text-muted">
                Our AI agent is analyzing your brand and crafting your strategy.
              </p>
            </div>
            <AnalysisProgress currentStep={step} />
          </div>
        )}

        {flowState === "select-platforms" && (
          <PlatformSelector onSelect={handlePlatformSelect} />
        )}

        {flowState === "social-profiles" && (
          <SocialProfilesForm
            platforms={selectedPlatforms}
            onSubmit={handleSocialProfiles}
            onSkip={handleSkipProfiles}
          />
        )}

        {flowState === "generating" && (
          <div className="text-center space-y-10">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">
                Generating your plan
              </h2>
              <p className="text-sm text-muted">
                Creating your personalized marketing strategy...
              </p>
            </div>
            <AnalysisProgress currentStep={step} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-32 pb-20">
      {/* ─── HERO ─── */}
      <section className="flex flex-col items-center justify-center min-h-[80vh] gap-14 -mt-10">
        <div className="text-center space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-[11px] text-brand font-medium uppercase tracking-widest">
              AI-Powered Marketing Agency
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.05]">
            <span className="text-foreground">Your entire marketing</span>
            <br />
            <span className="text-foreground">department in </span>
            <span className="text-brand">one platform.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Paste a URL. Our AI agent scrapes your site, analyzes your brand,
            builds a 30-day campaign with ad copy, generates production-ready
            creatives, and gives you step-by-step implementation guides
            &mdash; all in minutes.
          </p>
        </div>
        <UrlInput onSubmit={handleSubmit} isLoading={false} />
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-[12px] text-muted">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-brand/60" />
            Brand analysis
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-brand/60" />
            30-day strategy
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-brand/60" />
            Ad creative generation
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-brand/60" />
            Multi-platform targeting
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-brand/60" />
            Implementation guides
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-brand/60" />
            Influencer recommendations
          </span>
        </div>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm max-w-md text-center">
            {error}
          </div>
        )}
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="bg-surface-raised border border-border rounded-xl p-5 text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold text-brand mb-1">
                {stat.value}
              </div>
              <div className="text-[11px] text-muted uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── EVERYTHING YOU NEED ─── */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[10px] text-brand font-medium uppercase tracking-widest">
            Everything in One Place
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
            Everything a marketing agency does.
            <br />
            <span className="text-muted">Without the agency.</span>
          </h2>
          <p className="text-muted text-base mt-4 max-w-2xl mx-auto">
            From brand strategy to ad production to influencer outreach
            &mdash; TheMarketer handles the full stack of marketing work
            that teams of people usually manage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className="bg-surface-raised border border-border rounded-xl p-5 hover:border-border-hover hover:bg-surface-hover transition-all group"
            >
              <div className="w-10 h-10 bg-brand/10 border border-brand/20 rounded-lg flex items-center justify-center text-brand mb-4 group-hover:bg-brand/15 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-[15px] font-semibold text-foreground mb-1.5">
                {feature.title}
              </h3>
              <p className="text-[13px] text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[10px] text-brand font-medium uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
            Five steps. Zero marketing experience needed.
          </h2>
        </div>

        <div className="space-y-4">
          {HOW_IT_WORKS.map((item, i) => (
            <div
              key={i}
              className="flex gap-5 bg-surface-raised border border-border rounded-xl p-6 hover:border-border-hover transition-all"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-brand/10 border border-brand/20 rounded-xl flex items-center justify-center">
                <span className="text-brand font-bold text-lg">
                  {item.step}
                </span>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-[13px] text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PLATFORM LOGOS ─── */}
      <section className="max-w-4xl mx-auto text-center">
        <span className="text-[10px] text-brand font-medium uppercase tracking-widest">
          Platform Support
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-10">
          Content built for every major platform.
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            "Facebook",
            "Instagram",
            "LinkedIn",
            "Twitter / X",
            "TikTok",
            "Pinterest",
            "YouTube",
            "Google Ads",
          ].map((name) => (
            <div
              key={name}
              className="bg-surface-raised border border-border rounded-xl py-5 px-4 text-center text-sm font-medium text-foreground/70"
            >
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* ─── AD TEMPLATES ─── */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[10px] text-brand font-medium uppercase tracking-widest">
            Professional Templates
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
            20 ad templates built from real top performers.
          </h2>
          <p className="text-muted text-base mt-3 max-w-2xl mx-auto">
            8 core templates for any business, plus 12 industry-specific
            templates modeled on the highest-performing ad formats in each
            vertical. Every ad renders as a pixel-perfect PNG in 3 styles.
          </p>
        </div>

        <div className="mb-6">
          <h4 className="text-[11px] text-muted font-semibold uppercase tracking-widest mb-3">
            Core Templates
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "Hero CTA", desc: "Bold headline + call to action" },
              { name: "Feature Grid", desc: "4 features in a clean layout" },
              { name: "Testimonial", desc: "Quote-forward social proof" },
              { name: "Comparison", desc: "Without vs. With your product" },
              { name: "Stats Banner", desc: "Key numbers front and center" },
              { name: "Problem → Solution", desc: "Split pain point + fix" },
              { name: "Pricing Highlight", desc: "Price + features + CTA" },
              { name: "Social Post", desc: "Platform-native look and feel" },
            ].map((tmpl) => (
              <div
                key={tmpl.name}
                className="bg-surface-raised border border-border rounded-xl p-4 hover:border-brand/30 transition-all"
              >
                <h4 className="text-[13px] font-semibold text-foreground mb-1">
                  {tmpl.name}
                </h4>
                <p className="text-[11px] text-muted">{tmpl.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[11px] text-muted font-semibold uppercase tracking-widest mb-3">
            Industry-Specific Templates — Based on Top-Performing Real Ads
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                name: "UGC Style",
                industry: "E-commerce / DTC",
                desc: "Organic user-generated look with social proof bar, checkmarks, and urgency. Appears in 42% of top-spending ads.",
              },
              {
                name: "Case Study",
                industry: "B2B / SaaS",
                desc: "LinkedIn carousel-style card with bold stat and results metrics. LinkedIn carousels achieve 6.60% engagement rate.",
              },
              {
                name: "Before / After",
                industry: "Health & Beauty",
                desc: "Split transformation layout. Before/after appears in 29.7% of top beauty ads and dominates fitness creative.",
              },
              {
                name: "Urgency Offer",
                industry: "Food / Retail",
                desc: "Countdown-style with dashed offer box and red urgency banner. Time-limited promos see 15-30% more redemptions.",
              },
              {
                name: "App Download",
                industry: "Fintech / Mobile",
                desc: "Mobile-first with star rating, feature pills, and download CTA. Video + playable formats dominate UA strategies.",
              },
              {
                name: "Listicle",
                industry: "Education / Courses",
                desc: "Numbered tips with FREE GUIDE label. Value-first approach dramatically outperforms direct-sell in education.",
              },
              {
                name: "Trust Badges",
                industry: "Finance / Insurance",
                desc: "Shield icons, verification badges, security guarantee. Essential in high-stakes purchase decisions.",
              },
              {
                name: "Property Listing",
                industry: "Real Estate",
                desc: "Magazine-style with hero area and spec pills. Video tours drive 403% more inquiries; 9.20% CTR on search.",
              },
              {
                name: "Product Showcase",
                industry: "Beauty / Fashion",
                desc: "Clean product-forward with minimal text. Product demos appear in 53.5% of top beauty ads.",
              },
              {
                name: "Food Visual",
                industry: "Food & Restaurant",
                desc: "Warm-toned with sensory gradients and warm-color CTA. Reds/oranges stimulate appetite; avoids blue.",
              },
              {
                name: "Video Hook",
                industry: "All Verticals",
                desc: "Paused-video look with play button and engagement indicators. Video ads achieve 0.98% CTR on Facebook.",
              },
              {
                name: "Travel Escape",
                industry: "Travel / Hospitality",
                desc: "Aspirational full-bleed with experience pills and booking bar. 32% of consumers book from TikTok discovery.",
              },
              {
                name: "Automotive",
                industry: "Automotive",
                desc: "Cinematic dark layout with performance specs. 75% of car buyers are heavily influenced by video ads.",
              },
            ].map((tmpl) => (
              <div
                key={tmpl.name}
                className="bg-surface-raised border border-border rounded-xl p-4 hover:border-brand/30 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-[13px] font-semibold text-foreground">
                    {tmpl.name}
                  </h4>
                  <span className="text-[9px] text-brand font-medium uppercase tracking-wider">
                    {tmpl.industry}
                  </span>
                </div>
                <p className="text-[11px] text-muted leading-relaxed">
                  {tmpl.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="max-w-3xl mx-auto text-center space-y-8">
        <h2 className="text-3xl sm:text-5xl font-bold text-foreground leading-tight">
          Stop hiring agencies.
          <br />
          <span className="text-brand">Start with a URL.</span>
        </h2>
        <p className="text-muted text-lg max-w-xl mx-auto">
          Brand analysis, campaign strategy, ad copy, creative production,
          implementation guides, influencer matching, and 60-day planning
          &mdash; all from one paste.
        </p>
        <div className="pt-2">
          <UrlInput onSubmit={handleSubmit} isLoading={false} />
        </div>
      </section>
    </div>
  );
}
