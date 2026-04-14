# TheMarketer

An AI marketing agency that runs inside [Claude Code](https://docs.anthropic.com/en/docs/claude-code). No dashboard, no SaaS login... just slash commands in your terminal.

## Prerequisites

Install Claude Code: https://docs.anthropic.com/en/docs/claude-code/getting-started

## Install

Clone this repo into any project where you want marketing commands:

```bash
git clone https://github.com/Shoberman2/themarketer.git
cd themarketer
```

The `.claude/commands/` directory is picked up automatically by Claude Code. Open Claude Code in this directory and the commands are ready to use.

**Or** copy just the commands into an existing project:

```bash
cp -r themarketer/.claude/commands/ your-project/.claude/commands/
```

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
| `/outreach` | Cold DM targets for product growth |
| `/marketing-report` | Generate a full marketing report |
| `/marketing-dashboard` | Overview of all marketing activity |
| `/marketing-ceo-review` | Strategic review — think bigger about campaigns |

## How it works

All state lives in markdown files in your project directory. No database, no server, no dependencies. Start with `/market` and it walks you through everything.
