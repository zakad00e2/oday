const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');

const output = path.join(os.tmpdir(), 'oday-room-upgrade-verification');
const names = {
  en: { rooms: ['Standard room', 'Family room'], upgrades: ['Sea view', 'Pool view', 'Suite upgrade'], add: 'Add to your plan', update: 'Update booking', saved: 'Added to your plan', close: 'Close' },
  ar: { rooms: ['غرفة عادية', 'غرفة عائلية'], upgrades: ['إطلالة بحر', 'إطلالة مسبح', 'ترقية جناح'], add: 'أضف لبرنامجك', update: 'تعديل الحجز', saved: 'تمت الإضافة لبرنامجك', close: 'إغلاق' },
};
function translations(namesByLang) {
  return ['ar', 'en'].map(language => ({ language, name: namesByLang[language], slug: 'fixture-upgrades', description: 'Verification fixture', Facilities: [] }));
}
const hotel = {
  id: 'fixture-upgrades', destination: 'SHARM_EL_SHEIKH', initial_price: '100', original_price: '100', stars: 'FIVE', rating: 'TOP_RATED', is_discounted: false, discount_percentage: '0',
  translations: translations({ ar: 'فندق الاختبار', en: 'Verification hotel' }),
  assets: [{ url: '/images/hotel-booking.jpeg', kind: 'HOTEL_MAIN_IMAGE' }],
  rooms: [100, 150].map((price, index) => ({ id: `room-${index}`, capacity: '2', price: String(price), translations: translations({ ar: names.ar.rooms[index], en: names.en.rooms[index] }) })),
  addons: [10, 20, 30].map((price, index) => ({ id: `upgrade-${index}`, price: String(price), translations: translations({ ar: names.ar.upgrades[index], en: names.en.upgrades[index] }) })),
};
const listResponse = JSON.stringify({ data: [hotel], meta: { total: 1, page: 1, limit: 100, totalPages: 1 } });
async function main() {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/zeka1/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe' });
  const results = [];
  let activePage;
  try {
    for (const lang of ['en', 'ar']) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      await context.route(/https:\/\/oday-tourisim-production\.up\.railway\.app\/hotel(?:\?|$)/, route => route.fulfill({ status: 200, contentType: 'application/json', body: listResponse }));
      const page = await context.newPage();
      activePage = page;
      const runtimeErrors = [];
      const consoleErrors = [];
      page.on('pageerror', error => runtimeErrors.push(error.message));
      page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
      const n = names[lang];
      const booking = page.locator('#booking');
      const room = index => booking.locator('[role="button"]').filter({ hasText: n.rooms[index] });
      const roomPlus = index => room(index).locator('button').last();
      const roomMinus = index => room(index).locator('button').first();
      const upgrade = index => booking.getByRole('group', { name: n.upgrades[index], exact: true });
      const card = index => upgrade(index).getByRole('button', { name: n.upgrades[index], exact: true });
      const plus = index => upgrade(index).getByRole('button', { name: /Increase rooms|زيادة غرف/ });
      const minus = index => upgrade(index).getByRole('button', { name: /Decrease rooms|تقليل غرف/ });
      const count = async index => Number(await upgrade(index).locator('[aria-live="polite"]').textContent());
      const total = async value => assert.equal(await booking.locator('span.text-4xl').textContent(), `$${value}`);
      const quantities = async expected => assert.deepEqual(await Promise.all([0, 1, 2].map(count)), expected);
      const persisted = () => page.evaluate(() => JSON.parse(localStorage.getItem('oday-cart')));

      await page.goto(`http://localhost:3000/${lang}/hotels/fixture-upgrades#booking`, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await upgrade(0).waitFor({ timeout: 60000 });
      console.log(`${lang}: initial booking loaded`);
      await booking.scrollIntoViewIfNeeded();
      await total(100);
      assert.equal(await card(0).count(), 1, 'The upgrade card is an accessible toggle');
      await card(0).click();
      await quantities([1, 0, 0]);
      await total(110);
      assert.equal(await card(1).isDisabled(), true, 'Unselected cards cannot exceed booked rooms');
      await card(0).click();
      await quantities([0, 0, 0]);
      await card(0).focus();
      await card(0).press('Enter');
      await quantities([1, 0, 0]);
      await card(0).press('Space');
      await quantities([0, 0, 0]);
      await roomPlus(0).click();
      await card(0).click();
      await plus(0).click();
      await quantities([2, 0, 0]);
      await minus(0).click();
      await quantities([1, 0, 0]);
      await plus(0).click();
      await card(0).click();
      await quantities([0, 0, 0]);
      await roomMinus(0).click();
      await total(100);
      await roomPlus(0).click();
      await plus(0).click();
      await plus(1).click();
      await quantities([1, 1, 0]);
      assert.equal(await plus(2).isDisabled(), true, 'Total upgrades cannot exceed two rooms');
      await total(230);
      await minus(0).click();
      await plus(2).click();
      await quantities([0, 1, 1]);
      await total(250);
      await roomMinus(0).click();
      await quantities([0, 1, 0]);
      await total(120);
      await roomMinus(0).click();
      await quantities([0, 0, 0]);
      await total(0);
      assert.equal(await booking.getByRole('button', { name: n.add, exact: true }).isDisabled(), true, 'Zero rooms disables booking');
      assert.equal(await plus(0).isDisabled(), true, 'Zero rooms disables upgrades');
      await roomPlus(0).click();
      await quantities([0, 0, 0]);
      await roomPlus(1).click();
      await plus(0).click();
      await plus(1).click();
      await total(280);
      console.log(`${lang}: allocations and room limits passed`);
      await page.screenshot({ path: path.join(output, `${lang}-desktop.png`), fullPage: true });
      await booking.getByRole('button', { name: n.add, exact: true }).click();
      await page.waitForFunction(() => JSON.parse(localStorage.getItem('oday-cart'))?.hotel?.selectedAddOns?.length === 2);
      const saved = await persisted();
      assert.deepEqual(saved.hotel.selectedAddOns.map(addOn => [addOn.id, addOn.count]), [['upgrade-0', 1], ['upgrade-1', 1]]);
      assert.equal(saved.hotel.roomsCount, 2);
      assert.equal(saved.nights, 1);
      const drawer = page.locator('aside').last();
      for (const index of [0, 1]) {
        assert.match(await drawer.getByText(n.upgrades[index], { exact: true }).locator('..').innerText(), /×\s*1/, 'Drawer shows individual upgrade quantities');
      }
      const inquiryHref = await drawer.locator('a[href*="/checkout?wa="]').getAttribute('href');
      const inquiry = new URL(inquiryHref, 'http://localhost:3000').searchParams.get('wa');
      assert.ok(inquiry.includes(`${n.upgrades[0]} ×1`) && inquiry.includes(`${n.upgrades[1]} ×1`), 'Booking inquiry text includes each upgrade quantity');
      assert.ok(inquiry.includes('$280'), 'Booking inquiry total matches cart');
      const visibleText = await page.locator('body').innerText();
      assert.ok(visibleText.includes('$280'), 'Cart drawer retains combined room and upgrade total');
      assert.ok(visibleText.includes(n.upgrades[0]) && visibleText.includes(n.upgrades[1]));

      await page.reload({ waitUntil: 'domcontentloaded' });
      await upgrade(0).waitFor({ timeout: 60000 });
      await quantities([1, 1, 0]);
      await total(280);
      console.log(`${lang}: persistence passed`);
      await minus(0).click();
      await plus(2).click();
      await booking.getByRole('button', { name: n.update, exact: true }).waitFor();
      await booking.getByRole('button', { name: n.update, exact: true }).click();
      await page.waitForFunction(() => JSON.parse(localStorage.getItem('oday-cart'))?.hotel?.selectedAddOns?.some(addOn => addOn.id === 'upgrade-2'));
      await page.goto(`http://localhost:3000/${lang}/checkout`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.getByText(`${n.upgrades[1]} x1`, { exact: true }).waitFor();
      await page.getByText(`${n.upgrades[2]} x1`, { exact: true }).waitFor();
      assert.ok((await page.locator('body').innerText()).includes('$300'), 'Checkout total agrees with allocated upgrades');
      await page.setViewportSize({ width: 390, height: 844 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'Checkout has no mobile overflow');
      await page.screenshot({ path: path.join(output, `${lang}-checkout-mobile.png`), fullPage: true });

      await page.goto(`http://localhost:3000/${lang}/hotels/fixture-upgrades#booking`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await upgrade(0).waitFor({ timeout: 60000 });
      await quantities([0, 1, 1]);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'Booking has no mobile overflow');
      await booking.scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(output, `${lang}-booking-mobile.png`), fullPage: true });
      console.log(`${lang}: checkout and mobile passed`);

      const otherLang = lang === 'ar' ? 'en' : 'ar';
      await page.goto(`http://localhost:3000/${otherLang}/hotels/fixture-upgrades#booking`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await booking.getByRole('group', { name: names[otherLang].upgrades[1], exact: true }).waitFor({ timeout: 60000 });
      for (const index of [1, 2]) {
        assert.equal(await booking.getByRole('group', { name: names[otherLang].upgrades[index], exact: true }).locator('[aria-live="polite"]').textContent(), '1', 'Switching language preserves all quantities');
      }
      await page.goto(`http://localhost:3000/${lang}/hotels/fixture-upgrades#booking`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await upgrade(0).waitFor({ timeout: 60000 });

      await page.evaluate(() => {
        const cart = JSON.parse(localStorage.getItem('oday-cart'));
        cart.hotel.selectedAddOns = [{ name: 'Sea view', nameAr: 'إطلالة بحر', nameEn: 'Sea view', price: 10 }];
        localStorage.setItem('oday-cart', JSON.stringify(cart));
      });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await upgrade(0).waitFor({ timeout: 60000 });
      await quantities([2, 0, 0]);
      await total(270);
      console.log(`${lang}: legacy restore passed`);
      assert.deepEqual(runtimeErrors, [], 'No browser runtime errors');
      results.push({ lang, passed: true, runtimeErrors, consoleErrors });
      console.log(JSON.stringify(results.at(-1)));
      await context.close();
    }
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify({ passed: true, results }, null, 2));
  } catch (error) {
    if (activePage) {
      await fs.writeFile(path.join(output, 'failure-body.txt'), await activePage.locator('body').innerText());
      await activePage.screenshot({ path: path.join(output, 'failure.png'), fullPage: true });
      console.error('Failure URL:', activePage.url());
    }
    throw error;
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
