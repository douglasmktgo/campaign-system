// Taskday — sube, valida y publica artes en Instagram con un agente que solo actúa cuando tú apruebas.
import express from "express";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import * as store from "./lib/store.js";
import { MEDIA_DIR, GUIDES_DIR } from "./lib/store.js";
import { validatePost, hasErrors } from "./lib/validate.js";
import * as ig from "./lib/instagram.js";
import * as agent from "./lib/agent.js";
import * as plan from "./lib/plan.js";
import * as prod from "./lib/produccion.js";

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
// Sin URL pública ni cuenta real conectada se publica a mano: valen PNG y 3:4.
const manualPublishing = () => /^https?:\/\/(localhost|127\.|\[::1\])/.test(publicBase() || "http://localhost") || !db().accounts.some((a) => !a.demo && a.status !== "error");
function recheck(post) {
  post.checks = validatePost(post, { manual: manualPublishing() });
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
  return { ...rest, canResearch: ig.canDiscover(a), tokenKind: a.demo ? "demo" : token?.startsWith("EAA") ? "facebook" : "instagram" };
}

app.get("/api/state", (_req, res) => {
  const d = db();
  res.json({
    accounts: d.accounts.map(publicAccount),
    posts: d.posts,
    proposals: d.proposals.slice(0, 100),
    research: d.research.slice(0, 30),
    activity: d.activity.slice(0, 40),
    plan: d.plan,
    settings: {
      hasAnthropic: Boolean(d.settings.anthropicKey || process.env.ANTHROPIC_API_KEY),
      publicUrl: d.settings.publicUrl,
      effectivePublicUrl: publicBase(),
      brandGuide: d.settings.brandGuide,
      passwordFromEnv: Boolean(ENV_PASSWORD),
      autoReview: d.settings.autoReview !== false,
      producer: prod.available(),
    },
  });
});

const anthropicKey = () => db().settings.anthropicKey || process.env.ANTHROPIC_API_KEY || "";

// ---------------------------------------------------------------- cuentas

app.post("/api/accounts", wrap(async (req, res) => {
  const token = String(req.body?.token || "").trim();
  if (!token) throw new HttpError(400, "Pega el token de acceso.");
  // Nunca mandar a Meta algo que no es un token de Meta (p. ej. una API key de Anthropic pegada aquí por error).
  if (/^sk-ant-/i.test(token)) throw new HttpError(400, "Eso es una API key de Anthropic: pégala en Ajustes → Agente de IA, no aquí.");
  if (!/^(EAA|IG)\w+$/.test(token)) throw new HttpError(400, "Eso no parece un token de Instagram. Empieza por EAA… (Facebook) o IG… (Instagram).");
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
      Object.assign(existing, f, { token, status: "ok", statusMsg: "", tokenSetAt: store.now(), checkedAt: store.now() });
    } else {
      d.accounts.push({ id: store.id("acc"), ...f, token, demo: false, status: "ok", connectedAt: store.now(), tokenSetAt: store.now(), checkedAt: store.now() });
      adoptDemo(d.accounts[d.accounts.length - 1]);
    }
    added.push("@" + f.username);
  }
  store.log(`Cuenta conectada: ${added.join(", ")}`, "success");
  store.save();
  res.json({ ok: true, added });
}));

// Si preparaste el plan con una cuenta de prueba llamada igual (p. ej. loxita.app), la cuenta real se queda con todo.
function adoptDemo(real) {
  const d = db();
  const demo = d.accounts.find((a) => a.demo && a.username.toLowerCase() === real.username.toLowerCase());
  if (!demo) return;
  if (!real.profile && demo.profile) real.profile = demo.profile;
  if (!real.produccion && demo.produccion) real.produccion = demo.produccion;
  for (const s of d.plan.slots) if (s.accountId === demo.id) s.accountId = real.id;
  for (const p of d.posts) if (p.accountId === demo.id && !["published", "publishing", "scheduled"].includes(p.status)) p.accountId = real.id;
  for (const r of d.research) if (r.accountId === demo.id) r.accountId = real.id;
  if (d.plan.summaries?.[demo.id]) d.plan.summaries[real.id] = d.plan.summaries[demo.id];
  store.log(`@${real.username} hereda el plan y el perfil de la cuenta de prueba`);
}

// Cuenta manual (sin conexión): se planifica y se publica a mano.
const PRODUCCION_KEYS = ["carpeta", "estilo", "reglasVideo", "artes"];
function cleanProduccion(p) {
  const out = {};
  if (typeof p?.carpeta === "string" && p.carpeta.trim()) {
    if (!path.isAbsolute(p.carpeta.trim())) throw new HttpError(400, "La carpeta debe ser una ruta completa (p. ej. D:\\SOY GIO).");
    out.carpeta = p.carpeta.trim().slice(0, 300);
  }
  if (typeof p?.estilo === "string" && p.estilo.trim()) {
    if (!/^[a-z0-9-]{2,30}$/.test(p.estilo.trim())) throw new HttpError(400, "El estilo solo admite letras minúsculas, números y guiones.");
    out.estilo = p.estilo.trim();
  }
  if (typeof p?.reglasVideo === "string" && p.reglasVideo.trim()) out.reglasVideo = p.reglasVideo.trim().slice(0, 4000);
  // «manual» = las artes (carruseles y posts) las hace el dueño; Taskday no las manda a producir.
  if (p?.artes === "manual") out.artes = "manual";
  return out;
}
function addManualAccount({ username, name, profile, produccion }) {
  const d = db();
  const n = d.accounts.filter((a) => a.demo).length + 1;
  const acc = {
    id: store.id("acc"),
    igUserId: "demo" + n,
    username: /^[\w.]{2,30}$/.test(username || "") ? username.toLowerCase() : n === 1 ? "tu.marca.demo" : `tu.marca.demo${n}`,
    name: String(name || "").slice(0, 80) || "Cuenta manual",
    avatar: "",
    followers: null,
    token: "",
    demo: true,
    status: "ok",
    connectedAt: store.now(),
  };
  if (profile) acc.profile = cleanProfile({}, profile);
  if (produccion) acc.produccion = cleanProduccion(produccion);
  d.accounts.push(acc);
  return acc;
}
function cleanProfile(base, b) {
  const profile = { ...(base || {}) };
  for (const k of Object.keys(agent.PROFILE_FIELDS)) {
    if (typeof b?.[k] === "string") profile[k] = b[k].slice(0, k === "guide" ? 20000 : 4000);
  }
  return profile;
}

// Bandeja de entrada: un JSON en data/entrantes ({ username, name, profile, produccion }) crea la cuenta manual
// (o actualiza su perfil si ya existe) al arrancar. Sirve para preparar cuentas sin pasar por la web.
// Un plan exportado ({ kind: "studio-plan", username, slots }) se añade a esa cuenta (sin duplicar tarjetas).
function importEntrantes() {
  const dir = path.join(store.DATA_DIR, "entrantes");
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter((x) => x.endsWith(".json")).map((f) => {
    try {
      return { f, data: JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) };
    } catch (e) {
      return { f, error: e };
    }
  });
  files.sort((a, b) => (a.data?.kind === "studio-plan") - (b.data?.kind === "studio-plan"));
  for (const { f, data, error } of files) {
    const file = path.join(dir, f);
    try {
      if (error) throw error;
      const u = String(data.username || "").replace(/^@/, "").toLowerCase();
      if (!/^[\w.]{2,30}$/.test(u)) throw new Error("username no válido");
      const acc = db().accounts.find((a) => a.username.toLowerCase() === u);
      if (data.kind === "studio-plan") {
        if (!acc) throw new Error(`no existe la cuenta @${u}: añádela primero`);
        importPlanInto(acc, data, { includeProfile: !acc.profile?.about });
      } else if (acc) {
        if (data.profile) acc.profile = cleanProfile(acc.profile, data.profile);
        if (data.produccion) acc.produccion = cleanProduccion(data.produccion);
        if (data.name) acc.name = String(data.name).slice(0, 80);
        store.log(`Perfil de @${u} actualizado desde ${f}`);
      } else {
        addManualAccount({ ...data, username: u });
        store.log(`Cuenta manual @${u} creada desde ${f}`, "success");
      }
      fs.renameSync(file, file + ".importado");
    } catch (e) {
      store.log(`No se pudo importar ${f}: ${e.message}`, "error");
    }
  }
  store.save();
}

app.put("/api/accounts/:id/produccion", (req, res) => {
  const acc = findAccount(req.params.id);
  if (!acc) throw new HttpError(404, "Cuenta no encontrada.");
  acc.produccion = cleanProduccion(req.body || {});
  store.save();
  res.json(publicAccount(acc));
});

app.post("/api/accounts/demo", (req, res) => {
  const acc = addManualAccount({ username: req.body?.username, name: req.body?.name || "Cuenta de prueba" });
  store.log(`Cuenta manual @${acc.username} añadida (se publica a mano).`);
  store.save();
  res.json({ ok: true, id: acc.id });
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

// Perfil de marca de la cuenta y guía en PDF si la hay. La guía general de Ajustes solo se usa
// mientras la cuenta no tiene perfil propio: así el tono de una cuenta nunca se cuela en otra.
function generalGuide(acc) {
  return !agent.profileText(acc?.profile) && db().settings.brandGuide ? db().settings.brandGuide : "";
}
function agentProfile(acc) {
  return { ...(acc.profile || {}), guide: [acc.profile?.guide, generalGuide(acc)].filter(Boolean).join("\n\n") };
}
function brandContext(accountId) {
  const acc = findAccount(accountId);
  const g = generalGuide(acc);
  return [agent.profileText(acc?.profile), g ? "Guía general: " + g : ""].filter(Boolean).join("\n");
}
function guideDoc(accountId) {
  const g = findAccount(accountId)?.profile?.guideFile;
  const file = g && path.join(GUIDES_DIR, g.file);
  if (!file || !fs.existsSync(file)) return null;
  return { type: "document", source: { type: "base64", media_type: "application/pdf", data: fs.readFileSync(file).toString("base64") }, title: "Guía de marca: " + g.name };
}

function runReview(post) {
  const key = anthropicKey();
  if (!key) return;
  post.aiReview = { pending: true };
  agent
    .reviewPost(key, post, brandContext(post.accountId), guideDoc(post.accountId))
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
  if (Array.isArray(b.media)) {
    const media = cleanMedia(b.media);
    if (!media.length) throw new HttpError(400, "Sube al menos un archivo válido.");
    post.media = media;
    post.type = media.length === 1 && media[0].mime.startsWith("video/") ? "REELS" : media.length > 1 ? "CAROUSEL" : "IMAGE";
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
  // Una idea pasa a revisión en cuanto tiene su arte.
  if (post.status === "idea" && post.media.length) {
    post.status = "review";
    history(post, "Arte subido: pasa a revisión");
    store.log(`Nuevo arte para revisar: «${post.title}»`);
  }
  store.save();
  if (Array.isArray(b.media) && post.status === "review") runReview(post);
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
    const slot = post.planSlotId && db().plan.slots.find((s) => s.id === post.planSlotId);
    if (slot) {
      slot.status = "published";
      slot.publishedUrl = post.permalink || slot.publishedUrl;
      slotHistory(slot, "Publicado desde Taskday");
    }
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

// Mantenimiento cada hora: comprueba que los tokens siguen valiendo (y renueva los de Instagram)
// y, los lunes desde las 8:00 (zona del plan), deja preparada la revisión semanal de cada cuenta real.
let maintaining = false;
async function maintenance() {
  if (maintaining) return;
  maintaining = true;
  try {
    for (const acc of db().accounts.filter((a) => !a.demo && a.token)) {
      const every = acc.status === "error" ? 3600e3 : 12 * 3600e3;
      if (Date.now() - (Date.parse(acc.checkedAt) || 0) < every) continue;
      acc.checkedAt = store.now();
      if (ig.canRefresh(acc) && Date.now() - (Date.parse(acc.tokenSetAt || acc.connectedAt) || 0) > 7 * 86400e3) {
        try {
          acc.token = await ig.refreshToken(acc.token);
          acc.tokenSetAt = store.now();
        } catch {
          // si no se pudo renovar, la comprobación de abajo dirá si el token sigue valiendo
        }
      }
      try {
        await ig.discoverAccounts(acc.token);
        if (acc.status === "error") store.log(`@${acc.username} vuelve a funcionar`, "success");
        acc.status = "ok";
        acc.statusMsg = "";
      } catch (e) {
        if (acc.status !== "error") store.log(`@${acc.username} dejó de funcionar: ${e.message}`, "error");
        acc.status = "error";
        acc.statusMsg = e.message;
      }
    }
    await autoWeeklyReview();
    store.save();
  } catch (e) {
    console.error("mantenimiento:", e);
  } finally {
    maintaining = false;
  }
}

async function autoWeeklyReview() {
  const d = db();
  if (d.settings.autoReview === false || !anthropicKey()) return;
  const p = planData();
  const today = plan.todayIn(p.timezone);
  const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: p.timezone, hour: "2-digit", hourCycle: "h23" }).format(new Date()));
  if (plan.weekStart(today) !== today || hour < 8) return;
  for (const acc of d.accounts.filter((a) => !a.demo && a.status === "ok")) {
    if (acc.autoReviewWeek === today || !p.slots.some((s) => s.accountId === acc.id)) continue;
    if (p.reviews.some((r) => r.accountId === acc.id && r.weekStart === today)) continue;
    acc.autoReviewWeek = today; // un solo intento por semana, aunque falle
    try {
      await runReplan(acc, today, "", true);
    } catch (e) {
      store.log(`No se pudo hacer la revisión automática de @${acc.username}: ${e.message}`, "error");
    }
  }
}

for (const r of db().research) {
  if (r.status === "running") {
    r.status = "error";
    r.error = "Se interrumpió porque el servidor se reinició. Vuelve a lanzarla.";
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

// ---------------------------------------------------------------- perfil de marca

app.put("/api/accounts/:id/profile", (req, res) => {
  const acc = findAccount(req.params.id);
  if (!acc) throw new HttpError(404, "Cuenta no encontrada.");
  const b = req.body || {};
  acc.profile = cleanProfile(acc.profile, b);
  store.save();
  res.json(publicAccount(acc));
});

// Guía de marca como archivo: PDF (la IA lo lee entero) o texto (.txt / .md, se añade a la guía).
app.post("/api/accounts/:id/guide", express.raw({ type: () => true, limit: "20mb" }), (req, res) => {
  const acc = findAccount(req.params.id);
  if (!acc) throw new HttpError(404, "Cuenta no encontrada.");
  const mime = String(req.headers["content-type"] || "").split(";")[0];
  const name = decodeURIComponent(String(req.headers["x-filename"] || "guia")).slice(0, 120);
  if (!req.body?.length) throw new HttpError(400, "El archivo está vacío.");
  acc.profile = acc.profile || {};
  if (mime === "application/pdf") {
    if (acc.profile.guideFile) fs.rmSync(path.join(GUIDES_DIR, acc.profile.guideFile.file), { force: true });
    const file = crypto.randomBytes(16).toString("hex") + ".pdf";
    fs.writeFileSync(path.join(GUIDES_DIR, file), req.body);
    acc.profile.guideFile = { file, name, size: req.body.length };
  } else if (mime.startsWith("text/") || /\.(md|txt)$/i.test(name)) {
    const text = req.body.toString("utf8").slice(0, 20000);
    acc.profile.guide = [acc.profile.guide, `--- ${name} ---\n${text}`].filter(Boolean).join("\n\n").slice(0, 20000);
  } else {
    throw new HttpError(400, "Sube la guía en PDF, TXT o MD.");
  }
  store.log(`Guía de marca añadida a @${acc.username}: ${name}`);
  store.save();
  res.json(publicAccount(acc));
});

app.delete("/api/accounts/:id/guide", (req, res) => {
  const acc = findAccount(req.params.id);
  if (!acc?.profile?.guideFile) throw new HttpError(404, "No hay guía en PDF.");
  fs.rmSync(path.join(GUIDES_DIR, acc.profile.guideFile.file), { force: true });
  delete acc.profile.guideFile;
  store.save();
  res.json(publicAccount(acc));
});

async function safeOwnMedia(acc) {
  try {
    return await ig.ownMedia(acc);
  } catch {
    return null;
  }
}

app.post("/api/accounts/:id/profile/suggest", wrap(async (req, res) => {
  const acc = findAccount(req.params.id);
  if (!acc) throw new HttpError(404, "Cuenta no encontrada.");
  const current = { ...(acc.profile || {}), ...(req.body || {}) };
  try {
    res.json(await agent.suggestProfile(anthropicKey(), { account: acc, ownTop: await safeOwnMedia(acc), current }));
  } catch (e) {
    throw new HttpError(400, e.message);
  }
}));

// ---------------------------------------------------------------- investigación

const splitList = (v, re) => String(v || "").split(/[\s,;\n]+/).map((x) => x.trim()).filter((x) => re.test(x));

app.post("/api/research", (req, res) => {
  const b = req.body || {};
  const acc = findAccount(b.accountId);
  if (!acc) throw new HttpError(400, "Elige para qué cuenta es la investigación.");
  if (!anthropicKey()) throw new HttpError(400, "Agrega tu API key de Anthropic en Ajustes para investigar.");
  const inputs = {
    references: [...new Set(splitList(b.references, /^@?[\w.]{2,30}$/).map((u) => u.replace(/^@/, "").toLowerCase()))].slice(0, 5),
    hashtags: [...new Set(splitList(b.hashtags, /^#?[\p{L}\p{N}_]{2,}$/u).map((t) => t.replace(/^#/, "").toLowerCase()))].slice(0, 5),
    links: splitList(b.links, /^https?:\/\/\S+$/).slice(0, 10),
    ideas: String(b.ideas || "").slice(0, 5000),
    images: cleanMedia(b.images).filter((m) => m.mime.startsWith("image/")).slice(0, 10),
    webSearch: b.webSearch !== false,
    count: Math.min(12, Math.max(3, Number(b.count) || 8)),
    feedback: String(b.feedback || "").slice(0, 3000),
  };
  if (!inputs.references.length && !inputs.hashtags.length && !inputs.links.length && !inputs.ideas.trim() && !inputs.images.length && !inputs.webSearch) {
    throw new HttpError(400, "Añade al menos una cuenta, idea, enlace, captura o activa la búsqueda en internet.");
  }
  const r = { id: store.id("res"), accountId: acc.id, parentId: b.parentId || null, inputs, status: "running", step: "Preparando…", createdAt: store.now(), result: null, sources: null, error: "" };
  db().research.unshift(r);
  db().research = db().research.slice(0, 60);
  store.log(`Investigación iniciada para @${acc.username}`);
  store.save();
  runResearch(r);
  res.json(r);
});

async function runResearch(r) {
  const acc = findAccount(r.accountId);
  const step = (text) => {
    r.step = text;
    store.save();
  };
  try {
    // Cuenta con acceso a datos de otras cuentas: la propia si tiene token de Facebook, o cualquier otra conectada que lo tenga.
    const reader = ig.canDiscover(acc) ? acc : db().accounts.find((a) => ig.canDiscover(a));
    const noAccess = "para ver métricas de otras cuentas hace falta conectar una cuenta con token de Facebook (EAA…). Sube capturas de su perfil como alternativa.";
    step("Analizando tu cuenta…");
    const ownTop = await safeOwnMedia(acc);
    const references = [];
    for (const u of r.inputs.references) {
      step(`Leyendo @${u}…`);
      if (!reader) {
        references.push({ username: u, error: noAccess });
        continue;
      }
      try {
        references.push(await ig.discoverProfile(reader, u));
      } catch (e) {
        references.push({ username: u, error: e.message.includes("does not exist") ? "no es una cuenta profesional o no existe" : e.message });
      }
    }
    const hashtags = [];
    for (const t of r.inputs.hashtags) {
      step(`Revisando #${t}…`);
      if (!reader) {
        hashtags.push({ tag: t, error: noAccess });
        continue;
      }
      try {
        hashtags.push(await ig.hashtagTop(reader, t));
      } catch (e) {
        hashtags.push({ tag: t, error: e.message });
      }
    }
    r.sources = { ownTop, references, hashtags };
    step(r.inputs.webSearch ? "Investigando en internet y analizando el contenido… (1–3 min)" : "Analizando el contenido… (1–2 min)");
    const images = r.inputs.images
      .map((m) => path.join(MEDIA_DIR, m.file))
      .filter((f) => fs.existsSync(f) && fs.statSync(f).size <= 5 * 1024 * 1024)
      .map((f) => ({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: fs.readFileSync(f).toString("base64") } }));
    const result = await agent.research(anthropicKey(), {
      account: acc,
      profile: agentProfile(acc),
      guideDoc: guideDoc(acc.id),
      ownTop,
      references,
      hashtags,
      ideas: r.inputs.ideas,
      links: r.inputs.links,
      images,
      webSearch: r.inputs.webSearch,
      feedback: r.inputs.feedback,
      count: r.inputs.count,
    });
    result.ideas = result.ideas.map((i) => ({ ...i, id: store.id("idea"), status: "new" }));
    r.result = result;
    r.status = "done";
    r.step = "";
    store.log(`Investigación lista para @${acc.username}: ${result.ideas.length} ideas`, "success");
  } catch (e) {
    r.status = "error";
    r.error = e.message;
    store.log(`La investigación para @${acc?.username} falló: ${e.message}`, "error");
  }
  store.save();
}

function findIdea(req) {
  const r = db().research.find((x) => x.id === req.params.id);
  const idea = r?.result?.ideas.find((i) => i.id === req.params.ideaId);
  if (!idea) throw new HttpError(404, "Esa idea ya no existe.");
  return { r, idea };
}

// Convierte una idea en un borrador en Artes (estado "Idea") listo para diseñar y subir el arte.
app.post("/api/research/:id/ideas/:ideaId/draft", (req, res) => {
  const { r, idea } = findIdea(req);
  const post = {
    id: store.id("post"),
    title: idea.title.slice(0, 80),
    accountId: r.accountId,
    type: idea.format === "REEL" ? "REELS" : idea.format === "CARRUSEL" ? "CAROUSEL" : "IMAGE",
    media: [],
    caption: [idea.caption, idea.hashtags.join(" ")].filter(Boolean).join("\n\n"),
    status: "idea",
    scheduledAt: null,
    checks: [],
    aiReview: null,
    brief: { hook: idea.hook, outline: idea.outline, formula: idea.formula, cta: idea.cta, designNotes: idea.designNotes, format: idea.format, researchId: r.id },
    history: [],
    note: "",
    createdAt: store.now(),
  };
  recheck(post);
  history(post, "Creado desde Investigación");
  db().posts.unshift(post);
  idea.status = "drafted";
  idea.postId = post.id;
  store.log(`Idea convertida en borrador: «${post.title}»`);
  store.save();
  res.json(post);
});

app.post("/api/research/:id/ideas/:ideaId/dismiss", (req, res) => {
  const { idea } = findIdea(req);
  idea.status = "dismissed";
  store.save();
  res.json({ ok: true });
});

app.delete("/api/research/:id", (req, res) => {
  db().research = db().research.filter((x) => x.id !== req.params.id);
  store.save();
  res.json({ ok: true });
});

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

// ---------------------------------------------------------------- plan (mensual / semanal)

const planData = () => db().plan;
function findSlot(id) {
  const s = planData().slots.find((x) => x.id === id);
  if (!s) throw new HttpError(404, "Esa tarjeta del plan ya no existe.");
  return s;
}
function slotHistory(s, text) {
  s.history = [{ at: store.now(), text }, ...(s.history || [])].slice(0, 30);
  s.updatedAt = store.now();
}
function newSlot(accountId, fields, extra = {}) {
  return {
    id: store.id("slot"),
    accountId,
    date: plan.todayIn(planData().timezone),
    time: "19:00",
    format: "REEL",
    phase: "",
    theme: "",
    hook: "",
    goal: "seguidores",
    outline: [],
    caption: "",
    cta: "",
    hashtags: [],
    production: "",
    notes: "",
    why: "",
    status: "proposed",
    source: "manual",
    postId: null,
    publishedUrl: "",
    metrics: {},
    history: [],
    createdAt: store.now(),
    updatedAt: store.now(),
    ...plan.cleanFields(fields),
    ...extra,
  };
}
const slotIso = (s) => plan.zonedIso(s.date, s.time, planData().timezone);

// Contexto que el agente necesita para planificar una cuenta.
function planAgentInput(acc, extra) {
  const slots = planData().slots.filter((s) => s.accountId === acc.id).sort(plan.sortSlots);
  const ideas = db().research
    .filter((r) => r.accountId === acc.id && r.result)
    .flatMap((r) => r.result.ideas.filter((i) => i.status === "new" && i.fit >= 70).map((i) => ({ titulo: i.title, formato: i.format, gancho: i.hook, objetivo: i.goal, inspirada: i.inspiredBy })))
    .slice(0, 12);
  return {
    account: acc,
    profile: agentProfile(acc),
    guideDoc: guideDoc(acc.id),
    published: slots.filter((s) => s.status === "published").map(plan.slotForAgent),
    planned: slots.filter((s) => !["published", "skipped"].includes(s.status)).map(plan.slotForAgent),
    ideas,
    nowDate: plan.todayIn(planData().timezone),
    tz: planData().timezone,
    ...extra,
  };
}

app.post("/api/plan/slots", (req, res) => {
  const b = req.body || {};
  const acc = findAccount(b.accountId);
  if (!acc) throw new HttpError(400, "Elige la cuenta.");
  const published = b.status === "published";
  const s = newSlot(acc.id, b, {
    status: published ? "published" : "approved",
    publishedUrl: published ? String(b.publishedUrl || "").slice(0, 300) : "",
    metrics: published ? plan.cleanMetrics(b.metrics) : {},
  });
  slotHistory(s, published ? "Registrado como ya publicado" : "Creada por ti");
  planData().slots.push(s);
  store.save();
  res.json(s);
});

app.patch("/api/plan/slots/:id", (req, res) => {
  const s = findSlot(req.params.id);
  const b = req.body || {};
  const fields = plan.cleanFields(b);
  const changed = Object.keys(fields).filter((k) => JSON.stringify(fields[k]) !== JSON.stringify(s[k]));
  Object.assign(s, fields);
  if (b.metrics) s.metrics = { ...(s.metrics || {}), ...plan.cleanMetrics(b.metrics) };
  if (typeof b.publishedUrl === "string") s.publishedUrl = b.publishedUrl.slice(0, 300);
  if (changed.length && ["proposed", "approved"].includes(s.status)) s.status = "modified";
  if (changed.length) slotHistory(s, "Modificada por ti: " + changed.join(", "));
  // Si ya hay borrador, la hora prevista viaja con la tarjeta.
  const post = s.postId && db().posts.find((p) => p.id === s.postId);
  if (post && (fields.date || fields.time)) post.plannedAt = slotIso(s);
  store.save();
  res.json(s);
});

app.post("/api/plan/slots/:id/status", (req, res) => {
  const s = findSlot(req.params.id);
  const status = String(req.body?.status || "");
  if (!["approved", "proposed", "skipped", "published"].includes(status)) throw new HttpError(400, "Estado no válido.");
  s.status = status;
  if (status === "published") {
    s.publishedUrl = String(req.body?.publishedUrl || s.publishedUrl || "").slice(0, 300);
    s.metrics = { ...(s.metrics || {}), ...plan.cleanMetrics(req.body?.metrics) };
  }
  slotHistory(s, { approved: "Aprobada por ti", proposed: "Vuelve a propuesta", skipped: "Descartada", published: "Marcada como publicada" }[status]);
  if (status === "approved") startArt(s);
  store.save();
  res.json(s);
});

// Aprobar varias de una vez (p. ej. todas las propuestas de la semana).
app.post("/api/plan/approve", (req, res) => {
  const ids = new Set(Array.isArray(req.body?.ids) ? req.body.ids : []);
  let n = 0;
  for (const s of planData().slots) {
    if (ids.has(s.id) && s.status === "proposed") {
      s.status = "approved";
      slotHistory(s, "Aprobada por ti");
      startArt(s);
      n++;
    }
  }
  if (n) store.log(`Plan: ${n} ${n === 1 ? "tarjeta aprobada" : "tarjetas aprobadas"}`, "success");
  store.save();
  res.json({ ok: true, approved: n });
});

app.delete("/api/plan/slots/:id", (req, res) => {
  const s = findSlot(req.params.id);
  planData().slots = planData().slots.filter((x) => x.id !== s.id);
  store.save();
  res.json({ ok: true });
});

// Tarjeta → borrador en Artes (estado Idea) con su brief. Al aprobar el arte se propone su hora.
app.post("/api/plan/slots/:id/draft", (req, res) => {
  const s = findSlot(req.params.id);
  if (s.format === "STORIES") throw new HttpError(400, "Las stories no se publican por Taskday todavía: úsala como guion.");
  const fresh = !(s.postId && db().posts.find((p) => p.id === s.postId));
  const post = ensureDraft(s);
  if (fresh) startArt(s);
  store.save();
  res.json(post);
});

function ensureDraft(s) {
  const existing = s.postId && db().posts.find((p) => p.id === s.postId);
  if (existing) return existing;
  const post = {
    id: store.id("post"),
    title: (s.theme || s.hook || "Pieza del plan").slice(0, 80),
    accountId: s.accountId,
    type: s.format === "REEL" ? "REELS" : s.format === "CARRUSEL" ? "CAROUSEL" : "IMAGE",
    media: [],
    caption: [s.caption, s.hashtags.join(" ")].filter(Boolean).join("\n\n"),
    status: "idea",
    scheduledAt: null,
    plannedAt: slotIso(s),
    planSlotId: s.id,
    checks: [],
    aiReview: null,
    brief: { hook: s.hook, outline: s.outline, formula: s.why, cta: s.cta, designNotes: s.production, format: s.format },
    history: [],
    note: "",
    createdAt: store.now(),
  };
  recheck(post);
  history(post, "Creado desde el Plan");
  db().posts.unshift(post);
  s.postId = post.id;
  if (s.status === "proposed") s.status = "approved";
  slotHistory(s, "Borrador creado en Artes");
  store.log(`Plan → borrador: «${post.title}»`);
  return post;
}

// ---------------------------------------------------------------- producción de artes
// Carrusel o post aprobado sin arte → el productor dibuja las láminas y monta el PSD en Photoshop;
// las láminas entran en el borrador para revisarlas. Tras reafinar el PSD, «Recargar» trae las exportadas.

const hasArt = (s) => {
  const post = s.postId && db().posts.find((p) => p.id === s.postId);
  return !!post?.media?.length;
};
function startArt(s, force = false) {
  if (s.format === "REEL") return encargoReel(s, force);
  if (!prod.producible(s) || (!force && (hasArt(s) || s.art?.status === "ready"))) return false;
  if (findAccount(s.accountId)?.produccion?.artes === "manual") return false;
  return prod.enqueue(s, { onDone: artDone, cfg: findAccount(s.accountId)?.produccion });
}
function encargoReel(s, force) {
  if (!force && (hasArt(s) || s.art?.brief)) return false;
  try {
    const r = prod.encargoVideo(s, findAccount(s.accountId)?.produccion);
    s.art = { ...(s.art || {}), mode: "video", status: "encargo", error: "", brief: r.file, dir: r.dir, requestedAt: store.now() };
    slotHistory(s, "Encargo de video para Claude: " + path.basename(r.file));
    store.log(`Encargo de reel para Claude: «${s.theme}»`, "success");
    return true;
  } catch (e) {
    s.art = { ...(s.art || {}), mode: "video", status: "error", error: "No se pudo escribir el encargo: " + e.message };
    return false;
  }
}
function artDone(s, r) {
  const live = planData().slots.find((x) => x.id === s.id);
  if (!live) return;
  if (!r.ok) {
    live.art = { ...live.art, status: "error", error: r.error || "Falló la producción." };
    slotHistory(live, "No se pudo producir el arte: " + live.art.error);
    store.log(`Arte de «${live.theme}»: ${live.art.error}`, "error");
  } else {
    live.art = { ...live.art, ...(r.fuente === "claude" ? { mode: "medida" } : {}), status: "ready", error: "", dir: r.dir, slug: r.slug, psd: r.psd, fuente: r.fuente, warnings: r.warnings || [], producedAt: store.now() };
    try {
      const n = attachArt(live, r.files, r.fuente === "claude" ? "Arte a medida producido por Claude" : "Arte producido con la plantilla de marca");
      store.log(`Arte listo: «${live.theme}» (${n} ${n === 1 ? "lámina" : "láminas"}${r.psd ? " + PSD" : ""})`, "success");
    } catch (e) {
      live.art = { ...live.art, status: "error", error: e.message };
    }
  }
  store.save();
}
// Si Taskday se reinició a mitad de una producción, esa pieza queda para reintentar.
for (const s of db().plan?.slots || []) {
  if (["queued", "producing"].includes(s.art?.status)) s.art = { ...s.art, status: "error", error: "Se interrumpió (Taskday se reinició). Vuelve a producir." };
}
// Copia las láminas a media/ y las pone en el borrador de la tarjeta (lo crea si hace falta).
function attachArt(s, files, note) {
  const post = ensureDraft(s);
  const media = files.filter((f) => fs.existsSync(f)).map((f) => {
    const { width, height, mime } = prod.imageSize(f);
    const file = crypto.randomBytes(16).toString("hex") + (mime === "image/png" ? ".png" : ".jpg");
    fs.copyFileSync(f, path.join(MEDIA_DIR, file));
    return { file, url: "/media/" + file, mime, size: fs.statSync(f).size, width, height, duration: null, name: path.basename(f) };
  });
  if (!media.length) throw new HttpError(400, "No encontré láminas en la carpeta.");
  for (const m of post.media || []) fs.rmSync(path.join(MEDIA_DIR, m.file), { force: true });
  post.media = media;
  post.type = media.length > 1 ? "CAROUSEL" : "IMAGE";
  if (["idea", "review", "rejected"].includes(post.status)) post.status = "review";
  post.aiReview = null;
  recheck(post);
  history(post, note);
  slotHistory(s, `${note} (${media.length} ${media.length === 1 ? "lámina" : "láminas"})`);
  return media.length;
}

app.post("/api/plan/slots/:id/art", (req, res) => {
  const s = findSlot(req.params.id);
  const mode = String(req.body?.mode || "");
  if (!prod.MODES.includes(mode)) throw new HttpError(400, "Modo no válido.");
  s.art = { ...(s.art || {}), mode };
  slotHistory(s, mode === "medida" ? "Pieza clave: Claude la diseña a medida" : "Arte con la plantilla de marca");
  store.save();
  res.json(s);
});

app.post("/api/plan/slots/:id/produce", (req, res) => {
  const s = findSlot(req.params.id);
  if (s.format === "REEL") { startArt(s, true); store.save(); return res.json(s); }
  if (!prod.producible(s)) throw new HttpError(400, "Solo se producen carruseles y posts.");
  if (findAccount(s.accountId)?.produccion?.artes === "manual") throw new HttpError(400, "En esta cuenta las artes las haces tú (Perfil de marca → Producción de artes).");
  if (!prod.available()) throw new HttpError(400, "El productor de artes no está en este equipo (herramientas/produccion/producir.mjs).");
  if (prod.busy(s.id)) return res.json(s);
  startArt(s, true);
  store.save();
  res.json(s);
});

// Trae las láminas de la carpeta (p. ej. las que exportaste de Photoshop tras reafinar).
app.post("/api/plan/slots/:id/art/reload", (req, res) => {
  const s = findSlot(req.params.id);
  if (!s.art?.dir) throw new HttpError(400, "Esta pieza aún no tiene carpeta de arte.");
  const n = attachArt(s, prod.folderLaminas(s.art.dir), "Láminas recargadas desde la carpeta");
  s.art = { ...s.art, status: "ready", reloadedAt: store.now() };
  store.save();
  res.json({ ok: true, count: n });
});

app.post("/api/plan/slots/:id/art/open", (req, res) => {
  const s = findSlot(req.params.id);
  if (!/^(localhost|127\.|::1|\[::1\])/.test(req.hostname)) throw new HttpError(400, "Solo funciona con Taskday en tu equipo.");
  const target = req.body?.what === "psd" && s.art?.psd && fs.existsSync(s.art.psd) ? s.art.psd : s.art?.dir;
  if (!target || !fs.existsSync(target)) throw new HttpError(400, "No encuentro la carpeta del arte.");
  prod.openLocal(target);
  res.json({ ok: true });
});

// El agente propone el plan de un periodo. Las propuestas sin aprobar del periodo se sustituyen;
// lo aprobado, modificado y publicado se respeta.
app.post("/api/plan/generate", wrap(async (req, res) => {
  const b = req.body || {};
  const acc = findAccount(b.accountId);
  if (!acc) throw new HttpError(400, "Elige la cuenta.");
  if (!plan.isDate(b.from) || !plan.isDate(b.to) || b.to < b.from) throw new HttpError(400, "Elige un periodo válido.");
  if (plan.addDays(b.from, 62) < b.to) throw new HttpError(400, "Planifica como máximo dos meses de una vez.");
  let r;
  try {
    r = await agent.planPeriod(anthropicKey(), planAgentInput(acc, { from: b.from, to: b.to, instructions: String(b.instructions || "").slice(0, 4000) }));
  } catch (e) {
    throw new HttpError(400, e.message);
  }
  const p = planData();
  p.slots = p.slots.filter((s) => !(s.accountId === acc.id && s.status === "proposed" && s.date >= b.from && s.date <= b.to));
  const created = r.slots.map((x) => {
    const s = newSlot(acc.id, x, { source: "agent" });
    slotHistory(s, "Propuesta por el agente");
    return s;
  });
  p.slots.push(...created);
  p.summaries = { ...(p.summaries || {}), [acc.id]: { text: r.summary, from: b.from, to: b.to, at: store.now() } };
  store.log(`El agente propone ${created.length} piezas para @${acc.username}`, "success");
  store.save();
  res.json({ summary: r.summary, created: created.length });
}));

// Revisión semanal: el agente mira lo publicado y propone cambios que apruebas uno a uno.
app.post("/api/plan/replan", wrap(async (req, res) => {
  const b = req.body || {};
  const acc = findAccount(b.accountId);
  if (!acc) throw new HttpError(400, "Elige la cuenta.");
  const ws = plan.weekStart(plan.isDate(b.weekStart) ? b.weekStart : plan.todayIn(planData().timezone));
  try {
    res.json(await runReplan(acc, ws, String(b.instructions || "").slice(0, 4000)));
  } catch (e) {
    throw new HttpError(400, e.message);
  }
}));

async function runReplan(acc, ws, instructions, auto = false) {
  const r = await agent.replanWeek(anthropicKey(), planAgentInput(acc, { weekStart: ws, instructions }));
  const review = {
    id: store.id("rev"),
    accountId: acc.id,
    weekStart: ws,
    summary: r.summary,
    learnings: r.learnings.slice(0, 8),
    changes: r.changes.map((c) => ({ id: store.id("chg"), kind: c.kind, slotId: c.slotId || null, fields: plan.cleanFields(c.fields), reason: c.reason, status: "pending" })),
    createdAt: store.now(),
    auto,
  };
  planData().reviews.unshift(review);
  planData().reviews = planData().reviews.slice(0, 30);
  store.log(`Revisión semanal${auto ? " automática" : ""} lista para @${acc.username}: ${review.changes.length} cambios propuestos`);
  store.save();
  return review;
}

app.post("/api/plan/reviews/:id/changes/:changeId", (req, res) => {
  const review = planData().reviews.find((r) => r.id === req.params.id);
  const c = review?.changes.find((x) => x.id === req.params.changeId);
  if (!c || c.status !== "pending") throw new HttpError(404, "Ese cambio ya no está pendiente.");
  if (req.body?.decision !== "apply") {
    c.status = "rejected";
    store.save();
    return res.json(review);
  }
  if (c.kind === "add") {
    const s = newSlot(review.accountId, c.fields, { source: "agent", status: "approved" });
    slotHistory(s, "Añadida en la revisión semanal (aprobada por ti)");
    planData().slots.push(s);
  } else {
    const s = planData().slots.find((x) => x.id === c.slotId);
    if (!s || s.status === "published") {
      c.status = "failed";
      store.save();
      throw new HttpError(400, "Esa tarjeta ya no se puede cambiar.");
    }
    if (c.kind === "remove") {
      s.status = "skipped";
      slotHistory(s, "Descartada en la revisión semanal: " + c.reason);
    } else {
      Object.assign(s, c.fields);
      s.status = "approved";
      slotHistory(s, "Ajustada en la revisión semanal: " + c.reason);
    }
  }
  c.status = "applied";
  store.save();
  res.json(review);
});

app.put("/api/plan/settings", (req, res) => {
  const tz = String(req.body?.timezone || "");
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
  } catch {
    throw new HttpError(400, "Zona horaria no válida.");
  }
  planData().timezone = tz;
  store.save();
  res.json({ ok: true });
});

// Exportar / importar el plan de una cuenta (para pasarlo de tu PC a Render o hacer copia).
app.get("/api/plan/export", (req, res) => {
  const acc = findAccount(String(req.query.accountId || ""));
  if (!acc) throw new HttpError(400, "Elige la cuenta.");
  res.setHeader("Content-Disposition", `attachment; filename="plan-${acc.username}.json"`);
  res.json({
    kind: "studio-plan",
    version: 1,
    username: acc.username,
    timezone: planData().timezone,
    profile: acc.profile || {},
    summary: planData().summaries?.[acc.id] || null,
    slots: planData().slots.filter((s) => s.accountId === acc.id).map(({ accountId, postId, ...s }) => s),
  });
});

app.post("/api/plan/import", express.json({ limit: "5mb" }), (req, res) => {
  const { accountId, data, replace, includeProfile } = req.body || {};
  const acc = findAccount(accountId);
  if (!acc) throw new HttpError(400, "Elige la cuenta.");
  const n = importPlanInto(acc, data, { replace, includeProfile });
  res.json({ ok: true, imported: n });
});

function importPlanInto(acc, data, { replace = false, includeProfile = false } = {}) {
  if (data?.kind !== "studio-plan" || !Array.isArray(data.slots)) throw new HttpError(400, "Ese archivo no es un plan de Taskday.");
  const p = planData();
  if (replace) p.slots = p.slots.filter((s) => s.accountId !== acc.id || s.postId);
  const known = new Set(p.slots.map((s) => s.id));
  let n = 0;
  for (const x of data.slots.slice(0, 400)) {
    if (known.has(x.id)) continue;
    const status = plan.SLOT_STATUS.includes(x.status) ? x.status : "proposed";
    const s = newSlot(acc.id, x, {
      status,
      source: ["agent", "manual", "seed"].includes(x.source) ? x.source : "manual",
      publishedUrl: String(x.publishedUrl || "").slice(0, 300),
      metrics: plan.cleanMetrics(x.metrics),
      history: Array.isArray(x.history) ? x.history.slice(0, 30) : [],
    });
    if (/^slot_[a-f0-9]{12}$/.test(x.id || "")) s.id = x.id;
    p.slots.push(s);
    n++;
  }
  if (data.summary?.text) p.summaries = { ...(p.summaries || {}), [acc.id]: data.summary };
  if (includeProfile && data.profile && typeof data.profile === "object") {
    const profile = { ...(acc.profile || {}) };
    for (const k of Object.keys(agent.PROFILE_FIELDS)) if (typeof data.profile[k] === "string") profile[k] = data.profile[k].slice(0, k === "guide" ? 20000 : 2000);
    acc.profile = profile;
  }
  store.log(`Plan importado en @${acc.username}: ${n} tarjetas`, "success");
  store.save();
  return n;
}

// ---------------------------------------------------------------- ajustes

app.post("/api/settings", (req, res) => {
  const s = db().settings;
  const b = req.body || {};
  if (typeof b.anthropicKey === "string" && b.anthropicKey.trim()) {
    const key = b.anthropicKey.trim();
    if (!/^sk-ant-/.test(key)) throw new HttpError(400, "La API key de Anthropic empieza por sk-ant-… (los tokens de Instagram van en Cuentas).");
    s.anthropicKey = key;
  }
  if (typeof b.autoReview === "boolean") s.autoReview = b.autoReview;
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

// Al final del arranque: la bandeja de entrada usa el plan y las cuentas ya definidos.
importEntrantes();

const PORT = Number(process.env.PORT) || 4100;
// En tu PC solo escucha en este mismo equipo (nadie de la Wi-Fi llega). En Render (o con HOST=0.0.0.0) escucha en todas las interfaces.
const HOST = process.env.HOST || (process.env.RENDER ? "0.0.0.0" : "127.0.0.1");
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, HOST, () => console.log(`Taskday listo en http://localhost:${PORT} (solo ${HOST})`));
  setInterval(tick, 30 * 1000);
  setInterval(maintenance, 3600 * 1000);
  setTimeout(maintenance, 60 * 1000);
}

export { app, tick };
