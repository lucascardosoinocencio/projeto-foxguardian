const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, '..', 'review-shots');
fs.mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
];

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    page.on('pageerror', (err) => errors.push(`[${vp.name}] ${err.message}`));
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`[${vp.name}] console: ${msg.text()}`); });
    await page.goto('http://localhost:8642/index.html', { waitUntil: 'networkidle' });
    await page.locator('#avaliacoes').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, `reviews-${vp.name}-1.png`), clip: await page.locator('#avaliacoes').boundingBox() });

    if (vp.name === 'desktop') {
      await page.locator('#reviewsNext').click();
      await page.waitForTimeout(600);
      await page.locator('#reviewsNext').click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(OUT, `reviews-${vp.name}-2-scrolled.png`), clip: await page.locator('#avaliacoes').boundingBox() });
    }
    await page.close();
  }
  await browser.close();
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'done, no errors');
})();
