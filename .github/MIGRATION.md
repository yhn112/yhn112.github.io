# al-folio v1.2 migration

## Status and decisions

The migration was merged through [PR 4](https://github.com/yhn112/yhn112.github.io/pull/4)
at `3ca0a0a7695bedc50971920a60c02a5ef36cc037` on 24 November 2026.
The migrated site is published at [diskin.me](https://diskin.me).
The [release pipeline](https://github.com/yhn112/yhn112.github.io/actions/runs/45278901376)
passed its build, browser/accessibility, internal-link, and deployment jobs.
It follows upstream release [v1.2](https://github.com/alshedivat/al-folio/releases/tag/v1.2)
at `b95d6d61a1b0663529094b1b5f4fbe8aa41f8a04`.
The old local runtime is replaced by the release's exact gem pins,
including `al_folio_core` 1.0.15 and `al_folio_cv` 1.0.2.
`Gemfile` matches the release verbatim.
The remote citation commits through `ab8be0b` were merged without rewriting history.

Michael's one-time migration decisions of 24 November 2026:

- Use the v1.2 layout while preserving content, routes, site colors, and profile.
- Disable the unavailable GitHub trophies widget while preserving the other repository cards.
- Complete CI and visual acceptance before publishing the migrated site.
- Keep a commit with the site's changes on top of the clean v1.2 release,
  copied from the site instead of replaying the migration history, and merge it into `main`.
  Force-push was authorized only to move `migration/al-folio-v1.2` to that commit.
- Replace the outdated generic al-folio documentation with the v1.2 versions.
- Load third-party libraries from their CDNs, as in v1.2 (`third_party_libraries.download: false`).
- Show only CV sections in the sidebar table of contents, built by tocbot.
- Replace the old site's `Gemfile.lock` with the release's lockfile, including its checksums (PR 6).
  This was a one-time replacement, not a pin.

Decisions that still apply are in [AGENTS.md](../AGENTS.md#current-project-direction).
The migration keeps `https://diskin.me`, an empty `baseurl`, `CNAME`, page permalinks,
content collections, bibliography, CV source, RenderCV settings, and personal assets.
Existing disabled sections and features stay disabled.
Bootstrap compatibility and Distill rendering are disabled.
Repository cards keep the existing service endpoint; trophies are disabled.

Biographical changes, new publications, external-link repairs, and Scholar fetch reliability
remain separate tasks in [the site audit](SITE_AUDIT.md).

## Runtime ownership

The gems now own shared layouts, includes, Sass, JavaScript, citation tags,
external-post ingestion, CV rendering, and icon loading.
Copied Bootstrap/MDB, icon fonts, search bundles, and other stock runtime assets were removed.
Site-specific CSS is in `_sass/_site.scss`.
It preserves the blue/cyan theme and fixes year-heading and venue-badge contrast.

Ten intentional overrides remain:

| Local file                                                                                      | Reason                                                                       |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `_includes/metadata.liquid`                                                                     | JSON serialization, escaped metadata, and useful homepage preview titles.    |
| `_includes/cv/render.liquid`                                                                    | Accessible PDF download and sequential section headings in the v1 renderer.  |
| `_includes/plugins/al_analytics_scripts.liquid`                                                 | Standard Google integration plus the existing Yandex counter.                |
| `_layouts/bib.liquid`                                                                           | Venue background and text colors from `_data/venues.yml`.                    |
| `assets/css/main.scss`                                                                          | Load site CSS after the gem's Sass modules.                                  |
| `_layouts/default.liquid`                                                                       | Native main landmark that keeps `role="main"` for the gem's tocbot selector. |
| `_includes/cv/education.liquid`, `_includes/cv/experience.liquid`, `_includes/cv/awards.liquid` | Sequential CV headings kept out of the table of contents (`data-toc-skip`).  |
| `assets/js/copy_code.js`                                                                        | Keyboard scrolling in code blocks, including expanded BibTeX.                |

`.al-folio-overrides.yml` records the reviewed upstream and local checksums.
After editing an override, format it before reviewing and acknowledging its final contents:

```sh
npx prettier . --write
bundle exec al-folio upgrade overrides diff PATH
bundle exec al-folio upgrade overrides accept PATH
bundle exec al-folio upgrade audit
bundle exec al-folio upgrade overrides audit --fail-on-stale
```

The upstream [migration guide](https://github.com/alshedivat/al-folio/blob/v1.2/.agents/skills/al-folio-v1-migration/SKILL.md)
and [ownership boundaries](https://github.com/alshedivat/al-folio/blob/v1.2/docs/BOUNDARIES.md)
describe future gem upgrades.

## Upstream lineage and comparisons

The `upstream` remote points to `https://github.com/alshedivat/al-folio.git`.
The original release is kept as the namespaced tag `al-folio/v1.2`,
resolving to the release commit recorded above.
The tag and migration branch were pushed to `origin`.
Remote configuration is local to a checkout; on a fresh clone, configure and fetch it with:

```sh
git remote add upstream https://github.com/alshedivat/al-folio.git
git fetch --no-tags upstream refs/tags/v1.2:refs/tags/al-folio/v1.2
```

The site was created from the template without upstream history.
After the rollout, `migration/al-folio-v1.2` was moved to a single commit on top of `al-folio/v1.2`.
Its files were copied from the site after the documentation alignment;
the migration history was not replayed.
That commit was merged into `main` with `--allow-unrelated-histories` without changing any file,
so the v1.2 release is an ancestor of `main`, and `main` now contains 1113 upstream commits.
The original migration commits remain in `main` through PR 4.
That commit is a snapshot of 24 November 2026 (PR 5); later fixes are only in `main`.

Show the site's current changes against the clean release and check the lineage:

```sh
git diff al-folio/v1.2 main --stat
git diff al-folio/v1.2 main -- Gemfile _config.yml .github/workflows
git merge-base main al-folio/v1.2
```

On 24 November 2026 the site also merged al-folio `main` at `e5f84cc8` (23 commits after v1.2, no new release),
taking the GitHub Actions major-version update and Prettier 3.9 pins from upstream PR 3704
and the regenerated `docs/` tables of contents.
Star-history, screenshot and example-citation refreshes and upstream PR 3705, which limits starter test workflows the site removed, were not taken.
The merge base is therefore `e5f84cc8`;
`git diff al-folio/v1.2 main` still shows the site's changes against the release.
The full diff includes personal content and removed starter examples.
Runtime templates live in gems, so use the override audit and per-file diff commands above
for their actual implementation differences.
Those commands compare against the installed gem versions;
the current pins are the v1.2 release set.

The upstream guides in `docs/`, `.github/agents/`, and `.github/instructions/` are unchanged upstream copies;
[AGENTS.md](../AGENTS.md#documentation-precedence) defines their precedence.

To adopt a later release, merge its tag instead of copying files
(merge `upstream/main` the same way to take unreleased starter changes):

```sh
git fetch --no-tags upstream refs/tags/vX.Y:refs/tags/al-folio/vX.Y
git switch -c upgrade/al-folio-vX.Y main
git merge al-folio/vX.Y
```

When upstream modifies a starter file that the site removed, keep it removed;
resolve site configuration conflicts by hand.
Regenerate `Gemfile.lock` from the merged `Gemfile` with `bundle lock`,
read the release notes in `docs/releases/`, and run the override checks above.
Merge the pull request with a merge commit; squash and rebase merges drop the upstream ancestor.

## Assets, analytics, and automation

`third_party_libraries` is the v1.2 block verbatim, so libraries load from their CDNs with integrity hashes (`download: false`).
The site previously kept the old `download: true` setting,
which published every listed library under `assets/libs` and needed a font prefetch workaround
for `jekyll-3rd-party-libraries` 0.0.1; both were removed on 24 November 2026.
The v1.2 block also restores `tocbot`, which the CV's sidebar table of contents loads,
and drops entries that no v1.2 gem reads.
The legacy CSS minifier's second compression pass stays disabled, as in v1.2:
it corrupts Tailwind's `calc(var(--spacing))` expressions.
Tailwind remains precompiled and minified, and Sass still uses compressed output.
Browser checks verify navbar geometry, the icon font, integrity hashes of local assets,
and scripts or stylesheets with empty URLs.

Starter example media that no page referenced (sample images, audio, video, PDF, notebook, Plotly demo)
and the February 2026 `assets/json/resume.json` copy were removed on 24 November 2026.
The CV renders from `_data/cv.yml` (`cv_format: rendercv`);
`jekyll-get-json` keeps v1.2's `resume` entry and skips the missing file.

Google Analytics uses `al_analytics` 1.0.2 with the v1.2 `analytics:` block;
the gem reads top-level keys first and falls back to that block.
Yandex keeps `_scripts/yandex-metrika-setup.js` and its existing counter and options.
Both load immediately in the production site, without a consent dialog.
Privacy describes Webvisor, click maps, link tracking, bounce tracking, and the ecommerce data layer;
the footer links to that page.

The gem's `_includes/head.liquid` hard-codes a Content Security Policy without the `blob:` frame and child sources
that [Yandex requires for Session Replay and click maps](https://yandex.ru/support/metrica/code/install-counter-csp.html);
the old site added them together with `wss:` Yandex endpoints.
On 24 November 2026, scripted Chrome 158 sessions on diskin.me (home and CV, 30 seconds each, with scrolling and mouse movement)
loaded the Webvisor tag but started no recording and logged no CSP violations, so the impact is unconfirmed.
Webvisor recordings in Metrica after the rollout would confirm it; if they are missing,
override `_includes/head.liquid` with those exceptions as Michael decided.

The deployment workflow renders the PDF before a single production build,
then passes the same `site` artifact to browser/accessibility checks, offline link checks, and publication.
Ruby comes from `.ruby-version` (3.3); Node tools are installed from the lockfile on Node 24.
Chrome and its matching ChromeDriver are installed together with explicit executable paths.
The standalone RenderCV workflow still commits generated PDFs to Git.
The citation workflow retains its cache, tests, failure reporting, and deployment trigger.
Publishing remains on `gh-pages`; GitHub Pages settings and DNS are unchanged.

## Accepted risks

These were found in the post-rollout review and left unchanged:

- Yandex depends on the site's `yandex_metrika` keys, `include: [_pages, _scripts]` and the analytics override,
  loads only in production, and bypasses the cookie-consent gate, which is disabled.
- Every publication, including citation-triggered deploys, waits for browser, Axe, link, formatting and upgrade checks;
  Chrome is installed at its current stable version, so a browser change can block publishing.
- The `bib.liquid`, `cv/render.liquid` and `metadata.liquid` overrides copy most of their gem files;
  `--fail-on-stale` flags gem changes, which then need a manual three-way review.
- `al_folio_core` 1.0.15 `assets/js/bibsearch.js` calls `setTimeout(filterItems(searchTerm), 300)`:
  publication search filters on every keystroke without the intended delay,
  and Chrome logs a Content Security Policy `unsafe-eval` violation for the returned value.
  Search still works (PR 6 CI, 24 November 2026); the fix belongs upstream.
- `bundle exec al-folio upgrade audit` reports one non-blocking `legacy_data_toggle` finding:
  the `bib.liquid` override keeps the gem's own `data-toggle="popover"` annotation markup,
  which `al_folio_core` 1.0.15 `assets/js/tooltips-setup.js` handles without Bootstrap.
  `al_folio_upgrade` 1.0.3 flags its own runtime's markup; no publication has an annotation today.
- The external link check (`broken-links.yml`, which also scans `_bibliography/papers.bib`) ignores domains
  that refuse automated clients: Google Scholar (403), VK video (login redirect loop), Wildberries (498)
  yandexdataschool.com (intermittent 403), research.yandex.com (504 from GitHub runners, 200 elsewhere) and OpenReview PDF downloads (403; the matching `forum?id=` pages are checked).
  It also ignores `data-fusion.ru`, whose certificate chains to the Russian Ministry of Digital Development CA;
  browsers without that root show a certificate warning, and Michael chose to keep the link.
  Breakage on these domains is not detected.
- Upstream merges add new upstream workflows silently, while changes to deleted starter files appear as modify/delete conflicts;
  review `.github/workflows` after each merge.

## Verification and release

Local checks cover Liquid override output, JSON-LD with quotes/newlines/backslashes,
analytics duplication and flags, the CV download URL and accessible name,
cached citation badges, venue contrast, existing citation-update behavior,
workflow syntax, YAML, JavaScript syntax, and formatting.
The icon prefetch helper has been run against the pinned CDN assets.
The local run used Ruby 3.3.14: nine template checks and four citation-update tests passed.
The initial upgrade audit reported zero findings; the final acknowledged override count is ten.
The font helper verified three CSS hashes and downloaded twelve referenced font files.
Content and personal assets were byte-checked against merged baseline `d526da5`.

```sh
bundle exec ruby tests/site_templates_test.rb
python -m unittest discover -s tests -p 'test_*.py'
actionlint .github/workflows/deploy.yml .github/workflows/axe.yml .github/workflows/broken-links-site.yml .github/workflows/render-cv.yml
node --check tests/site-browser.mjs
npx prettier . --check
git diff --check
```

No local Jekyll build or server was run, in accordance with the project policy.
Production acceptance ran in GitHub Actions.

Michael authorized the upstream setup and upload on 24 November 2026.
[PR acceptance run 45277857389](https://github.com/yhn112/yhn112.github.io/actions/runs/45277857389)
passed the production build, browser/accessibility job, and internal-link check
at head `9f0b6d1cca9b8306bc6f0070fbd78ce2d73552cb` before merge.
Browser checks used Chrome and ChromeDriver 158.0.8127.88 on the Ubuntu runner.
All 20 routes passed, including five teaching pages, seven news entries, and 404.
The seven main sections also passed in light/dark themes at 1440 and 390 pixels:
41 page checks in total, plus mobile navigation, theme switching, publication filtering,
BibTeX expansion and keyboard scrolling, and PDF download/artifact parity.
Page checks cover JSON-LD, canonical URLs, local resources and integrity hashes,
analytics inclusion, image loading, navbar geometry, overflow, and JavaScript exceptions.
Axe Core 4.14.1 reported zero violations on the seven main pages in its desktop light-theme run.
Desktop/mobile screenshots in both themes were visually reviewed.
Both pages of the generated A4 PDF were rendered with Poppler and inspected for clipping and overlap.
The separate external URL check still fails on previously recorded dead links and bot/network restrictions;
its behavior was preserved and repairs remain in [the site audit](SITE_AUDIT.md).

Release run `45278901376` repeated the checks on merge commit `3ca0a0a7`
and published the same artifact to `gh-pages` at `11481dd9ef37b5ebdffab316f438248286e785bc`.
GitHub Pages reported that revision built at `2026-11-23T22:25:58Z`.
Live verification after publication returned HTTP 200 for all seven main sections, sitemap, robots, and PDF.
The seven HTML pages passed checks of JSON-LD, canonicals, privacy links,
analytics inclusion, and main landmarks.
The live CSS (31,319 bytes) and PDF (55,187 bytes) matched the release artifact byte for byte.
The release PDF's extracted text also matched the visually reviewed two-page PDF.
A fresh Chrome session verified immediate Google and Yandex script requests,
publication filtering, mobile navigation, theme switching, no horizontal overflow on the mobile homepage,
and no JavaScript exceptions.

Repeat artifact checks and screenshot review before publishing future runtime changes.
If rollout fails, restore the prior source through a new revert commit and redeploy;
keep the complete migration history.
