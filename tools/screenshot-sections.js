const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const OUT = path.join(__dirname, '..', 'review-shots');
fs.mkdirSync(OUT, { recursive: true });

const sections = ['servicos', 'sobre', 'catalogo'];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:8642/index.html', { waitUntil: 'networkidle' });
  for (const id of sections) {
    await page.evaluate((id) => {
      document.getElementById(id).scrollIntoView({ block: 'start' });
    }, id);
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(OUT, `section-${id}.png`) });
  }
  // protocol section is right after sobre badge, scroll a bit more
  await page.evaluate(() => window.scrollBy(0, 650));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, 'section-protocol.png') });
  await browser.close();
  console.log('done');
})();
