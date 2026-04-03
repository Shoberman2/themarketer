"use client";

import { useState, useEffect } from "react";
import { WebsiteAnalysis } from "@/types/analysis";
import { AdRecommendation } from "@/types/recommendation";

type PostFormat = "text" | "image" | "video";
type GenerationPhase = "idle" | "thinking" | "writing" | "designing" | "rendering" | "done";

const IMAGE_TEMPLATES = [
  { id: "hero-cta", name: "Hero CTA", desc: "Bold headline with call to action" },
  { id: "testimonial", name: "Testimonial", desc: "Quote-forward social proof" },
  { id: "stats-banner", name: "Stats Banner", desc: "Key numbers front and center" },
  { id: "problem-solution", name: "Problem / Solution", desc: "Split pain point and fix" },
  { id: "ugc-style", name: "UGC Style", desc: "Authentic user-generated feel" },
  { id: "before-after", name: "Before / After", desc: "Transformation layout" },
  { id: "product-showcase", name: "Product Showcase", desc: "Clean product-forward" },
  { id: "comparison", name: "Comparison", desc: "Without vs. With" },
];

const VIDEO_TEMPLATES = [
  { id: "video-hook", name: "Hook + Reveal", desc: "Attention-grabbing opener with payoff" },
  { id: "tutorial-steps", name: "Tutorial Steps", desc: "Step-by-step how-to format" },
  { id: "testimonial-clip", name: "Testimonial Clip", desc: "Customer success story" },
  { id: "behind-scenes", name: "Behind the Scenes", desc: "Raw, authentic brand content" },
  { id: "trending-sound", name: "Trending Format", desc: "Ride a current trend" },
];

const PHASE_LABELS: Record<GenerationPhase, string> = {
  idle: "",
  thinking: "Analyzing your brand...",
  writing: "Crafting the perfect copy...",
  designing: "Selecting visual direction...",
  rendering: "Rendering your creative...",
  done: "Ready to post",
};

interface PastPost {
  id: string;
  date: string;
  format: PostFormat;
  platform: string;
  headline: string;
  caption: string;
  template?: string;
  imageData?: string;
}

function GenerationAnimation({ phase }: { phase: GenerationPhase }) {
  if (phase === "idle" || phase === "done") return null;

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
      {/* Animated dots */}
      <div className="flex items-center gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-brand animate-bounce"
            style={{
              animationDelay: `${i * 200}ms`,
              animationDuration: "1s",
            }}
          />
        ))}
      </div>

      {/* Phase indicator */}
      <div className="text-center space-y-3">
        <div className="text-base font-semibold text-foreground">
          {PHASE_LABELS[phase]}
        </div>
        <div className="flex items-center gap-1.5 justify-center">
          {(["thinking", "writing", "designing", "rendering"] as const).map((p, i) => {
            const currentIndex = (["thinking", "writing", "designing", "rendering"] as const).indexOf(phase);
            return (
              <div
                key={p}
                className={`h-1 rounded-full transition-all duration-500 ${
                  currentIndex >= i
                    ? "w-10 bg-brand"
                    : "w-6 bg-border"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  const [brandName, setBrandName] = useState("Your Brand");
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [recommendation, setRecommendation] = useState<AdRecommendation | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<PostFormat | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [generationPhase, setGenerationPhase] = useState<GenerationPhase>("idle");
  const [generatedContent, setGeneratedContent] = useState<{
    headline: string;
    caption: string;
    imageData?: string;
    videoScript?: string;
  } | null>(null);
  const [pastPosts, setPastPosts] = useState<PastPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Load brand context and today's suggestion
  useEffect(() => {
    async function load() {
      try {
        const brandId = localStorage.getItem("activeBrandId");
        if (brandId) {
          const brandsRes = await fetch("/api/brands");
          if (brandsRes.ok) {
            const { brands } = await brandsRes.json();
            const active = brands.find((b: { id: string }) => b.id === brandId);
            if (active) setBrandName(active.name);
          }
        }

        // Get recommendation for today
        const plansRes = await fetch("/api/plans");
        if (plansRes.ok) {
          const { plans } = await plansRes.json();
          const brandPlans = brandId
            ? plans.filter((p: { brandId: string }) => p.brandId === brandId)
            : plans;

          if (brandPlans.length > 0) {
            const planRes = await fetch(`/api/plans/${brandPlans[0].id}`);
            if (planRes.ok) {
              const data = await planRes.json();
              setAnalysis(data.analysis);

              // Get today's suggestion from the plan
              const dayIndex = Math.floor(
                (Date.now() - new Date(data.plan.createdAt).getTime()) / 86400000
              );
              const day = data.plan.days[Math.min(dayIndex, data.plan.days.length - 1)];
              if (day?.tasks?.[0]) {
                const task = day.tasks[0];
                setRecommendation({
                  platform: task.platform,
                  platformReasoning: "",
                  postingTime: task.howToImplement?.bestTimeToPost || "Anytime today",
                  postingTimeReasoning: "",
                  messageAngle: "features",
                  template: task.template,
                  adSize: { width: 1080, height: 1080, label: "Square" },
                  headline: task.headline,
                  subheadline: task.subheadline,
                  bodyText: task.bodyText,
                  ctaText: task.ctaText,
                  bulletPoints: task.bulletPoints || [],
                  caption: `${task.headline}\n\n${task.bodyText}\n\n${task.howToImplement?.hashtags?.join(" ") || ""}`,
                  confidence: 8,
                });
              }
            }
          }
        }

        // Load past posts from localStorage
        const stored = localStorage.getItem("studio-past-posts");
        if (stored) setPastPosts(JSON.parse(stored));
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleGenerate() {
    if (!selectedFormat || !analysis) return;

    setGenerationPhase("thinking");
    await delay(800);
    setGenerationPhase("writing");
    await delay(1000);

    if (selectedFormat === "text") {
      // Text post: just use the recommendation copy
      setGeneratedContent({
        headline: recommendation?.headline || "Your headline here",
        caption: recommendation?.caption || "Your caption here",
      });
      setGenerationPhase("done");
    } else if (selectedFormat === "image") {
      setGenerationPhase("designing");
      await delay(600);
      setGenerationPhase("rendering");

      // Generate the ad image
      try {
        const recRes = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analysis,
            url: "",
            brandId: localStorage.getItem("activeBrandId") || undefined,
          }),
        });

        if (recRes.ok) {
          const { recommendation: rec, imageData } = await recRes.json();
          setGeneratedContent({
            headline: rec.headline,
            caption: rec.caption,
            imageData,
          });
        } else {
          setGeneratedContent({
            headline: recommendation?.headline || "Generated headline",
            caption: recommendation?.caption || "Generated caption",
          });
        }
      } catch {
        setGeneratedContent({
          headline: recommendation?.headline || "Generated headline",
          caption: recommendation?.caption || "Generated caption",
        });
      }
      setGenerationPhase("done");
    } else if (selectedFormat === "video") {
      setGenerationPhase("designing");
      await delay(800);

      // Video: generate a script
      const template = VIDEO_TEMPLATES.find((t) => t.id === selectedTemplate);
      setGeneratedContent({
        headline: recommendation?.headline || "Video hook",
        caption: recommendation?.caption || "Video caption",
        videoScript: `HOOK (0-3s): "${recommendation?.headline || "Stop scrolling."}"

PROBLEM (3-8s): Your audience faces ${recommendation?.bodyText || "a real challenge"}.

SOLUTION (8-15s): ${brandName} solves this with ${recommendation?.subheadline || "a better approach"}.

CTA (15-20s): "${recommendation?.ctaText || "Try it free"}" — link in bio.

FORMAT: ${template?.name || "Standard"} — ${template?.desc || "engaging format"}
MUSIC: Trending audio, upbeat
DURATION: 15-20 seconds`,
      });
      setGenerationPhase("done");
    }
  }

  function handleSavePost() {
    if (!generatedContent || !selectedFormat) return;

    const post: PastPost = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      format: selectedFormat,
      platform: recommendation?.platform || "Instagram",
      headline: generatedContent.headline,
      caption: generatedContent.caption,
      template: selectedTemplate || undefined,
      imageData: generatedContent.imageData,
    };

    const updated = [post, ...pastPosts];
    setPastPosts(updated);
    localStorage.setItem("studio-past-posts", JSON.stringify(updated));

    // Reset for next creation
    setSelectedFormat(null);
    setSelectedTemplate(null);
    setGeneratedContent(null);
    setGenerationPhase("idle");
  }

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="font-serif italic text-5xl sm:text-6xl text-foreground">Creative Studio</h1>
        <p className="text-base text-muted mt-3">
          {brandName} · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Today's suggestion */}
      {recommendation && generationPhase === "idle" && !generatedContent && (
        <div className="bg-gradient-to-br from-brand/5 to-brand/10 border border-brand/20 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <div className="text-[10px] uppercase tracking-[2px] text-brand font-medium">Today&apos;s suggestion</div>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">{recommendation.headline}</h2>
          <p className="text-base text-muted leading-relaxed">{recommendation.subheadline}</p>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="px-2 py-0.5 bg-foreground/5 rounded-full">{recommendation.platform}</span>
            <span>{recommendation.postingTime}</span>
          </div>
        </div>
      )}

      {/* Format selector */}
      {generationPhase === "idle" && !generatedContent && (
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-foreground">What do you want to create?</h3>
          <div className="grid grid-cols-3 gap-4">
            {(["text", "image", "video"] as PostFormat[]).map((format) => {
              const isSelected = selectedFormat === format;
              const icons = {
                text: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" />
                  </svg>
                ),
                image: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                ),
                video: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                ),
              };
              return (
                <button
                  key={format}
                  onClick={() => {
                    setSelectedFormat(format);
                    setSelectedTemplate(null);
                  }}
                  className={`hover-lift p-7 rounded-2xl text-left transition-all ${
                    isSelected
                      ? "border-2 border-brand bg-brand/5 shadow-sm"
                      : "border border-border hover:border-brand/30 hover:bg-surface"
                  }`}
                >
                  <div className={`mb-3 ${isSelected ? "text-brand" : "text-muted"}`}>
                    {icons[format]}
                  </div>
                  <div className="text-base font-semibold text-foreground capitalize">{format} Post</div>
                  <div className="text-sm text-muted mt-1 leading-relaxed">
                    {format === "text" && "Write captions, threads, and announcements. AI crafts compelling copy for any platform."}
                    {format === "image" && "Choose from 8 professional templates. AI generates pixel-perfect ad creatives as PNGs."}
                    {format === "video" && "Get a full video script with hooks, scenes, and CTAs. Ready to film or hand to an editor."}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Template selector (image/video only) */}
      {selectedFormat && selectedFormat !== "text" && generationPhase === "idle" && !generatedContent && (
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-foreground">
            Choose a {selectedFormat === "image" ? "template" : "format"}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {(selectedFormat === "image" ? IMAGE_TEMPLATES : VIDEO_TEMPLATES).map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl.id)}
                className={`p-4 border text-left transition-all ${
                  selectedTemplate === tmpl.id
                    ? "border-foreground bg-foreground/5"
                    : "border-border hover:border-foreground/30"
                }`}
              >
                <div className="text-base font-medium text-foreground">{tmpl.name}</div>
                <div className="text-sm text-muted mt-0.5">{tmpl.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Generate button */}
      {selectedFormat && generationPhase === "idle" && !generatedContent && (
        <button
          onClick={handleGenerate}
          disabled={selectedFormat !== "text" && !selectedTemplate}
          className="w-full py-4 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-light hover:shadow-lg hover:shadow-brand/20 transition-all disabled:opacity-30 disabled:hover:shadow-none"
        >
          Generate {selectedFormat === "text" ? "Text Post" : selectedFormat === "image" ? "Ad Creative" : "Video Script"}
        </button>
      )}

      {/* Generation animation */}
      <GenerationAnimation phase={generationPhase} />

      {/* Generated content */}
      {generatedContent && generationPhase === "done" && (
        <div className="space-y-6">
          <div className="text-[10px] uppercase tracking-[2px] text-muted">Generated content</div>

          {/* Image preview */}
          {generatedContent.imageData && (
            <div className="border border-border overflow-hidden">
              <img
                src={`data:image/png;base64,${generatedContent.imageData}`}
                alt="Generated ad"
                className="w-full"
              />
            </div>
          )}

          {/* Video script */}
          {generatedContent.videoScript && (
            <div className="border border-border p-5 space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-muted">Video Script</div>
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                {generatedContent.videoScript}
              </pre>
            </div>
          )}

          {/* Caption */}
          <div className="border border-border p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-muted">Caption</span>
              <button
                onClick={() => navigator.clipboard?.writeText(generatedContent.caption)}
                className="text-[11px] text-muted hover:text-foreground transition-colors"
              >
                Copy
              </button>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {generatedContent.caption}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {generatedContent.imageData && (
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = `data:image/png;base64,${generatedContent.imageData}`;
                  link.download = `${brandName.toLowerCase().replace(/\s+/g, "-")}-ad.png`;
                  link.click();
                }}
                className="flex-1 py-3 bg-brand text-white text-sm font-medium hover:bg-brand-light transition-all"
              >
                Download Image
              </button>
            )}
            <button
              onClick={handleSavePost}
              className={`${generatedContent.imageData ? "flex-1" : "w-full"} py-3 border border-border text-foreground text-sm font-medium hover:bg-surface transition-colors`}
            >
              Save & Create Another
            </button>
          </div>
        </div>
      )}

      {/* Past posts feed */}
      {pastPosts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="text-[10px] uppercase tracking-[2px] text-muted">
            Past creations ({pastPosts.length})
          </div>
          {pastPosts.map((post) => (
            <div key={post.id} className="border border-border p-4 flex gap-4">
              {post.imageData && (
                <img
                  src={`data:image/png;base64,${post.imageData}`}
                  alt="Past ad"
                  className="w-20 h-20 object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[10px] text-muted mb-1">
                  <span className="uppercase tracking-wider font-medium">{post.format}</span>
                  <span>·</span>
                  <span>{post.platform}</span>
                  <span>·</span>
                  <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
                <h4 className="text-sm font-medium text-foreground truncate">{post.headline}</h4>
                <p className="text-xs text-muted line-clamp-2">{post.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
