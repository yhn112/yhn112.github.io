# Coding instructions for diskin.me

Read [AGENTS.md](../AGENTS.md) first.
Its prohibition on local Jekyll builds and servers applies to both Codex and Claude Code.

## Site and runtime

This is Michael Diskin's academic and professional website at `https://diskin.me`.
It uses Jekyll 4 with the al-folio v1.2 starter contract and exact plugin pins in `Gemfile`.
Ruby is selected by `.ruby-version`; commit dependency resolution in `Gemfile.lock`.

Shared runtime files come from gems.
Local `_includes`, `_layouts`, `_sass`, and runtime asset files are intentional customizations.
Review and acknowledge gem-owned overrides in `.al-folio-overrides.yml`.
See [the migration record](MIGRATION.md) for ownership, reasons, commands, and verification limits.

## Site-owned inputs

- `_config.yml`: domain, language, metadata, feature flags, and v1 runtime contract.
- `_pages`, `_news`, `_teachings`: page content and existing routes.
- `_bibliography/papers.bib`: publications.
- `_data`: CV, citations, social links, coauthors, venues, and repositories.
- `assets/img`, `assets/pdf`, `assets/rendercv`: personal assets and PDF settings.
- `_scripts/yandex-metrika-setup.js`: the site's Yandex integration.

Keep `url: https://diskin.me` and an empty `baseurl` consistent.
Preserve existing permalinks and disabled demo sections.
Do not copy starter sample content over personal data.

## Verification and delivery

Local source checks:

```sh
npx prettier . --write
npx prettier . --check
bundle exec ruby tests/site_templates_test.rb
python -m unittest discover -s tests -p 'test_*.py'
bundle exec al-folio upgrade audit
bundle exec al-folio upgrade overrides audit --fail-on-stale
git diff --check
```

The production build runs only in GitHub Actions.
`deploy.yml` renders the PDF, builds once,
and passes the same artifact through browser/accessibility checks and offline link checks before publishing.
PR builds do not publish.
`render-cv.yml` preserves generated PDF commits;
`update-citations.yml` preserves citation updates and cache failure handling.

Follow [the Git workflow](GIT_WORKFLOW.md).
Changes to site requirements and publication need the authorization described in `AGENTS.md`.
