# Railway Matrix BD — Architecture

How the desktop/mobile app in this folder is put together. Repo setup, commands and contribution rules live in the [root README](../../README.md).

React + TypeScript frontend inside a Tauri v2 shell. In the packaged app, API calls go through Tauri's HTTP plugin; when running in a plain browser (Vite dev), they go through the Vite proxy configured in `vite.config.ts`.

## Tech stack

- React 18.3 with TypeScript 5.6
- Zustand for state management
- HeroUI + Tailwind CSS for the UI
- Vite 6 for dev/build tooling
- Tauri v2 (Rust) for the native shell
- Tauri plugins: `updater`, `process`, `clipboard-manager`, `http`, `os`, `opener`

## Folder layout

```
apps/desktop/
├── src/
│   ├── components/
│   │   ├── home/          # feature screens (matrix, route, train form, auth, ...)
│   │   └── global/        # shared chrome (desktop/mobile menubar, footer)
│   ├── constants/         # StationList.ts, TrainList.ts, DemoMatrix.ts
│   ├── interface/         # TypeScript types (metadata, stations, trains, stores)
│   ├── routes/            # React Router pages (Home, Update)
│   ├── store/             # Zustand stores
│   ├── ui/                # small shared components
│   ├── utils/             # http.ts and other helpers
│   ├── App.tsx            # shell/layout, theme + OS + update wiring
│   └── main.tsx           # router, providers
├── src-tauri/
│   ├── capabilities/      # permission grants (default.json, desktop.json)
│   ├── src/               # Rust entrypoint, plugin registration
│   ├── Cargo.toml
│   └── tauri.conf.json    # window, bundle, updater config
├── index.html
├── package.json
└── vite.config.ts
```

The `Makefile` lives at the repo root and wraps every command; there is no per-app Makefile.

## Core implementation

### 1. Persistent authentication store

**Files:** `src/store/AuthorizationStore.ts`, `src/components/home/AuthorizationComponent.tsx`

The Railway API needs a Bearer token plus two device values (`x-device-key`/SSDK and `x-device-id`/UUDID). They persist across restarts with Zustand's `persist` middleware.

```typescript
interface AuthorizationStoreState {
  token: string | null;
  ssdk: string | null;
  uudid: string;
  setToken: (token: string) => void;
  setSsdk: (ssdk: string) => void;
  setUudid: (uudid: string) => void;
  resetAuthData: () => void;
}

export const useAuthorizationStore = create<AuthorizationStoreState>()(
  persist(
    (set) => ({
      token: null,
      ssdk: null,
      uudid: "",
      setToken: (token: string) => set({ token }),
      setSsdk: (ssdk: string) => set({ ssdk }),
      setUudid: (uudid: string) => set({ uudid }),
      resetAuthData: () => set({ token: null, ssdk: null, uudid: "" }),
    }),
    {
      name: "railwaymatrix_auth",
      version: 2,
    }
  )
);
```

Paste buttons read the clipboard through `@tauri-apps/plugin-clipboard-manager` as shown in section 5.

### 2. Train search with device headers

**Files:** `src/store/trainStore.ts`, `src/components/home/TrainForm.tsx`

Every request carries the auth triple, read directly from the store so the fetch code doesn't depend on React hooks:

```typescript
const { token, ssdk, uudid } = useAuthorizationStore.getState();

const response = await fetch(tempUrl, {
  headers: {
    Authorization: `Bearer ${token}`,
    "x-device-id": uudid,
    "x-device-key": ssdk,
  },
});
```

`src/utils/http.ts` centralises this: in Tauri it uses the HTTP plugin, in the browser it rewrites the URL through the dev proxies (`/railway-api`, `/github-raw`).

### 3. Rate-limited seat matrix

**Files:** `src/store/matrixStore.ts`, `src/components/home/MatrixBox.tsx`

A full matrix is O(n²) seat-availability calls. Firing them all at once triggered HTTP 429 and took 85–90 s. The fix is batched, staggered requests with silent retries:

```typescript
const BATCH_SIZE = 3;
const DELAY_BETWEEN_REQUESTS = 50;  // ms stagger inside a batch
const DELAY_BETWEEN_BATCHES = 150;  // ms pause between batches
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

for (let i = 0; i < fetchTasks.length; i += BATCH_SIZE) {
  const batch = fetchTasks.slice(i, i + BATCH_SIZE);

  const batchPromises = batch.map(
    (task, index) =>
      new Promise<void>((resolve) => {
        setTimeout(async () => {
          await task();
          resolve();
        }, index * DELAY_BETWEEN_REQUESTS);
      })
  );

  await Promise.all(batchPromises);

  if (i + BATCH_SIZE < fetchTasks.length) {
    await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
  }
}
```

Each task retries on 429 up to `MAX_RETRIES` times, then gives up quietly. Result: 105 requests (15 stations) complete in 35 batches in 18–23 s.

### 4. Segmented route finder (BFS)

**Files:** `src/store/matrixStore.ts`, `src/components/home/SegmentedRoute.tsx`

When the direct route has no seats, the matrix is treated as a graph: a station pair is an edge when it has available seats. BFS over paths gives the route with the fewest segments.

```typescript
const queue: number[][] = [[start]];
const visited: Set<string> = new Set();

while (queue.length > 0) {
  const path = queue.shift()!;
  const last = path[path.length - 1];

  if (last === end) return path;

  for (let next = 0; next < dataMatrix.length; next++) {
    const edge = dataMatrix[last][next];
    if (edge && Array.isArray(edge) && edge.length > 0 && !path.includes(next)) {
      const newPath = [...path, next];
      const key = newPath.join("-");
      if (!visited.has(key)) {
        queue.push(newPath);
        visited.add(key);
      }
    }
  }
}

return [];
```

Visited paths (not just nodes) are tracked so cycles can't loop and the same path combination isn't explored twice.

### 5. Native clipboard access

**Files:** `src/components/home/AuthorizationComponent.tsx`, `src-tauri/Cargo.toml`

Browser clipboard APIs don't work in the Tauri webview. The clipboard-manager plugin does, and it's only invoked when the user clicks a paste button:

```typescript
import { readText } from "@tauri-apps/plugin-clipboard-manager";

const handlePaste = async (field: "token" | "ssdk" | "uudid") => {
  try {
    const clipboardText = await readText();
    if (!clipboardText) return;
    if (field === "token") setToken(clipboardText);
    if (field === "ssdk") setSsdk(clipboardText);
    if (field === "uudid") setUudid(clipboardText);
  } catch (error) {
    // toast shown to the user
  }
};
```

Fields use `type="password"` so credentials are masked on screen. Permission is granted in `src-tauri/capabilities/default.json`.

### 6. Journey date handling

**Files:** `src/store/journeyStore.ts`, `src/components/home/DatePickerComponent.tsx`

The API wants `DD-MMM-YYYY` ("15-Dec-2024") while HeroUI's DatePicker returns a structured value. Both formats are kept in the store:

```typescript
const tempDate = `${date.year}-${date.month}-${date.day}`;           // internal
const tempFormatedDate = `${date.day}-${monthList[date.month - 1]}-${date.year}`; // API

set({ journeyDate: tempDate, formattedJourneyDate: tempFormatedDate });
```

Search is disabled until origin, destination, a valid date exist and origin ≠ destination.

### 7. Cross-platform UI and theming

**Files:** `src/App.tsx`, `src/store/osInfoStore.ts`, `src/store/themeStore.ts`

Platform detection comes from `@tauri-apps/plugin-os`, with a user-agent fallback for browser dev. Desktop renders `MenuBar` (custom window controls), mobile renders `MobileMenuBar`.

```typescript
const currentOS = platform(); // windows | macos | linux | android | ios
set({
  osName: currentOS,
  isMobileOS: currentOS === "android" || currentOS === "ios",
});
```

Theme is a `dark` class on `<html>` persisted in localStorage; Tailwind's `darkMode: "class"` does the rest.

### 8. Official Tauri updater

**Files:** `src/store/ApplicationStore.ts`, `src/routes/Update.tsx`, `src-tauri/tauri.conf.json`, `.github/workflows/publish.yml`

Updates use Tauri's own updater, not a hand-maintained JSON file. The plugin is desktop-only: on Android/iOS it isn't compiled in and the UI check is skipped.

**Config** (`src-tauri/tauri.conf.json`):

```json
"bundle": { "createUpdaterArtifacts": true },
"plugins": {
  "updater": {
    "pubkey": "<minisign public key>",
    "endpoints": [
      "https://github.com/AhmedTrooper/RailwayMatrixBD/releases/latest/download/latest.json"
    ]
  }
}
```

**Release pipeline:** pushing a `v*` tag runs `.github/workflows/publish.yml` on Windows/Linux/macOS with `tauri-action` pointed at `apps/desktop`. The private key (`TAURI_SIGNING_PRIVATE_KEY` + password) comes from repo secrets, so the build emits `.sig` files next to each bundle; the action uploads bundles, `.sig` files and `latest.json` to a draft release.

**Frontend:**

```typescript
detectUpdate: async () => {
  if (typeof window === "undefined" || !("__TAURI_INTERNALS__" in window)) return;
  const currentOS = platform();
  if (currentOS === "android" || currentOS === "ios") return;

  const update = await check(); // @tauri-apps/plugin-updater
  if (!update) return;

  setPendingUpdate(update);
  setOnlineVersion(update.version);
  setUpdateMetadata({
    version: update.version,
    release_date: update.date ?? "",
    notes: update.body ?? null,
    release_url: RELEASES_URL,
    features: [],
    fixed_errors: [],
    author: null,
    severity: "low",
    platforms: [],
  });
  setIsUpdateAvailable(true);
},

installUpdate: async () => {
  const update = get().pendingUpdate;
  if (!update) return;
  await update.downloadAndInstall();
  await relaunch(); // @tauri-apps/plugin-process
},
```

`Metadata` is kept as the UI-facing shape, so the menubar, footer and update page didn't need a new data model. The update page renders version/notes from the release body and has the download/install button.

**Permissions:** `updater:default` in `src-tauri/capabilities/desktop.json`, `process:allow-restart` in `default.json`.

### 9. Native window management

**Files:** `src/components/global/menubar/MenuBar.tsx`, `src-tauri/tauri.conf.json`

The window is frameless (`decorations: false`), so the menubar provides drag/minimize/fullscreen/close:

```typescript
import { getCurrentWindow } from "@tauri-apps/api/window";

const startDraggingWindow = async () => getCurrentWindow().startDragging();
const handleMinimize = async () => getCurrentWindow().minimize();
const handleClose = async () => getCurrentWindow().close();

const handleFullScreen = async () => {
  const isFullscreen = await getCurrentWindow().isFullscreen();
  await getCurrentWindow().setFullscreen(!isFullscreen);
};
```

The drag region is marked with `data-tauri-drag-region`; the required window permissions are in `capabilities/default.json`.

## Data management

**Static data**

- `src/constants/StationList.ts` — 250+ stations
- `src/constants/TrainList.ts` — 130+ train services
- `src/constants/DemoMatrix.ts` — placeholder matrix for the empty state

**Stores**

| Store | Responsibility |
| --- | --- |
| `AuthorizationStore` | token/SSDK/UUDID, persisted in localStorage |
| `matrixStore` | seat matrix, segmented route finding |
| `trainStore` | search results, route info, header building |
| `journeyStore` | stations, dates, validation |
| `ApplicationStore` | app version, updater state/metadata |
| `themeStore` | dark/light persistence |
| `osInfoStore` | platform detection |
| `stationListStore`, `trainListStore` | static list loading |

**API integration**

- Base: `https://railspaapi.shohoz.com/v1.0/web/`
- Auth: Bearer token + `x-device-id` + `x-device-key`
- Endpoints: `/bookings/search-trips-v2` (search), `/bookings/seat-availability` (matrix)
- Rate limiting: 3 requests per batch, 50 ms stagger, 150 ms between batches, max 2 retries on 429

## Technical considerations

**Performance**

- batched/staggered API calls (85–90 s → 18–23 s for a 15-station matrix)
- Zustand selectors keep re-renders scoped
- matrix table renders with sticky headers and overflow handling

**Error handling**

- 429s retry silently, other failures surface as toasts
- form validation blocks impossible searches
- empty/error states instead of blank screens

**Security**

- credentials live only in local storage on the device, never on a server
- password inputs mask tokens; clipboard access is user-triggered
- HTTPS only; CSP is `null` in `tauri.conf.json`, so the renderer is trusted code only — don't add remote scripts
- no remote update manifest beyond the signed `latest.json`

**Accessibility**

- keyboard navigation, screen-reader-friendly tables, high-contrast dark/light themes
