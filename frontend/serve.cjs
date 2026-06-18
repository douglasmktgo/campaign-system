// Zero-dependency static server for the built frontend (dist/).
// Used as a fallback launcher in environments where Vite's dev server can't
// run (e.g. corporate EDR quarantining node/esbuild binaries). Uses only
// Node's built-in http/fs/path — no node_modules required.
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 5173;
const DIST = path.join(__dirname, "dist");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function send(res, status, body, type) {
  res.writeHead(status, { "Content-Type": type || "text/plain; charset=utf-8" });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  let filePath = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);

  // Prevent path traversal outside dist.
  if (!filePath.startsWith(DIST)) return send(res, 403, "Forbidden");

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      // SPA fallback: serve index.html for client-side routes.
      const index = path.join(DIST, "index.html");
      if (fs.existsSync(index)) {
        return send(res, 200, fs.readFileSync(index), TYPES[".html"]);
      }
      return send(res, 404, "Not found");
    }
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, fs.readFileSync(filePath), TYPES[ext] || "application/octet-stream");
  });
});

server.listen(PORT, () => {
  console.log(`Static server (dist) on http://localhost:${PORT}`);
});
