# TheMarketer

An AI marketing agency that runs inside Claude Code. No dashboard, no SaaS login — just slash commands in your terminal.

## Setup

1. Clone this repo
2. The `.claude/commands/` directory gives you all the marketing slash commands automatically

## Commands

| Command | What it does |
|---------|-------------|
| `/market` | Daily marketing hub — your starting point |
| `/morning-brief` | AI-generated daily brief with content recommendations |
| `/create-content` | Generate ad copy, visuals, and campaign content |
| `/brand-voice` | Establish and refine brand voice guidelines |
| `/campaign-arc` | Review and adjust campaign phase strategy |
| `/performance-check` | Analyze content performance and spot patterns |
| `/outreach-plan` | Plan influencer and partnership outreach |
| `/influencers-outreach` | Match with real influencers from curated database |
| `/outreach` | Cold DM targets for product growth |
| `/marketing-report` | Generate a full marketing report |
| `/marketing-dashboard` | Overview of all marketing activity |
| `/marketing-ceo-review` | Strategic review — think bigger about campaigns |

## Architecture

Hub-and-spokes: `/market` is the hub that routes to specialized spoke commands. Each command reads brand context from local files (`voice.md`, `DESIGN.md`, `marketing.TODO`) and writes structured output back.

All state lives in markdown files in your project directory. No database, no server, no dependencies.
