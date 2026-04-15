<p align="center">
  <h1 align="center">TheMarketer</h1>
  <p align="center">AI marketing agency in your terminal. No dashboard, no SaaS login... just slash commands in Claude Code.</p>
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/dependencies-zero-brightgreen.svg" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/built%20for-Claude%20Code-blueviolet.svg" alt="Built for Claude Code">
  <img src="https://img.shields.io/badge/AI%20images-Pollinations-orange.svg" alt="AI Images via Pollinations">
</p>

<p align="center">
  Built for solo founders who'd rather type <code>/market</code> than open another tab.
</p>

---

<!-- Add a terminal recording here: https://github.com/charmbracelet/vhs -->
<!-- vhs demo.tape && mv demo.gif assets/demo.gif -->
<!-- ![Demo](assets/demo.gif) -->

## Why this exists

I was paying for 3 marketing tools I opened once a week. Buffer, Canva, some analytics thing. Most of my "marketing" was staring at a dashboard wondering what to post.

So I built a system that just tells me what to do. Every morning: one theme, one brief, one piece of content. It generates the copy, the AI image, the HTML preview. I review it, tweak it, ship it. 15 minutes. Done.

No onboarding wizard. No team seats pricing page. Just markdown files and Claude Code.

## What it does

Run `/market` every morning and it tells you what to do: generate content, refine your brand voice, check performance, plan outreach. Each day builds on the last. Your voice profile sharpens. Your campaign arc progresses. Your streak grows.

It also generates AI-powered ad creatives with images (via Pollinations), matches you against a curated influencer database, and tracks everything in plain markdown files you can read and git-commit.

## Install

### One-liner

```bash
git clone https://github.com/Shoberman2/themarketer.git && cd themarketer && ./install.sh
```

### Claude Code Plugin (recommended)

```bash
# In Claude Code:
/plugin marketplace add Shoberman2/themarketer
/plugin install themarketer@themarketer
```

## Quick start

```
/setup              # Set up your brand (or try the demo)
/market             # See your daily marketing dashboard
/morning-brief      # Get today's content recommendation
/create-content     # Generate an ad with AI images
```

## Example output

### `/market` — Daily dashboard

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  T H E   M A R K E T E R
  2026-04-15
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THEME: Founder Story Carousel Sprint
Share the origin story — why you started, what you learned.

PHASE: awareness  |  DAY 3  |  STREAK: 3

TODAY'S STEPS                    STATUS
──────────────────────────────────────────
1. Morning Brief                 [ ] /morning-brief
2. Content Creation              [ ] /create-content
3. Brand Voice Check             [ ] /brand-voice
4. Campaign Arc Review           [ ] /campaign-arc
5. Performance Analysis          [ ] /performance-check
6. Influencer Outreach           [ ] /influencer-outreach
7. Cold Outreach                 [ ] /cold-outreach
8. End-of-Day Report             [ ] /marketing-report

NEXT ACTION
──────────────────────────────────────────
> Run /morning-brief to get today's content recommendation.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### `/morning-brief` — Daily content recommendation

```
MORNING BRIEF — 2026-04-15
━━━━━━━━━━━━━━━━━━━━━━━━━━

Platform: Instagram
Template: carousel
Post at:  11:30 AM EST
Confidence: 8/10

HEADLINE
The Tool I Wish Existed (So I Built It)

SUBHEADLINE
From paying for 3 marketing tools to shipping content in 15 minutes.

BODY
I was spending more time managing marketing tools than actually marketing.
So I built a CLI that just tells me what to post every morning.
No dashboard. No login. Just slash commands.

CTA: Try it free — link in bio

AGENT NOTE
Origin stories outperform product posts 3:1 on Instagram. Carousel
format lets you break the narrative into swipeable moments.

Brief saved to: briefs/2026-04-15-brief.md
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Commands

| Command | What it does |
|---------|-------------|
| `/setup` | Guided brand setup with demo mode and campaign templates |
| `/market` | Daily marketing hub — your starting point every morning |
| `/morning-brief` | AI-generated daily brief with content recommendations |
| `/create-content` | Generate ad copy, AI images, and HTML previews |
| `/brand-voice` | Establish and refine brand voice guidelines |
| `/campaign-arc` | Review and adjust campaign phase strategy |
| `/performance-check` | Analyze content performance and spot patterns |
| `/influencer-outreach` | Match against curated influencer database with fit scoring |
| `/cold-outreach` | Generate cold outreach targets and DM templates |
| `/marketing-report` | End-of-day summary of marketing activity |
| `/marketing-dashboard` | Overview of all marketing activity |
| `/marketing-ceo-review` | Strategic review — "is this campaign ambitious enough?" |

## How it works

All state lives in markdown and JSON files in your project directory. No database, no server, no dependencies.

- `marketing.state.json` tracks your campaign day, streak, and step completion
- `marketing.TODO` is your campaign journal (append-only, git-trackable)
- `voice.md` is your brand voice profile (refines over time)
- `briefs/`, `assets/`, `reports/` hold generated content

**Multi-brand:** Each folder is a brand. cd into a project folder, run your commands. Different folder, different brand.

**Campaign templates:** Choose from Product Launch (42 days), Seasonal Sale (28 days), Brand Awareness (42 days), or Content Marketing (56 days) during `/setup`.

## Zero dependencies

No npm packages. No API keys. No build step. Just markdown files and Claude Code. AI image generation uses the free Pollinations API (no account needed).

## Contributing

We'd love help with new commands, campaign templates, and influencer data. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) — do whatever you want with it.
