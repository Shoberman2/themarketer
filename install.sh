#!/bin/bash
# TheMarketer — Install Script
# Copies commands and data to the correct locations for Claude Code

set -e

COMMANDS_DIR="$HOME/.claude/commands"
DATA_DIR="$HOME/.claude/commands/themarketer-data"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Installing TheMarketer..."

# Create directories
mkdir -p "$COMMANDS_DIR"
mkdir -p "$DATA_DIR/templates"
mkdir -p "$DATA_DIR/demo-brand/briefs"

# Copy command files
echo "  Copying commands..."
cp "$SCRIPT_DIR/.claude/commands/"*.md "$COMMANDS_DIR/"

# Copy data files
echo "  Copying data..."
cp "$SCRIPT_DIR/data/influencers.json" "$DATA_DIR/"
cp "$SCRIPT_DIR/data/templates/"*.json "$DATA_DIR/templates/"
cp "$SCRIPT_DIR/data/demo-brand/voice.md" "$DATA_DIR/demo-brand/"
cp "$SCRIPT_DIR/data/demo-brand/DESIGN.md" "$DATA_DIR/demo-brand/"
cp "$SCRIPT_DIR/data/demo-brand/briefs/"*.md "$DATA_DIR/demo-brand/briefs/"

# Validate install
echo "  Validating..."
MISSING=0
[ ! -f "$COMMANDS_DIR/market.md" ] && echo "  WARNING: market.md missing" && MISSING=1
[ ! -f "$COMMANDS_DIR/setup.md" ] && echo "  WARNING: setup.md missing" && MISSING=1
[ ! -f "$DATA_DIR/influencers.json" ] && echo "  WARNING: influencers.json missing" && MISSING=1
[ ! -d "$DATA_DIR/templates" ] && echo "  WARNING: templates/ missing" && MISSING=1
[ ! -f "$DATA_DIR/demo-brand/voice.md" ] && echo "  WARNING: demo-brand missing" && MISSING=1

if [ "$MISSING" -eq 1 ]; then
  echo ""
  echo "WARNING: Install may be incomplete. Check the warnings above."
  exit 1
fi

echo ""
echo "TheMarketer installed."
echo ""
echo "Quick start:"
echo "  1. cd into any project folder"
echo "  2. Open Claude Code"
echo "  3. Run /setup"
echo "  4. Run /market"
echo ""
