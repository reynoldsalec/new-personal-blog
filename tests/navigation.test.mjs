import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { load } from 'cheerio';
const baseline = JSON.parse(readFileSync(new URL('./baseline.json', import.meta.url)));
const html = path => { assert.ok(existsSync(`dist${path}index.html`), `Missing ${path}`); return load(readFileSync(`dist${path}index.html`, 'utf8')); };
test('homepage lists all posts chronologically and all four filters work without JS', () => {
  const $ = html('/');
  assert.equal($('.post-row').length, baseline.posts.length);
  const dates = $('time').map((_, e) => $(e).attr('datetime')).get();
  assert.deepEqual(dates, [...dates].sort().reverse());
  assert.equal($('.filters a').length, 4);
  assert.equal($('script').length, 0);
  const urls = new Set();
  for (const name of ['Tech', 'Trails', 'Thoughts']) {
    const cat = html(`/category/${name.toLowerCase()}/`);
    assert.ok(cat('.post-row').length > 0);
    cat('.post-row').each((_, row) => {
      assert.equal(cat(row).attr('data-category'), name);
      const link = cat(row).find('h2 a').attr('href');
      assert.ok(!urls.has(link)); urls.add(link);
    });
    assert.equal(cat('.filters [aria-current="page"]').text(), name);
  }
  assert.equal(urls.size, baseline.posts.length);
});
test('RSS and sitemap include every original article URL', () => {
  for (const file of ['rss.xml', 'sitemap-0.xml']) {
    assert.ok(existsSync(`dist/${file}`), `Missing ${file}`);
    const xml = readFileSync(`dist/${file}`, 'utf8');
    for (const post of baseline.posts) assert.ok(xml.includes(`https://www.alecreynolds.com${post.url}`), post.url);
  }
});
