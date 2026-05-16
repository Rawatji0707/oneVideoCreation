/**
 * Local static server for mythologyGodShorts + POST API to write allowed JSON catalogs to disk.
 * Bind: 127.0.0.1 only. Not for production / GitHub Pages.
 */
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.resolve(__dirname, "..", "mythologyGodShorts");
const START_PORT = Number(process.env.PORT) || 8080;
const MAX_PORT = START_PORT + 30;
const HOST = process.env.HOST || "127.0.0.1";
let listenPort = START_PORT;

const ALLOWED_FILES = new Set([
  "godCharacter.json",
  "backgroundCharacter.json",
  "prioritySceneBeats.json",
  "VideoStyle.json",
  "EditingState.json",
]);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function safePublicPath(relPath) {
  const decoded = decodeURIComponent(relPath);
  const normalized = path.normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, "");
  const full = path.join(APP_DIR, normalized);
  if (!full.startsWith(APP_DIR)) {
    throw new Error("Invalid path");
  }
  return full;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8", ...headers });
  res.end(body);
}

function sendJson(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);

    if (req.method === "POST" && url.pathname === "/__dev/write-catalog") {
      const raw = await readBody(req);
      let payload;
      try {
        payload = JSON.parse(raw || "{}");
      } catch {
        send(res, 400, "Invalid JSON body");
        return;
      }
      const file = typeof payload.file === "string" ? path.basename(payload.file.trim()) : "";
      if (!ALLOWED_FILES.has(file)) {
        sendJson(res, 400, { ok: false, error: "file not allowed" });
        return;
      }
      if (!payload.doc || typeof payload.doc !== "object") {
        sendJson(res, 400, { ok: false, error: "doc must be an object" });
        return;
      }
      const target = path.join(APP_DIR, file);
      const text = `${JSON.stringify(payload.doc, null, 2)}\n`;
      await fs.writeFile(target, text, "utf8");
      sendJson(res, 200, { ok: true, file });
      return;
    }

    let pathname = url.pathname;
    if (pathname === "/") pathname = "/index.html";

    const filePath = safePublicPath(pathname.slice(1));
    let stat;
    try {
      stat = await fs.stat(filePath);
    } catch {
      send(res, 404, "Not found");
      return;
    }
    if (stat.isDirectory()) {
      const indexPath = path.join(filePath, "index.html");
      try {
        await fs.access(indexPath);
        const html = await fs.readFile(indexPath);
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(html);
        return;
      } catch {
        send(res, 403, "Directory listing disabled");
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    const buf = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": type });
    res.end(buf);
  } catch (e) {
    console.error(e);
    send(res, 500, e instanceof Error ? e.message : "Server error");
  }
});

function tryListen() {
  return new Promise((resolve, reject) => {
    const onError = (err) => {
      server.removeListener("listening", onListening);
      if (err.code === "EADDRINUSE" && listenPort < MAX_PORT) {
        console.warn(`Port ${listenPort} in use (${err.code}). Trying ${listenPort + 1}...`);
        listenPort += 1;
        setImmediate(() => {
          tryListen().then(resolve, reject);
        });
        return;
      }
      reject(err);
    };
    const onListening = () => {
      server.removeListener("error", onError);
      resolve(listenPort);
    };
    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(listenPort, HOST);
  });
}

tryListen()
  .then((port) => {
    console.log(`Mythology dev server: http://${HOST}:${port}/`);
    console.log(`  static root: ${APP_DIR}`);
    console.log(`  POST /__dev/write-catalog — allowed: ${[...ALLOWED_FILES].join(", ")}`);
  })
  .catch((err) => {
    console.error("Could not start server:", err.message);
    console.error(`Tried ports ${START_PORT}–${MAX_PORT - 1} on ${HOST}. Stop other apps (e.g. python http.server) or set PORT=8787`);
    process.exit(1);
  });
