# 🚆 Railway Matrix BD

Check Bangladesh Railway seat availability for a whole route at once. Instead of opening segment after segment, Railway Matrix BD renders every origin–destination pair on your route as a matrix with live seat counts, so you can see exactly where seats exist and plan around the segments that are full.

Desktop (Windows/Linux/macOS) and Android, built with React + Tauri v2.

<p align="center">
  <img src="assets/First%20part.png" alt="Route search and seat matrix" width="400" />
  <img src="assets/Second%20Part.png" alt="Trip details and segmented route" width="400" />
</p>

## What you can do

- **See the whole route at once** — one matrix for every station pair, with real-time seat counts instead of checking each segment by hand.
- **Find a way around full segments** — when a direct pair has no seats, the app suggests the shortest multi-segment route that does.
- **Search 250+ stations and 130+ trains** — pick your train, date and stations, then generate the matrix.
- **Switch themes** — dark and light mode, remembered between launches.
- **Update from inside the app** — desktop builds check GitHub releases and install signed updates.

Seat search currently covers the **SHULOV** class. Android and desktop builds need an internet connection — all data comes live from the Railway API.

## Getting started

The app talks to the Railway API with your own session credentials.

1. **Download** the latest build from the [Releases page](https://github.com/AhmedTrooper/RailwayMatrixBD/releases).
2. **Log in** at [https://eticket.railway.gov.bd/](https://eticket.railway.gov.bd/).
3. **Open DevTools** with `F12` (or right-click → Inspect).
   - Chrome/Edge: **Application** → **Local Storage** → `https://eticket.railway.gov.bd`
   - Firefox: **Storage** → **Local Storage** → `https://eticket.railway.gov.bd`
4. **Copy** three values: `token`, `x-device-key` (SSDK) and `x-device-id` (UUDID).
5. **Paste** them into the app's Authorization form.

> These values are session-specific and stay on your device. Refresh them when the session expires.

## For developers

Architecture, stores, API flow and updater internals: [apps/desktop/README.md](apps/desktop/README.md).

### Requirements

- **bun** — the only JS runtime and package manager used here
- Rust stable toolchain
- Tauri v2 system dependencies for your OS (WebView2 on Windows, webkit2gtk on Linux, Xcode tools on macOS)
- Android SDK + NDK if you build for Android

### Clone and run

Clone the `dev` branch, not `main`:

```sh
git clone -b dev https://github.com/AhmedTrooper/RailwayMatrixBD.git
cd RailwayMatrixBD
make install
make tauri-dev
```

### Commands

Everything goes through `make`; don't run raw `bun`/`cargo` commands. If a target is missing, add it to the root `Makefile` in the same PR.

| Command | What it does |
| --- | --- |
| `make install` | `bun install` in `apps/desktop` |
| `make tauri-dev` | desktop dev loop |
| `make tauri-android-dev` | Android dev loop |
| `make build` | frontend build (`tsc` + `vite build`) |
| `make lint` | frontend type check |
| `make fmt` | `cargo fmt` for `src-tauri` |
| `make clippy` | `cargo clippy` for `src-tauri` |
| `make check` | `cargo check` for `src-tauri` |
| `make tauri-build` | signed desktop release build (maintainers/CI — needs the updater signing keys) |
| `make tauri-android-build` | Android release build |
| `make add ARGS="pkg"` | add a dependency (`ARGS="-d pkg"` for dev deps) |
| `make help` | list targets |

### Runtime rules

- Use **bun only** for JS: no npm, yarn or pnpm, and don't commit their lockfiles.
- Dependencies are added with `make add`, never by editing `package.json` by hand.
- This is a Tauri app: plain `bun run dev` only serves the frontend in a browser; use `make tauri-dev` for real work.

### Branches and pull requests

- `dev` is the integration branch, `main` is releases.
- **Never push directly to `main` or `dev`**, even if you have write access. Branch off `dev`, open a PR into `dev`.
- Name branches `feat/...`, `fix/...` or `chore/...`, and keep PRs focused.
- Fork-based PRs and branches from this repo are both fine.

### Checks before committing

Run and pass all of them:

```sh
make build lint fmt clippy check
```

The git pre-commit hook enforces the same checks (it runs the make targets plus `cargo fmt --check`). Don't commit with `--no-verify`; if the hook fails, fix the code.

Commit message rules live in [COMMIT_RULES.md](COMMIT_RULES.md): one-line headline, details in the body, human wording, no `Co-authored-by` trailers.

### Releases

Maintainers only: bump the version in `apps/desktop/src-tauri/tauri.conf.json`, merge to `main`, then push a matching tag (`v0.9.0`). The tag runs the release workflow, which builds and signs the bundles, generates `.sig` files and `latest.json`, and opens a draft GitHub release.

## Acknowledgements

- [Bangladesh Railway Train Seat Matrix Web Application](https://github.com/nishatrhythm/Bangladesh-Railway-Train-Seat-Matrix-Web-Application) — matrix visualization approach
- [Bangladesh Railway Train Seat Availability Web Application](https://github.com/nishatrhythm/Bangladesh-Railway-Train-Seat-Availability-Web-Application) — API usage patterns

## License

MIT
