import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const baseline = JSON.parse(readFileSync(new URL('./baseline.json', import.meta.url)));
test('every original Markdown file and asset is byte-for-byte preserved', () => {
  for (const item of baseline.files) {
    assert.ok(existsSync(item.path), `Missing original: ${item.path}`);
    assert.equal(createHash('sha256').update(readFileSync(item.path)).digest('hex'), item.sha256, item.path);
  }
});
test('all published article URLs render their original title', () => {
  for (const post of baseline.posts) {
    const file = `dist${post.url}index.html`;
    assert.ok(existsSync(file), `Missing published URL: ${post.url}`);
    const html = readFileSync(file, 'utf8');
    assert.ok(html.includes('rel="canonical"'), file);
    assert.ok(html.includes(post.title.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')) || html.includes(post.title), `Missing title: ${post.title}`);
  }
});
