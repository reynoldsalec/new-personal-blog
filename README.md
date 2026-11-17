# Alec Reynolds — Astro blog

A static Astro migration of the personal blog at https://www.alecreynolds.com, using the approved Swiss Index design. All 20 original posts remain in `src/_posts/`, with their original Markdown unchanged. The index has All, Tech, Trails, and Thoughts category links that work without JavaScript.

## Development and verification

Use Node **22.23.4 or newer** (required by this Astro release) and npm:

```sh
npm ci
npm run dev
```

```sh
npm run check
npm run build
npm test
npx playwright install --with-deps chromium
npm run test:browser
```

If the system Node is older, run commands with:

```sh
npm exec --yes --package=node@22.23.4 -c 'npm ci && npm run check && npm run build && npm test'
```

Browser tests use Playwright's installed Chromium by default. Set `PLAYWRIGHT_EXECUTABLE_PATH` to use a specific Chromium binary. They serve `dist/` on an ephemeral loopback port, crawl generated links and fragment targets, check all HTML pages at 320, 390, and 1440 pixels with JavaScript disabled, exercise category navigation and keyboard skip links, and save six screenshots plus `artifacts/browser-report.json`. These checks are not a full accessibility audit.

## Content and compatibility

- `src/lib/legacy-urls.json` preserves published article URLs, including historical date/slug discrepancies.
- Tag archives and legacy pagination routes are statically generated.
- `tests/baseline.json` records original post/asset SHA-256 hashes and published article URLs. Its `publishedTree` identifies the deployment commit in **reynoldsalec/reynoldsalec.github.io**, not this source repository; `tests/legacy-archives.json` records legacy archive routes.
- RSS, sitemap, canonical links, metadata, a custom 404 page, and robots.txt are generated or provided.
- The original GParted screenshot is retained at `/images/gparted-example.png`.
- No client JavaScript, third-party fonts, analytics, or runtime server is required. Markdown is trusted repository content, not user-submitted input.

### Known historical missing images

These image references are present in the original posts but are absent from the source repository and return HTTP 404 on the existing live site:

- `/assets/img/posts/guardian-data-workflow-001.jpg` — Data Journalism.
- `/assets/img/posts/elguapo.jpg` — Christmas List.

The original Markdown and references are preserved rather than replacing the images with invented content. Browser checks allow only these two known missing paths; other local link or asset failures fail verification. Recovering the original files remains a separate content-recovery task.

## Dependency security caveat

The final `npm audit` reports **12 high-severity dependency findings**, propagated from picomatch's ReDoS advisory [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf). These affect the build/development dependency graph; the published output is static and ships no Node server. This is not a clean security audit. Do not expose the development server or process untrusted glob patterns/content. Audit's proposed Astro downgrade was not applied as part of this migration; dependency remediation needs separate compatibility testing before production approval.

## Deployment

`npm run build` writes the static site to `dist/`. `public/CNAME` retains `www.alecreynolds.com`; `.nojekyll` is copied for GitHub Pages compatibility. The site assumes hosting at the domain root and trailing-slash URLs.

The GitHub Actions workflow validates builds and uploads preview and browser-evidence artifacts **only**. It does not publish to production. The old VuePress deploy script has been removed. Production hosting/publishing must be configured and approved separately; this migration does not change the live site or DNS.

You're welcome to use the code, but Alec Reynolds retains all rights to the written content.
