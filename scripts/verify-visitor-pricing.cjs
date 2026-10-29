/* eslint-disable @typescript-eslint/no-require-imports */
// Run against the local dev server. All browser remote traffic is intercepted.
// NODE_PATH=<Playwright package parent> VISITOR_PRICING_BASE_URL=http://localhost:3100 node scripts/verify-visitor-pricing.cjs
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const fixture = require('./fixtures/visitor-pricing.cjs');
const baseURL = process.env.VISITOR_PRICING_BASE_URL || 'http://localhost:3100';
const output = path.resolve('.superpowers/sdd/2026-10-26-visitor-pricing');
const clone = value => JSON.parse(JSON.stringify(value));
const key = 'oday-visitor-category-v1';

async function main() {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: process.env.VISITOR_PRICING_BROWSER_PATH || undefined });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  const errors = [], requests = [], passes = [], failures = [], blocked = [], geometries = [];
  let hotel = clone(fixture.hotel), trip = clone(fixture.trip), retainEgp = true;
  const json = (route, payload) => route.fulfill({ contentType: 'application/json', body: JSON.stringify(payload), headers: { 'access-control-allow-origin': '*' } });
  const jpeg = await fs.readFile(path.resolve('public/images/hurghada.jpg'));
  await context.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.origin === new URL(baseURL).origin) {
      if (url.pathname === '/_next/image' && url.searchParams.get('url')?.startsWith('https://ik.imagekit.io/verification/')) return route.fulfill({ contentType: 'image/jpeg', body: jpeg });
      return route.continue();
    }
    if (url.hostname === 'oday-tourisim-production.up.railway.app') {
      const item = { method: request.method(), path: url.pathname, body: request.postData() || '', contentType: request.headers()['content-type'] || '' };
      requests.push(item);
      if (item.method === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': '*', 'access-control-allow-headers': '*' } });
      const isHotel = url.pathname.startsWith('/hotel'), isTrip = url.pathname.startsWith('/trip');
      if (isHotel || isTrip) {
        const record = isHotel ? hotel : trip;
        if (item.method === 'GET') return json(route, url.pathname === (isHotel ? '/hotel' : '/trip') ? { data: [record], meta: { page: 1, limit: 100, total: 1, totalPages: 1 } } : record);
        if (!['POST', 'PATCH', 'DELETE'].includes(item.method)) throw new Error(`Unexpected fixture mutation ${item.method}`);
        const next = clone(record);
        const fields = {};
        for (const match of item.body.matchAll(/name="([^"]+)"\r\n\r\n([\s\S]*?)\r\n--/g)) fields[match[1]] = match[2];
        item.fields = fields;
        for (const name of ['initial_price', 'initial_price_egp', 'original_price', 'original_price_egp', 'price', 'price_egp', 'slug', 'start_time', 'end_time']) if (name in fields) next[name] = fields[name];
        for (const name of ['translations', 'rooms', 'options', 'addons']) if (name in fields) next[name] = JSON.parse(fields[name]);
        if (!retainEgp) { delete next.initial_price_egp; delete next.original_price_egp; delete next.price_egp; for (const name of ['rooms', 'options', 'addons']) next[name]?.forEach(entry => delete entry.price_egp); }
        if (isHotel) hotel = next; else trip = next;
        return json(route, next);
      }
      if (url.pathname === '/destination') return json(route, [{ destination: 'SHARM_EL_SHEIKH', image: null, hotels_count: 1, trips_count: 1 }]);
      if (item.method !== 'GET') { blocked.push(item); return route.abort(); }
      return json(route, []);
    }
    if (url.hostname === 'ik.imagekit.io') return route.fulfill({ contentType: 'image/jpeg', body: jpeg });
    if (request.resourceType() === 'image') return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="182" height="50"><rect width="182" height="50" fill="#f8fafc"/><text x="91" y="30" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#64748b">Local asset fixture</text></svg>' });
    blocked.push({ method: request.method(), url: request.url() });
    return route.abort();
  });
  await context.addInitScript(() => {
    window.__inquiries = []; window.__residenceOpenEvents = [];
    window.open = url => { window.__inquiries.push(String(url)); return { closed: false, opener: null }; };
    new MutationObserver(records => { for (const record of records) if (record.type === 'attributes' && record.target.tagName === 'DIALOG' && record.target.open) window.__residenceOpenEvents.push(record.target.textContent); }).observe(document, { attributes: true, attributeFilter: ['open'], subtree: true });
  });
  page.on('pageerror', error => errors.push(error.message));
  const check = async (name, fn) => {
    const failuresBefore = failures.length;
    try { await fn(); passes.push(name); console.log(`PASS ${name}`); }
    catch (error) { failures.push({ name, error: error.stack }); console.log(`FAIL ${name}: ${error.message}`); await page.screenshot({ path: path.join(output, `failure-${failures.length}.png`), fullPage: true }).catch(() => {}); }
    finally {
      if (failures.length > failuresBefore && process.env.VISITOR_RESIDENCE_RED !== '1' && process.env.VISITOR_RESIDENCE_VISUAL_RED !== '1') {
        const recoveryChoice = page.locator('dialog[open] [data-visitor-category="egyptian-resident"]');
        if (await recoveryChoice.isVisible()) await recoveryChoice.click();
      }
      retainEgp = true; await page.setViewportSize({ width: 1440, height: 1000 });
    }
  };
  const goto = async url => { await page.goto(`${baseURL}${url}`, { waitUntil: 'domcontentloaded' }); };
  const dialog = () => page.getByRole('dialog', { name: /أهلًا بك في|Welcome to/ });
  const editResidence = () => page.locator('nav button[aria-label]:visible').filter({ has: page.locator('svg.lucide-map-pin') });
  const chooseCategory = async (category, target = page) => {
    const modal = target.getByRole('dialog', { name: /أهلًا بك في|Welcome to/ });
    if (!await modal.isVisible()) await target.locator('nav button[aria-label]:visible').filter({ has: target.locator('svg.lucide-map-pin') }).click();
    await modal.locator(`[data-visitor-category="${category}"]`).click(); await modal.waitFor({ state: 'hidden' });
  };
  const headerResidenceControl = async () => {
    assert.equal(await page.locator('nav select,header select,nav [data-visitor-category],header [data-visitor-category]').count(), 0);
    assert.equal(await page.locator('nav button[aria-label]:visible').filter({ has: page.locator('svg.lucide-map-pin') }).count(), 1);
  };
  const assertReferenceGeometry = async locale => {
    const geometry = await dialog().evaluate(element => {
      const bounds = item => { const rect = item.getBoundingClientRect(); return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, right: rect.right }; };
      const image = element.querySelector('img');
      return { dialog: bounds(element), viewport: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth,
        headingAlign: getComputedStyle(element.querySelector('h2')).textAlign,
        hero: image ? bounds(image.parentElement) : null,
        cards: [...element.querySelectorAll('[data-visitor-category]')].map(card => {
          const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT); let node, title;
          while ((node = walker.nextNode())) if (node.textContent.trim()) { const range = document.createRange(); range.selectNodeContents(node); title = bounds(range); break; }
          return { bounds: bounds(card), cursor: getComputedStyle(card).cursor, title, icons: [...card.querySelectorAll(':scope > svg')].map(bounds), content: card.innerText,
            border: Number.parseFloat(getComputedStyle(card).borderTopWidth) };
        }) };
    });
    geometries.push({ locale, ...geometry });
    assert.equal(geometry.overflow, false, 'No horizontal page overflow');
    assert.ok(geometry.dialog.width <= Math.min(442, geometry.viewport - 30), 'Dialog respects compact 440px maximum and mobile side insets');
    assert.equal(geometry.headingAlign, 'center', 'Welcome heading is centered');
    assert.ok(geometry.hero && geometry.hero.height <= 114, 'Logo area stays compact');
    if (geometry.viewport >= 1024) assert.ok(geometry.dialog.height < 550, 'Desktop dialog is shorter than 550px');
    assert.equal(geometry.cards.length, 2);
    for (const card of geometry.cards) {
      assert.ok(card.border >= 1, 'Choice card has an outline'); assert.equal(card.icons.length, 2, 'Choice card has leading category icon and trailing chevron');
      assert.equal(card.cursor, 'pointer', 'Choice card uses a pointer cursor');
      assert.doesNotMatch(card.content, /\bUSD\b|\bEGP\b/, 'Choice cards have no currency badges');
      assert.doesNotMatch(card.content, /[\u{1F1E6}-\u{1FAFF}]/u, 'Choice cards have no emoji');
      const [leading, trailing] = card.icons;
      assert.ok(leading.width >= 24 && leading.height >= 24, 'Category icon is at least 24px');
      assert.ok(locale === 'ar' ? leading.x > trailing.x : leading.x < trailing.x, 'Leading icon and trailing chevron follow locale direction');
      assert.ok(card.title && (locale === 'ar' ? card.title.right <= leading.x + 2 && card.title.x >= trailing.right - 2 : card.title.x >= leading.right - 2 && card.title.right <= trailing.x + 2), 'Choice text sits between category icon and chevron');
      assert.ok(Math.abs((leading.y + leading.height / 2) - (trailing.y + trailing.height / 2)) <= 8, 'Icons share a vertical center');
      assert.ok(card.bounds.width >= geometry.dialog.width * 0.75, 'Choice cards fill the content width');
    }
  };
  const screenshot = async name => {
    const scrollY = await page.evaluate(() => window.scrollY);
    if (!page.url().includes('/admin/')) {
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let offset = 0; offset < height; offset += 650) { await page.evaluate(offset => window.scrollTo({ top: offset, behavior: 'instant' }), offset); await page.waitForTimeout(100); }
      await page.evaluate(scrollY => window.scrollTo({ top: scrollY, behavior: 'instant' }), scrollY); await page.waitForTimeout(800);
    }
    await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: true });
  };
  const text = () => page.locator('main').innerText();
  const mutationCount = () => requests.filter(item => !['GET', 'OPTIONS'].includes(item.method)).length;
  const field = label => page.locator('label').filter({ hasText: label }).first().locator('..').locator('input,textarea').first();
  const fillPair = async (label, usd, egp) => { await page.getByRole('spinbutton', { name: `${label} — USD`, exact: true }).fill(usd); await page.getByRole('spinbutton', { name: `${label} — EGP`, exact: true }).fill(egp); };
  const chooseDate = async placeholder => {
    await page.getByRole('button', { name: placeholder, exact: true }).click();
    const calendar = page.getByRole('button', { name: 'Next month', exact: true }).locator('../..');
    await calendar.getByRole('button', { name: /^\d+$/, exact: true }).filter({ visible: true }).and(page.locator(':not([disabled])')).first().click();
  };
  try {
    await goto('/ar');
    await check('Automatic prompt is limited to hotel and trip routes, including client navigation', async () => {
      await editResidence().waitFor();
      await page.waitForTimeout(500); // Observe delayed hydration before asserting absence.
      assert.equal(await dialog().isVisible(), false, 'Homepage remains accessible without a category');
      assert.deepEqual(await page.evaluate(() => window.__residenceOpenEvents), [], 'Homepage never flashes the prompt');
      await page.locator('nav a[href="/ar/hotels"]').filter({ visible: true }).click();
      await dialog().waitFor();
      await goto('/en/about'); await editResidence().waitFor();
      await page.waitForTimeout(500);
      assert.equal(await dialog().isVisible(), false, 'About page does not require a category');
      assert.deepEqual(await page.evaluate(() => window.__residenceOpenEvents), [], 'Unrelated page never flashes the prompt');
      await page.locator('nav a[href="/en/trips"]').filter({ visible: true }).click();
      await dialog().waitFor();
      await goto('/ar/hotels'); await dialog().waitFor();
    });
    if (process.env.VISITOR_ROUTE_RED === '1') { assert.deepEqual(failures, [], 'RED: route-limited pricing prompt is not implemented'); return; }
    await check('Compact residence dialog uses the existing site logo and centered welcome heading', async () => {
      await page.getByRole('img', { name: 'شعار عدي للسياحة', exact: true }).waitFor({ timeout: process.env.VISITOR_RESIDENCE_VISUAL_RED === '1' ? 5000 : 20000 });
      await page.waitForFunction(() => { const image = document.querySelector('dialog img'); return image?.complete && image.naturalWidth > 0; });
      await page.getByRole('dialog', { name: /أهلًا بك في|Welcome to/ }).getByRole('heading', { name: /أهلًا بك في|Welcome to/ }).waitFor();
      if (process.env.VISITOR_RESIDENCE_VISUAL_RED !== '1') await assertReferenceGeometry('ar');
    });
    if (process.env.VISITOR_RESIDENCE_VISUAL_RED === '1') { assert.deepEqual(failures, [], 'RED: reference residence design is not implemented'); return; }
    if (process.env.VISITOR_PRICING_PROBE === '1') {
      console.log(await page.locator('body').innerText());
      console.log(JSON.stringify(await page.locator('button,input,select').evaluateAll(elements => elements.map(element => ({ tag: element.tagName, text: element.textContent, label: element.getAttribute('aria-label'), type: element.getAttribute('type'), placeholder: element.getAttribute('placeholder') }))), null, 2));
      return;
    }
    await check('Arabic first entry automatically requires a native residence dialog, traps focus and rejects Escape/backdrop dismissal', async () => {
      await dialog().waitFor({ timeout: process.env.VISITOR_RESIDENCE_RED === '1' ? 5000 : 20000 });
      assert.equal(await dialog().evaluate(element => element.tagName), 'DIALOG'); await headerResidenceControl();
      assert.equal(await dialog().getByRole('button').count(), 2, 'Initial choice has no dismiss control');
      for (let index = 0; index < 6; index++) { await page.keyboard.press('Tab'); assert.ok(await dialog().evaluate(element => element.contains(document.activeElement)), `Keyboard focus remains inside modal after Tab ${index + 1}; active=${await page.evaluate(() => document.activeElement?.outerHTML.slice(0, 150))}`); }
      for (let index = 0; index < 3; index++) { await page.keyboard.press('Shift+Tab'); assert.ok(await dialog().evaluate(element => element.contains(document.activeElement)), 'Reverse keyboard focus remains inside modal'); }
      await page.keyboard.press('Escape'); assert.ok(await dialog().isVisible());
      await page.mouse.click(2, 2); assert.ok(await dialog().isVisible());
      await page.screenshot({ path: path.join(output, 'residence-first-entry-ar.png') });
      await chooseCategory('egyptian-resident'); assert.equal(await page.evaluate(key => localStorage.getItem(key), key), 'egyptian-resident');
    });
    if (process.env.VISITOR_RESIDENCE_RED === '1') { assert.deepEqual(failures, [], 'RED: first-entry residence modal contract is not implemented'); return; }
    await check('Saved residence persists across reload/locale; header editing can cancel', async () => {
      await page.reload({ waitUntil: 'domcontentloaded' }); await editResidence().waitFor(); assert.equal(await dialog().isVisible(), false); assert.deepEqual(await page.evaluate(() => window.__residenceOpenEvents), [], 'Saved choice never flashes an automatic modal'); await headerResidenceControl();
      await editResidence().click(); await dialog().waitFor(); await page.keyboard.press('Escape'); await dialog().waitFor({ state: 'hidden' }); assert.equal(await page.evaluate(key => localStorage.getItem(key), key), 'egyptian-resident');
      await goto('/en/trips/verification-trip'); await page.getByRole('heading', { name: 'Verification Trip', level: 1, exact: true }).waitFor(); assert.equal(await dialog().isVisible(), false); assert.match(await text(), /EGP 999\.5/); await headerResidenceControl();
      await editResidence().click(); await dialog().waitFor(); await page.screenshot({ path: path.join(output, 'residence-english-desktop.png') }); const closeButton = dialog().getByRole('button', { name: 'Cancel residence change', exact: true }); assert.equal(await closeButton.evaluate(element => getComputedStyle(element).cursor), 'pointer', 'Close button uses a pointer cursor'); await closeButton.click(); await dialog().waitFor({ state: 'hidden' }); assert.equal(await page.evaluate(key => localStorage.getItem(key), key), 'egyptian-resident');
      await page.evaluate(key => localStorage.removeItem(key), key); await goto('/en/hotels'); await dialog().waitFor(); await assertReferenceGeometry('en'); await page.screenshot({ path: path.join(output, 'residence-reference-en-desktop.png') }); await chooseCategory('egyptian-resident');
      await page.setViewportSize({ width: 390, height: 844 }); await chooseCategory('other'); await headerResidenceControl(); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.evaluate(key => localStorage.removeItem(key), key); await goto('/en/trips'); await dialog().waitFor(); await headerResidenceControl(); await assertReferenceGeometry('en'); await page.screenshot({ path: path.join(output, 'residence-first-entry-en-mobile.png') });
      await page.setViewportSize({ width: 320, height: 780 }); await assertReferenceGeometry('en'); await page.screenshot({ path: path.join(output, 'residence-reference-en-320.png') }); await page.setViewportSize({ width: 390, height: 844 }); await chooseCategory('other');
      await goto('/en/trips/verification-trip'); await page.getByRole('heading', { name: 'Verification Trip', level: 1, exact: true }).waitFor(); assert.equal(await dialog().isVisible(), false); assert.match(await text(), /\$80\.25/);
      await page.evaluate(key => localStorage.removeItem(key), key); await goto('/ar/trips'); await dialog().waitFor(); await headerResidenceControl(); await assertReferenceGeometry('ar'); await page.screenshot({ path: path.join(output, 'residence-first-entry-ar-mobile.png') });
      await page.setViewportSize({ width: 320, height: 780 }); await assertReferenceGeometry('ar'); await page.screenshot({ path: path.join(output, 'residence-reference-ar-320.png') }); await page.setViewportSize({ width: 390, height: 844 }); await chooseCategory('egyptian-resident');
      await page.setViewportSize({ width: 1440, height: 1000 });
    });
    await check('A second tab updates residence prices immediately and invalid removal requires a fresh choice', async () => {
      await goto('/en/trips/verification-trip'); await page.getByRole('heading', { name: 'Verification Trip', level: 1, exact: true }).waitFor();
      const secondTab = await context.newPage(); secondTab.on('pageerror', error => errors.push(error.message));
      await secondTab.goto(`${baseURL}/en/trips/verification-trip`, { waitUntil: 'domcontentloaded' }); await secondTab.getByRole('heading', { name: 'Verification Trip', level: 1, exact: true }).waitFor();
      await chooseCategory('other', secondTab); await page.waitForFunction(() => document.querySelector('main')?.innerText.includes('$80.25')); assert.equal(await dialog().isVisible(), false);
      await secondTab.evaluate(key => localStorage.removeItem(key), key); await dialog().waitFor(); await page.keyboard.press('Escape'); assert.ok(await dialog().isVisible());
      await chooseCategory('egyptian-resident'); await secondTab.close();
    });
    await check('Trip decimal unit prices, option/addon quantities, cart persistence and currency switch', async () => {
      await goto('/en/trips/verification-trip'); await page.getByRole('heading', { name: 'Verification Trip', level: 1, exact: true }).waitFor();
      await chooseCategory('other'); assert.match(await text(), /\$80\.25/);
      const option = page.getByRole('checkbox').filter({ hasText: 'Verification Option' }).first();
      await option.getByRole('button', { name: '+', exact: true }).click();
      const addon = page.getByRole('checkbox').filter({ hasText: 'Verification Addon' }).first();
      await addon.click(); await addon.getByRole('button', { name: '+', exact: true }).click();
      assert.match(await text(), /\$172/);
      await chooseDate('Select trip date');
      await page.getByRole('button', { name: /Add to.*[Pp]lan/ }).click();
      await page.waitForFunction(() => JSON.parse(localStorage.getItem('oday-cart') || '{}').trips?.length === 1);
      const cart = await page.evaluate(() => JSON.parse(localStorage.getItem('oday-cart')));
      assert.deepEqual(cart.trips[0].selectedOptions[0].prices, { USD: 80.25, EGP: 999.5 });
      assert.equal(cart.trips[0].selectedOptions[0].persons, 2);
      await goto('/en/checkout'); await page.locator('main').getByText('Verification Trip', { exact: true }).waitFor(); assert.match(await text(), /\$172/);
      await chooseCategory('egyptian-resident'); assert.match(await text(), /2,153\.5|2,153\.50/); await screenshot('checkout-egp-trip');
      await chooseCategory('other'); assert.match(await text(), /\$172/);
      await page.locator('form input[type="text"]').first().fill('Local Browser Test'); await page.locator('form input[type="tel"]').fill('+201000000000'); await page.locator('#agreement').check(); await page.locator('form button[type="submit"]').click();
      const inquiry = await page.evaluate(() => window.__inquiries.at(-1)); const message = new URL(inquiry).searchParams.get('text'); assert.match(message, /Pricing currency: USD/); assert.match(message, /\$172/); assert.doesNotMatch(message, /[Oo]n request/);
      await fs.writeFile(path.join(output, 'inquiry-usd.txt'), message);
    });
    await check('Hotel rooms, addon, two nights and two rooms preserve both price sets', async () => {
      await goto('/en/hotels/verification-hotel'); await page.getByRole('heading', { name: 'Verification Hotel', level: 1, exact: true }).waitFor();
      await chooseCategory('other');
      const room = page.locator('[role="button"]').filter({ hasText: 'Verification Room' }).first();
      const increment = room.getByRole('button', { name: '+', exact: true });
      await increment.click();
      await page.getByRole('button').filter({ hasText: 'Verification Breakfast' }).click();
      await chooseCategory('egyptian-resident'); assert.match(await text(), /3,252/);
      await chooseCategory('other');
      await page.locator('label').filter({ hasText: 'Check-out date' }).getByRole('button').click();
      const calendar = page.getByRole('button', { name: 'Next month', exact: true }).locator('../..');
      await calendar.getByRole('button', { name: /^\d+$/, exact: true }).and(page.locator(':not([disabled])')).nth(1).click();
      await page.getByRole('button', { name: /Add to.*[Pp]lan/ }).click();
      await page.waitForFunction(() => JSON.parse(localStorage.getItem('oday-cart') || '{}').hotel !== null);
      const cart = await page.evaluate(() => JSON.parse(localStorage.getItem('oday-cart')));
      assert.deepEqual(cart.hotel.selectedRooms[0].prices, { USD: 100.25, EGP: 1500.75 });
      assert.equal(cart.hotel.selectedRooms[0].count, 2);
      assert.equal(cart.nights, 2);
      await goto('/en/checkout'); await page.locator('main').getByText('Verification Hotel', { exact: true }).waitFor(); await chooseCategory('egyptian-resident');
      assert.match(await text(), /ج\.م|EGP/); await screenshot('checkout-egp-hotel-trip');
    });
    await check('Same-name same-USD trip options retain the selected ID and independent EGP price across navigation/reload', async () => {
      trip = clone(fixture.trip); trip.options.push({ ...clone(trip.options[0]), id: 'option-b', price_egp: '1500.25' });
      await page.evaluate(({ key }) => { localStorage.setItem(key, 'egyptian-resident'); localStorage.removeItem('oday-cart'); }, { key });
      await goto('/en/trips/verification-trip'); await page.getByRole('heading', { name: 'Verification Trip', level: 1, exact: true }).waitFor();
      const options = page.getByRole('checkbox').filter({ hasText: 'Verification Option' }); assert.equal(await options.count(), 2);
      await options.nth(0).click(); await options.nth(1).click(); await options.nth(1).getByRole('button', { name: '+', exact: true }).click();
      await chooseDate('Select trip date'); await page.getByRole('button', { name: /Add to.*[Pp]lan/ }).click();
      await page.waitForFunction(() => JSON.parse(localStorage.getItem('oday-cart') || '{}').trips?.[0]?.selectedOptions?.[0]?.id === 'option-b');
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('oday-cart')).trips[0]); assert.deepEqual(saved.selectedOptions[0].prices, { USD: 80.25, EGP: 1500.25 }); assert.equal(saved.selectedOptions[0].persons, 2);
      await goto('/en/checkout'); await page.locator('main').getByText('Verification Trip', { exact: true }).waitFor(); assert.match(await text(), /EGP 3,000\.5/);
      await goto('/en/trips/verification-trip'); await page.getByRole('heading', { name: 'Verification Trip', level: 1, exact: true }).waitFor();
      await page.waitForFunction(() => { const choices = [...document.querySelectorAll('[role="checkbox"]')]; return choices[0]?.getAttribute('aria-checked') === 'false' && choices[1]?.getAttribute('aria-checked') === 'true'; });
      await page.reload({ waitUntil: 'domcontentloaded' }); await page.getByRole('heading', { name: 'Verification Trip', level: 1, exact: true }).waitFor();
      await page.waitForFunction(() => { const choices = [...document.querySelectorAll('[role="checkbox"]')]; return choices[0]?.getAttribute('aria-checked') === 'false' && choices[1]?.getAttribute('aria-checked') === 'true'; });
      assert.match(await options.nth(1).innerText(), /EGP 1,500\.25/); assert.match(await text(), /EGP 3,000\.5/); trip = clone(fixture.trip);
    });
    await check('Legacy cart stays visible with incomplete EGP total and quote inquiry, never free', async () => {
      await page.evaluate(({ key, cart }) => { localStorage.setItem(key, 'egyptian-resident'); localStorage.setItem('oday-cart', JSON.stringify(cart)); }, { key, cart: fixture.legacyCart });
      await goto('/en/checkout'); await page.getByText('Legacy Trip', { exact: true }).first().waitFor();
      assert.match(await text(), /[Oo]n request/); assert.doesNotMatch(await text(), /\bFree\b/);
      await page.locator('form input[type="text"]').first().fill('Local Browser Test');
      await page.locator('form input[type="tel"]').fill('+201000000000');
      await page.locator('#agreement').check(); await page.locator('form button[type="submit"]').click();
      const inquiry = await page.evaluate(() => window.__inquiries.at(-1)); assert.ok(inquiry, 'window.open captured without a popup or message');
      const message = new URL(inquiry).searchParams.get('text'); assert.match(message, /EGP/); assert.match(message, /[Oo]n request/); assert.match(message, /Egyptian or valid Egyptian residency holder/);
      await fs.writeFile(path.join(output, 'inquiry-egp.txt'), message); await screenshot('checkout-legacy-egp');
    });
    await check('One missing addon price makes the complete total on request, without a partial amount', async () => {
      const cart = clone(fixture.legacyCart);
      cart.trips[0].selectedOptions[0].prices = { USD: 50, EGP: 500.25 };
      await page.evaluate(cart => localStorage.setItem('oday-cart', JSON.stringify(cart)), cart);
      await goto('/en/checkout'); await page.getByText('Legacy Trip', { exact: true }).first().waitFor();
      const total = page.locator('main').getByText(/Estimated total/i, { exact: true }).locator('..').last();
      assert.match(await total.innerText(), /[Oo]n request/); assert.doesNotMatch(await total.innerText(), /1,000\.5/);
      await screenshot('checkout-partially-unpriced-egp');
    });
    await check('Catalog missing EGP options/addons stay on request and never appear free', async () => {
      delete trip.price_egp; delete trip.options[0].price_egp; delete trip.addons[0].price_egp;
      await goto('/en/trips/verification-trip'); await page.getByRole('heading', { name: 'Verification Trip', level: 1, exact: true }).waitFor();
      await chooseCategory('egyptian-resident'); assert.match(await text(), /[Oo]n request/); assert.doesNotMatch(await text(), /\bFree\b/);
      await screenshot('trip-missing-egp'); trip = clone(fixture.trip);
    });
    await check('Admin hotel create dual fields, empty/negative validation and decimal multipart payload', async () => {
      await page.evaluate(() => localStorage.setItem('oday-admin-token', 'local-fixture-token'));
      await goto('/admin/hotels'); await page.getByRole('button', { name: 'إضافة فندق', exact: true }).click();
      await field('اسم الفندق بالعربي').fill('فندق اختبار محلي'); await field('Hotel name in English').fill('Local Test Hotel');
      await page.getByPlaceholder('hotel-name-slug').fill('local-test-hotel');
      await page.locator('label').filter({ hasText: 'نظام الوجبات' }).locator('..').locator('select').selectOption('BREAKFAST_ONLY');
      const save = page.getByRole('button', { name: 'إضافة الفندق', exact: true });
      let before = mutationCount(); await save.click(); assert.equal(mutationCount(), before); await page.getByText(/أدخل سعر الدولار وسعر الجنيه/).waitFor();
      await fillPair('السعر الابتدائي / ليلة', '-1', '1200.75'); await save.click(); assert.equal(mutationCount(), before);
      await fillPair('السعر الابتدائي / ليلة', '25.50', '1200.75');
      await page.getByPlaceholder('اسم الغرفة بالعربي').fill('غرفة محلية'); await page.getByPlaceholder('Room name in English').fill('Local room');
      await fillPair('سعر الغرفة / ليلة', '40.25', ''); await page.getByRole('button', { name: '+ إضافة غرفة', exact: true }).click(); await page.getByText('أدخل سعر الدولار وسعر الجنيه بقيم صحيحة غير سالبة.', { exact: true }).waitFor();
      await fillPair('سعر الغرفة / ليلة', '40.25', '2000.50'); await page.getByRole('button', { name: '+ إضافة غرفة', exact: true }).click();
      await page.getByPlaceholder('اسم الإضافة بالعربي').fill('إضافة محلية'); await page.getByPlaceholder('Add-on name in English').fill('Local addon');
      await fillPair('سعر إضافة الغرفة / ليلة', '5.25', '77.75'); await page.getByRole('button', { name: '+ إضافة إضافة غرفة', exact: true }).click();
      await screenshot('admin-hotel-dual-prices'); await save.click();
      await page.waitForFunction(() => ![...document.querySelectorAll('h2')].some(item => item.textContent === 'إضافة فندق جديد'));
      const request = requests.filter(item => item.method === 'POST' && item.path === '/hotel').at(-1); assert.ok(request);
      assert.equal(request.fields.initial_price, '25.5'); assert.equal(request.fields.initial_price_egp, '1200.75'); assert.equal(JSON.parse(request.fields.rooms)[0].price_egp, 2000.5); assert.equal(JSON.parse(request.fields.addons)[0].price_egp, 77.75);
    });
    await check('Admin hotel edit original dual fields and server missing-EGP warning', async () => {
      hotel = clone(fixture.hotel); await goto('/admin/hotels'); await page.getByRole('button', { name: 'تعديل', exact: true }).first().click();
      assert.equal(await page.getByRole('spinbutton', { name: 'السعر الابتدائي / ليلة — EGP', exact: true }).inputValue(), '1500.75');
      assert.equal(await page.getByRole('spinbutton', { name: 'السعر الأصلي قبل الخصم — EGP', exact: true }).inputValue(), '2000.5');
      await page.locator('section').filter({ hasText: 'أنواع الغرف' }).getByTitle('تعديل', { exact: true }).click();
      assert.equal(await page.getByRole('spinbutton', { name: 'سعر الغرفة / ليلة — USD', exact: true }).inputValue(), '100.25');
      assert.equal(await page.getByRole('spinbutton', { name: 'سعر الغرفة / ليلة — EGP', exact: true }).inputValue(), '1500.75');
      await page.locator('section').filter({ hasText: 'إضافات الغرف' }).getByTitle('تعديل', { exact: true }).click();
      assert.equal(await page.getByRole('spinbutton', { name: 'سعر إضافة الغرفة / ليلة — EGP', exact: true }).inputValue(), '125.25');
      await fillPair('السعر الابتدائي / ليلة', '101.25', '1550.75'); retainEgp = false;
      await page.getByRole('button', { name: 'حفظ التعديلات', exact: true }).click(); await page.getByText(/لم يؤكد حفظ أسعار الجنيه/).waitFor();
      assert.equal(await page.getByRole('spinbutton', { name: 'السعر الابتدائي / ليلة — EGP', exact: true }).inputValue(), '1550.75'); await screenshot('admin-hotel-integration-warning'); retainEgp = true;
    });
    await check('Admin trip create dual base/options/addons, empty/negative validation and decimals', async () => {
      await goto('/admin/trips'); await page.getByRole('button', { name: 'إضافة رحلة', exact: true }).click();
      await field('العنوان بالعربي').fill('رحلة اختبار محلي'); await field('العنوان بالإنجليزي').fill('Local Test Trip'); await page.getByPlaceholder('trip-name-slug').fill('local-test-trip');
      const save = page.getByRole('button', { name: 'إضافة الرحلة', exact: true }); const before = mutationCount(); await save.click(); assert.equal(mutationCount(), before); await page.getByText(/أدخل سعر الدولار وسعر الجنيه/).waitFor();
      await fillPair('السعر الابتدائي للرحلة', '33.25', '-1'); await save.click(); assert.equal(mutationCount(), before);
      await fillPair('السعر الابتدائي للرحلة', '33.251', '333.75'); await save.click(); assert.equal(mutationCount(), before);
      await fillPair('السعر الابتدائي للرحلة', '33.25', '333.75'); await page.locator('input[type="time"]').nth(0).fill('09:00'); await page.locator('input[type="time"]').nth(1).fill('12:00');
      await page.getByPlaceholder('الاسم بالعربي', { exact: true }).nth(0).fill('خيار محلي'); await page.getByPlaceholder('Name in English', { exact: true }).nth(0).fill('Local option');
      await fillPair('سعر خيار الرحلة', '11.25', '123.75'); await page.getByRole('button', { name: '+ إضافة خيار', exact: true }).click();
      await page.getByPlaceholder('الاسم بالعربي', { exact: true }).nth(1).fill('إضافة محلية'); await page.getByPlaceholder('Name in English', { exact: true }).nth(1).fill('Local addon');
      await fillPair('سعر إضافة الرحلة', '0', '0'); await page.getByRole('button', { name: '+ إضافة', exact: true }).click();
      await screenshot('admin-trip-dual-prices'); await save.click();
      await page.waitForFunction(() => ![...document.querySelectorAll('h2')].some(item => item.textContent === 'إضافة رحلة جديدة'));
      const request = requests.filter(item => item.method === 'POST' && item.path === '/trip').at(-1); assert.ok(request);
      assert.equal(request.fields.price, '33.25'); assert.equal(request.fields.price_egp, '333.75'); assert.equal(JSON.parse(request.fields.options)[0].price_egp, 123.75); assert.equal(JSON.parse(request.fields.addons)[0].price_egp, 0);
    });
    await check('Admin trip edit dual fields and missing-EGP response warning', async () => {
      trip = clone(fixture.trip); await goto('/admin/trips'); await page.getByTitle('تعديل', { exact: true }).filter({ visible: true }).first().click();
      assert.equal(await page.getByRole('spinbutton', { name: 'السعر الابتدائي للرحلة — EGP', exact: true }).inputValue(), '999.5');
      await page.locator('section').filter({ hasText: 'خيارات الحجز' }).getByTitle('تعديل', { exact: true }).click();
      assert.equal(await page.getByRole('spinbutton', { name: 'سعر خيار الرحلة — USD', exact: true }).inputValue(), '80.25');
      assert.equal(await page.getByRole('spinbutton', { name: 'سعر خيار الرحلة — EGP', exact: true }).inputValue(), '999.5');
      await page.locator('section').filter({ hasText: 'الإضافات' }).getByTitle('تعديل', { exact: true }).click();
      assert.equal(await page.getByRole('spinbutton', { name: 'سعر إضافة الرحلة — EGP', exact: true }).inputValue(), '77.25');
      await fillPair('السعر الابتدائي للرحلة', '90.25', '1100.75'); retainEgp = false;
      await page.getByRole('button', { name: 'حفظ التعديلات', exact: true }).click(); await page.getByText(/لم يؤكد حفظ أسعار الجنيه/).waitFor();
      assert.equal(await page.getByRole('spinbutton', { name: 'السعر الابتدائي للرحلة — EGP', exact: true }).inputValue(), '1100.75'); await screenshot('admin-trip-integration-warning'); retainEgp = true;
    });
    await check('Invalid persisted category is ignored; blocked storage still allows an in-memory choice', async () => {
      trip = clone(fixture.trip);
      await page.evaluate(key => localStorage.setItem(key, 'EGP'), key); await goto('/en/trips/verification-trip'); await dialog().waitFor();
      await page.keyboard.press('Escape'); assert.ok(await dialog().isVisible());
      await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Blocked storage', 'SecurityError'); }; });
      await chooseCategory('egyptian-resident'); await page.getByRole('heading', { name: 'Verification Trip', level: 1, exact: true }).waitFor(); assert.match(await text(), /EGP/);
      const blockedPage = await context.newPage(); blockedPage.on('pageerror', error => errors.push(error.message));
      await blockedPage.addInitScript(key => {
        const getItem = Storage.prototype.getItem, setItem = Storage.prototype.setItem;
        Storage.prototype.getItem = function (name) { if (name === key) throw new DOMException('Blocked storage', 'SecurityError'); return getItem.call(this, name); };
        Storage.prototype.setItem = function (name, value) { if (name === key) throw new DOMException('Blocked storage', 'SecurityError'); return setItem.call(this, name, value); };
      }, key);
      await blockedPage.goto(`${baseURL}/en/trips/verification-trip`, { waitUntil: 'domcontentloaded' }); await blockedPage.getByRole('heading', { name: 'Verification Trip', level: 1, exact: true }).waitFor();
      await blockedPage.getByRole('dialog', { name: /أهلًا بك في|Welcome to/ }).waitFor(); await chooseCategory('other', blockedPage); assert.match(await blockedPage.locator('main').innerText(), /\$80\.25/); await blockedPage.close();
    });
  } finally {
    await fs.writeFile(path.join(output, 'browser-results.json'), JSON.stringify({ baseURL, passes, failures, errors, requests, blocked, geometries }, null, 2));
    await context.close(); await browser.close();
  }
  assert.deepEqual(failures, [], 'Browser checks failed; inspect browser-results.json');
  assert.deepEqual(errors, [], 'Unexpected browser exceptions');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
