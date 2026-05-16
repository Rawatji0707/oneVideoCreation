# Local dev server (Node)

Serves `mythologyGodShorts/` and writes catalog JSON **to disk** when you Add / Update / Delete in the UI (same behavior as before, plus file sync).

**GitHub Pages** is unchanged: the app uses `localStorage` only there (no write API).

## Requirements

- Node 18+ recommended (uses built-in `http` / `fs` only — no npm dependencies).

## Run

From repo root:

```bash
cd dev-local
npm start
```

Or:

```bash
node dev-local/server.mjs
```

Open **http://127.0.0.1:8080/** (or whatever port is printed — if **8080 is busy**, e.g. Python `http.server`, the server tries **8081, 8082, …** up to 30 ports ahead).

- Listens on **127.0.0.1** only (not exposed on your LAN).
- Default first port **8080**; set a different starting port with `PORT` (PowerShell: `$env:PORT=8787; npm start`).

If **8080 is already in use** (e.g. Python `http.server`), either stop that process or use another base port — the dev server will **auto-increment** until it finds a free port.

After using a plain static server on localhost, **reload the tab** before using this server so catalog disk sync is retried (the app stops POSTing after a `404` from `/__dev/write-catalog` until reload).

## vs `python -m http.server`

Python’s static server **cannot** save `godCharacter.json` from the browser. Use this Node server when you want **direct JSON file sync** while testing locally.
