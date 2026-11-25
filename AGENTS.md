# Agent Guidelines for diskin.me

Michael Diskin's academic website, built on the al-folio v1.2 starter.

## Current Project Direction

The site targets al-folio v1.2 with gem-owned runtime files.
See [the migration record](.github/MIGRATION.md) for implementation status, retained overrides, checks, and release steps.
See [the site audit](.github/SITE_AUDIT.md) for the historical baseline and separate content work.

This section lists only Michael's decisions that still apply to future work.
Record one-time choices and their results where that work is documented:
migration decisions in [the migration record](.github/MIGRATION.md#status-and-decisions),
content decisions in the site audit.

Michael's decisions of 24 November 2026:

- Keep Google Analytics and Yandex.Metrika loading immediately, including the existing Yandex settings;
  Privacy describes that behavior.
- Keep the `upstream` remote and the original release at `al-folio/v1.2` for direct comparisons.
- Do not rewrite `main`; adopt upstream releases by merging them,
  as described in [the migration record](.github/MIGRATION.md#upstream-lineage-and-comparisons).
- Publish through the existing `origin` repository to `diskin.me`
  (Michael authorized the upload: "делай. и заливать можно").
- If Content Security Policy violations break Yandex Webvisor, override `_includes/head.liquid`
  to add the Yandex exceptions; until they are confirmed, keep the gem's policy.

Michael's decision of 25 November 2026:

- A failed Google Scholar fetch fails the citation workflow only when `_data/citations.yml` last changed more than 30 days ago;
  otherwise the run warns and keeps the cache,
  as described in [the migration record](.github/MIGRATION.md#citation-updates).

Local runtime files must be intentional overrides of the pinned gems.
Review them with `bundle exec al-folio upgrade overrides diff PATH` and acknowledge reviewed changes in `.al-folio-overrides.yml`.

## Local Build Policy

- Never run local site build or serve commands in this repository.
- This includes `bundle exec jekyll build`, `bundle exec jekyll serve --livereload`, and similar local verification flows.
- Do not suggest local build verification as a default step.
- This policy overrides any conflicting build instructions in other project docs unless the user explicitly asks to run a local build.

## Documentation Precedence

Site-specific rules live in this file, [`.github/copilot-instructions.md`](.github/copilot-instructions.md),
and [the migration record](.github/MIGRATION.md).
`docs/`, `.github/agents/`, and `.github/instructions/` are unchanged al-folio copies,
kept verbatim so that upstream merges apply cleanly.
They describe the upstream starter repository:
its ban on local `_layouts`, `_includes`, `_sass`, and `_scripts`, its `/al-folio` baseurl,
its local build and Docker commands, and agent skills under `.agents/skills` that this site does not keep.
Where they conflict with the site-specific files, the site-specific files take precedence.

## Quick Links by Role

- **Are you a coding agent?** → Read [`.github/copilot-instructions.md`](.github/copilot-instructions.md) first (site runtime, inputs, verification, delivery)
- **Which gem owns a layout, include, or feature?** → [docs/BOUNDARIES.md](docs/BOUNDARIES.md) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Customizing the site?** → [docs/CUSTOMIZE.md](docs/CUSTOMIZE.md) and [`.github/agents/customize.agent.md`](.github/agents/customize.agent.md)
- **Writing documentation?** → See [`.github/agents/docs.agent.md`](.github/agents/docs.agent.md)
- **Need setup/deployment help?** → [docs/INSTALL.md](docs/INSTALL.md)
- **Troubleshooting & FAQ?** → [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) and [docs/FAQ.md](docs/FAQ.md)
- **Quick start?** → [docs/QUICKSTART.md](docs/QUICKSTART.md)

## Essential Commands

These commands are reference only. Agents should not run local build or serve commands unless the user explicitly overrides the policy above.

### Local Development

```bash
# Install Ruby gems and Python support
bundle install
pip install -r requirements.txt

# Start the dev server
bundle exec jekyll serve --livereload
# Site runs at http://localhost:4000

# Production-like build
JEKYLL_ENV=production bundle exec jekyll build
```

### Pre-Commit Checklist

Before every commit, you **must** run these steps:

1.  **Format Code:**
    ```bash
    # Install the locked formatter dependencies
    npm ci
    # Format all files
    npx prettier . --write
    ```
2.  **Do Not Run Local Build/Serve:**

    ```bash
    # Repository-specific policy:
    # do not run local Jekyll build/serve commands in this repo
    # unless the user explicitly asks for it.
    ```

## Critical Configuration

When modifying `_config.yml`, these **must be updated together**:

- **Personal site:** `url: https://username.github.io` + `baseurl:` (empty)
- **Project site:** `url: https://username.github.io` + `baseurl: /repo-name/`
- **YAML errors:** Quote strings with special characters: `title: "My: Cool Site"`

## Development Workflow

- **Git & Commits:** For commit message format and Git practices, see [.github/GIT_WORKFLOW.md](.github/GIT_WORKFLOW.md).
- **Code-Specific Instructions:** Consult the relevant instruction file for your code type.

| File Type                                     | Instruction File                                                                                |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Markdown content (`_posts/`, `_pages/`, etc.) | [markdown-content.instructions.md](.github/instructions/markdown-content.instructions.md)       |
| YAML config (`_config.yml`, `_data/`)         | [yaml-configuration.instructions.md](.github/instructions/yaml-configuration.instructions.md)   |
| BibTeX (`_bibliography/`)                     | [bibtex-bibliography.instructions.md](.github/instructions/bibtex-bibliography.instructions.md) |
| Liquid templates (`_includes/`, `_layouts/`)  | [liquid-templates.instructions.md](.github/instructions/liquid-templates.instructions.md)       |
| JavaScript (`_scripts/`)                      | [javascript-scripts.instructions.md](.github/instructions/javascript-scripts.instructions.md)   |

## Common Issues

For troubleshooting, see:

- [Failure modes that produce no error message](docs/ARCHITECTURE.md#failure-modes-that-produce-no-error-message) in docs/ARCHITECTURE.md
- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) and [docs/FAQ.md](docs/FAQ.md) for detailed solutions
- [GitHub Issues](https://github.com/alshedivat/al-folio/issues) to search for your specific problem.
