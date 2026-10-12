const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const output = path.resolve('.codex/destination-verification');
const labels = { ar: { sharm: 'شرم الشيخ', hurghada: 'الغردقة', gouna: 'الجونة', back: 'العودة إلى الوجهات' }, en: { sharm: 'Sharm El Sheikh', hurghada: 'Hurghada', gouna: 'El Gouna', back: 'Back to destinations' } };
const names = { ar: 'عنصر تجريبي', en: 'Fixture entry' };
function fixture(kind, destination, id, deleted = false) {
  const translations = ['ar', 'en'].map(language => ({ language, name: names[language] + ' ' + id, title: names[language] + ' ' + id, slug: 'fixture-' + id, description: 'Verification fixture', subtitle: 'Verification fixture', duration: '2 hours', facilities: [], Facilities: [] }));
  const common = { id, is_deleted: deleted, translations, assets: [], rooms: [], options: [], addons: [] };
  return kind === 'hotels'
    ? { ...common, destination, initial_price: '100', original_price: '100', stars: 'FIVE', rating: 'TOP_RATED', is_discounted: false, discount_percentage: '0' }
    : { ...common, city: destination, slug: 'fixture-' + id, price: '100', start_time: '08:00', end_time: '10:00' };
}
async function main() {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/zeka1/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe' });
  const results = [];
  try {
    for (const lang of ['ar', 'en']) for (const kind of ['hotels', 'trips']) for (const scenario of ['mixed', 'empty', 'deleted-only']) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      const consoleErrors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
      const data = scenario === 'mixed' ? [fixture(kind, 'SHARM_EL_SHEIKH', '1'), fixture(kind, 'SHARM_EL_SHEIKH', '2'), fixture(kind, 'EL_GHARDQA', '3'), fixture(kind, 'EL_GOUNA', '4', true)] : scenario === 'deleted-only' ? [fixture(kind, 'EL_GOUNA', '4', true)] : [];
      let requestCount = 0;
      await context.route(/https:\/\/oday-tourisim-production\.up\.railway\.app\/(hotel|trip)(\?|$)/, async route => {
        requestCount++;
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data, meta: { total: data.length, page: 1, limit: 100, totalPages: 1 } }) });
      });
      await page.goto(`http://localhost:3000/${lang}/${kind}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      const section = page.locator('#' + kind);
      await section.waitFor();
      await section.scrollIntoViewIfNeeded();
      const destinationCards = section.locator('button').filter({ hasText: kind === 'hotels' ? /عرض الفنادق|View hotels/ : /عرض الرحلات|View trips/ });
      if (scenario === 'mixed') {
        await destinationCards.first().waitFor({ timeout: 30000 });
        assert.equal(await destinationCards.count(), 2, 'Only populated destinations appear');
        assert.ok((await destinationCards.allTextContents()).some(t => t.includes(labels[lang].sharm)));
        assert.ok((await destinationCards.allTextContents()).some(t => t.includes(labels[lang].hurghada)));
        assert.equal(await destinationCards.filter({ hasText: labels[lang].gouna }).count(), 0, 'Deleted-only destination hidden');
        await destinationCards.filter({ hasText: labels[lang].sharm }).click();
        await section.getByRole('heading', { name: names[lang] + ' 1', exact: true }).waitFor();
        assert.equal(await section.getByRole('heading', { name: names[lang] + ' 2', exact: true }).count(), 1);
        assert.equal(await section.getByRole('heading', { name: names[lang] + ' 3', exact: true }).count(), 0, 'Other destination entry hidden');
        await section.getByRole('button', { name: labels[lang].back, exact: true }).click();
        await destinationCards.first().waitFor();
        assert.equal(await destinationCards.count(), 2, 'Back restores filtered destinations');
        await page.screenshot({ path: path.join(output, `${lang}-${kind}-desktop.png`) });
        await page.setViewportSize({ width: 390, height: 844 });
        await section.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'No mobile horizontal overflow');
        const mobileBoxes = await destinationCards.evaluateAll(cards => cards.map(card => { const b = card.getBoundingClientRect(); return { x: b.x, width: b.width, height: b.height }; }));
        assert.ok(mobileBoxes.every(box => box.x >= 0 && box.x + box.width <= 391 && box.height >= 44), 'Mobile cards fit viewport');
        await page.screenshot({ path: path.join(output, `${lang}-${kind}-mobile.png`) });
      } else {
        const explanation = lang === 'ar' ? (kind === 'hotels' ? 'ستظهر الوجهات هنا عند إضافة فنادق إليها.' : 'ستظهر الوجهات هنا عند إضافة رحلات إليها.') : `Destinations will appear here when ${kind} are added to them.`;
        await section.getByText(explanation, { exact: true }).waitFor();
        assert.equal(await destinationCards.count(), 0, 'No cards for empty/deleted-only dataset');
        await page.screenshot({ path: path.join(output, `${lang}-${kind}-${scenario}.png`) });
      }
      assert.ok(requestCount > 0, 'Controlled API response used');
      assert.deepEqual(errors, [], 'No browser runtime errors');
      results.push({ lang, kind, scenario, passed: true, requestCount, runtimeErrors: errors, consoleErrors });
      console.log(JSON.stringify(results[results.length - 1]));
      await context.close();
    }
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify({ passed: true, method: 'Bundled Playwright fallback; Expect MCP unavailable', results }, null, 2));
    console.log(JSON.stringify({ passed: true, cases: results.length, output }));
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
