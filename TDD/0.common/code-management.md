# Code Management

> Key: value

Location: local
Base branch: main
Branch pattern: {feat,fix,chore}/{slug}
Branch policy: ask
Uniformity: uniform

## Per-repo overrides

(Not applicable — uniformity is set to `uniform`.)

## Notes

- Location inferred as `local` because the project root has no git remote origin.
- Branch pattern follows naming §3 default (`{feat,fix,chore}/{slug}`).
- Branch policy `ask` means the agent confirms branch creation with the user before proceeding.
- Full customization (base / pattern / policy / uniformity) is available anytime via `/opera:cicd-setup`.

## Back-compat

- Location derived from git-remote presence check on project root (no remote found → local).
- Base branch: `main` (default).
- Branch pattern: `{feat,fix,chore}/{slug}` (naming §3 default).
- Branch policy: `ask` (safe default).
- Uniformity: `uniform` (single-repo project).