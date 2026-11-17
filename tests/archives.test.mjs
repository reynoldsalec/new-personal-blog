import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { load } from 'cheerio';
const paths = JSON.parse(readFileSync(new URL('./legacy-archives.json', import.meta.url)));
test('all published tag and pagination archives remain reachable', () => {
  for (const path of paths) {
    const file = `dist${path}index.html`;
    assert.ok(existsSync(file), `Missing archive ${path}`);
    const $ = load(readFileSync(file, 'utf8'));
    assert.ok($('main a').length > 0, `Empty archive ${path}`);
  }
});
