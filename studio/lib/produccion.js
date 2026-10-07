// Producción de artes: al aprobar un carrusel o post del plan, un productor externo (script de Node)
// dibuja las láminas PNG y monta el PSD editable en Photoshop. Aquí solo se gestiona la cola.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// Por defecto, el productor de la carpeta de Loxita (D:\LOXITA\herramientas\produccion) junto al repo.
export const PRODUCER = process.env.PRODUCER || path.resolve(here, "..", "..", "..", "herramientas", "produccion", "producir.mjs");
export const PRODUCIBLE = ["CARRUSEL", "POST"];
export const MODES = ["plantilla", "medida"];

export const available = () => fs.existsSync(PRODUCER);
export const producible = (s) => PRODUCIBLE.includes(s.format);

const queue = [];
let running = null;

// Pone la pieza en la cola (una a la vez: Photoshop solo monta un PSD cada vez).
// cfg = producción de la cuenta: { carpeta, estilo } (vacío = Loxita).
export function enqueue(s, { onDone, psd = true, cfg = {} } = {}) {
  if (!available() || !producible(s)) return false;
  if (running === s.id || queue.some((q) => q.s.id === s.id)) return true;
  s.art = { ...(s.art || {}), mode: s.art?.mode || "plantilla", status: "queued", error: "", queuedAt: new Date().toISOString() };
  queue.push({ s, onDone, psd, cfg });
  next();
  return true;
}
export const busy = (id) => running === id || queue.some((q) => q.s.id === id);

function next() {
  if (running || !queue.length) return;
  const { s, onDone, psd, cfg } = queue.shift();
  running = s.id;
  s.art.status = "producing";
  s.art.startedAt = new Date().toISOString();
  const tmp = path.join(os.tmpdir(), `taskday-pieza-${s.id}.json`);
  fs.writeFileSync(tmp, JSON.stringify(s));
  const args = [PRODUCER, "--slot", tmp, ...(psd ? ["--psd"] : []), ...(cfg?.carpeta ? ["--pub", cfg.carpeta] : []), ...(cfg?.estilo ? ["--estilo", cfg.estilo] : [])];
  let out = "", err = "";
  const child = spawn(process.execPath, args, { windowsHide: true });
  child.stdout.on("data", (d) => (out += d));
  child.stderr.on("data", (d) => (err += d));
  const finish = (result) => {
    fs.rmSync(tmp, { force: true });
    running = null;
    try { onDone?.(s, result); } finally { next(); }
  };
  child.on("error", (e) => finish({ ok: false, error: e.message }));
  child.on("close", () => {
    const line = out.split("\n").reverse().find((l) => l.startsWith("RESULT "));
    let r;
    try { r = line ? JSON.parse(line.slice(7)) : null; } catch {}
    finish(r || { ok: false, error: (err.trim().split("\n").pop() || "El productor terminó sin resultado.").slice(0, 300) });
  });
}

// Láminas de la carpeta (las que exporta Photoshop tras reafinar, o las del productor).
export function folderLaminas(dir) {
  const d = path.join(dir, "laminas");
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort().map((f) => path.join(d, f));
}

// Tamaño de un PNG o JPG leyendo su cabecera.
export function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20), mime: "image/png" };
  let i = 2;
  while (i < b.length) {
    const marker = b.readUInt16BE(i);
    if (marker >= 0xffc0 && marker <= 0xffc3) return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5), mime: "image/jpeg" };
    i += 2 + b.readUInt16BE(i + 2);
  }
  return { width: null, height: null, mime: "image/jpeg" };
}

// Abre una carpeta o archivo en el equipo (solo tiene sentido con Taskday en local).
export function openLocal(target) {
  const cmd = process.platform === "win32" ? "explorer.exe" : process.platform === "darwin" ? "open" : "xdg-open";
  spawn(cmd, [target], { detached: true, stdio: "ignore" }).unref();
}

// Reels: no se producen solos (Remotion + trabajo creativo). Al aprobarlos se deja un encargo para Claude
// en <carpeta de la cuenta>/<año>/<NN MES>/VIDEOS/ENCARGOS/<fecha>-<tema>.md con todo lo de la tarjeta
// (por defecto la carpeta es D:\LOXITA\00 PUBLICACIONES y las reglas son las de Loxita).
const MESES = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
const BASE = process.env.LOXITA_BASE || path.resolve(here, "..", "..", "..");
const slug = (t) => String(t || "reel").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "reel";
const REGLAS_LOXITA = "- Copy en PT-BR; nunca mostrar cuántas vagas quedan.\n- Paleta completa de marca; pantallas reales del banco (LOXITA IDENTIDAD VISUAL/APP/PANTALLAS) y el personaje Loxita (LOXITA IDENTIDAD VISUAL/PERSONAJE).\n- Entregar MP4 1080×1920 en esta carpeta VIDEOS y subirlo al borrador de la tarjeta.";
export function encargoVideo(s, cfg = {}) {
  const [y, m] = String(s.date || new Date().toISOString().slice(0, 10)).split("-");
  const root = cfg.carpeta || path.join(BASE, "00 PUBLICACIONES");
  const dir = path.join(root, y, `${m} ${MESES[Number(m) - 1]}`, "VIDEOS", "ENCARGOS");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${s.date || "sin-fecha"}-${slug(s.theme)}.md`);
  const L = (t, v) => (v ? `## ${t}\n${v}\n` : "");
  fs.writeFileSync(file, [
    `# Encargo de reel: ${s.theme || "sin tema"}`,
    `Publicación: ${s.date || "?"} ${s.time || ""} · fase: ${s.phase || "-"} · objetivo: ${s.goal || "-"} · tarjeta ${s.id}`,
    `Encargado: ${new Date().toISOString()}\n`,
    L("Notas del usuario (lo más importante)", s.notes),
    L("Gancho", s.hook),
    L("Estructura", (s.outline || []).map((x) => "- " + x).join("\n")),
    L("Producción sugerida", s.production),
    L("Copy", s.caption),
    L("CTA", s.cta),
    L("Hashtags", (s.hashtags || []).join(" ")),
    L("Por qué", s.why),
    `## Reglas\n${(cfg.reglasVideo || REGLAS_LOXITA).trim()}\n`,
  ].filter(Boolean).join("\n"));
  return { file, dir };
}
