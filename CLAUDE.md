# Rule for Folder

- Top-level layout under this project:
  - `docs/` — product documents (PRD, TDD, Test-Case, URS, help, deployment). Tracked at `docs/.git`.
  - `code/` — implementation + configuration.
    - **Single code repo**: `.git` lives directly at `code/.git`.
    - **Multiple code repos**: each repo as `code/<repo-name>/` with its own `.git`; no `.git` at `code/.git`.
  - `opera/` — workflow artifacts (process reference, ADO metadata, iteration/bugfix plans, gap checks). **Untracked** on purpose — contents often include coworker emails (ADO team snapshots) or in-flight plans that don't belong in product doc history.
- Repo mapping recorded at `opera/ado/repos.md`. Downstream skills read this file to resolve local paths, git identities, and (in ADO mode) remote repo coordinates.
- Always put documents under `docs/`, code/configuration under the appropriate `code/` subtree, workflow artifacts under `opera/`.
- Ask for confirmation if you're not sure which bucket a new file belongs in.

# Rule for Agent and Skill

- Agents are dispatched only by Skills. Never invoke an Agent directly.
- Users call Skills (`/opera:*` slash commands); Skills dispatch Agents with the right pre-flight checks, context, and return-contract handling.
- Direct Agent invocation bypasses the Skill's clean-tree checks, front-matter parsing, audit logging, and execution-checklist flips — treat it as a contract violation.
- When the user's intent is to write code, test scripts, or update documents, always check for a suitable Opera skill first before taking action. The skill provides the correct workflow, worktree isolation, and audit trail.

# Documentation Language

- All project documents under `docs/` (PRD / TDD / Test-Case / help / deployment) are written in: **Simplified Chinese (简体中文)**.
- Every Opera producer skill (`/opera:prd-management`, `/opera:tdd-management`, `/opera:testcase-management`, `/opera:cicd-setup`) MUST honor this language when writing or refreshing docs.
- Code / config / commit messages / agent return text are NOT governed by this rule — they follow their own conventions.
- To change the project's documentation language, re-run `/opera:init-project` Phase 1 and choose a different option; the section is refreshed in place.