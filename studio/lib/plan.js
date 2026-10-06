// Planificador: tarjetas por día (formato, tema, gancho, objetivo, copy, hora) agrupadas por cuenta.
// Las fechas y horas de cada tarjeta están en la zona horaria del plan (por defecto, Brasil).

export const DEFAULT_TZ = "America/Sao_Paulo";
export const FORMATS = ["REEL", "CARRUSEL", "POST", "STORIES"];
export const GOALS = ["seguidores", "leads", "comunidad", "autoridad", "ventas", "activacion"];
export const SLOT_STATUS = ["proposed", "approved", "modified", "published", "skipped"];

const str = (v, max) => String(v ?? "").slice(0, max);
const list = (v, max, n) => (Array.isArray(v) ? v : String(v || "").split("\n")).map((x) => str(x, max).trim()).filter(Boolean).slice(0, n);

export function isDate(v) {
  return /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v + "T00:00:00Z"));
}
export function isTime(v) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
}

// Limpia los campos editables de una tarjeta. Devuelve solo los que vienen en `input`.
export function cleanFields(input = {}) {
  const out = {};
  if (input.date !== undefined && isDate(input.date)) out.date = input.date;
  if (input.time !== undefined && isTime(input.time)) out.time = input.time;
  if (input.format !== undefined && FORMATS.includes(input.format)) out.format = input.format;
  if (input.goal !== undefined && GOALS.includes(input.goal)) out.goal = input.goal;
  for (const k of ["phase", "theme", "cta", "production"]) if (input[k] !== undefined) out[k] = str(input[k], 300);
  for (const k of ["hook", "why", "notes"]) if (input[k] !== undefined) out[k] = str(input[k], 1000);
  if (input.caption !== undefined) out.caption = str(input.caption, 2200);
  if (input.outline !== undefined) out.outline = list(input.outline, 400, 12);
  if (input.hashtags !== undefined) {
    out.hashtags = list(Array.isArray(input.hashtags) ? input.hashtags : String(input.hashtags).split(/[\s,]+/), 60, 15)
      .map((h) => (h.startsWith("#") ? h : "#" + h))
      .filter((h) => /^#[\p{L}\p{N}_]+$/u.test(h));
  }
  return out;
}

export const METRICS = ["views", "likes", "comments", "saves", "shares", "follows", "signups"];
export function cleanMetrics(input = {}) {
  const out = {};
  for (const k of METRICS) {
    const n = Number(input[k]);
    if (input[k] !== "" && input[k] != null && Number.isFinite(n) && n >= 0) out[k] = Math.round(n);
  }
  return out;
}

// Fecha + hora locales de una zona horaria → instante ISO (UTC).
export function zonedIso(date, time, tz = DEFAULT_TZ) {
  const [y, m, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, h, mi);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
      .formatToParts(new Date(guess))
      .map((p) => [p.type, p.value])
  );
  const asLocal = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
  return new Date(guess - (asLocal - guess)).toISOString();
}

// Hoy en la zona del plan, como YYYY-MM-DD.
export function todayIn(tz = DEFAULT_TZ) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date());
}

export function addDays(date, n) {
  const d = new Date(date + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// Lunes de la semana de `date`.
export function weekStart(date) {
  const d = new Date(date + "T12:00:00Z");
  return addDays(date, -((d.getUTCDay() + 6) % 7));
}

export const sortSlots = (a, b) => (a.date + a.time).localeCompare(b.date + b.time);

// Resumen compacto de una tarjeta para dárselo al agente.
export function slotForAgent(s) {
  return {
    slotId: s.id,
    fecha: s.date,
    hora: s.time,
    formato: s.format,
    fase: s.phase,
    tema: s.theme,
    gancho: s.hook,
    objetivo: s.goal,
    estado: s.status,
    cta: s.cta,
    ...(s.status === "published" ? { enlace: s.publishedUrl || "", metricas: s.metrics || {}, notas: s.notes || "" } : {}),
  };
}
