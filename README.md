# TheMarketer

AI marketing agency in your terminal. No dashboard, no SaaS login... just slash commands in Claude Code.

Built for solo founders who'd rather type `/market` than open another tab.

## What it does

TheMarketer gives you a daily marketing cadence system. Run `/market` every morning and it tells you what to do: generate content, refine your brand voice, check performance, plan outreach. Each day builds on the last. Your voice profile sharpens. Your campaign arc progresses. Your streak grows.

It also generates AI-powered ad creatives with images (via Pollinations), matches you against a curated influencer database, and tracks everything in plain markdown files you can read and git-commit.

## Install

### Option A: Claude Code Plugin

```bash
# Add the marketplace
/plugin marketplace add Shoberman2/themarketer

# Install
/plugin install themarketer@themarketer
```

### Option B: Manual install

```bash
git clone https://github.com/Shoberman2/themarketer.git
cd themarketer
./install.sh
```

## Quick start

```
/setup              # Set up your brand (or try the demo)
/market             # See your daily marketing dashboard
/morning-brief      # Get today's content recommendation
/create-content     # Generate an ad with AI images
```

## Commands

| Command | What it does |
|---------|-------------|
| `/setup` | Guided brand setup with demo mode and campaign templates |
| `/market` | Daily marketing hub, your starting point every morning |
| `/morning-brief` | AI-generated daily brief with content recommendations |
| `/create-content` | Generate ad copy, AI images, and HTML previews |
| `/brand-voice` | Establish and refine brand voice guidelines |
| `/campaign-arc` | Review and adjust campaign phase strategy |
| `/performance-check` | Analyze content performance and spot patterns |
| `/influencer-outreach` | Match against curated influencer database with fit scoring |
| `/cold-outreach` | Generate cold outreach targets and DM templates |
| `/marketing-report` | End-of-day summary of marketing activity |
| `/marketing-dashboard` | Overview of all marketing activity |
| `/marketing-ceo-review` | Strategic review for campaigns |

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

Made by a solo founder for solo founders.
