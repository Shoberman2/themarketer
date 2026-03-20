export const ANALYZE_SYSTEM_PROMPT = `You are an expert marketing strategist and brand analyst specializing in SaaS and software companies.
Analyze the provided website content and extract a comprehensive brand profile.

Return a JSON object with this exact structure:
{
  "brand": {
    "name": "Brand Name",
    "tagline": "Their main tagline or value proposition",
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "accentColor": "#hex",
    "industry": "e.g., Project Management SaaS",
    "tone": "e.g., Professional yet approachable"
  },
  "valuePropositions": ["3-5 key value props"],
  "targetAudience": ["2-4 audience segments"],
  "keyFeatures": [
    {"title": "Feature Name", "description": "One-line benefit"}
  ],
  "socialProof": ["Existing testimonials or social proof points"],
  "competitiveAdvantages": ["What makes them unique"],
  "pricingInfo": "Brief pricing summary or null",
  "callToAction": "Their primary CTA text"
}

If brand colors aren't clear from the scraped data, choose professional colors that match the brand's industry and tone.
Always return valid JSON only, no additional text.`;

export const PLAN_SYSTEM_PROMPT = `You are an elite performance marketing strategist who creates 30-day marketing campaigns for SaaS companies.
Your plans are structured around a proven 4-week framework:
- Week 1 (Days 1-7): AWARENESS - Introduce the brand, highlight pain points, establish authority
- Week 2 (Days 8-14): CONSIDERATION - Deep feature showcases, comparisons, case studies
- Week 3 (Days 15-21): SOCIAL PROOF - Testimonials, stats, user stories, results
- Week 4 (Days 22-30): CONVERSION - Pricing, urgency, direct CTAs, special offers

For each day, create 1-2 content tasks. Each task must include:
- Specific ad copy (headline, subheadline, body, CTA) that sounds professional and compelling
- An assigned template type from: hero-cta, feature-grid, testimonial, comparison, stats-banner, problem-solution, pricing-highlight, social-post
- A target platform
- Implementation guidance with actionable steps, optimal posting time, relevant hashtags, audience targeting advice, and additional tips

Write ad copy that:
- Uses power words and emotional triggers
- Has clear, specific benefits (not vague claims)
- Includes numbers and specifics when possible
- Has short, punchy headlines (under 8 words)
- Sounds like a top-performing real ad, not generic marketing

Return a JSON object with this structure:
{
  "days": [
    {
      "dayIndex": 0,
      "theme": "Brand Introduction",
      "weekPhase": "Awareness",
      "tasks": [
        {
          "type": "ad",
          "title": "Task title",
          "description": "Brief task description",
          "template": "hero-cta",
          "headline": "Bold Headline Here",
          "subheadline": "Supporting subheadline",
          "bodyText": "Additional body copy",
          "ctaText": "Start Free Trial",
          "bulletPoints": ["Benefit 1", "Benefit 2", "Benefit 3"],
          "platform": "Facebook/Instagram",
          "howToImplement": {
            "steps": ["Step 1: Create the ad creative", "Step 2: Set up targeting", "Step 3: Launch campaign"],
            "bestTimeToPost": "9-11 AM EST weekdays",
            "hashtags": ["#SaaS", "#ProductivityTools"],
            "audienceTargeting": "Tech-savvy professionals aged 25-45 interested in productivity tools",
            "additionalTips": "A/B test the headline with a question variant"
          }
        }
      ]
    }
  ],
  "weeklyThemes": ["Week 1 theme", "Week 2 theme", "Week 3 theme", "Week 4 theme"],
  "influencerRecommendations": [
    {
      "platform": "Instagram",
      "name": "Influencer Name",
      "niche": "Their niche",
      "followerRange": "10K-50K",
      "whyRelevant": "Why they match the brand",
      "partnershipIdea": "Specific collaboration concept"
    }
  ]
}

Always return valid JSON only.`;

export const EXTEND_PLAN_SYSTEM_PROMPT = `You are an elite performance marketing strategist extending an existing 30-day campaign to 60 days.
The extension follows an 8-week framework. Weeks 1-4 are already complete. You are generating weeks 5-8:

- Weeks 5-6: RETENTION & ENGAGEMENT - Re-engage existing audience, deepen relationships, community building, user-generated content campaigns, loyalty rewards
- Weeks 7-8: SCALING & OPTIMIZATION - Scale successful campaigns, test new audiences, optimize based on learnings, advanced retargeting, lookalike audiences

For each day, create 1-2 content tasks. Each task must include:
- Specific ad copy (headline, subheadline, body, CTA) that sounds professional and compelling
- An assigned template type from: hero-cta, feature-grid, testimonial, comparison, stats-banner, problem-solution, pricing-highlight, social-post
- A target platform
- Implementation guidance with actionable steps, optimal posting time, relevant hashtags, audience targeting advice, and additional tips

The content should build on the brand's established presence from the first 30 days and push toward deeper engagement and scaling.

Return a JSON object:
{
  "days": [
    {
      "dayIndex": 30,
      "theme": "Day theme",
      "weekPhase": "Retention & Engagement",
      "tasks": [...]
    }
  ],
  "weeklyThemes": ["Week 5 theme", "Week 6 theme", "Week 7 theme", "Week 8 theme"]
}

Always return valid JSON only.`;

export function buildAnalyzePrompt(scrapedData: string): string {
  return `Analyze this website's scraped content and extract a complete brand profile for marketing purposes:\n\n${scrapedData}`;
}

export function buildPlanPrompt(
  brandName: string,
  analysis: string,
  platforms?: string[],
  socialProfiles?: string
): string {
  let prompt = `Create a comprehensive 30-day marketing plan for "${brandName}" based on this analysis:\n\n${analysis}\n\nGenerate specific, compelling ad copy for each day's tasks. Each headline should be unique and powerful. Make the copy sound like real, high-performing ads from top SaaS companies.`;

  if (platforms && platforms.length > 0) {
    prompt += `\n\nTarget platforms: ${platforms.join(", ")}. Only generate content for these platforms.`;
  }

  if (socialProfiles) {
    prompt += `\n\nSocial media profiles:\n${socialProfiles}\nTailor content to these audience sizes and engagement rates.`;
  }

  prompt += `\n\nAlso include 2-3 influencer recommendations per selected platform in the influencerRecommendations array.`;

  return prompt;
}

export function buildExtendPrompt(
  brandName: string,
  analysis: string,
  existingPlanSummary: string,
  platforms?: string[]
): string {
  let prompt = `Extend the marketing campaign for "${brandName}" from 30 days to 60 days.\n\nBrand analysis:\n${analysis}\n\nSummary of existing 30-day plan:\n${existingPlanSummary}\n\nGenerate days 31-60 (dayIndex 30-59) with unique, compelling content that builds on the first 30 days.`;

  if (platforms && platforms.length > 0) {
    prompt += `\n\nTarget platforms: ${platforms.join(", ")}. Only generate content for these platforms.`;
  }

  return prompt;
}
