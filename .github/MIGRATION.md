# al-folio v1.2 migration

## Status and decisions

The migration is prepared on `migration/al-folio-v1.2`.
It follows upstream release [v1.2](https://github.com/alshedivat/al-folio/releases/tag/v1.2)
at `b95d6d61a1b0663529094b1b5f4fbe8aa41f8a04`.
The old local runtime is replaced by the release's exact gem pins,
including `al_folio_core` 1.0.15 and `al_folio_cv` 1.0.2.
The remote citation commits through `ab8be0b` were merged without rewriting history.

Michael's approved decisions are recorded in [AGENTS.md](../AGENTS.md#current-project-direction).
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

Five intentional overrides remain:

| Local file                                      | Reason                                                                    |
| ----------------------------------------------- | ------------------------------------------------------------------------- |
| `_includes/metadata.liquid`                     | JSON serialization, escaped metadata, and useful homepage preview titles. |
| `_includes/cv/render.liquid`                    | Accessible PDF download name, retaining the v1 RenderCV renderer.         |
| `_includes/plugins/al_analytics_scripts.liquid` | Standard Google integration plus the existing Yandex counter.             |
| `_layouts/bib.liquid`                           | Venue text colors and native annotation disclosure.                       |
| `assets/css/main.scss`                          | Load site CSS after the gem's Sass modules.                               |

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

## Upstream comparisons

The `upstream` remote points to `https://github.com/alshedivat/al-folio.git`.
The original release is kept as the namespaced tag `al-folio/v1.2`,
resolving to the release commit recorded above.
Publish this tag to `origin` with the migration branch.
Remote configuration is local to a checkout; on a fresh clone, configure and fetch it with:

```sh
git remote add upstream https://github.com/alshedivat/al-folio.git
git fetch --no-tags upstream refs/tags/v1.2:refs/tags/al-folio/v1.2
```

Compare starter configuration, dependencies, and workflows against the original release:

```sh
git diff al-folio/v1.2 HEAD --stat
git diff al-folio/v1.2 HEAD -- Gemfile _config.yml .github/workflows
```

These compare the two snapshots directly, preserving the site's existing history.
The full diff includes personal content and removed starter examples.
Runtime templates live in gems, so use the override audit and per-file diff commands above
for their actual implementation differences.
Those commands compare against the installed gem versions;
the current pins are the v1.2 release set.

## Assets, analytics, and automation

The icon configuration uses the v1.2 Font Awesome, Academicons, and Scholar Icons versions and CSS integrity hashes.
`bin/download_icon_fonts.py` downloads their fonts before the Jekyll library hook.
This is needed because `jekyll-3rd-party-libraries` 0.0.1 flattens CSS paths
and skips a font directory once it contains any files;
Academicons and Scholar Icons share the resulting `assets/libs/fonts` directory.
The helper verifies each CSS integrity hash and preserves all referenced font formats.
Downloaded files remain disposable under `assets/libs`.
The legacy CSS minifier's second compression pass is disabled:
it corrupts Tailwind's `calc(var(--spacing))` expressions and changes Scholar Icons' integrity hash.
Tailwind remains precompiled and minified, and Sass still uses compressed output.
Browser checks verify navbar geometry and integrity hashes of the loaded local assets.

Google Analytics uses `al_analytics` 1.0.2 and its supported top-level configuration keys.
Yandex keeps `_scripts/yandex-metrika-setup.js` and its existing counter and options.
Both load immediately in the production site, without a consent dialog.
Privacy describes Webvisor, click maps, link tracking, bounce tracking, and the ecommerce data layer;
the footer links to that page.

The deployment workflow renders the PDF before a single production build,
then passes the same `site` artifact to browser/accessibility checks, offline link checks, and publication.
Ruby comes from `.ruby-version` (3.3); Node tools are installed from the lockfile on Node 24.
Chrome and its matching ChromeDriver are installed together with explicit executable paths.
The standalone RenderCV workflow still commits generated PDFs to Git.
The citation workflow retains its cache, tests, failure reporting, and deployment trigger.
Publishing remains on `gh-pages`; GitHub Pages settings and DNS are unchanged.

## Verification and release

Local checks cover Liquid override output, JSON-LD with quotes/newlines/backslashes,
analytics duplication and flags, the CV download URL and accessible name,
cached citation badges, venue contrast, existing citation-update behavior,
workflow syntax, YAML, JavaScript syntax, and formatting.
The icon prefetch helper has been run against the pinned CDN assets.
The local run used Ruby 3.3.14: nine template checks and four citation-update tests passed.
The upgrade audit reported zero findings, and all five overrides were acknowledged.
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

These checks do not establish that the complete site builds or renders correctly.
No local Jekyll build or server was run, in accordance with the project policy.
CI build, browser review, and publication status are recorded below as release proceeds.

Michael authorized the upstream setup and upload on 24 November 2026.
Release the migration through a PR against `main`.
The PR builds and checks the artifact before publication.
CI browser checks cover existing sections, all teaching/news routes, 404, JSON-LD,
local resources, both themes at 1440 and 390 pixels, mobile navigation, theme switching,
publication filtering, CV sections, analytics inclusion, and the downloadable PDF.
Review the uploaded screenshots and resolve failures before merging and publishing.
After publication, check `diskin.me`, key routes, PDF, and analytics requests again.
If rollout fails, restore the prior source through a new revert commit and redeploy;
keep the complete migration history.
