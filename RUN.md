# Local run — Mythology God Shorts

App folder: `mythologyGodShorts/`  
Live site (GitHub Pages): https://rawatji0707.github.io/oneVideoCreation/mythologyGodShorts/

## Recommended: Node dev server (JSON sync on disk)

Use this when editing gods/backgrounds/beats in the UI and you want **`godCharacter.json`** (and other catalog JSON) updated in the repo without a commit workflow for every test.

**Requirements:** Node 18+ (no npm install needed).

From the **repo root** (`oneVideoCreation`):

```powershell
cd dev-local
npm start
```

Or without `npm`:

```powershell
node dev-local/server.mjs
```

Open the URL printed in the terminal (usually **http://127.0.0.1:8080/**).

- If port **8080** is busy, the server tries **8081, 8082, …** automatically.
- Use a different starting port (PowerShell):

```powershell
$env:PORT = "8787"
npm start
```

- **Remove localstorage** in the app header, then reload, to re-fetch JSON from the server after you change files on disk.
- Listens on **127.0.0.1** only (local machine).

More detail: [dev-local/README.md](dev-local/README.md)

---

## Quick view only: Python static server

Use when you only need to open the UI and load JSON via `fetch` — **Add / Update / Delete will not write to JSON files** (only `localStorage`).

From the **repo root**:

```powershell
python -m http.server 8080 --directory mythologyGodShorts
```

Open **http://localhost:8080/**

Or from inside the app folder:

```powershell
cd mythologyGodShorts
python -m http.server 8080
```

---

## GitHub Pages vs local

| | GitHub Pages | Node dev (`dev-local`) | Python static |
|--|--------------|------------------------|---------------|
| Catalog source | `*.json` via fetch | `*.json` via fetch | `*.json` via fetch |
| UI saves | `localStorage` | `localStorage` + **writes JSON files** | `localStorage` only |
| Best for | Phone / sharing URL | Daily editing on PC | Quick preview |

---

## Check tools (optional)

```powershell
node --version
python --version
```
