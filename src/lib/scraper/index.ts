import * as cheerio from "cheerio";
import { ScrapedData } from "@/types/analysis";

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove scripts, styles, and nav/footer noise
  $("script, style, noscript, iframe, svg").remove();

  const headings: string[] = [];
  $("h1, h2, h3").each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 2 && text.length < 200) {
      headings.push(text);
    }
  });

  const paragraphs: string[] = [];
  $("p").each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 20 && text.length < 500) {
      paragraphs.push(text);
    }
  });

  const metaTags: Record<string, string> = {};
  $("meta").each((_, el) => {
    const name =
      $(el).attr("name") || $(el).attr("property") || "";
    const content = $(el).attr("content") || "";
    if (name && content) {
      metaTags[name] = content;
    }
  });

  const colors: string[] = [];
  const colorRegex = /#[0-9a-fA-F]{3,8}/g;
  $("[style]").each((_, el) => {
    const style = $(el).attr("style") || "";
    const matches = style.match(colorRegex);
    if (matches) colors.push(...matches);
  });
  // Also check inline style tags before they were removed
  const rawHtml = html;
  const styleMatches = rawHtml.match(
    /--(?:primary|brand|accent|main)[^:]*:\s*(#[0-9a-fA-F]{3,8})/gi
  );
  if (styleMatches) {
    for (const m of styleMatches) {
      const hex = m.match(/#[0-9a-fA-F]{3,8}/);
      if (hex) colors.push(hex[0]);
    }
  }

  const imageUrls: string[] = [];
  $("img").each((_, el) => {
    const src = $(el).attr("src");
    if (src && !src.includes("data:") && !src.includes("tracking")) {
      try {
        const absUrl = new URL(src, url).href;
        imageUrls.push(absUrl);
      } catch {
        // skip invalid URLs
      }
    }
  });

  const pricingContent: string[] = [];
  $('[class*="pric"], [id*="pric"], [class*="plan"], [data-section*="pric"]')
    .find("*")
    .each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 5 && text.length < 300) {
        pricingContent.push(text);
      }
    });

  const testimonials: string[] = [];
  $(
    '[class*="testimonial"], [class*="review"], [class*="quote"], blockquote'
  ).each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 20 && text.length < 500) {
      testimonials.push(text);
    }
  });

  const features: string[] = [];
  $('[class*="feature"], [class*="benefit"], li').each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 10 && text.length < 200) {
      features.push(text);
    }
  });

  const ctaTexts: string[] = [];
  $(
    'a[class*="btn"], a[class*="cta"], button, [class*="button"], [role="button"]'
  ).each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 2 && text.length < 50) {
      ctaTexts.push(text);
    }
  });

  return {
    url,
    title: $("title").text().trim() || "",
    description: metaTags["description"] || metaTags["og:description"] || "",
    headings: [...new Set(headings)].slice(0, 20),
    paragraphs: [...new Set(paragraphs)].slice(0, 15),
    metaTags,
    colors: [...new Set(colors)].slice(0, 10),
    imageUrls: imageUrls.slice(0, 10),
    pricingContent: [...new Set(pricingContent)].slice(0, 10),
    testimonials: [...new Set(testimonials)].slice(0, 5),
    features: [...new Set(features)].slice(0, 15),
    ctaTexts: [...new Set(ctaTexts)].slice(0, 10),
  };
}
