const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, '..', 'review-shots');
fs.mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

(async () => {
  const browser = await chromium.launch();
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:8642/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, `${vp.name}-1-top.png`) });

    const height = await page.evaluate(() => document.body.scrollHeight);
    const steps = 4;
    for (let i = 1; i <= steps; i++) {
      const y = Math.round((height / steps) * i);
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(OUT, `${vp.name}-${i + 1}-scroll${i}.png`) });
    }
    await page.close();
  }
  await browser.close();
  console.log('done');
})();
