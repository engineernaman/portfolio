import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const BASE = process.env.SITE_URL || 'http://127.0.0.1:4173';
const OUT = join(process.cwd(), 'scripts', 'screenshots');

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const logs = [];
page.on('console', (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', (err) => logs.push(`[pageerror] ${err.message}`));

const report = { url: BASE, checks: [], screenshots: [] };

try {
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  const heroBookVisible = await page.locator('#home img, #home .font-display').first().isVisible().catch(() => false);
  report.checks.push({ name: 'hero_book_visible', value: heroBookVisible, ok: heroBookVisible });

  const galleryPhotos = await page.locator('#speaking img').count();
  report.checks.push({ name: 'speaking_photo_count', value: galleryPhotos, ok: galleryPhotos >= 4 });

  // dismiss boot if present
  const bootBtn = page.locator('button:has-text("Enter")');
  if (await bootBtn.count()) {
    await bootBtn.click().catch(() => {});
    await page.waitForTimeout(800);
  }

  const hero = join(OUT, '01-hero.png');
  await page.screenshot({ path: hero, fullPage: false });
  report.screenshots.push(hero);

  const canvasCount = await page.locator('canvas').count();
  report.checks.push({ name: 'canvas_count', value: canvasCount, ok: canvasCount >= 2 });

  const immersive = await page.locator('#immersive-canvas').count();
  report.checks.push({ name: 'immersive_canvas', value: immersive, ok: immersive === 1 });

  const webgl = await page.evaluate(() => {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    return !!gl;
  });
  report.checks.push({ name: 'webgl', value: webgl, ok: webgl });

  const scrollProgress = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--scroll-progress').trim()
  );
  report.checks.push({ name: 'scroll_progress_initial', value: scrollProgress });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.35));
  await page.waitForTimeout(1500);

  const mid = join(OUT, '02-mid-scroll.png');
  await page.screenshot({ path: mid, fullPage: false });
  report.screenshots.push(mid);

  const scrollAfter = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--scroll-progress').trim()
  );
  report.checks.push({
    name: 'scroll_progress_after',
    value: scrollAfter,
    ok: parseFloat(scrollAfter) > 0.05,
  });

  await page.locator('#speaking').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);

  const speaking = join(OUT, '03-speaking.png');
  await page.screenshot({ path: speaking, fullPage: false });
  report.screenshots.push(speaking);

  const galleryCanvas = await page.locator('#speaking canvas').count();
  report.checks.push({ name: 'speaking_gallery_canvas', value: galleryCanvas, ok: galleryCanvas >= 1 });

  const bookCanvas = await page.locator('#home canvas').count();
  report.checks.push({ name: 'hero_canvas', value: bookCanvas, ok: bookCanvas >= 1 });

  report.console_errors = logs.filter((l) => /error|pageerror/i.test(l)).slice(0, 20);
  report.console_sample = logs.slice(0, 15);
} catch (err) {
  report.fatal = String(err);
}

await browser.close();
console.log(JSON.stringify(report, null, 2));
