# Contributing to TheMarketer

Thanks for wanting to contribute! TheMarketer is a CLI-only AI marketing agency built as Claude Code slash commands. Every feature is a markdown file in `.claude/commands/`.

## How to contribute

### Adding a new command

1. Create a markdown file in `.claude/commands/` (e.g., `my-command.md`)
2. Follow the existing command structure — see `morning-brief.md` for a good example
3. Add the command to the table in `README.md`
4. Test it by running `/my-command` in Claude Code

### Adding campaign templates

Campaign templates live in `data/templates/` as JSON files. Each template defines phases, day ranges, and theme banks. Look at the existing templates for the structure.

### Adding influencers to the database

The influencer database is at `data/influencers.json`. Add entries with:
- Name, handle, platform
- Follower count and engagement rate
- Niche/industry tags
- Contact info (if public)

### Improving existing commands

Found a command that could be better? Edit the markdown file directly. The prompt IS the feature.

## Guidelines

- Keep commands opinionated. One recommendation, not five options.
- Analyst voice: direct, no fluff, no "excited to share."
- Zero dependencies. No npm packages, no API keys, no build steps.
- All state lives in markdown and JSON files the user can read and git-commit.
- Test your changes by actually running the commands in Claude Code.

## Submitting changes

1. Fork the repo
2. Create a branch (`git checkout -b add-seo-command`)
3. Make your changes
4. Test by running the commands in Claude Code
5. Open a PR with a clear description of what the command does and why

## Ideas we'd love help with

- New slash commands (SEO audit, competitor analysis, A/B test planner)
- More campaign templates for different industries
- Expanding the influencer database
- Translations / localization of command prompts
- Integration guides for different marketing workflows
