// Almacenamiento en un archivo JSON (sin base de datos aparte).
// DATA_DIR permite apuntar a un disco persistente (p. ej. un Disk de Render).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
export const MEDIA_DIR = path.join(DATA_DIR, "media");
export const GUIDES_DIR = path.join(DATA_DIR, "guides"); // privado: no se sirve por web
const DB_PATH = path.join(DATA_DIR, "db.json");

fs.mkdirSync(MEDIA_DIR, { recursive: true });
fs.mkdirSync(GUIDES_DIR, { recursive: true });

const EMPTY = () => ({
  settings: {
    passwordHash: null,
    sessionSecret: crypto.randomBytes(32).toString("hex"),
    anthropicKey: "",
    publicUrl: "",
    brandGuide: "",
  },
  accounts: [],
  posts: [],
  proposals: [],
  research: [],
  activity: [],
  plan: { timezone: "America/Sao_Paulo", slots: [], reviews: [], summaries: {} },
});

let db = load();

function load() {
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    const base = EMPTY();
    return { ...base, ...data, settings: { ...base.settings, ...data.settings }, plan: { ...base.plan, ...data.plan } };
  } catch {
    const fresh = EMPTY();
    write(fresh);
    return fresh;
  }
}

// Escritura atómica: archivo temporal + rename, para no corromper el JSON si el proceso muere.
function write(data) {
  const tmp = DB_PATH + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, DB_PATH);
}

export function get() {
  return db;
}

export function save() {
  write(db);
}

export function id(prefix) {
  return prefix + "_" + crypto.randomBytes(6).toString("hex");
}

export function now() {
  return new Date().toISOString();
}

export function log(text, kind = "info") {
  db.activity.unshift({ id: id("act"), at: now(), text, kind });
  db.activity = db.activity.slice(0, 200);
}
