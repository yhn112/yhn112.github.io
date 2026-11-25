# Website audit and remaining work

Original baseline: 23 November 2026.
Migration status updated on 24 November 2026.
The historical findings below describe the old runtime;
the migration record identifies completed fixes and release evidence.

## Template migration

The v1.2 migration was merged through [PR 4](https://github.com/yhn112/yhn112.github.io/pull/4).
See [the migration record](MIGRATION.md) for the pinned release, implementation,
retained overrides, checks, and release steps.
Michael's migration decisions are listed there;
those that still apply are in [AGENTS.md](../AGENTS.md#current-project-direction).

The implementation replaces copied runtime files with the v1.2 gems,
preserves site content and URLs, fixes JSON-LD and measured contrast/download-label defects,
and changes CI to validate the same artifact that will be published.
It also orders PDF rendering before the build and replaces the broken driver setup.
The production build, internal links, browser matrix, and Axe checks passed before merge.
The migrated site is published at [diskin.me](https://diskin.me).
The release pipeline and live checks passed; their exact revisions and scope are in the migration record.
The site's changes also exist as one commit on top of the clean v1.2 release, merged into `main`,
and the generic guides now match v1.2;
see [upstream lineage](MIGRATION.md#upstream-lineage-and-comparisons).

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
- Decide whether the October 2026 WMT paper
  [One Model, Five Tasks, Two RTX 3090 GPUs](https://aclanthology.org/2026.wmt-main.209/)
  should get a news entry; the paper itself is now in [\_bibliography/papers.bib](../_bibliography/papers.bib).
- Add the PhD to [\_data/cv.yml](../_data/cv.yml), the bios, and the homepage.
  The current education list ends with the 2022–2024 MSc, and the homepage subtitle says `Researcher · HSE University`.
  Michael's [HSE staff page](https://www.hse.ru/en/staff/yhn112), read on 24 November 2026, lists Michael as
  Doctoral Student at the Faculty of Computer Science,
  International Laboratory of Stochastic Algorithms and High-Dimensional Inference, in the 3rd year of postgraduate study,
  with the approved thesis topic "Adaptive Uncertainty Estimation Methods for Ensuring Generation Reliability in Large Language Models"
  and Alexey Naumov as academic supervisor.
  The homepage research themes do not mention uncertainty estimation.
- Review news and selected homepage papers for current work.
  The latest news item is dated 23 April 2026, and all three selected homepage papers are from 2021–2023.
  The homepage research paragraph now lists the 2025–2026 themes.
  The citation figures in prose are maintained independently of the citation cache.
  On 24 November 2026 they were raised from the 23 November cache:
  the total from `950+` to `1,000+` (1,064 across its 12 entries) and the GNN benchmark from `650+` to `700+` (735).
- Decide the scope of the CV.
  The PDF and web CV have no Publications, Teaching, or Talks sections,
  and the PDF header shows the GitHub and LinkedIn usernames without the website or Scholar profile.
  `al_folio_cv` 1.0.2 renders a `Publications` section;
  generating it from [\_bibliography/papers.bib](../_bibliography/papers.bib) would avoid a second copy of the list.
  The published PDF has the same text as the committed one; their bytes differ.
- Update teaching.
  The NLP course is marked `Ongoing` with year 2025.
  The HSE staff page lists a 2026/27 Mentor's Seminar "Artificial Intelligence" in a Master's programme,
  which the teaching page does not include.
- Complete the talks list.
  It has three entries and no slides.
  News items mention a workshop presentation at EMNLP 2025 and attendance at ICLR 2026, which it does not list,
  and the `LLMs One Year Later` entry names no event.
- Decide whether to show recent public repositories that the site does not mention:
  [vistaqa-premise-check](https://github.com/yhn112/vistaqa-premise-check),
  a system for the VistaQA Zero-Shot Challenge of the VLM4RWD workshop at NeurIPS 2026, last pushed on 16 November 2026;
  [QK-resoning](https://github.com/yhn112/QK-resoning), code for query–key score experiments,
  which its README calls an anonymous repository and no publication links to;
  and [Talkloom](https://github.com/yhn112/Talkloom), a local meeting transcriber for macOS.
- The HSE staff page itself lists outdated interests (deep learning, computer vision, graph neural networks)
  and "2022 Bachelor's" education, while the site's CV lists a 2014–2019 BSc.
  It is edited on the HSE portal, outside this repository.
- Add the existing Scholar identifier `WF5omc3nYNoC` to the sparse activations paper
  if it should display a citation badge.
  The cache contains this paper, but its bibliography entry lacks `google_scholar_id`.
- Review [Dependabot PR 3](https://github.com/yhn112/yhn112.github.io/pull/3)
  and [dependency alerts](https://github.com/yhn112/yhn112.github.io/security/dependabot).
  GitHub's push summary after migration reported 40 alerts:
  four high, 20 moderate, and 16 low.
  This is GitHub's automatic report; advisory applicability and fixes were not triaged during migration.
- Refresh performance measurements after fixes.
  The checked-in Lighthouse reports are from 23 April 2026, using Lighthouse 9.6.8.
  Their performance scores are 71 for mobile and 98 for desktop under their respective recorded presets;
  these are historical measurements, not current site scores.
- Consider shortening the mobile introduction area.
  At a 390-pixel viewport, the portrait and location list occupy most of the space before the name and summary.
  This is an editorial choice; no horizontal overflow was measured in the inspected layouts.
  The location list (Moscow, Yerevan, Tel Aviv, Zürich, London, Abu Dhabi) does not say what it means,
  while the CV places the current role in Moscow.

## Peer-site comparison

On 24 November 2026, the homepages and up to three subpages of 13 researcher sites were read with WebFetch:

- academic NLP and optimization: Lena Voita, Tim Dettmers, Eduard Gorbunov, Colin Raffel;
- industry research: Eugene Yan, Nathan Lambert, Lucas Beyer, Yi Tay, Chip Huyen;
- researcher-practitioners and group leads: Sebastian Raschka, Sasha Rush, Hamel Husain, Peter Richtárik.

Parts of Richtárik's homepage and talks page and of Gorbunov's publications page were read only through a model summary.
No personal sites were found for Max Ryabinin or Alexander Borzunov.

The same change added items that needed no new information from Michael:

- research themes with links to publications on the homepage;
- a [contact page](../_pages/contact.md) with short, medium, and long bios and the headshot;
- abstracts for publications whose primary sources were reachable (arXiv, ACL Anthology).
  The two OpenReview papers have none: OpenReview pages, API, and PDFs returned HTTP 403 browser challenges.
- the 2025 YSDA NLP course role, as stated in the course README.

Candidate additions that need Michael's information or decisions, with the sites where each was observed:

- Contact routing for hiring, student supervision, talk requests, collaboration, and consulting
  (Gorbunov, Eugene Yan, Lambert, Raffel, Huyen).
- Talks grouped by type, with slides, recordings, podcasts, and workshop presentations
  (Voita, Richtárik, Hamel, Eugene Yan, Lambert).
  The BibTeX `slides`, `poster`, and `video` fields are rendered natively.
- A projects page with open-source and publicly describable industry work and Michael's role in each
  (Hamel, Beyer, Yi Tay).
- Students and mentees with periods, topics, and next positions (Gorbunov, Richtárik, Rush, Dettmers).
- A Service section in [\_data/cv.yml](../_data/cv.yml) for reviewing and organizing
  (Voita, Dettmers, Beyer, Richtárik).
- Lecture recordings and slides through course `schedule` materials in `_teachings/` (Gorbunov, Raschka).
- A higher-resolution headshot; the current file is 640 × 640 px.
  It, the homepage portrait, and the social preview image are an illustrated avatar, not a photograph.
- Pronouns for the third-person bios, which currently avoid them.
- Writing, observed on almost all 13 sites: paper companion posts (Voita) or external posts through `external_sources`.
  A newsletter, comments, and site search add little without regular posts.

A second pass on 24 November 2026 read six more sites with WebFetch:
the homepages of Andrej Karpathy, Jason Wei, and Omar Khattab,
and the homepages plus one or two subpages of Jack Morris, Ofir Press, and Sebastian Ruder.
Additional candidates:

- A research agenda written as open questions (Khattab, Morris), a natural place for the thesis topic.
- Michael's contribution to each paper (Khattab), useful for long author lists such as the open-collaborations paper.
- A one-line plain-language summary and teaser figure for selected papers (Morris);
  the BibTeX `preview` field is rendered natively.
- Named adoption of software and benchmarks (Press, Khattab), for example Hivemind, the GNN benchmark, and the NLP course.
- A last-updated date in the footer (Khattab); `last_updated` exists in [\_config.yml](../_config.yml) and is disabled.
- Talk types such as keynote, panel, guest lecture, and podcast (Ruder, Jason Wei).
- A FAQ for recurring questions (Ruder), for example from prospective students and candidates.

The second pass added items that needed no new information from Michael:

- code links for SWARM, Secure Distributed Training, and Training Transformers Together, plus the demo page of the last,
  confirmed through the GitHub API as the papers' repositories;
- homepage JSON-LD as a [ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
  whose `Person` has alternate names, job title, employer, HSE affiliation, education, portrait, and profile links;
  the job and education come from [\_data/cv.yml](../_data/cv.yml);
- a large social preview card instead of a square crop of the 1536 × 1024 preview image;
- the citation figures in prose, described under [content updates](#content-updates).

The second pass also fetched the live homepage, publications, CV, teaching, contact, repositories, and news pages.
The Semantic Scholar API listed eight papers for Michael's author ID, all already on the site.
DBLP returned a browser challenge, so the site was not compared with it.
Michael's name was not searched in search engines.

## Decisions and missing information

Michael's content decisions of 25 November 2026:

- PhD: do not add to the site.
- Homepage location list: keep as is.
- `Query–Key Ensembles for Mathematical Reasoning Verification` (MATH-AI 2026): do not add to `_bibliography/papers.bib`.
- Selected homepage publications and compact CV scope: keep as is.
- News: updated ICLR 2026 to past tense and added EMNLP 2026 / WMT 2026 attendance in Budapest without naming the paper.
- WMT 2026 model: linked `https://huggingface.co/yhn112/WMT_Limited_Resources_Sorbian` on `diskin2026one`.
- Contact / Bio: added an open-ended reach-out note and updated bios to use `he`/`his` pronouns.
- Footer: enabled `last_updated: true`.

Remaining open items:

- Peer-site candidates: choose whether to pursue any additional sections (projects, students/mentees, service, writing/FAQ);
  Wildberries work beyond the CV wording needs Michael's approval for public description.
- Photo: choose whether to replace the illustrated avatar with a high-resolution photograph.
- Teaching and talks: confirm current 2026/27 courses, any additional talks, and available slides or recordings.
- Repositories: decide whether `QK-resoning`, `vistaqa-premise-check`, or `Talkloom` belong on `/repositories/`.
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
