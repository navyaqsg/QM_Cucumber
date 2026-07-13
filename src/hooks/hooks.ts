import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, chromium, firefox, webkit } from '@playwright/test';
import { pageFixture } from './pageFixture';
import path from 'path';
import fs from 'fs';

setDefaultTimeout(60_000);

let browser: Browser;

BeforeAll(async function () {
  const dir = path.resolve(__dirname, '../../test-results/screenshots');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

Before({ timeout: 120_000 }, async function (scenario) {
  const browserName = (process.env.BROWSER || 'chromium').toLowerCase();
  const headless = process.env.HEADLESS !== 'false';

  const launchOptions = { headless };

  switch (browserName) {
    case 'firefox':
      browser = await firefox.launch(launchOptions);
      break;
    case 'webkit':
      browser = await webkit.launch(launchOptions);
      break;
    default:
      browser = await chromium.launch(launchOptions);
  }

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1366, height: 768 });
  pageFixture.page = page;

  console.log(`▶  Scenario: ${scenario.pickle.name} | browser: ${browserName} | headless: ${headless}`);
});

After(async function ({ pickle, result }) {
  if (!pageFixture.page) {
    console.warn('⚠️  pageFixture.page is undefined – skipping cleanup.');
    return;
  }

  if (result?.status === Status.FAILED) {
    const screenshotName = pickle.name
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 100);
    const screenshotPath = path.resolve(
      __dirname,
      '../../test-results/screenshots',
      `${screenshotName}.png`,
    );

    const screenshot = await pageFixture.page.screenshot({
      path: screenshotPath,
      type: 'png',
      fullPage: true,
    });

    await this.attach(screenshot, 'image/png');
  }

  await pageFixture.page.context().clearCookies();
  await browser.close();
});

AfterAll(async function () {
  console.log('✅  All scenarios finished.');
});