import { InfluencerRecommendation, getProfileUrl } from "@/types/influencer";

/**
 * Curated database of real influencers across industries and platforms.
 * Tagged by industry keywords so they can be matched to any brand's vertical.
 * All influencers listed are public figures who actively accept brand partnerships.
 */

interface CuratedInfluencer extends InfluencerRecommendation {
  industries: string[];
  profileUrl?: string;
  email?: string;
  openToPartnerships?: boolean;
}

export const CURATED_INFLUENCERS: CuratedInfluencer[] = [
  // ─── TECH / SAAS ───
  {
    platform: "LinkedIn",
    name: "Justin Welsh",
    niche: "SaaS & Solopreneurship",
    followerRange: "800K+",
    whyRelevant: "Builds in public, shares SaaS growth tactics. His audience is founders, operators, and B2B buyers who make purchasing decisions.",
    partnershipIdea: "Sponsored deep-dive post breaking down how your product solves a specific workflow problem, with his personal take.",
    industries: ["saas", "tech", "software", "b2b", "startup", "productivity", "ai", "automation"],
    profileUrl: "https://www.linkedin.com/in/justinwelsh/",
    openToPartnerships: true,
  },
  {
    platform: "YouTube",
    name: "Fireship (Jeff Delaney)",
    niche: "Developer Tools & Tech",
    followerRange: "3M+",
    whyRelevant: "Creates viral 'X in 100 seconds' videos. Reaches developers and technical decision-makers who evaluate and adopt tools.",
    partnershipIdea: "Sponsored '100 seconds' explainer video showing your product's core value prop to a developer audience.",
    industries: ["saas", "tech", "software", "developer", "ai", "api", "cloud", "devtools"],
  },
  {
    platform: "Twitter/X",
    name: "Sahil Bloom",
    niche: "Business & Growth Strategy",
    followerRange: "1.5M+",
    whyRelevant: "Writes viral threads on frameworks, mental models, and business growth. His audience includes founders, investors, and operators.",
    partnershipIdea: "Co-create a thread on a growth framework that naturally features your product as a case study or recommended tool.",
    industries: ["saas", "tech", "business", "finance", "startup", "b2b", "consulting", "productivity"],
  },
  {
    platform: "Instagram",
    name: "Later (Social Media Platform)",
    niche: "Social Media Marketing",
    followerRange: "500K+",
    whyRelevant: "Their audience is marketers and small business owners actively looking for tools. Cross-promotion reaches tool-evaluating buyers.",
    partnershipIdea: "Joint Instagram carousel showing a workflow integration between your product and their scheduling platform.",
    industries: ["saas", "tech", "marketing", "social media", "startup", "ecommerce"],
  },
  {
    platform: "TikTok",
    name: "Jera Bean",
    niche: "Tech & Productivity",
    followerRange: "1M+",
    whyRelevant: "Makes viral videos about tech tools, apps, and productivity setups. Drives massive app downloads and trial signups.",
    partnershipIdea: "Sponsored 'tools that changed my workflow' TikTok featuring your product as the hero tool.",
    industries: ["saas", "tech", "productivity", "software", "ai", "automation", "app"],
  },

  // ─── E-COMMERCE / DTC ───
  {
    platform: "Instagram",
    name: "Emma Chamberlain",
    niche: "Lifestyle & Consumer Products",
    followerRange: "16M+",
    whyRelevant: "Gen Z icon with massive purchasing influence. Her authentic, unfiltered style drives real conversions for DTC brands.",
    partnershipIdea: "Organic-feeling Story series showing her genuinely using/unboxing your product in her daily routine.",
    industries: ["ecommerce", "dtc", "fashion", "beauty", "food", "beverage", "lifestyle", "retail"],
  },
  {
    platform: "TikTok",
    name: "Alix Earle",
    niche: "Lifestyle & Product Reviews",
    followerRange: "7M+",
    whyRelevant: "The 'Alix Earle effect' — products she mentions sell out within hours. Authentic GRWM format drives massive DTC conversions.",
    partnershipIdea: "GRWM-style TikTok where your product is naturally integrated into her routine, not a scripted ad read.",
    industries: ["ecommerce", "dtc", "beauty", "fashion", "skincare", "lifestyle", "retail"],
  },
  {
    platform: "YouTube",
    name: "MKBHD (Marques Brownlee)",
    niche: "Tech & Product Reviews",
    followerRange: "19M+",
    whyRelevant: "The most trusted product reviewer on the internet. A positive review from him moves markets and sells out products.",
    partnershipIdea: "Full product review or integration into his 'best of' roundup videos with a dedicated sponsor segment.",
    industries: ["tech", "ecommerce", "electronics", "software", "gadgets", "hardware", "app"],
  },
  {
    platform: "Pinterest",
    name: "The Sorry Girls",
    niche: "DIY & Home Lifestyle",
    followerRange: "500K+",
    whyRelevant: "Top Pinterest creators in home/DIY. Their pins drive long-tail traffic for months — Pinterest content has the longest shelf life of any platform.",
    partnershipIdea: "Sponsored pin series showing your product used in a DIY project or home makeover, driving traffic to your site.",
    industries: ["ecommerce", "home", "furniture", "decor", "diy", "lifestyle", "retail"],
  },

  // ─── FINANCE / FINTECH ───
  {
    platform: "YouTube",
    name: "Graham Stephan",
    niche: "Personal Finance & Investing",
    followerRange: "4.5M+",
    whyRelevant: "Most-watched finance creator. His audience actively opens accounts, downloads apps, and moves money based on his recommendations.",
    partnershipIdea: "Sponsored review or integration showing how your fintech product fits into a smart money management strategy.",
    industries: ["finance", "fintech", "banking", "investing", "insurance", "crypto", "payments"],
  },
  {
    platform: "Instagram",
    name: "The Financial Diet",
    niche: "Money Management & Financial Literacy",
    followerRange: "900K+",
    whyRelevant: "Reaches millennials making financial decisions. Their audience trusts tool recommendations and actively seeks better financial products.",
    partnershipIdea: "Sponsored carousel or Reel about a financial habit/strategy that naturally features your product as the recommended tool.",
    industries: ["finance", "fintech", "banking", "budgeting", "investing", "insurance"],
  },
  {
    platform: "TikTok",
    name: "Humphrey Yang",
    niche: "Finance & Money Explained",
    followerRange: "3.5M+",
    whyRelevant: "Makes complex finance topics viral with prop-based explainers. His audience is young adults actively setting up their financial stack.",
    partnershipIdea: "Prop-style TikTok explaining a financial concept where your product is the solution, matching his signature visual format.",
    industries: ["finance", "fintech", "banking", "crypto", "investing", "payments", "insurance"],
  },

  // ─── HEALTH & FITNESS ───
  {
    platform: "Instagram",
    name: "Kayla Itsines",
    niche: "Fitness & Wellness",
    followerRange: "16M+",
    whyRelevant: "Pioneer of the fitness influencer space. Her audience actively buys fitness products, supplements, and wellness tools.",
    partnershipIdea: "Sponsored workout Reel incorporating your product with a 'swipe up' to a landing page with an exclusive discount code.",
    industries: ["fitness", "health", "wellness", "supplements", "gym", "nutrition", "sports", "activewear"],
  },
  {
    platform: "YouTube",
    name: "Jeff Nippard",
    niche: "Science-Based Fitness",
    followerRange: "5M+",
    whyRelevant: "His audience trusts evidence-based recommendations. A mention carries credibility that pure entertainment influencers can't match.",
    partnershipIdea: "Sponsored segment in a training video where he explains the science behind your product's benefits with real data.",
    industries: ["fitness", "health", "supplements", "nutrition", "gym", "sports", "wellness"],
  },
  {
    platform: "TikTok",
    name: "Doctor Mike",
    niche: "Health & Medical Education",
    followerRange: "10M+",
    whyRelevant: "Licensed physician with massive reach. His endorsement carries medical credibility that drives trust-based conversions in health products.",
    partnershipIdea: "Sponsored health myth-busting TikTok where your product addresses a common misconception with his medical perspective.",
    industries: ["health", "wellness", "supplements", "medical", "pharma", "fitness", "nutrition", "skincare"],
  },

  // ─── FOOD & RESTAURANT ───
  {
    platform: "TikTok",
    name: "Keith Lee",
    niche: "Food Reviews & Restaurant Discovery",
    followerRange: "16M+",
    whyRelevant: "Single-handedly makes restaurants go viral overnight. A review from him can generate lines around the block for weeks.",
    partnershipIdea: "Invite him for an authentic review of your restaurant or food product — his honest, unscripted style is what drives trust.",
    industries: ["food", "restaurant", "beverage", "delivery", "hospitality", "catering"],
  },
  {
    platform: "Instagram",
    name: "Molly Baz",
    niche: "Home Cooking & Food Media",
    followerRange: "800K+",
    whyRelevant: "Former Bon Appétit chef with a loyal food-obsessed audience. She drives cookbook sales, kitchen product purchases, and brand loyalty.",
    partnershipIdea: "Sponsored recipe Reel using your product/ingredient with her signature accessible cooking style and a link to purchase.",
    industries: ["food", "beverage", "kitchen", "grocery", "restaurant", "cooking", "meal delivery"],
  },
  {
    platform: "YouTube",
    name: "Joshua Weissman",
    niche: "Cooking & Food Entertainment",
    followerRange: "8M+",
    whyRelevant: "His 'But Better' and 'But Cheaper' series regularly go viral. Reaches young adults who cook at home and buy food products online.",
    partnershipIdea: "Sponsored 'But Better' video where he uses your product to elevate a common dish, with a discount code for viewers.",
    industries: ["food", "beverage", "kitchen", "grocery", "restaurant", "cooking", "meal delivery"],
  },

  // ─── BEAUTY & FASHION ───
  {
    platform: "Instagram",
    name: "Hyram Yarbro",
    niche: "Skincare Education",
    followerRange: "6M+",
    whyRelevant: "The internet's most trusted skincare voice. Products he recommends sell out globally — the 'Hyram effect' is documented retail phenomenon.",
    partnershipIdea: "Sponsored skincare routine Reel where he reviews your product ingredients and gives his honest verdict to his audience.",
    industries: ["beauty", "skincare", "cosmetics", "wellness", "fashion", "dtc"],
  },
  {
    platform: "TikTok",
    name: "Mikayla Nogueira",
    niche: "Beauty & Makeup Reviews",
    followerRange: "15M+",
    whyRelevant: "Her product reviews drive immediate sellouts. Her authentic Boston accent and genuine reactions make her recommendations feel trustworthy.",
    partnershipIdea: "Sponsored 'first impressions' TikTok testing your product on camera with her signature genuine reaction format.",
    industries: ["beauty", "cosmetics", "skincare", "fashion", "dtc", "retail"],
  },
  {
    platform: "YouTube",
    name: "Alex Costa",
    niche: "Men's Fashion & Grooming",
    followerRange: "4M+",
    whyRelevant: "The top men's style creator. His audience actively purchases grooming products and fashion items based on his recommendations.",
    partnershipIdea: "Sponsored 'essentials' or 'upgrade your style' video featuring your product as a key recommendation with affiliate link.",
    industries: ["fashion", "grooming", "beauty", "menswear", "dtc", "retail", "lifestyle"],
  },

  // ─── REAL ESTATE ───
  {
    platform: "Instagram",
    name: "Ryan Serhant",
    niche: "Luxury Real Estate & Entrepreneurship",
    followerRange: "2.5M+",
    whyRelevant: "Star of Million Dollar Listing. His audience is high-net-worth buyers and aspiring real estate professionals who trust his recommendations.",
    partnershipIdea: "Sponsored property tour Reel or Story series featuring your real estate product/service as part of his selling process.",
    industries: ["real estate", "property", "luxury", "mortgage", "home", "construction", "interior design"],
  },
  {
    platform: "YouTube",
    name: "Graham Stephan (Real Estate)",
    niche: "Real Estate Investing",
    followerRange: "4.5M+",
    whyRelevant: "Also covers real estate investing extensively. His audience is actively buying properties and evaluating real estate tools and services.",
    partnershipIdea: "Sponsored segment in a real estate analysis video showing how your product helps investors evaluate or manage properties.",
    industries: ["real estate", "property", "investing", "mortgage", "home", "construction"],
  },
  {
    platform: "TikTok",
    name: "Tatiana Londono",
    niche: "Real Estate Tips & Luxury Homes",
    followerRange: "2M+",
    whyRelevant: "Makes real estate accessible and entertaining on TikTok. Her audience includes first-time buyers and real estate enthusiasts.",
    partnershipIdea: "Sponsored TikTok showing a 'day in the life' or property walkthrough where your product/service plays a natural role.",
    industries: ["real estate", "property", "mortgage", "home", "luxury", "interior design"],
  },

  // ─── EDUCATION / ONLINE COURSES ───
  {
    platform: "YouTube",
    name: "Ali Abdaal",
    niche: "Productivity & Online Business",
    followerRange: "5M+",
    whyRelevant: "Former doctor turned creator economy expert. His audience buys courses, tools, and productivity software at extremely high rates.",
    partnershipIdea: "Sponsored 'tools I use' video or dedicated review showing how your platform fits into an efficient learning/working system.",
    industries: ["education", "courses", "productivity", "tech", "software", "saas", "learning"],
  },
  {
    platform: "Instagram",
    name: "Study With Jess",
    niche: "Study Tips & Academic Success",
    followerRange: "1M+",
    whyRelevant: "Reaches students and lifelong learners who actively seek educational tools and resources. High engagement on study content.",
    partnershipIdea: "Sponsored Reel showing a study session setup/routine that features your product as a key study tool.",
    industries: ["education", "courses", "learning", "edtech", "university", "tutoring"],
  },
  {
    platform: "TikTok",
    name: "Hank Green",
    niche: "Science Education & Learning",
    followerRange: "8M+",
    whyRelevant: "Co-founded VidCon, Crash Course. His audience values learning and actively supports educational products and platforms.",
    partnershipIdea: "Sponsored educational TikTok connecting a fascinating science topic to what your product does, in his signature enthusiastic style.",
    industries: ["education", "courses", "science", "learning", "edtech", "publishing"],
  },

  // ─── TRAVEL & HOSPITALITY ───
  {
    platform: "Instagram",
    name: "Jack Morris (@doyoutravel)",
    niche: "Travel Photography & Luxury Travel",
    followerRange: "2.5M+",
    whyRelevant: "His travel photography drives destination bookings. Hotels and resorts see measurable booking increases after his features.",
    partnershipIdea: "Multi-day Instagram takeover featuring your hotel/destination with a mix of feed posts, Stories, and Reels.",
    industries: ["travel", "hospitality", "hotel", "resort", "tourism", "airline", "luxury"],
  },
  {
    platform: "YouTube",
    name: "Kara and Nate",
    niche: "Budget Travel & Adventure",
    followerRange: "3.5M+",
    whyRelevant: "Document real travel experiences with budgets and tips. Their audience books flights, hotels, and experiences based on their recommendations.",
    partnershipIdea: "Sponsored travel vlog where they visit your destination/hotel and provide an honest, detailed experience review.",
    industries: ["travel", "hospitality", "hotel", "tourism", "airline", "adventure", "outdoor"],
  },
  {
    platform: "TikTok",
    name: "Nas Daily",
    niche: "Travel & Culture Stories",
    followerRange: "14M+",
    whyRelevant: "Creates 1-minute cultural stories that go massively viral. A feature can put a destination or travel brand on the global map instantly.",
    partnershipIdea: "Sponsored '1-minute' TikTok telling the unique story behind your destination, hotel, or travel product.",
    industries: ["travel", "hospitality", "tourism", "culture", "airline", "adventure"],
  },

  // ─── AUTOMOTIVE ───
  {
    platform: "YouTube",
    name: "Doug DeMuro",
    niche: "Car Reviews & Quirks",
    followerRange: "5M+",
    whyRelevant: "The most-watched car reviewer. His 'quirks and features' format is iconic and drives massive interest in vehicles he covers.",
    partnershipIdea: "Full vehicle review in his signature format covering quirks, features, and a DougScore, driving awareness to your model.",
    industries: ["automotive", "cars", "vehicles", "ev", "electric", "truck", "motorcycle"],
  },
  {
    platform: "Instagram",
    name: "Supercar Blondie",
    niche: "Luxury & Exotic Cars",
    followerRange: "12M+",
    whyRelevant: "The world's most-followed automotive influencer. She reaches car enthusiasts and luxury buyers across every major platform.",
    partnershipIdea: "Sponsored first-look Reel with your vehicle featuring her signature 'let me show you this' walkthrough format.",
    industries: ["automotive", "cars", "luxury", "ev", "vehicles", "motorcycle"],
  },
  {
    platform: "TikTok",
    name: "Daniel Mac",
    niche: "Cars & Entrepreneurship",
    followerRange: "12M+",
    whyRelevant: "His 'what do you do for a living?' series next to supercars went mega-viral. Reaches young adults aspirationally interested in vehicles.",
    partnershipIdea: "Sponsored TikTok featuring your vehicle in his signature format, connecting the car to an aspirational lifestyle story.",
    industries: ["automotive", "cars", "luxury", "ev", "vehicles", "business"],
  },

  // ─── CROSS-INDUSTRY / GENERAL ───
  {
    platform: "YouTube",
    name: "MrBeast",
    niche: "Entertainment & Philanthropy",
    followerRange: "300M+",
    whyRelevant: "The biggest creator on YouTube. A MrBeast sponsorship delivers unmatched reach — but requires significant budget and brand alignment.",
    partnershipIdea: "Sponsored challenge or giveaway segment where your product/brand is featured as a key prize or partner.",
    industries: ["ecommerce", "tech", "food", "beverage", "finance", "app", "gaming", "entertainment"],
  },
  {
    platform: "Instagram",
    name: "Gary Vaynerchuk",
    niche: "Marketing & Entrepreneurship",
    followerRange: "10M+",
    whyRelevant: "The voice of modern marketing. His audience is business owners and marketers actively seeking tools, platforms, and strategies.",
    partnershipIdea: "Sponsored keynote clip or 'marketing minute' where he discusses a strategy that features your product as the execution tool.",
    industries: ["marketing", "saas", "tech", "ecommerce", "startup", "b2b", "consulting", "social media"],
  },
  {
    platform: "LinkedIn",
    name: "Chris Walker",
    niche: "B2B Marketing & Demand Gen",
    followerRange: "200K+",
    whyRelevant: "The leading voice in B2B demand generation. His audience is CMOs, VPs of Marketing, and revenue leaders who approve tool purchases.",
    partnershipIdea: "Guest on his podcast or co-authored LinkedIn post about a demand gen strategy featuring your product as infrastructure.",
    industries: ["b2b", "saas", "marketing", "tech", "software", "startup", "consulting"],
  },
  {
    platform: "Twitter/X",
    name: "Shaan Puri",
    niche: "Startups & Business Ideas",
    followerRange: "500K+",
    whyRelevant: "Co-host of My First Million podcast. His audience is builders, founders, and aspiring entrepreneurs who adopt tools early.",
    partnershipIdea: "Sponsored tweet thread or podcast mention where he discusses your product as an underrated tool for a specific business use case.",
    industries: ["tech", "saas", "startup", "business", "ecommerce", "finance", "ai", "productivity"],
  },
  {
    platform: "Pinterest",
    name: "Oh Joy (Joy Cho)",
    niche: "Design, Lifestyle & Parenting",
    followerRange: "15M+",
    whyRelevant: "The most-followed person on Pinterest. Her audience is design-conscious consumers with high purchasing intent for home, kids, and lifestyle products.",
    partnershipIdea: "Sponsored pin board featuring your product in a curated lifestyle/design context, driving long-tail discovery traffic.",
    industries: ["ecommerce", "home", "design", "lifestyle", "kids", "fashion", "food", "retail"],
  },
];

/**
 * Match curated influencers to a brand based on industry keywords.
 * Returns up to `limit` influencers that match any of the detected industry terms,
 * optionally filtered to only the selected platforms.
 */
export function getMatchingInfluencers(
  industry: string,
  platforms?: string[],
  limit: number = 15
): InfluencerRecommendation[] {
  const industryLower = industry.toLowerCase();

  // Extract keywords from the industry string
  const keywords = industryLower
    .split(/[\s,/&\-()]+/)
    .filter((w) => w.length > 2);

  // Also add common synonyms
  const expandedKeywords = [...keywords];
  if (keywords.some((k) => ["saas", "software", "platform", "tool", "app"].includes(k))) {
    expandedKeywords.push("saas", "tech", "software");
  }
  if (keywords.some((k) => ["ecommerce", "shop", "store", "retail", "commerce"].includes(k))) {
    expandedKeywords.push("ecommerce", "dtc", "retail");
  }
  if (keywords.some((k) => ["health", "fitness", "gym", "workout", "supplement"].includes(k))) {
    expandedKeywords.push("health", "fitness", "wellness");
  }
  if (keywords.some((k) => ["beauty", "skincare", "cosmetic", "makeup"].includes(k))) {
    expandedKeywords.push("beauty", "skincare", "cosmetics");
  }
  if (keywords.some((k) => ["food", "restaurant", "dining", "kitchen", "cooking", "meal"].includes(k))) {
    expandedKeywords.push("food", "restaurant", "beverage");
  }
  if (keywords.some((k) => ["real", "estate", "property", "home", "housing", "mortgage"].includes(k))) {
    expandedKeywords.push("real estate", "property", "home");
  }
  if (keywords.some((k) => ["travel", "hotel", "hospitality", "tourism", "resort"].includes(k))) {
    expandedKeywords.push("travel", "hospitality", "hotel");
  }
  if (keywords.some((k) => ["finance", "fintech", "bank", "invest", "insurance", "payment"].includes(k))) {
    expandedKeywords.push("finance", "fintech", "banking");
  }
  if (keywords.some((k) => ["education", "course", "learn", "training", "tutor"].includes(k))) {
    expandedKeywords.push("education", "courses", "learning");
  }
  if (keywords.some((k) => ["auto", "car", "vehicle", "motor", "ev", "electric"].includes(k))) {
    expandedKeywords.push("automotive", "cars", "vehicles");
  }
  if (keywords.some((k) => ["fashion", "clothing", "apparel", "wear"].includes(k))) {
    expandedKeywords.push("fashion", "beauty", "dtc");
  }

  // Normalize platform names for matching
  const normalizedPlatforms = platforms?.map((p) => {
    const map: Record<string, string> = {
      facebook: "Instagram",  // many FB influencers also do IG
      instagram: "Instagram",
      linkedin: "LinkedIn",
      twitter: "Twitter/X",
      tiktok: "TikTok",
      pinterest: "Pinterest",
      youtube: "YouTube",
      "google-ads": "YouTube", // closest match
    };
    return map[p] || p;
  });

  // Score each influencer
  const scored = CURATED_INFLUENCERS.map((inf) => {
    let score = 0;
    for (const keyword of expandedKeywords) {
      if (inf.industries.some((ind) => ind.includes(keyword))) {
        score += 1;
      }
    }
    return { influencer: inf, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  // Filter by platform if specified
  let filtered = scored;
  if (normalizedPlatforms && normalizedPlatforms.length > 0) {
    const platformSet = new Set(normalizedPlatforms);
    const onPlatform = scored.filter((s) => platformSet.has(s.influencer.platform));
    // If we have enough on-platform matches, prefer those; otherwise include all
    if (onPlatform.length >= 5) {
      filtered = onPlatform;
    }
  }

  return filtered.slice(0, limit).map(({ influencer }) => ({
    platform: influencer.platform,
    name: influencer.name,
    niche: influencer.niche,
    followerRange: influencer.followerRange,
    whyRelevant: influencer.whyRelevant,
    partnershipIdea: influencer.partnershipIdea,
    profileUrl: influencer.profileUrl || getProfileUrl(influencer.platform, influencer.name),
    openToPartnerships: influencer.openToPartnerships ?? true, // All curated influencers accept partnerships
  }));
}
