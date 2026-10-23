# Commit Rules

Applies to every commit in this repo, whoever makes it (human or agent).

## Commit message

- The headline is a single line. Extra info goes in the body, never in the headline.
- Write it like a human: say what changed and why. No AI-ness — no emoji spam, no marketing words, no "various improvements", no summary-of-nothing.
- Never append `Co-authored-by: ...` or any "generated with ..." trailer.
- Body is optional. If used, one blank line after the headline.

Good:

```
move tauri app into apps/desktop for a monorepo layout

also switched installs to bun and added a root Makefile
```

Bad:

```
feat(core): ✨ enhance repo structure using best practices 🚀 (AI-assisted)

Co-authored-by: SomeAgent <noreply@agents.example>
```

## Pre-commit rule

Before any commit, run:

```sh
make build lint fmt clippy check
```

All five must pass:

1. `make build` — `bun run build` (tsc + vite build, frontend)
2. `make lint` — `bun run lint` (tsc --noEmit, frontend)
3. `make fmt` — `cargo fmt` (src-tauri). If it rewrites files, stage the result and re-run the checks.
4. `make clippy` — `cargo clippy` (src-tauri)
5. `make check` — `cargo check` (src-tauri)

If any of them fails: fix the problem, re-run all five, then commit. Never knowingly commit failing checks. `--no-verify` is for emergencies only, and the fix must follow immediately.

The installed `.git/hooks/pre-commit` enforces this automatically (it runs the four make targets and `cargo fmt --check` so it never rewrites files mid-commit).

## Who commits

Don't commit on your own. Commits happen when the user explicitly asks for it, and only after the pre-commit rule passes.
