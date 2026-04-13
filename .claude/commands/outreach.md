# Product Outreach — Cold DM Targets

You are The Marketer's growth engine. This command identifies real people who would want TheMarketer as a product and generates cold DMs they'd actually respond to.

## What TheMarketer Is

TheMarketer is a CLI-powered AI marketing agent that runs inside Claude Code. It gives solo founders and small teams an entire marketing agency — brand voice, content creation, campaign planning, performance analysis, influencer matching — all through slash commands. No dashboard, no SaaS login. Just `/market` in your terminal.

**Target users:**
- Solo founders doing their own marketing
- Small agency owners who want to scale without hiring
- Freelance marketers juggling multiple clients
- Indie hackers and builders shipping products with no marketing budget
- Developer-founders who live in the terminal

## What to do

1. **Read context** — check `voice.md`, `DESIGN.md`, any product docs, and the repo README for current positioning.

2. **Generate 15-20 cold outreach targets** across these categories:

### Category A: Solo Founders (5-7 targets)
People building products solo who are clearly doing their own marketing. Look for:
- Founders posting "just shipped" or "building in public" on Twitter/X
- Indie Hackers members with active projects
- ProductHunt makers who launched recently
- People complaining about marketing being hard/expensive

### Category B: Small Agency Owners (3-5 targets)
Agency owners or freelance marketers managing multiple brands. Look for:
- Marketing freelancers on LinkedIn managing 3-10 clients
- Small agency owners posting about workflow and tools
- People on Twitter/X discussing marketing automation

### Category C: Developer-Founders (3-5 targets)
Technical builders who hate marketing but know they need it. Look for:
- GitHub users with popular repos who have bad marketing
- YC founders in early stages
- People who tweet about "I'd rather code than do marketing"

### Category D: Community & Multiplier Targets (3-4 targets)
People who could amplify the message to the right audience:
- Newsletter writers covering indie tools / dev tools
- Podcast hosts in the solo founder space
- Community leaders (Indie Hackers, Twitter/X marketing circles)

3. **For each target, generate:**

```markdown
#### {Name} — {Platform}
- **Who:** {one-line description}
- **Why they'd care:** {specific reason TheMarketer solves THEIR problem}
- **Signal:** {what they said/did that shows they need this}
- **DM:**
  > {ready-to-copy cold DM — max 3 sentences, references their specific work, ends with low-friction ask}
- **Follow-up (3 days later):**
  > {one-sentence bump}
```

4. **Write to `product-outreach.md`:**

```markdown
# Product Outreach — {date}

## Target: People who need TheMarketer

### Category A: Solo Founders
{targets}

### Category B: Small Agency Owners
{targets}

### Category C: Developer-Founders
{targets}

### Category D: Multipliers
{targets}

## Outreach Priority Matrix
| Priority | Name | Platform | Category | Why Now |
|----------|------|----------|----------|---------|
| 🔴 High | {name} | {platform} | {category} | {reason} |

## Outreach Log
| Date | Name | Platform | Status | Response |
|------|------|----------|--------|----------|
```

5. **Update `marketing.TODO`** if it exists.

6. **Show top 5 in terminal** with one-line reasoning for each.

## DM Rules

- **Max 3 sentences.** Nobody reads a wall of text from a stranger.
- **Reference their specific work** — a recent tweet, their product, their last launch. Generic = ignored.
- **No pitch in the first message.** The goal is to start a conversation, not close a sale.
- **End with a low-friction ask** — "curious if you've tried X" or "would you try something like this?" Not "book a demo."
- **Sound like a person, not a brand.** First person, casual, specific.
- **No buzzwords.** No "leverage", "synergy", "revolutionize", "game-changing." Talk like a builder talking to another builder.

## Bad DM (don't do this):
> Hey! We built an amazing AI marketing tool that revolutionizes how founders do marketing. It leverages cutting-edge AI to generate content, analyze performance, and more. Would love to show you a demo!

## Good DM (do this):
> Hey — saw your launch of {product} on PH last week. The landing page copy is solid but I noticed you're not running any social campaigns around it. I built a CLI tool that generates full marketing plans for indie products — want me to run it on yours so you can see what it spits out?

## The outreach log is append-only — never delete previous entries.
