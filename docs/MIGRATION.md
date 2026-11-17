# Owner migration runbook — do not merge or deploy yet

## Verified current state

- Source: `reynoldsalec/new-personal-blog`, PR #1, `feat/astro-swiss-index`.
- Production output: `reynoldsalec/reynoldsalec.github.io`, Pages **Deploy from a branch**, `main`, `/` (API `build_type: legacy`).
- Custom domain: `www.alecreynolds.com`; API says `https_enforced: false`. No DNS changes are needed for this migration.
- Output main at inspection: `90f912661c42fd326457d54c9274205278727a98`. Retain this rollback baseline; recheck immediately before release.
- Agent can push source feature branches, cannot push output, and its OAuth grant cannot update workflow files. No production settings, credentials, or DNS were changed.
- The ACTIVE source `.github/workflows/deploy.yml` is still the old Node 16 workflow calling removed `deploy.sh`. **It must be replaced before merge.** The YAML in `docs/` is inert, not active CI.

## Release blockers

1. Dependency audit remains **12 high / 0 critical** findings, all propagated from picomatch ReDoS [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf). Registry latest is `4.0.7`, vulnerable range `<=4.0.7`, and GitHub advisory `first_patched_version` is null. Installed versions are `4.0.7` and nested `2.3.2`. There is no published safe upgrade/override at inspection. `npm audit fix --dry-run` does not establish a safe fix; the proposed forced Astro 5.3.0 downgrade is not accepted. Upstream PR #194 is open and explicitly says `+(*a)` remains exponential: do not treat it as a fix. No dependency changes or audit suppressions were made. Both proposed workflows enforce the high-severity audit gate and will currently fail it. Wait for a verified upstream fix, update compatible dependencies/lockfile, and rerun the entire verification suite. Do not bypass the gate merely to make deployment green.
2. Owner must replace the legacy source workflow and see CI pass before merging.
3. Owner must approve hosting configuration and the release. No deployment was attempted.

Static output contains no Node runtime or browser scripts, so the advisory concerns build/dev tooling rather than a deployed server. This limits exposure, but is not remediation. Use trusted repository content only; never expose the dev server or process untrusted glob patterns.

## Preferred path: keep GitHub Pages and domain; no cross-repo secrets

Run production Actions in the OUTPUT repository. It can read the public source without a PAT/deploy key and publish to its own Pages site with short-lived GitHub credentials. The build job has only `contents: read`; only the separate approved deploy job has `pages: write` and `id-token: write`.

### Before merging PR #1 (owner)

1. Check out the source feature branch using your own workflow-capable GitHub authentication:
   ```sh
   git switch feat/astro-swiss-index
   git pull --ff-only
   cp docs/validate-site.yml .github/workflows/deploy.yml
   git add .github/workflows/deploy.yml
   git commit -m "ci: replace legacy publisher with Astro validation"
   git push origin feat/astro-swiss-index
   ```
   Alternatively replace the file through GitHub's editor on this feature branch. Do NOT restore `deploy.sh`, merge with the old workflow, or give the agent broad credentials.
2. Resolve the dependency blocker above. With Node 22.23.4+, run `npm ci`, `npm run check`, `npm run build`, `npm test`, `npx playwright install --with-deps chromium`, `npm run test:browser`, and `npm audit --audit-level=high`. Review the exact resulting commit and CI. Keep PR draft until all gates and human review pass.
3. Review the six screenshots and `artifacts/browser-report.json`. Two historical missing images remain, not newly broken migration assets: `/assets/img/posts/elguapo.jpg` and `/assets/img/posts/guardian-data-workflow-001.jpg`. No versions were found in the available source git history or output repository history for those exact paths. Supply originals separately if available; do not silently replace them. Decide explicitly whether these pre-existing content defects are acceptable for release.
4. Only after approval, merge using your normal review process. Record the resulting full **main** commit SHA (a squash merge SHA differs from the PR head).

### Prepare output hosting (owner; release window)

5. Record current output main SHA, Pages source/domain settings, and a backup clone/tag. Preserve all existing output files/history for rollback. Copy source `docs/deploy-site.yml` to output `.github/workflows/deploy-astro.yml` on its default `main` branch. Do not install this workflow in the source repository. It is manual-only and does not itself publish on commit; while legacy Pages is enabled an output-main commit can trigger a legacy rebuild of unchanged output.
6. In output repository **Settings → Environments → github-pages**, configure a required human reviewer and restrict deployment branches to `main`. Confirm the protection rule is available for your repository/account; do not assume the environment name alone creates an approval gate. If unavailable, keep manual dispatch limited to authorized owners and establish explicit release approval before dispatch.
7. In output **Settings → Pages**, change Build and deployment Source from **Deploy from a branch** to **GitHub Actions**. Keep `www.alecreynolds.com` unchanged. Do not alter DNS. This is the only hosting-mode change. Review HTTPS separately: currently enforcement is off; enable it only once GitHub reports a valid domain certificate and HTTPS has been checked. It is not a prerequisite to rewrite DNS.
8. In output **Actions → Publish approved Astro site → Run workflow**, choose `main` and enter the full reviewed source-main SHA. The build rejects a SHA that does not match source main. It builds/tests/audits before uploading a Pages artifact. Approve the protected `github-pages` deployment only after reviewing the successful build. This is the production-changing step; the agent has NOT done it.

### Verify and roll back (owner)

9. Confirm the Pages deployment succeeds and check `https://www.alecreynolds.com/`, All/Tech/Trails/Thoughts, `/2021/12/03/resizing-docker-for-mac/`, representative legacy tag/pagination routes, `/rss.xml`, `/sitemap-index.xml`, `/robots.txt`, and a nonexistent URL (HTTP 404). Confirm canonicals/custom domain and no mixed-content failures. Recheck the two known missing-image exceptions separately. No redirect or DNS migration should be required because article URLs and domain remain intact.
10. If release fails, cancel pending deployments and change output Pages back to **Deploy from a branch → main → /(root)**. The Actions publishing path does not overwrite that branch's old static files. If other output files changed, restore the recorded pre-release output commit through an owner-reviewed revert; avoid a blind force push. Rebuild legacy Pages and verify the domain and representative old URLs. Keep the new manual workflow disabled until the issue is resolved.

## Local verification evidence

Clean `npm ci` under Node 22.23.4 succeeded. Astro check: 18 files, zero errors/warnings/hints. Build: 58 pages. All five preservation/URL/archive/feed tests passed, including byte-identical original Markdown/assets. Chromium: 58 pages, 174 viewport checks (320/390/1440), 707 internal links, zero unexpected errors. Six screenshots regenerated. Audit: 12 high, zero critical; **release not security-cleared**. Both workflow templates passed actionlint 1.7.12 (shellcheck integration disabled) and YAML parsing locally. Evidence is saved in `artifacts/readiness-validation.log` and `artifacts/dependency-audit.json`; GitHub-hosted workflows and production publish remain unexecuted, so no claim of end-to-end deployment verification is made.
