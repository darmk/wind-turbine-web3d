const { chromium } = require('playwright');
const { mkdirSync } = require('node:fs');
const { join } = require('node:path');

const output = join(__dirname, '..', 'docs', 'article', 'assets', 'nacelle-isolated-sequence');
mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
    args: ['--enable-webgl', '--ignore-gpu-blocklist'],
  });
  const page = await browser.newPage({ viewport: { width: 1200, height: 750 }, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.locator('.loading-screen').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.locator('fieldset').waitFor({ state: 'visible' });
  await page.waitForFunction(() => {
    const fieldset = document.querySelector('fieldset');
    return fieldset && !fieldset.disabled;
  });
  await page.waitForTimeout(1200);
  await page.getByRole('button', { name: /结构探索/ }).click();
  await page.waitForTimeout(1600);
  await page.getByRole('button', { name: '单独查看' }).click();
  await page.waitForTimeout(1400);

  let frame = 0;
  async function capture(count) {
    for (let i = 0; i < count; i += 1) {
      const name = `frame_${String(frame).padStart(3, '0')}.jpg`;
      await page.screenshot({ path: join(output, name), type: 'jpeg', quality: 78 });
      frame += 1;
      await page.waitForTimeout(100);
    }
  }

  await capture(8);
  await page.locator('[data-level="2"]').click();
  await capture(24);
  await capture(7);
  await page.locator('[data-level="0"]').click();
  await capture(24);
  await capture(7);
  await browser.close();
  console.log(`Captured ${frame} article frames in ${output}`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
