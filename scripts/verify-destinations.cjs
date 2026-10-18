/* eslint-disable @typescript-eslint/no-require-imports -- Browser tools may be provided through NODE_PATH. */
// Run against npm run dev: node scripts/verify-destinations.cjs (requires playwright).
// API traffic is mocked; DESTINATION_LIVE_SMOKE=1 additionally allows public GETs.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const baseURL = process.env.DESTINATION_BASE_URL || 'http://localhost:3000';
const apiHost = 'oday-tourisim-production.up.railway.app';
const values = ['SHARM_EL_SHEIKH', 'EL_GHARDQA', 'EL_AIN_SOKHNA', 'DAHAB', 'EL_GOUNA', 'NORTH_COAST', 'CAIRO', 'ALEXANDRIA', 'SAHL_HASHEESH', 'MARSA_MATROUH', 'MARSA_ALAM', 'FAYOUM', 'ASWAN', 'LUXOR'];
const image = (id) => ({ id, url: `https://ik.imagekit.io/verification/${id}.jpg`, kind: 'DESTINATION_IMAGE' });
const records = () => values.map((destination, index) => ({ destination, image: index === 0 ? image('initial') : null, hotels_count: 37 + index, trips_count: 23 + index }));
const hotel = (id, destination = values[0]) => ({ id, destination, initial_price: 100, stars: 'FIVE', rating: 'TOP_RATED', translations: ['ar', 'en'].map(language => ({ language, name: `Hotel ${id}`, slug: `hotel-${id}`, description: 'Verification hotel' })) });
const trip = (id, city = values[0]) => ({ id, city, slug: `trip-${id}`, price: 150, translations: ['ar', 'en'].map(language => ({ language, title: `Trip ${id}`, subtitle: 'Verification trip', description: 'Verification trip', duration: '2 hours' })) });

async function main() {
  const output = path.resolve('.codex/destination-verification');
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: process.env.DESTINATION_BROWSER_PATH || undefined });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  let page = await context.newPage();
  page.setDefaultTimeout(20000);
  const errors = [], requests = [], passed = [];
  let current = records(), catalogMode = 'normal', listMode = 'normal', mutationStatus = 200, uploadNumber = 0;
  page.on('pageerror', error => errors.push(error.message));
  const json = (route, payload, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(payload), headers: { 'access-control-allow-origin': '*' } });
  await context.route(`https://${apiHost}/**`, async route => {
    const request = route.request(), url = new URL(request.url());
    const entry = { method: request.method(), path: url.pathname, query: Object.fromEntries(url.searchParams), authorization: request.headers().authorization || null, contentType: request.headers()['content-type'] || '', body: request.postData() || '' };
    requests.push(entry);
    if (entry.method === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET,PUT,DELETE', 'access-control-allow-headers': '*' } });
    if (url.pathname === '/destination' && entry.method === 'GET') {
      if (catalogMode === 'failure') return json(route, { message: 'Mock destination unavailable' }, 500);
      return json(route, catalogMode === 'empty' ? [] : url.searchParams.has('type') ? current.slice(0, 2) : current);
    }
    if (/^\/destination\/[^/]+\/image$/.test(url.pathname)) {
      assert.ok(['PUT', 'DELETE'].includes(entry.method), 'Only expected mocked mutations');
      assert.equal(entry.authorization, 'Bearer destination-verification-token');
      if (mutationStatus !== 200) return json(route, { message: `Mock server ${mutationStatus}` }, mutationStatus);
      const record = current.find(item => item.destination === url.pathname.split('/')[2]);
      if (entry.method === 'PUT') {
        assert.match(entry.contentType, /^multipart\/form-data; boundary=/);
        assert.equal((entry.body.match(/name="image";/g) || []).length, 1, 'Exactly one image form field');
        assert.equal((entry.body.match(/filename=/g) || []).length, 1, 'Exactly one file');
        record.image = image(`uploaded-${++uploadNumber}`);
        return json(route, record);
      }
      record.image = null;
      return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*' } });
    }
    if (url.pathname === '/hotel' || url.pathname === '/trip') {
      if (listMode === 'failure') return json(route, { message: 'Mock results unavailable' }, 500);
      const isHotel = url.pathname === '/hotel', filter = isHotel ? 'destination' : 'city';
      assert.equal(url.searchParams.get(filter), values[0], 'Correct destination parameter');
      assert.equal(url.searchParams.has(isHotel ? 'city' : 'destination'), false, 'No wrong parameter');
      const n = Number(url.searchParams.get('page'));
      const data = listMode === 'empty' ? [] : [(isHotel ? hotel : trip)(`${n}`, values[0]), ...(n === 1 ? [(isHotel ? hotel : trip)('wrong-destination', 'DAHAB')] : [])];
      return json(route, { data, meta: { page: n, limit: 100, total: listMode === 'empty' ? 0 : 2, totalPages: listMode === 'empty' ? 1 : 2 } });
    }
    return json(route, []);
  });
  // Supply actual local images for optimized mock URLs without calling ImageKit.
  const jpeg = await fs.readFile(path.resolve('public/images/hurghada.jpg'));
  await context.route('**/_next/image?*', async route => {
    const source = new URL(route.request().url()).searchParams.get('url');
    if (source === 'https://ik.imagekit.io/verification/broken.jpg') return route.fulfill({ status: 404, body: 'Missing mock image' });
    if (source?.startsWith('https://ik.imagekit.io/verification/')) return route.fulfill({ contentType: 'image/jpeg', body: jpeg });
    return route.continue();
  });
  const check = async (name, fn) => { await fn(); passed.push(name); console.log(`PASS ${name}`); };
  const overflow = async label => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${label}: no horizontal overflow`);
  const waitText = text => page.getByText(text, { exact: true }).first().waitFor();
  const settleCatalog = async type => page.waitForFunction(type => {
    const card = [...document.querySelectorAll(`#${type} button`)].find(element => element.querySelector('img'));
    if (!card) return false;
    for (let element = card; element; element = element.parentElement) {
      if (Number(getComputedStyle(element).opacity) < 0.99) return false;
    }
    return [...document.querySelectorAll(`#${type} button img`)].every(image => {
      const rect = image.getBoundingClientRect();
      return rect.bottom <= 0 || rect.top >= innerHeight || (image.complete && image.naturalWidth > 0);
    });
  }, type);
  const publicFlow = async (type, lang) => {
    const hotels = type === 'hotels', section = page.locator(`#${type}`), name = lang === 'ar' ? 'شرم الشيخ' : 'Sharm El Sheikh';
    requests.length = 0; current = records(); catalogMode = listMode = 'normal';
    await page.goto(`${baseURL}/${lang}/${type}`, { waitUntil: 'domcontentloaded' });
    const card = section.getByRole('button').filter({ hasText: name }).first();
    await card.waitFor(); await card.scrollIntoViewIfNeeded();
    const apiRequests = requests.filter(item => item.method !== 'OPTIONS');
    assert.ok(apiRequests.some(item => item.path === '/destination' && item.query.type === type));
    assert.equal(apiRequests.some(item => ['/hotel', '/trip'].includes(item.path)), false, 'No unfiltered result request on first load');
    assert.ok(apiRequests.filter(item => item.path === '/destination').every(item => item.authorization === null), 'Public destination requests have no token');
    assert.match(await card.innerText(), new RegExp(hotels ? '٣٧|37' : '23'));
    assert.ok(decodeURIComponent(await card.locator('img').getAttribute('src')).includes('/verification/initial.jpg'));
    const fallback = section.getByRole('button').filter({ hasText: lang === 'ar' ? 'الغردقة' : 'Hurghada' }).first();
    assert.ok(decodeURIComponent(await fallback.locator('img').getAttribute('src')).includes('/images/hurghada.jpg'));
    await overflow(`${type} desktop`);
    await settleCatalog(type);
    await page.screenshot({ path: path.join(output, `${type}-desktop.png`) });
    await page.setViewportSize({ width: 390, height: 844 });
    await card.scrollIntoViewIfNeeded(); await overflow(`${type} mobile`); await settleCatalog(type);
    await page.screenshot({ path: path.join(output, `${type}-mobile.png`) });
    await card.click();
    await waitText(`${hotels ? 'Hotel' : 'Trip'} 2`);
    assert.equal(await section.getByText(`${hotels ? 'Hotel' : 'Trip'} wrong-destination`, { exact: true }).count(), 0);
    const resultRequests = requests.filter(item => item.path === (hotels ? '/hotel' : '/trip') && item.method === 'GET');
    assert.deepEqual(resultRequests.map(item => item.query.page), ['1', '2']);
    await overflow(`${type} results mobile`);
    // Selected-destination retry and empty results.
    await section.getByRole('button', { name: lang === 'ar' ? 'العودة إلى الوجهات' : 'Back to destinations', exact: true }).first().click();
    await card.waitFor(); listMode = 'failure'; await card.click();
    const retry = section.getByRole('button', { name: lang === 'ar' ? 'إعادة المحاولة' : 'Retry', exact: true });
    await retry.waitFor();
    if (!hotels) {
      await section.getByRole('button', { name: 'Back to destinations', exact: true }).click();
      await card.waitFor(); await card.click(); await retry.waitFor();
    }
    listMode = 'empty'; await retry.click();
    await section.getByText(hotels ? 'لا توجد فنادق في هذه الوجهة حاليًا' : 'No trips are available in this destination yet', { exact: true }).waitFor();
    // Destination-list error/retry and fully empty catalog.
    catalogMode = 'failure';
    await page.goto(`${baseURL}/${lang}/${type}`, { waitUntil: 'domcontentloaded' });
    await retry.waitFor(); catalogMode = 'empty'; await retry.click();
    await section.getByText(hotels ? 'لا توجد فنادق متاحة حاليًا' : 'No trips available yet', { exact: true }).waitFor();
    await page.setViewportSize({ width: 1440, height: 1000 });
  };
  try {
    if (process.env.DESTINATION_CAPTURE_ONLY === '1') {
      for (const [type, lang] of [['hotels', 'ar'], ['trips', 'en']]) {
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.goto(`${baseURL}/${lang}/${type}`, { waitUntil: 'domcontentloaded' });
        const card = page.locator(`#${type}`).getByRole('button').filter({ hasText: lang === 'ar' ? 'شرم الشيخ' : 'Sharm El Sheikh' }).first();
        await card.scrollIntoViewIfNeeded(); await settleCatalog(type);
        await page.screenshot({ path: path.join(output, `${type}-desktop.png`) });
        await page.setViewportSize({ width: 390, height: 844 });
        await card.scrollIntoViewIfNeeded(); await settleCatalog(type); await overflow(`${type} capture mobile`);
        await page.screenshot({ path: path.join(output, `${type}-mobile.png`) });
      }
      assert.deepEqual(errors, []); console.log('PASS refreshed public screenshots after opacity >= 0.99 and visible images loaded');
      return;
    }
    await check('Arabic hotels: catalog images/counts, filter, two pages, empty and retries; desktop/mobile', () => publicFlow('hotels', 'ar'));
    await check('English trips: images/counts, city filter, two pages, error Back escape, empty and retries; desktop/mobile', () => publicFlow('trips', 'en'));
    await check('Broken custom image falls back; stored admin token is omitted from public destination reads', async () => {
      requests.length = 0; current = records(); current[0].image = image('broken'); catalogMode = 'normal';
      await page.evaluate(() => localStorage.setItem('oday-admin-token', 'destination-verification-token'));
      await page.goto(`${baseURL}/en/trips`, { waitUntil: 'domcontentloaded' });
      const card = page.locator('#trips').getByRole('button').filter({ hasText: 'Sharm El Sheikh' }).first();
      await card.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => {
        const image = document.querySelector('#trips button img');
        return image && !decodeURIComponent(image.getAttribute('src')).includes('/verification/broken.jpg') && image.complete && image.naturalWidth > 0;
      });
      const catalogRequests = requests.filter(item => item.path === '/destination' && item.method === 'GET');
      assert.ok(catalogRequests.length > 0 && catalogRequests.every(item => item.authorization === null));
    });
    await check('Admin: all 14 destinations and public list endpoint', async () => {
      catalogMode = 'normal'; current = records(); requests.length = 0;
      await page.evaluate(() => localStorage.setItem('oday-admin-token', 'destination-verification-token'));
      await page.goto(`${baseURL}/admin/destinations`, { waitUntil: 'domcontentloaded' });
      await page.locator('article').nth(values.length - 1).waitFor();
      assert.equal(await page.locator('article').count(), values.length);
      await page.getByRole('heading', { name: 'أسوان', exact: true }).waitFor();
      await page.getByRole('heading', { name: 'الأقصر', exact: true }).waitFor();
      assert.ok(requests.some(item => item.path === '/destination' && Object.keys(item.query).length === 0));
      await overflow('admin desktop'); await page.screenshot({ path: path.join(output, 'admin-desktop.png') });
      await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(400); await overflow('admin mobile');
      await page.screenshot({ path: path.join(output, 'admin-mobile.png') });
    });
    const first = page.locator('article').first(), input = first.locator('input[type=file]');
    const file = { name: 'destination.jpg', mimeType: 'image/jpeg', buffer: jpeg };
    const mutations = () => requests.filter(item => ['PUT', 'DELETE'].includes(item.method));
    await check('Admin: multipart upload and replacement, bearer auth, 204 delete and fallback', async () => {
      await input.setInputFiles(file); await page.getByRole('status').filter({ hasText: 'تم حفظ صورة الوجهة' }).waitFor();
      assert.ok(decodeURIComponent(await first.locator('img').getAttribute('src')).includes('uploaded-1.jpg'));
      await input.setInputFiles(file);
      await page.waitForFunction(() => decodeURIComponent(document.querySelector('article img').getAttribute('src')).includes('uploaded-2.jpg'));
      await first.getByRole('button', { name: 'حذف صورة شرم الشيخ' }).click();
      await page.getByRole('status').filter({ hasText: 'تم حذف الصورة' }).waitFor();
      assert.equal(await first.getByText('صورة افتراضية', { exact: true }).count(), 1);
      assert.ok(await first.getByRole('button', { name: 'حذف صورة شرم الشيخ' }).isDisabled());
      assert.equal(mutations().length, 3);
    });
    await check('Admin: non-image and >2 MB validation sends no request', async () => {
      const before = mutations().length;
      await input.setInputFiles({ name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('bad') });
      await page.getByRole('alert').filter({ hasText: 'يرجى اختيار ملف صورة.' }).waitFor();
      await input.setInputFiles({ name: 'large.jpg', mimeType: 'image/jpeg', buffer: Buffer.alloc(2 * 1024 * 1024 + 1) });
      await page.getByRole('alert').filter({ hasText: 'حجم الصورة' }).waitFor();
      assert.equal(mutations().length, before);
    });
    await check('Admin: server 400 preserves current image, 404 clears stale image', async () => {
      mutationStatus = 400; await input.setInputFiles(file);
      await page.getByRole('alert').filter({ hasText: 'Mock server 400' }).waitFor();
      assert.equal(await first.getByText('صورة افتراضية', { exact: true }).count(), 1);
      mutationStatus = 200; await input.setInputFiles(file);
      await page.getByRole('status').filter({ hasText: 'تم حفظ صورة الوجهة' }).waitFor();
      mutationStatus = 404; await first.getByRole('button', { name: 'حذف صورة شرم الشيخ' }).click();
      await page.getByRole('alert').filter({ hasText: 'لا توجد صورة لهذه الوجهة' }).waitFor();
      assert.equal(await first.getByText('صورة افتراضية', { exact: true }).count(), 1);
    });
    await check('Admin: authenticated 401 clears token and returns to login', async () => {
      mutationStatus = 401; await input.setInputFiles(file);
      await page.locator('input[type=password]').waitFor();
      assert.equal(await page.evaluate(() => localStorage.getItem('oday-admin-token')), null);
    });
    const live = [];
    if (process.env.DESTINATION_LIVE_SMOKE === '1') {
      // Fresh page/context with no token or API response mocks; real writes stay blocked.
      const liveContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      page = await liveContext.newPage();
      page.setDefaultTimeout(60000);
      page.on('pageerror', error => errors.push(error.message));
      await liveContext.route(`https://${apiHost}/**`, route => ['GET', 'OPTIONS'].includes(route.request().method()) ? route.continue() : route.abort('blockedbyclient'));
      for (const [type, lang] of [['hotels', 'ar'], ['trips', 'en']]) {
        const responsePromise = page.waitForResponse(response => {
          const url = new URL(response.url());
          return url.hostname === apiHost && url.pathname === '/destination' && url.searchParams.get('type') === type;
        });
        await page.goto(`${baseURL}/${lang}/${type}`, { waitUntil: 'domcontentloaded' });
        const response = await responsePromise;
        assert.equal(response.status(), 200);
        const catalog = await response.json(), destination = catalog.find(item => item.destination === values[0]);
        assert.ok(destination, `Live ${type} catalog includes Sharm`);
        const expected = destination[type === 'hotels' ? 'hotels_count' : 'trips_count'];
        const section = page.locator(`#${type}`);
        await section.getByRole('button').filter({ hasText: lang === 'ar' ? 'شرم الشيخ' : 'Sharm El Sheikh' }).first().click();
        await page.waitForFunction(({ type, expected }) => document.querySelectorAll(`#${type} h3`).length === expected, { type, expected });
        await overflow(`live ${type}`);
        await page.screenshot({ path: path.join(output, `live-${type}.png`) });
        live.push({ type, destination: values[0], apiCount: expected, displayedCount: await section.locator('h3').count() });
        console.log(`PASS live ${type}: ${expected} Sharm results`);
      }
    }
    assert.deepEqual(errors, [], 'No browser runtime errors');
    const report = { passed: true, checks: passed, browserErrors: errors, live, mutations: mutations().map(({ body, ...rest }) => ({ ...rest, bodyBytes: body.length })), output };
    await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    await page.screenshot({ path: path.join(output, 'failure.png') }).catch(() => {});
    await fs.writeFile(path.join(output, 'failure.json'), JSON.stringify({ error: String(error), passed, errors, requests: requests.map(({ body, ...rest }) => ({ ...rest, bodyBytes: body.length })) }, null, 2));
    throw error;
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
