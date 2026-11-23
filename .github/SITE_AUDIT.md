# Website audit and remaining work

Original baseline: 23 November 2026.
Migration status updated on 24 November 2026.
The historical findings below describe the old runtime;
the migration record identifies completed fixes and release evidence.

## Template migration

The v1.2 migration was merged through [PR 4](https://github.com/yhn112/yhn112.github.io/pull/4).
See [the migration record](MIGRATION.md) for the pinned release, implementation,
retained overrides, checks, and release steps.
Michael's approved layout, analytics, widget, and publication decisions live in
[AGENTS.md](../AGENTS.md#current-project-direction).

The implementation replaces copied runtime files with the v1.2 gems,
preserves site content and URLs, fixes JSON-LD and measured contrast/download-label defects,
and changes CI to validate the same artifact that will be published.
It also orders PDF rendering before the build and replaces the broken driver setup.
The production build, internal links, browser matrix, and Axe checks passed before merge.
The migrated site is published at [diskin.me](https://diskin.me).
The release pipeline and live checks passed; their exact revisions and scope are in the migration record.

The migration resolves the Ruby/driver failures, PDF build ordering, invalid JSON-LD,
privacy mismatch and missing footer link, measured contrast defects, and unnamed CV download.
The unavailable trophy widget is disabled by Michael's decision.
External-link repairs, citation-fetch reliability, PDF content mapping, and the content updates below remain separate work.

## Historical publication and automation findings

1. **Restore deployment.**
   The [23 November deployment](https://github.com/yhn112/yhn112.github.io/actions/runs/45119677739)
   failed before building: `Unavailable version 3.3.5 for ruby on ubuntu-26.04`.
   The runner log identifies Ruby 3.3.14 as available.
   Select a compatible Ruby version and align the Ruby configuration in
   [deploy.yml](workflows/deploy.yml), [axe.yml](workflows/axe.yml), and
   [broken-links-site.yml](workflows/broken-links-site.yml).
   The latter two currently request Ruby 3.2.2.
   The [latest successful deployment](https://github.com/yhn112/yhn112.github.io/actions/runs/41004332539)
   was on 30 October.

2. **Repair accessibility CI.**
   The [30 October Axe run](https://github.com/yhn112/yhn112.github.io/actions/runs/41004487206)
   stopped at WebDriver startup with `Server terminated early with status 1`.
   Its logs also report blocked `chromedriver` installation scripts.
   Repair browser and driver startup before treating this workflow as an accessibility check.
   The latest Axe and generated-site link checks were skipped because deployment failed;
   skipped checks provide no validation of the latest changes.

3. **Publish regenerated CV PDFs after rendering completes.**
   [RenderCV](workflows/render-cv.yml) and deployment can start independently on a CV source change.
   RenderCV falls back to `github.token`; the repository secret list contains no `PAT`.
   A PDF commit made with `GITHUB_TOKEN` does not trigger a new push workflow,
   as documented in [GitHub's workflow trigger guidance](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow).
   Deployment currently listens for citation workflow completion, but not RenderCV completion.
   This creates a risk of publishing the previous PDF after the next CV edit.
   Order rendering and deployment explicitly.
   The currently published PDF matches the committed PDF byte for byte.

4. **Investigate citation update reliability.**
   Of the 20 latest scheduled runs inspected, 16 failed and four succeeded.
   The [20 November run](https://github.com/yhn112/yhn112.github.io/actions/runs/44684611205)
   hit the existing 90-second limit with exit code 124.
   The [23 November update](https://github.com/yhn112/yhn112.github.io/actions/runs/45119607658)
   succeeded, but its deployment failed.
   Published badges therefore still show, for example, 705 GNN citations and 114 SWARM citations,
   while the latest committed cache contains 735 and 120 respectively.
   Preserve failure reporting and existing cached data while diagnosing fetch failures.

## Historical visitor-facing findings

1. **Reconcile analytics with the privacy page.**
   [Privacy](https://diskin.me/privacy/) says Google Analytics and Yandex.Metrika load only after consent.
   In [\_config.yml](../_config.yml), both analytics providers are enabled and cookie consent is disabled.
   Fresh browser sessions sent analytics requests without interaction.
   The Yandex setup also enables `webvisor`, `clickmap`, and link tracking,
   which the current description of aggregate traffic does not explain.
   The inspected pages have no link to the privacy page.
   Choose the intended analytics behavior, make the implementation and text agree,
   and expose the privacy page in the footer.

2. **Replace broken destinations and repair the repository widget.**
   Direct GET requests on 23 November reproduced HTTP 404 for
   [Practical RL on Coursera](https://www.coursera.org/learn/practical-rl),
   [Anton Sinitsin's linked Hugging Face profile](https://huggingface.co/anutiv), and
   [Aleksandr Beznosikov's linked homepage](https://anbeznosikov.github.io/).
   Their source locations are [\_teachings/practical-rl.md](../_teachings/practical-rl.md)
   and [\_data/coauthors.yml](../_data/coauthors.yml).
   The trophy image on [repositories](https://diskin.me/repositories/) returns HTTP 402
   and visibly renders as a broken image.
   Other repository cards loaded in this browser check.
   The [17 November link check](https://github.com/yhn112/yhn112.github.io/actions/runs/44043862717)
   reported 22 errors among 70 checked URLs; its other errors include bot restrictions,
   redirect loops, and network failures, so they must not all be classified as dead links.
   The current external-link workflow also omits `_bibliography/papers.bib`.
   Include publication destinations when repairing link validation.

3. **Emit valid structured data.**
   The JSON-LD on the published homepage and CV fails JSON parsing because
   `description` contains an unescaped newline.
   The publications and privacy pages passed the same parsing check.
   Serialize string values safely in [\_includes/metadata.liquid](../_includes/metadata.liquid),
   including descriptions, names, and titles.
   Homepage social previews also use the generic titles `about` and `Michael Diskin | about`;
   give them a useful name and role.

4. **Fix measured accessibility failures.**
   Axe Core 4.14.1 found insufficient contrast in publication year headings and venue badges.
   Year headings measured 1.24:1 in the light theme and 1.7:1 in the dark theme,
   below the 3:1 threshold reported for these headings.
   Review [the old publication styles](https://github.com/yhn112/yhn112.github.io/blob/ac27afc9e9691b3100c6b316e15b24b85caf7b44/_sass/_publications.scss)
   and [\_data/venues.yml](../_data/venues.yml).
   The CV download link has no accessible name;
   add one in [the old CV layout](https://github.com/yhn112/yhn112.github.io/blob/ac27afc9e9691b3100c6b316e15b24b85caf7b44/_layouts/cv.liquid).

## Content updates

- Repair the PDF mapping of education degree labels (`studyType`) and Skills descriptions (`keywords`)
  from [\_data/cv.yml](../_data/cv.yml).
  Text extraction confirms that the committed pre-migration PDF and the regenerated migration PDF
  both omit these values while showing institutions and skill category names.
  This is an existing content-mapping defect, not a migration regression.
- Add the October 2026 WMT paper
  [One Model, Five Tasks, Two RTX 3090 GPUs](https://aclanthology.org/2026.wmt-main.209/)
  to [\_bibliography/papers.bib](../_bibliography/papers.bib), with a news entry if desired.
  ACL Anthology identifies Michael Diskin as its author; the paper is absent from the current bibliography.
- Add the PhD education entry to [\_data/cv.yml](../_data/cv.yml)
  using Michael's confirmed institution, program, and dates.
  The current education list ends with the 2022–2024 MSc.
- Review the research summary and news for current work.
  The latest news item is dated 23 April 2026, and all three selected homepage papers are from 2021–2023.
  The `950+` total and `650+` GNN citation figures in prose are maintained independently of the citation cache.
- Add the existing Scholar identifier `WF5omc3nYNoC` to the sparse activations paper
  if it should display a citation badge.
  The cache contains this paper, but its bibliography entry lacks `google_scholar_id`.
- Review [Dependabot PR 3](https://github.com/yhn112/yhn112.github.io/pull/3)
  after repairing CI; its existing checks include an Axe failure.
- Refresh performance measurements after fixes.
  The checked-in Lighthouse reports are from 23 April 2026, using Lighthouse 9.6.8.
  Their performance scores are 71 for mobile and 98 for desktop under their respective recorded presets;
  these are historical measurements, not current site scores.
- Consider shortening the mobile introduction area.
  At a 390-pixel viewport, the portrait and location list occupy most of the space before the name and summary.
  This is an editorial choice; no horizontal overflow was measured in the inspected layouts.

## Decisions and missing information

- PhD: confirm institution, program, start date, and public wording before editing the CV.
- The latest remote citation cache also contains `Query–Key Ensembles for Mathematical Reasoning Verification`.
  The [MATH-AI 2026 accepted paper list](https://mathai-2026.github.io/papers/) includes this title,
  but direct OpenReview author verification was blocked by its browser challenge.
  Confirm its author list and publication status before adding it.
- Search Console ownership and indexing status remain unknown.
  Empty verification settings alone do not establish that ownership verification is missing.

## Historical verification scope

- Inspected local commit `ac27afc` and compared it with remote `main` at `ab8be0b`.
  Remote is five citation-only commits ahead; other source files are unchanged.
- HTTP GET checks returned 200 for the homepage, publications, CV, teaching, repositories,
  news, privacy, sitemap, robots file, and downloadable CV.
  HTTPS enforcement, canonical URLs, absolute social preview image URLs, sitemap, and robots are configured.
- Browser checks used Chrome 158.0.8127.37 at 1440 × 1000 and 390 × 844.
  Playwright Core and Axe Core were installed in a temporary directory for these checks.
  Screenshots of the homepage, publications, and repositories were inspected.
  Mobile navigation opened after its transition; publication filtering for `Swarm` showed one matching entry.
  The inspected browser pages produced no JavaScript exceptions.
- Axe checks used WCAG 2 A/AA and WCAG 2.1 A/AA tags.
  No violations were reported on the light homepage at either inspected width,
  mobile teaching, or desktop repositories; this is not a complete accessibility certification.
- JSON-LD was parsed separately from raw published HTML.
  No local Jekyll build or serve command was run.
  No new Lighthouse measurement or PDF layout review was performed.
- Repository formatting passed `npx prettier . --check` before this report was added.
  GitHub workflow logs, current repository settings, and open pull requests were read without remote changes.
