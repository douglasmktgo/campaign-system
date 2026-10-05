// Studio — sube, valida y publica artes en Instagram con un agente que solo actúa cuando tú apruebas.
import express from "express";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import * as store from "./lib/store.js";
import { MEDIA_DIR } from "./lib/store.js";
import { validatePost, hasErrors } from "./lib/validate.js";
import * as ig from "./lib/instagram.js";
import * as agent from "./lib/agent.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.set("trust proxy", true);
app.use(express.json({ limit: "1mb" }));

const db = store.get;
const ENV_PASSWORD = process.env.APP_PASSWORD || "";

// ---------------------------------------------------------------- utilidades

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function findPost(id) {
  const post = db().posts.find((p) => p.id === id);
  if (!post) throw new HttpError(404, "Ese arte ya no existe.");
  return post;
}
function findAccount(id) {
  return db().accounts.find((a) => a.id === id) || null;
}
function history(post, text) {
  post.history.unshift({ at: store.now(), text });
}
function recheck(post) {
  post.checks = validatePost(post);
}

// ---------------------------------------------------------------- acceso

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  return salt + ":" + crypto.scryptSync(password, salt, 32).toString("hex");
}
function checkPassword(password) {
  if (ENV_PASSWORD) {
    const a = Buffer.from(password);
    const b = Buffer.from(ENV_PASSWORD);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }
  const stored = db().settings.passwordHash;
  if (!stored) return false;
  const [salt] = stored.split(":");
  const a = Buffer.from(hashPassword(password, salt));
  const b = Buffer.from(stored);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function sign(value) {
  return crypto.createHmac("sha256", db().settings.sessionSecret).update(value).digest("hex");
}
function setSession(req, res) {
  const expires = String(Date.now() + 30 * 24 * 3600 * 1000);
  res.cookie("studio_session", expires + "." + sign(expires), {
    httpOnly: true,
    sameSite: "lax",
    secure: req.secure,
    maxAge: 30 * 24 * 3600 * 1000,
  });
}
function isAuthed(req) {
  const raw = (req.headers.cookie || "").split(/;\s*/).find((c) => c.startsWith("studio_session="));
  if (!raw) return false;
  const [expires, mac] = decodeURIComponent(raw.slice("studio_session=".length)).split(".");
  if (!expires || !mac || Number(expires) < Date.now()) return false;
  const expected = sign(expires);
  return mac.length === expected.length && crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected));
}
const needsSetup = () => !ENV_PASSWORD && !db().settings.passwordHash;

const attempts = new Map();
function throttle(req) {
  const key = req.ip;
  const entry = attempts.get(key) || { n: 0, since: Date.now() };
  if (Date.now() - entry.since > 15 * 60 * 1000) Object.assign(entry, { n: 0, since: Date.now() });
  entry.n++;
  attempts.set(key, entry);
  if (entry.n > 10) throw new HttpError(429, "Demasiados intentos. Espera 15 minutos.");
}

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/api/session", (req, res) => res.json({ needsSetup: needsSetup(), authed: isAuthed(req) }));

app.post("/api/setup", (req, res) => {
  if (!needsSetup()) throw new HttpError(400, "La contraseña ya está configurada.");
  const password = String(req.body?.password || "");
  if (password.length < 8) throw new HttpError(400, "Usa al menos 8 caracteres.");
  db().settings.passwordHash = hashPassword(password);
  store.save();
  setSession(req, res);
  res.json({ ok: true });
});

app.post("/api/login", (req, res) => {
  throttle(req);
  if (!checkPassword(String(req.body?.password || ""))) throw new HttpError(401, "Contraseña incorrecta.");
  attempts.delete(req.ip);
  setSession(req, res);
  res.json({ ok: true });
});

app.post("/api/logout", (_req, res) => {
  res.clearCookie("studio_session");
  res.json({ ok: true });
});

// Todo lo que sigue requiere sesión.
app.use("/api", (req, _res, next) => {
  if (!isAuthed(req)) return next(new HttpError(401, "Inicia sesión."));
  next();
});

// Recuerda la URL pública con la que se abre la app (Instagram necesita descargar los artes desde ahí).
let lastOrigin = "";
app.use((req, _res, next) => {
  if (req.headers.host) lastOrigin = `${req.protocol}://${req.headers.host}`;
  next();
});
function publicBase() {
  return (db().settings.publicUrl || process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || lastOrigin).replace(/\/$/, "");
}

// ---------------------------------------------------------------- estado

function publicAccount(a) {
  const { token, ...rest } = a;
  return rest;
}

app.get("/api/state", (_req, res) => {
  const d = db();
  res.json({
    accounts: d.accounts.map(publicAccount),
    posts: d.posts,
    proposals: d.proposals.slice(0, 100),
    activity: d.activity.slice(0, 40),
    settings: {
      hasAnthropic: Boolean(d.settings.anthropicKey || process.env.ANTHROPIC_API_KEY),
      publicUrl: d.settings.publicUrl,
      effectivePublicUrl: publicBase(),
      brandGuide: d.settings.brandGuide,
      passwordFromEnv: Boolean(ENV_PASSWORD),
    },
  });
});

const anthropicKey = () => db().settings.anthropicKey || process.env.ANTHROPIC_API_KEY || "";

// ---------------------------------------------------------------- cuentas

app.post("/api/accounts", wrap(async (req, res) => {
  const token = String(req.body?.token || "").trim();
  if (!token) throw new HttpError(400, "Pega el token de acceso.");
  let found;
  try {
    found = await ig.discoverAccounts(token);
  } catch (e) {
    throw new HttpError(400, e.message);
  }
  const d = db();
  const added = [];
  for (const f of found) {
    const existing = d.accounts.find((a) => a.igUserId === f.igUserId);
    if (existing) {
      Object.assign(existing, f, { token, status: "ok" });
    } else {
      d.accounts.push({ id: store.id("acc"), ...f, token, demo: false, status: "ok", connectedAt: store.now() });
    }
    added.push("@" + f.username);
  }
  store.log(`Cuenta conectada: ${added.join(", ")}`, "success");
  store.save();
  res.json({ ok: true, added });
}));

app.post("/api/accounts/demo", (_req, res) => {
  const d = db();
  const n = d.accounts.filter((a) => a.demo).length + 1;
  d.accounts.push({
    id: store.id("acc"),
    igUserId: "demo" + n,
    username: n === 1 ? "tu.marca.demo" : `tu.marca.demo${n}`,
    name: "Cuenta de prueba",
    avatar: "",
    followers: null,
    token: "",
    demo: true,
    status: "ok",
    connectedAt: store.now(),
  });
  store.log("Cuenta de prueba añadida (simula publicaciones, no publica en Instagram).");
  store.save();
  res.json({ ok: true });
});

app.post("/api/accounts/:id/test", wrap(async (req, res) => {
  const acc = findAccount(req.params.id);
  if (!acc) throw new HttpError(404, "Cuenta no encontrada.");
  if (acc.demo) return res.json({ ok: true, msg: "Cuenta de prueba: todo correcto." });
  try {
    const found = await ig.discoverAccounts(acc.token);
    const me = found.find((f) => f.igUserId === acc.igUserId) || found[0];
    Object.assign(acc, { avatar: me.avatar, followers: me.followers, name: me.name, status: "ok" });
    store.save();
    res.json({ ok: true, msg: `Conectada como @${me.username}` });
  } catch (e) {
    acc.status = "error";
    store.save();
    throw new HttpError(400, e.message);
  }
}));

app.delete("/api/accounts/:id", (req, res) => {
  const d = db();
  const acc = findAccount(req.params.id);
  if (!acc) throw new HttpError(404, "Cuenta no encontrada.");
  if (d.posts.some((p) => p.accountId === acc.id && p.status === "scheduled")) {
    throw new HttpError(400, "Esta cuenta tiene publicaciones programadas. Desprográmalas primero.");
  }
  d.accounts = d.accounts.filter((a) => a.id !== acc.id);
  store.log(`Cuenta desconectada: @${acc.username}`);
  store.save();
  res.json({ ok: true });
});

// ---------------------------------------------------------------- archivos

const ALLOWED = { "image/jpeg": ".jpg", "image/png": ".png", "video/mp4": ".mp4", "video/quicktime": ".mov" };

app.post("/api/media", express.raw({ type: () => true, limit: "300mb" }), (req, res) => {
  const mime = String(req.headers["content-type"] || "").split(";")[0];
  if (!ALLOWED[mime]) throw new HttpError(400, "Formato no admitido. Usa JPG, PNG, MP4 o MOV.");
  if (!req.body?.length) throw new HttpError(400, "El archivo está vacío.");
  // Nombre aleatorio e impredecible: los archivos son públicos para que Instagram pueda descargarlos.
  const file = crypto.randomBytes(16).toString("hex") + ALLOWED[mime];
  fs.writeFileSync(path.join(MEDIA_DIR, file), req.body);
  const num = (h) => (Number.isFinite(Number(req.headers[h])) ? Number(req.headers[h]) : null);
  res.json({
    file,
    url: "/media/" + file,
    mime,
    size: req.body.length,
    width: num("x-width"),
    height: num("x-height"),
    duration: num("x-duration"),
    name: decodeURIComponent(String(req.headers["x-filename"] || file)).slice(0, 120),
  });
});

function cleanMedia(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((m) => m && /^[a-f0-9]{32}\.(jpg|png|mp4|mov)$/.test(m.file) && fs.existsSync(path.join(MEDIA_DIR, m.file)))
    .map((m) => ({
      file: m.file,
      url: "/media/" + m.file,
      mime: Object.keys(ALLOWED).find((k) => ALLOWED[k] === path.extname(m.file)) || m.mime,
      size: fs.statSync(path.join(MEDIA_DIR, m.file)).size,
      width: Number(m.width) || null,
      height: Number(m.height) || null,
      duration: Number(m.duration) || null,
      name: String(m.name || "").slice(0, 120),
    }));
}

// ---------------------------------------------------------------- artes

function runReview(post) {
  const key = anthropicKey();
  if (!key) return;
  post.aiReview = { pending: true };
  agent
    .reviewPost(key, post, db().settings.brandGuide)
    .then((review) => {
      post.aiReview = review;
      store.log(`IA revisó «${post.title}»: ${review.score}/100`, review.verdict === "listo" ? "success" : "info");
    })
    .catch((e) => {
      post.aiReview = { error: e.message };
    })
    .finally(() => store.save());
}

app.post("/api/posts", (req, res) => {
  const b = req.body || {};
  const media = cleanMedia(b.media);
  if (!media.length) throw new HttpError(400, "Sube al menos un archivo.");
  const isVideo = media.length === 1 && media[0].mime.startsWith("video/");
  const post = {
    id: store.id("post"),
    title: String(b.title || media[0].name.replace(/\.[^.]+$/, "") || "Arte sin título").slice(0, 80),
    accountId: findAccount(b.accountId) ? b.accountId : "",
    type: isVideo ? "REELS" : media.length > 1 ? "CAROUSEL" : "IMAGE",
    media,
    caption: String(b.caption || "").slice(0, 5000),
    status: "review",
    scheduledAt: null,
    checks: [],
    aiReview: null,
    history: [],
    note: "",
    createdAt: store.now(),
  };
  recheck(post);
  history(post, "Arte subido y enviado a revisión");
  db().posts.unshift(post);
  store.log(`Nuevo arte para revisar: «${post.title}»`);
  store.save();
  runReview(post);
  res.json(post);
});

const LOCKED = ["publishing", "published"];

app.patch("/api/posts/:id", (req, res) => {
  const post = findPost(req.params.id);
  if (LOCKED.includes(post.status)) throw new HttpError(400, "Un arte publicado no se puede editar.");
  const b = req.body || {};
  let contentChanged = false;
  if (typeof b.title === "string") post.title = b.title.slice(0, 80) || post.title;
  if (typeof b.caption === "string" && b.caption !== post.caption) {
    post.caption = b.caption.slice(0, 5000);
    contentChanged = true;
  }
  if (typeof b.accountId === "string" && b.accountId !== post.accountId) {
    if (b.accountId && !findAccount(b.accountId)) throw new HttpError(400, "Cuenta no válida.");
    post.accountId = b.accountId;
    contentChanged = true;
  }
  recheck(post);
  // Si cambias el contenido de algo ya aprobado, vuelve a revisión: nada se publica sin tu visto bueno final.
  if (contentChanged && ["approved", "scheduled", "rejected", "failed"].includes(post.status)) {
    post.status = "review";
    post.scheduledAt = null;
    history(post, "Editado: vuelve a revisión");
  }
  store.save();
  res.json(post);
});

app.post("/api/posts/:id/approve", wrap(async (req, res) => {
  const post = findPost(req.params.id);
  if (LOCKED.includes(post.status)) throw new HttpError(400, "Este arte ya se publicó.");
  recheck(post);
  if (hasErrors(post.checks)) throw new HttpError(400, "Corrige los errores de validación antes de aprobar.");
  const { scheduledAt, publishNow } = req.body || {};
  post.status = "approved";
  post.note = "";
  history(post, "Aprobado por ti");
  if (scheduledAt) {
    schedule(post, scheduledAt);
  } else {
    post.scheduledAt = null;
  }
  store.log(`Aprobado: «${post.title}»`, "success");
  store.save();
  if (publishNow) await publishPost(post);
  res.json(post);
}));

function schedule(post, when) {
  const t = Date.parse(when);
  if (Number.isNaN(t)) throw new HttpError(400, "Fecha no válida.");
  if (t < Date.now() - 60 * 1000) throw new HttpError(400, "Esa fecha ya pasó. Elige una futura.");
  post.status = "scheduled";
  post.scheduledAt = new Date(t).toISOString();
  history(post, "Programado para " + post.scheduledAt);
}

app.post("/api/posts/:id/schedule", (req, res) => {
  const post = findPost(req.params.id);
  if (!["approved", "scheduled", "failed"].includes(post.status)) throw new HttpError(400, "Aprueba el arte antes de programarlo.");
  schedule(post, req.body?.scheduledAt);
  store.save();
  res.json(post);
});

app.post("/api/posts/:id/unschedule", (req, res) => {
  const post = findPost(req.params.id);
  if (post.status !== "scheduled") throw new HttpError(400, "Este arte no está programado.");
  post.status = "approved";
  post.scheduledAt = null;
  history(post, "Programación cancelada");
  store.save();
  res.json(post);
});

app.post("/api/posts/:id/reject", (req, res) => {
  const post = findPost(req.params.id);
  if (LOCKED.includes(post.status)) throw new HttpError(400, "Este arte ya se publicó.");
  post.status = "rejected";
  post.scheduledAt = null;
  post.note = String(req.body?.note || "").slice(0, 500);
  history(post, "Rechazado" + (post.note ? ": " + post.note : ""));
  store.log(`Rechazado: «${post.title}»`);
  store.save();
  res.json(post);
});

app.post("/api/posts/:id/publish", wrap(async (req, res) => {
  const post = findPost(req.params.id);
  if (!["approved", "scheduled", "failed"].includes(post.status)) throw new HttpError(400, "Aprueba el arte antes de publicarlo.");
  await publishPost(post);
  res.json(post);
}));

app.post("/api/posts/:id/review", (req, res) => {
  const post = findPost(req.params.id);
  if (!anthropicKey()) throw new HttpError(400, "Agrega tu API key de Anthropic en Ajustes.");
  runReview(post);
  store.save();
  res.json(post);
});

app.delete("/api/posts/:id", (req, res) => {
  const post = findPost(req.params.id);
  if (post.status === "publishing") throw new HttpError(400, "Se está publicando ahora mismo.");
  const d = db();
  d.posts = d.posts.filter((p) => p.id !== post.id);
  for (const m of post.media) {
    if (!d.posts.some((p) => p.media.some((x) => x.file === m.file))) fs.rmSync(path.join(MEDIA_DIR, m.file), { force: true });
  }
  for (const pr of d.proposals) if (pr.postId === post.id && pr.status === "pending") pr.status = "rejected";
  store.log(`Eliminado: «${post.title}»`);
  store.save();
  res.json({ ok: true });
});

// ---------------------------------------------------------------- publicación

async function publishPost(post) {
  const account = findAccount(post.accountId);
  const fail = (msg) => {
    post.status = "failed";
    post.error = msg;
    history(post, "Error al publicar: " + msg);
    store.log(`No se pudo publicar «${post.title}»: ${msg}`, "error");
    store.save();
  };
  if (!account) return fail("La cuenta de Instagram ya no está conectada.");
  const base = publicBase();
  if (!account.demo && (!base.startsWith("https://") || /localhost|127\.0\.0\.1/.test(base))) {
    return fail("Instagram necesita descargar el arte desde una URL pública https. Configúrala en Ajustes.");
  }
  post.status = "publishing";
  post.error = "";
  store.save();
  try {
    const result = await ig.publish(account, post, post.media.map((m) => base + m.url));
    post.status = "published";
    post.publishedAt = store.now();
    post.permalink = result.permalink;
    post.mediaId = result.mediaId;
    history(post, account.demo ? "Publicado (simulado en cuenta de prueba)" : "Publicado en Instagram");
    store.log(`Publicado en @${account.username}: «${post.title}»`, "success");
    store.save();
  } catch (e) {
    fail(e.message);
  }
}

// Programador: revisa cada 30 s si hay artes aprobados cuya hora ya llegó.
let ticking = false;
async function tick() {
  if (ticking) return;
  ticking = true;
  try {
    const due = db().posts.filter((p) => p.status === "scheduled" && Date.parse(p.scheduledAt) <= Date.now());
    for (const post of due) await publishPost(post);
  } finally {
    ticking = false;
  }
}

// Si el servidor se reinició a mitad de una publicación, no reintentamos a ciegas (evita duplicados).
for (const p of db().posts) {
  if (p.status === "publishing") {
    p.status = "failed";
    p.error = "La publicación se interrumpió. Revisa en Instagram si salió antes de reintentar.";
  }
}
store.save();

// ---------------------------------------------------------------- agente

app.post("/api/agent", wrap(async (req, res) => {
  const command = String(req.body?.command || "").trim().slice(0, 2000);
  if (!command) throw new HttpError(400, "Escribe qué quieres que haga el agente.");
  const d = db();
  let plan;
  try {
    plan = await agent.planFromCommand(anthropicKey(), {
      command,
      posts: d.posts,
      accounts: d.accounts,
      nowIso: new Date().toISOString(),
      timezone: String(req.body?.timezone || ""),
    });
  } catch (e) {
    throw new HttpError(400, e.message);
  }
  const created = plan.actions.map((a) => ({
    id: store.id("prop"),
    kind: a.kind,
    postId: a.postId,
    scheduledAt: a.kind === "schedule" ? new Date(a.scheduledAt).toISOString() : null,
    caption: a.kind === "update_caption" ? a.caption : null,
    reason: a.reason,
    command,
    status: "pending",
    createdAt: store.now(),
  }));
  d.proposals.unshift(...created);
  if (created.length) store.log(`El agente propone ${created.length} ${created.length === 1 ? "acción" : "acciones"}`);
  store.save();
  res.json({ reply: plan.reply, proposals: created });
}));

app.post("/api/proposals/:id/approve", wrap(async (req, res) => {
  const pr = db().proposals.find((p) => p.id === req.params.id);
  if (!pr || pr.status !== "pending") throw new HttpError(404, "Esta propuesta ya no está pendiente.");
  const post = db().posts.find((p) => p.id === pr.postId);
  try {
    if (!post || LOCKED.includes(post.status)) throw new HttpError(400, "El arte ya no está disponible.");
    if (pr.kind === "update_caption") {
      post.caption = pr.caption;
      recheck(post);
      history(post, "Copy actualizado por el agente (aprobado por ti)");
    } else if (pr.kind === "unschedule") {
      if (post.status === "scheduled") {
        post.status = "approved";
        post.scheduledAt = null;
        history(post, "Programación cancelada por el agente (aprobado por ti)");
      }
    } else {
      recheck(post);
      if (hasErrors(post.checks)) throw new HttpError(400, "El arte tiene errores de validación.");
      // Aprobar la propuesta es también tu aprobación del arte.
      if (post.status !== "approved" && post.status !== "scheduled") history(post, "Aprobado por ti (vía agente)");
      post.status = "approved";
      if (pr.kind === "schedule") schedule(post, pr.scheduledAt);
    }
    pr.status = "done";
    pr.resolvedAt = store.now();
    store.save();
    if (pr.kind === "publish_now") await publishPost(post);
    res.json({ ok: true });
  } catch (e) {
    pr.status = "failed";
    pr.error = e.message;
    pr.resolvedAt = store.now();
    store.save();
    throw e;
  }
}));

app.post("/api/proposals/:id/reject", (req, res) => {
  const pr = db().proposals.find((p) => p.id === req.params.id);
  if (!pr || pr.status !== "pending") throw new HttpError(404, "Esta propuesta ya no está pendiente.");
  pr.status = "rejected";
  pr.resolvedAt = store.now();
  store.save();
  res.json({ ok: true });
});

// ---------------------------------------------------------------- ajustes

app.post("/api/settings", (req, res) => {
  const s = db().settings;
  const b = req.body || {};
  if (typeof b.anthropicKey === "string" && b.anthropicKey.trim()) s.anthropicKey = b.anthropicKey.trim();
  if (b.removeAnthropicKey) s.anthropicKey = "";
  if (typeof b.publicUrl === "string") {
    const url = b.publicUrl.trim().replace(/\/$/, "");
    if (url && !/^https:\/\/[^\s]+$/.test(url)) throw new HttpError(400, "La URL pública debe empezar por https://");
    s.publicUrl = url;
  }
  if (typeof b.brandGuide === "string") s.brandGuide = b.brandGuide.slice(0, 4000);
  if (typeof b.newPassword === "string" && b.newPassword) {
    if (ENV_PASSWORD) throw new HttpError(400, "La contraseña está definida en el servidor (APP_PASSWORD).");
    if (!checkPassword(String(b.currentPassword || ""))) throw new HttpError(400, "La contraseña actual no es correcta.");
    if (b.newPassword.length < 8) throw new HttpError(400, "Usa al menos 8 caracteres.");
    s.passwordHash = hashPassword(b.newPassword);
  }
  store.save();
  res.json({ ok: true });
});

app.post("/api/settings/test-ai", wrap(async (_req, res) => {
  try {
    await agent.testKey(anthropicKey());
  } catch (e) {
    throw new HttpError(400, e.message);
  }
  res.json({ ok: true, msg: "El agente está listo." });
}));

// ---------------------------------------------------------------- estáticos y errores

app.use("/media", express.static(MEDIA_DIR, { maxAge: "7d", fallthrough: false }));
app.use(express.static(path.join(here, "public")));
app.get(/^\/(?!api|media).*/, (_req, res) => res.sendFile(path.join(here, "public", "index.html")));

app.use((err, _req, res, _next) => {
  const status = err.status || (err.type === "entity.too.large" ? 413 : 500);
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? "Error interno del servidor." : err.message });
});

const PORT = Number(process.env.PORT) || 4100;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Studio listo en http://localhost:${PORT}`));
  setInterval(tick, 30 * 1000);
}

export { app, tick };
