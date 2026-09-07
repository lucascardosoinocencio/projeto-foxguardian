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
  const consoleErrors = [];
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    page.on('pageerror', (err) => consoleErrors.push(`[${vp.name}] pageerror: ${err.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(`[${vp.name}] console: ${msg.text()}`);
    });
    await page.goto('http://localhost:8642/privacidade.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, `privacy-${vp.name}-1-top.png`) });

    const height = await page.evaluate(() => document.body.scrollHeight);
    const steps = 5;
    for (let i = 1; i <= steps; i++) {
      const y = Math.round((height / steps) * i);
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(OUT, `privacy-${vp.name}-${i + 1}-scroll${i}.png`) });
    }
    await page.close();
  }
  await browser.close();
  if (consoleErrors.length) {
    console.log('ERRORS:\n' + consoleErrors.join('\n'));
  } else {
    console.log('done, no console/page errors');
  }
})();
