import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, mkdir, writeFile, readdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { load } from 'cheerio';

const root = resolve('dist');
const artifacts = resolve(process.env.ARTIFACTS_DIR || 'artifacts');
await mkdir(artifacts, { recursive: true });
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml' };
const server = createServer(async (request, response) => {
  try {
    let file = resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
    assert.ok(file.startsWith(root + '/') || file === root);
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'text/plain' });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end(await readFile(resolve(root, '404.html')));
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined, headless: true });
// These two image references already return 404 on the published site; never silently waive new failures.
const legacyMissing = new Set(['/assets/img/posts/guardian-data-workflow-001.jpg', '/assets/img/posts/elguapo.jpg']);
const errors = [];
const missing = new Set();
const report = { pages: 0, viewportChecks: 0, internalLinks: 0, screenshots: [], knownMissingAssets: [], errors };
try {
  const files = (await readdir(root, { recursive: true })).filter(file => file.endsWith('.html'));
  const paths = files.map(file => '/' + file.replace(/index\.html$/, ''));
  // Crawl every locally generated link and asset, including encoded tag routes and fragment targets.
  for (const file of files) {
    const sourceUrl = '/' + file.replace(/index\.html$/, '');
    const $ = load(await readFile(resolve(root, file), 'utf8'));
    assert.equal($('html').attr('lang'), 'en');
    assert.equal($('main').length, 1);
    assert.equal($('h1').length, 1);
    assert.equal($('script').length, 0, `Unexpected client JavaScript: ${file}`);
    for (const element of $('a[href], img[src], link[href]').toArray()) {
      const value = $(element).attr('href') || $(element).attr('src');
      const url = new URL(value, origin + sourceUrl);
      if (url.origin !== origin) continue;
      if (legacyMissing.has(url.pathname)) { missing.add(url.pathname); continue; }
      const response = await fetch(url);
      assert.equal(response.status, 200, `${file} → ${value}`);
      if (url.hash && response.headers.get('content-type').includes('text/html')) {
        const target = load(await response.text());
        const id = decodeURIComponent(url.hash.slice(1));
        assert.ok(target('[id], [name]').toArray().some(e => target(e).attr('id') === id || target(e).attr('name') === id), `Missing anchor ${value}`);
      }
      report.internalLinks++;
    }
  }
  for (const width of [320, 390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, javaScriptEnabled: false });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400 && !legacyMissing.has(new URL(response.url()).pathname)) errors.push(`${response.status()} ${response.url()}`); });
    for (const path of paths) {
      assert.equal((await page.goto(origin + path)).status(), 200, path);
      const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth }));
      assert.ok(dimensions.scroll <= dimensions.viewport, `Horizontal overflow at ${width}: ${path} ${JSON.stringify(dimensions)}`);
      report.viewportChecks++;
    }
    await page.goto(origin);
    assert.equal(await page.locator('.post-row').count(), 20);
    for (const category of ['Tech', 'Trails', 'Thoughts', 'All']) {
      await page.getByRole('navigation', { name: 'Filter writing' }).getByRole('link', { name: category, exact: true }).click();
      assert.equal(await page.locator('.filters [aria-current="page"]').innerText(), category);
      if (category !== 'All') assert.equal(await page.locator(`.post-row:not([data-category="${category}"])`).count(), 0);
    }
    await page.goto(origin);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').innerText(), 'Skip to content');
    await page.keyboard.press('Enter');
    assert.ok(page.url().endsWith('#main'));
    if (width !== 320) {
      await page.goto(origin);
      const label = width === 1440 ? 'desktop' : 'mobile';
      const home = `${artifacts}/home-${label}.png`;
      await page.screenshot({ path: home, fullPage: true }); report.screenshots.push(home);
      await page.locator('.post-row h2 a').first().click();
      assert.equal(await page.locator('.article-header h1').innerText(), 'California Trails and Greenways 2025 Recap');
      const article = `${artifacts}/article-${label}.png`;
      await page.screenshot({ path: article, fullPage: true }); report.screenshots.push(article);
      await page.goto(origin + '/2021/12/03/resizing-docker-for-mac/');
      assert.ok(await page.locator('.prose img').evaluate(img => img.complete && img.naturalWidth > 0));
      const code = `${artifacts}/article-code-${label}.png`;
      await page.screenshot({ path: code, fullPage: true }); report.screenshots.push(code);
    }
    await context.close();
  }
  report.pages = files.length;
  report.knownMissingAssets = [...missing];
  assert.equal(errors.length, 0, JSON.stringify(errors));
  await writeFile(`${artifacts}/browser-report.json`, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
