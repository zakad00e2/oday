import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outputDir = path.join(root, "public", "optimized");

const jobs = [
  { input: "public/clear.png", output: "clear-hero.avif", width: 1920, format: "avif", options: { quality: 42, effort: 7 } },
  { input: "public/cover.png", output: "cover-cta.avif", width: 1920, format: "avif", options: { quality: 40, effort: 7 } },
  { input: "public/logo.png", output: "logo.webp", width: 320, format: "webp", options: { quality: 82, effort: 6 } },
  { input: "public/pakg.jpeg", output: "package-card.webp", width: 1200, format: "webp", options: { quality: 64, effort: 6 } },
  { input: "public/contact-us.jpg", output: "contact-card.webp", width: 1200, format: "webp", options: { quality: 64, effort: 6 } },
  { input: "public/fpi.jpg", output: "airport-card.webp", width: 1200, format: "webp", options: { quality: 64, effort: 6 } },
  { input: "public/about2.jpeg", output: "about-experience.webp", width: 1600, format: "webp", options: { quality: 64, effort: 6 } },
  { input: "public/WhatsApp Image 2026-02-27 at 8.28.18 PM (1).jpeg", output: "sharm-activities.webp", width: 1600, format: "webp", options: { quality: 64, effort: 6 } },
  { input: "public/WhatsApp Image 2026-02-27 at 8.28.18 PM.jpeg", output: "gallery-1.webp", width: 1200, format: "webp", options: { quality: 62, effort: 6 } },
  { input: "public/WhatsApp Image 2026-02-27 at 8.28.18 PM (1).jpeg", output: "gallery-2.webp", width: 1200, format: "webp", options: { quality: 62, effort: 6 } },
  { input: "public/WhatsApp Image 2026-02-27 at 8.28.18 PM (2).jpeg", output: "gallery-3.webp", width: 1200, format: "webp", options: { quality: 62, effort: 6 } },
  { input: "public/WhatsApp Image 2026-02-27 at 8.28.19 PM.jpeg", output: "gallery-4.webp", width: 1200, format: "webp", options: { quality: 62, effort: 6 } },
  { input: "public/WhatsApp Image 2026-02-27 at 8.28.19 PM (1).jpeg", output: "gallery-5.webp", width: 1200, format: "webp", options: { quality: 62, effort: 6 } },
  { input: "public/WhatsApp Image 2026-02-27 at 8.28.19 PM (2).jpeg", output: "gallery-6.webp", width: 1200, format: "webp", options: { quality: 62, effort: 6 } },
  { input: "public/WhatsApp Image 2026-02-27 at 8.28.19 PM (3).jpeg", output: "gallery-7.webp", width: 1200, format: "webp", options: { quality: 62, effort: 6 } },
  { input: "public/WhatsApp Image 2026-02-27 at 8.28.19 PM (4).jpeg", output: "gallery-8.webp", width: 1200, format: "webp", options: { quality: 62, effort: 6 } },
  { input: "public/WhatsApp Image 2026-02-27 at 8.28.20 PM.jpeg", output: "gallery-9.webp", width: 1200, format: "webp", options: { quality: 62, effort: 6 } },
  { input: "public/images/about/team.png", output: "about-team.avif", width: 1440, format: "avif", options: { quality: 48, effort: 7 } },
  { input: "public/images/about/activities.png", output: "about-activities.avif", width: 1440, format: "avif", options: { quality: 48, effort: 7 } },
];

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

await fs.mkdir(outputDir, { recursive: true });

for (const job of jobs) {
  const inputPath = path.join(root, job.input);
  const outputPath = path.join(outputDir, job.output);
  const transformer = sharp(inputPath).rotate().resize({ width: job.width, withoutEnlargement: true });

  if (job.format === "avif") {
    await transformer.avif(job.options).toFile(outputPath);
  } else {
    await transformer.webp(job.options).toFile(outputPath);
  }

  const [before, after] = await Promise.all([fs.stat(inputPath), fs.stat(outputPath)]);
  const saved = (((before.size - after.size) / before.size) * 100).toFixed(1);
  console.log(`${job.output}: ${formatSize(before.size)} -> ${formatSize(after.size)} (${saved}% smaller)`);
}
