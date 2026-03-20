import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "fs/promises";
import path from "path";
import { ContentTask } from "@/types/plan";
import { AdSize, AD_SIZES, AD_VARIANTS } from "@/types/ad";
import { ColorPalette, generatePalettes } from "./palettes";
import { renderTemplate } from "./templates";
import { BrandProfile } from "@/types/analysis";

let fontsLoaded: {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 600 | 700;
  style: "normal";
}[] | null = null;

async function loadFonts() {
  if (fontsLoaded) return fontsLoaded;

  const fontDir = path.join(process.cwd(), "public", "fonts");

  const [interRegular, interBold, poppinsBold, poppinsSemiBold, spaceGrotesk] =
    await Promise.all([
      readFile(path.join(fontDir, "Inter-Regular.ttf")),
      readFile(path.join(fontDir, "Inter-Bold.ttf")),
      readFile(path.join(fontDir, "Poppins-Bold.ttf")),
      readFile(path.join(fontDir, "Poppins-SemiBold.ttf")),
      readFile(path.join(fontDir, "SpaceGrotesk-Bold.ttf")),
    ]);

  fontsLoaded = [
    { name: "Inter", data: interRegular.buffer as ArrayBuffer, weight: 400, style: "normal" },
    { name: "Inter", data: interBold.buffer as ArrayBuffer, weight: 700, style: "normal" },
    { name: "Poppins", data: poppinsSemiBold.buffer as ArrayBuffer, weight: 600, style: "normal" },
    { name: "Poppins", data: poppinsBold.buffer as ArrayBuffer, weight: 700, style: "normal" },
    { name: "Space Grotesk", data: spaceGrotesk.buffer as ArrayBuffer, weight: 700, style: "normal" },
  ];

  return fontsLoaded;
}

async function renderSingleAd(
  task: ContentTask,
  palette: ColorPalette,
  size: AdSize
): Promise<string> {
  const fonts = await loadFonts();
  const element = renderTemplate(task.template, task, palette, size.width, size.height);

  const svg = await satori(element, {
    width: size.width,
    height: size.height,
    fonts,
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size.width },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return Buffer.from(pngBuffer).toString("base64");
}

// Render a subset of sizes for speed - the most important ones
const DEFAULT_SIZES = AD_SIZES.filter((s) =>
  ["Square", "Landscape", "Story"].includes(s.label)
);

export async function renderAdsForTask(
  task: ContentTask,
  brand: BrandProfile
): Promise<
  { variant: string; sizeLabel: string; platform: string; imageData: string }[]
> {
  const palettes = generatePalettes(
    brand.primaryColor,
    brand.secondaryColor,
    brand.accentColor
  );

  const results: {
    variant: string;
    sizeLabel: string;
    platform: string;
    imageData: string;
  }[] = [];

  for (const adVariant of AD_VARIANTS) {
    const palette = palettes[adVariant.style];
    for (const size of DEFAULT_SIZES) {
      const imageData = await renderSingleAd(task, palette, size);
      results.push({
        variant: adVariant.label,
        sizeLabel: size.label,
        platform: size.platform,
        imageData,
      });
    }
  }

  return results;
}

export async function renderSingleAdVariant(
  task: ContentTask,
  brand: BrandProfile,
  variant: "dark" | "light" | "gradient",
  size: AdSize
): Promise<string> {
  const palettes = generatePalettes(
    brand.primaryColor,
    brand.secondaryColor,
    brand.accentColor
  );
  return renderSingleAd(task, palettes[variant], size);
}
