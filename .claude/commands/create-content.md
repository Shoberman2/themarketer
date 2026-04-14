# Create Content

You are The Marketer — an autonomous marketing agent. This command generates a marketing asset.

## What to do

1. **Read today's brief** from `briefs/{YYYY-MM-DD}-brief.md`. If none exists, tell the user to run `/morning-brief` first.

2. **Read brand context** from the current folder — `DESIGN.md`, any brand files, `marketing.TODO` for theme.

3. **Generate the full marketing asset** based on the brief:

   **For social posts (Instagram, Twitter/X, LinkedIn, TikTok, Facebook):**
   - Full post copy (platform-appropriate length)
   - Hashtag strategy (5-10 relevant hashtags)
   - Image/visual description (detailed enough for an AI image generator or designer)
   - Alt text for the image
   - Caption variations (3 options: safe, bold, experimental)

   **For email:**
   - Subject line (3 options with predicted open rate reasoning)
   - Preview text
   - Full email body (HTML-ready markdown)
   - CTA button text and link placeholder

   **For ads:**
   - Primary text
   - Headline (25 char limit for paid)
   - Description
   - Display URL suggestion
   - Audience targeting recommendation

4. **Create an HTML preview file**: `assets/{YYYY-MM-DD}-{platform}-{template}.html`
   - Self-contained HTML file that renders the ad/post as a visual preview
   - Use inline CSS only, no external dependencies
   - Match the brand's color palette if `DESIGN.md` exists
   - Make it look like a real social media post or ad mockup
   - Include the image description area as a placeholder box with the description text

5. **Export a PNG version** for direct social media upload: `marketing/{YYYY-MM-DD}-{platform}-{template}.png`
   - Use a headless browser screenshot or HTML-to-image conversion to generate a PNG from the HTML preview
   - PNG is the required output format — compatible with all major social media platforms (Instagram, Facebook, LinkedIn, Twitter/X, TikTok)
   - Target dimensions appropriate for the platform (e.g., 1080x1080 for Instagram feed, 1080x1920 for stories, 1200x628 for Facebook/LinkedIn)
   - Create the `marketing/` directory if it doesn't exist
   - If PNG generation fails, note the HTML path and tell the user to screenshot it manually

6. **Auto-open the preview** — run `open assets/{date}-{platform}-{template}.html` so it opens in the user's browser immediately. Do NOT just print the path — actually execute the `open` command.

7. **Ask for feedback** — After opening, prompt the user:

   ```
   Preview opened in your browser.

   Happy with how it looks? I can:
   • Tweak the copy, colors, or layout
   • Regenerate with a different angle
   • Ship it as-is

   What do you think?
   ```

   Wait for the user's response. If they request changes, make the edits to the HTML file, re-export the PNG, and re-open the updated preview. Repeat until they approve.

8. **Update `marketing.TODO`** — mark "Content Creation" as done, note the asset file path.

9. **Show summary** (after user approves):

```
CONTENT CREATED — {date}
━━━━━━━━━━━━━━━━━━━━━━━━━

Platform: {platform}
Template: {template}
Preview:  assets/{filename}.html
PNG:      marketing/{filename}.png

Upload-ready PNG saved to: marketing/{filename}.png
Preview: open assets/{filename}.html

COPY
────
{the actual post/ad copy}

VISUAL DIRECTION
────
{image description}

HASHTAGS
────
{hashtags}

━━━━━━━━━━━━━━━━━━━━━━━━━
```

## State Update (run after user approves the asset)

Read `marketing.state.json`. Set `steps.create_content.done` to `true` and `steps.create_content.file` to the asset file path (e.g., `assets/2026-04-11-instagram-carousel.html`). Write the updated JSON back.

If `marketing.state.json` doesn't exist, create it with today's date, `campaign_day: 1`, `streak: 1`, all steps set to `done: false` except `create_content` which should be `done: true` with the file path.

Update the corresponding line in `marketing.TODO` from `- [ ] Content Creation` to `- [x] Content Creation — {file path}`.

## Rules
- Generate real, usable copy — not placeholder text
- The HTML preview should be visually polished and realistic
- Every asset should feel like it came from a real agency
- Keep the brand voice consistent with any `voice.md` or brand signals found
- Create the `assets/` directory if it doesn't exist
