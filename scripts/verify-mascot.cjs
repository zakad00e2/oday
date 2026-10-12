// Run with playwright and sharp installed (or provided through NODE_PATH).
/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS resolves bundled test tools through NODE_PATH. */
const { chromium } = require("playwright");
const sharp = require("sharp");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const digest = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const baseURL = process.env.MASCOT_BASE_URL || "http://localhost:3000";

async function main() {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.MASCOT_BROWSER_PATH || undefined });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (/WebGL|context/i.test(message.text())) console.log(message.type(), message.text());
  });
  const output = path.resolve(".codex/mascot-verification");
  await fs.mkdir(output, { recursive: true });
  try {
    await page.goto(`${baseURL}/ar`, { waitUntil: "domcontentloaded" });
    const mascot = page.locator("[data-oday-mascot]");
    const canvas = mascot.locator("canvas");
    await page.waitForSelector('[data-oday-mascot][data-renderer="webgl"]', { timeout: 60000 });
    assert.equal(await mascot.count(), 1);
    const before = await mascot.boundingBox();
    await page.evaluate(() => window.scrollTo(0, 1600));
    await page.waitForTimeout(1000);
    assert.deepEqual(await mascot.boundingBox(), before, "The mascot stays fixed during scroll");
    assert.ok(before.x < 25 && before.width <= 140 && before.y + before.height <= 1000, "Smaller desktop mascot stays bottom-left");
    const a = await canvas.screenshot();
    await page.waitForTimeout(500);
    const b = await canvas.screenshot();
    assert.notEqual(digest(a), digest(b), "The actual rendered canvas animates");
    const point = await mascot.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return document.elementFromPoint(r.right + 8, r.top + 40)?.closest('[data-oday-mascot]') === null;
    });
    assert.ok(point, "The widget does not intercept clicks outside its bounds");
    await mascot.locator("button").click();
    await mascot.locator("button").focus();
    await page.keyboard.press("Enter");
    await page.screenshot({ path: path.join(output, "desktop-ar.png") });

    // Capture a matching transparent first-paint/fallback asset from the real 3D model.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(250);
    await mascot.evaluate((el) => { el.style.width = "552px"; el.style.height = "696px"; });
    await page.waitForTimeout(300);
    const posterPath = path.resolve("public/images/mascot/oday-passport.png");
    await fs.mkdir(path.dirname(posterPath), { recursive: true });
    const originalParent = await mascot.evaluateHandle((el) => el.parentNode);
    await mascot.evaluate((el) => document.body.appendChild(el));
    const poster = await canvas.screenshot({ omitBackground: true, style: 'html, body { background: transparent !important; } body > :not([data-oday-mascot]) { display: none !important; } [data-oday-mascot] > span { display: none !important; }' });
    const { data, info } = await sharp(poster).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let visiblePixels = 0;
    let transparentPixels = 0;
    for (let i = 3; i < data.length; i += info.channels) {
      if (data[i] > 0) visiblePixels++;
      if (data[i] === 0) transparentPixels++;
    }
    assert.ok(visiblePixels > 10000 && transparentPixels > 10000, `The model is visible with actual transparent surroundings: visible=${visiblePixels}, transparent=${transparentPixels}`);
    await fs.writeFile(posterPath, poster);
    await mascot.evaluate((el) => { el.style.removeProperty("width"); el.style.removeProperty("height"); });
    await page.waitForTimeout(300);
    const still1 = await canvas.screenshot({ omitBackground: true, style: 'html, body { background: transparent !important; } body > :not([data-oday-mascot]) { display: none !important; } [data-oday-mascot] > span { display: none !important; }' });
    await page.waitForTimeout(500);
    const still2 = await canvas.screenshot({ omitBackground: true, style: 'html, body { background: transparent !important; } body > :not([data-oday-mascot]) { display: none !important; } [data-oday-mascot] > span { display: none !important; }' });
    assert.equal(digest(still1), digest(still2), "Reduced motion produces a stable canvas");
    await originalParent.evaluate((parent) => parent.appendChild(document.querySelector('[data-oday-mascot]')));
    await originalParent.dispose();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    const mobile = await mascot.boundingBox();
    assert.ok(mobile.x < 15 && mobile.width <= 90 && mobile.y + mobile.height <= 844, "Smaller mobile size and bottom-left placement");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "No mobile horizontal overflow");
    await page.screenshot({ path: path.join(output, "mobile-ar.png") });
    await page.goto(`${baseURL}/en/about`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('[data-oday-mascot][data-renderer="webgl"]', { timeout: 60000 });
    assert.equal(await mascot.locator("button").getAttribute("aria-label"), "Wave to your travel buddy");
    assert.ok((await mascot.boundingBox()).x < 15, "English layout also anchors on the physical left");
    await page.screenshot({ path: path.join(output, "mobile-en.png") });

    const contextExtension = await canvas.evaluateHandle((el) => el.getContext("webgl2")?.getExtension("WEBGL_lose_context"));
    assert.ok(await contextExtension.evaluate((extension) => Boolean(extension)), "Context-loss simulation is supported");
    await contextExtension.evaluate((extension) => extension.loseContext());
    await page.waitForSelector('[data-oday-mascot][data-renderer="poster"]');
    await page.screenshot({ path: path.join(output, "webgl-fallback.png") });
    await page.waitForTimeout(1000);
    await contextExtension.evaluate((extension) => extension.restoreContext());
    await page.waitForSelector('[data-oday-mascot][data-renderer="webgl"]');
    await contextExtension.dispose();
    assert.deepEqual(errors, [], "No browser runtime errors");
    console.log(JSON.stringify({ passed: true, desktop: before, mobile, visiblePixels, transparentPixels, errors, output, posterPath }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
