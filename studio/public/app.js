// Taskday — interfaz. JavaScript plano, sin compilación.

// ------------------------------------------------------------------ iconos
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.5 2.5L16 9.5"/>',
  warn: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
  xCircle: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  send: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.8"/><path d="m21 15-5-5L5 21"/>',
  stack: '<rect x="7" y="7" width="14" height="14" rx="2.5"/><path d="M3 15V5a2 2 0 0 1 2-2h10"/>',
  play: '<path d="M7 4v16l13-8z"/>',
  left: '<path d="m15 18-6-6 6-6"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  heart: '<path d="M12 20s-7.5-4.5-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5c-1.8 4.5-9.3 9-9.3 9z"/>',
  comment: '<path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.4A8.5 8.5 0 1 1 21 12z"/>',
  share: '<path d="M22 3 11 14M22 3l-7 18-4-7-7-4z"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1l1-13M9 7V4h6v3"/>',
  logout: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
  flask: '<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7 15h10"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  stories: '<circle cx="12" cy="12" r="9" stroke-dasharray="3.5 2.5"/><circle cx="12" cy="12" r="4.5"/>',
  inbox: '<path d="M3 13h5l1.5 3h5l1.5-3h5"/><path d="M5 5h14l2 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  more: '<circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="19" cy="12" r="1.3" fill="currentColor"/>',
};
const icon = (name, extra = "") =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>${ICONS[name] || ""}</svg>`;

// ------------------------------------------------------------------ utilidades
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

async function api(path, opts = {}) {
  const res = await fetch("/api" + path, {
    method: opts.method || (opts.body ? "POST" : "GET"),
    headers: opts.body ? { "Content-Type": "application/json" } : {},
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && path !== "/login") {
    state.session = { authed: false, needsSetup: false };
    render();
  }
  if (!res.ok) throw new Error(data.error || "Algo salió mal. Inténtalo de nuevo.");
  return data;
}

let toastTimer;
function toast(text, kind = "") {
  document.querySelector(".toast")?.remove();
  const el = document.createElement("div");
  el.className = "toast " + kind;
  el.textContent = text;
  document.body.appendChild(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), 3600);
}

// Ejecuta una acción con el botón en estado "cargando" y muestra errores como aviso.
async function busy(btn, fn) {
  const html = btn?.innerHTML;
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>';
  }
  try {
    return await fn();
  } catch (e) {
    toast(e.message, "error");
  } finally {
    if (btn && btn.isConnected) {
      btn.disabled = false;
      btn.innerHTML = html;
    }
  }
}

const fmtDate = (iso, opts = {}) =>
  new Date(iso).toLocaleString("es", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", ...opts });
function relative(iso) {
  const diff = (Date.parse(iso) - Date.now()) / 1000;
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  if (abs < 60) return "ahora";
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  return rtf.format(Math.round(diff / 86400), "day");
}
// Valor para <input type="datetime-local"> en hora local.
function toLocalInput(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}
// Si el arte viene del Plan, propone la hora de su tarjeta.
function slotDefault(post) {
  return post?.plannedAt && Date.parse(post.plannedAt) > Date.now() ? toLocalInput(post.plannedAt) : defaultSlot();
}
function defaultSlot() {
  const d = new Date();
  d.setDate(d.getDate() + (d.getHours() >= 18 ? 1 : 0));
  d.setHours(19, 0, 0, 0);
  return toLocalInput(d);
}

const STATUS = {
  review: { label: "En revisión", cls: "pill-review" },
  approved: { label: "Aprobado", cls: "pill-approved" },
  scheduled: { label: "Programado", cls: "pill-scheduled" },
  publishing: { label: "Publicando…", cls: "pill-publishing" },
  published: { label: "Publicado", cls: "pill-published" },
  rejected: { label: "Rechazado", cls: "pill-rejected" },
  failed: { label: "Error", cls: "pill-failed" },
  idea: { label: "Idea", cls: "pill-idea" },
};
const pill = (status) => `<span class="pill ${STATUS[status].cls}">${STATUS[status].label}</span>`;
const TYPE_ICON = { IMAGE: "image", CAROUSEL: "stack", REELS: "play" };
const TYPE_LABEL = { IMAGE: "Imagen", CAROUSEL: "Carrusel", REELS: "Reel" };

function mediaTag(m, attrs = "") {
  if (!m) return `<div class="thumb placeholder" ${attrs}>${icon("bulb")}</div>`;
  return m.mime.startsWith("video/")
    ? `<video src="${esc(m.url)}#t=0.5" muted playsinline preload="metadata" ${attrs}></video>`
    : `<img src="${esc(m.url)}" alt="" loading="lazy" ${attrs}>`;
}
function thumb(post, cls = "thumb") {
  return mediaTag(post?.media[0], `class="${cls}"`);
}
function avatar(acc, size = "") {
  if (!acc) return `<div class="avatar ${size}">?</div>`;
  return acc.avatar
    ? `<div class="avatar ${size}"><img src="${esc(acc.avatar)}" alt=""></div>`
    : `<div class="avatar ${size}">${esc((acc.username || "?")[0].toUpperCase())}</div>`;
}
function scoreBadge(review) {
  if (!review || review.score == null) return "";
  const c = review.score >= 80 ? "var(--green)" : review.score >= 60 ? "var(--orange)" : "var(--red)";
  return `<span class="score"><span class="score-ring" style="--v:${review.score};--c:${c}"></span>${review.score}</span>`;
}

// ------------------------------------------------------------------ estado
const state = {
  session: null,
  data: null,
  view: location.hash.slice(1) || "home",
  filter: "all",
  calMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  agentReply: null,
  agentProposals: [],
  homeDay: "",
};

const accountById = (id) => state.data?.accounts.find((a) => a.id === id);
const postById = (id) => state.data?.posts.find((p) => p.id === id);
const pendingProposals = () => (state.data?.proposals || []).filter((p) => p.status === "pending" && postById(p.postId));
const reviewPosts = () => (state.data?.posts || []).filter((p) => p.status === "review");
// Propuestas del plan desde hoy: también esperan tu visto bueno.
const planProposals = () => {
  const t = planToday();
  return (state.data?.plan?.slots || []).filter((s) => s.status === "proposed" && s.date >= t).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
};
const approvalCount = () => pendingProposals().length + reviewPosts().length + planProposals().length;

async function refresh() {
  state.data = await api("/state");
}

// ------------------------------------------------------------------ navegación
const NAV = [
  { id: "home", label: "Hoy", icon: "home" },
  { id: "plan", label: "Plan", icon: "calendar" },
  { id: "approvals", label: "Aprobaciones", short: "Aprobar", icon: "inbox" },
  { id: "library", label: "Artes", icon: "grid" },
  { id: "calendar", label: "Calendario", icon: "clock" },
  { id: "research", label: "Investigación", icon: "flask" },
  { id: "accounts", label: "Cuentas", icon: "instagram" },
  { id: "settings", label: "Ajustes", icon: "gear" },
];
const TOP_NAV = ["home", "plan", "approvals", "library", "calendar", "research"];
const TAB_NAV = ["home", "plan", "approvals", "library"];
const navById = (id) => NAV.find((n) => n.id === id);

function go(view) {
  state.view = view;
  history.replaceState(null, "", "#" + view);
  render();
  window.scrollTo({ top: 0 });
}
window.addEventListener("hashchange", () => {
  const v = location.hash.slice(1);
  if (v && v !== state.view) go(v);
});

// ------------------------------------------------------------------ tema claro / oscuro (uno solo botón: luna ↔ sol)
const isDark = () => document.documentElement.dataset.theme === "dark";
const themeBtn = () =>
  `<button class="icon-btn" data-action="theme" title="${isDark() ? "Modo claro" : "Modo oscuro"}" aria-label="${isDark() ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}">${icon(isDark() ? "sun" : "moon")}</button>`;
function toggleTheme() {
  const next = isDark() ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    // sin almacenamiento: el tema dura hasta recargar
  }
  document.querySelectorAll('[data-action="theme"]').forEach((b) => (b.outerHTML = themeBtn()));
}

function openMore() {
  openSheet(`
    <div class="sheet sheet-sm more-menu">
      <div class="sheet-head"><h2>Más</h2><button class="btn btn-icon" data-close aria-label="Cerrar">${icon("x")}</button></div>
      <div class="more-list">
        ${["calendar", "research", "accounts", "settings"].map((id) => `<button class="more-item" data-go="${id}">${icon(navById(id).icon)}<span>${navById(id).label}</span>${icon("right")}</button>`).join("")}
        <button class="more-item" data-action="new-post">${icon("plus")}<span>Nuevo arte</span>${icon("right")}</button>
        <button class="more-item" data-action="logout">${icon("logout")}<span>Cerrar sesión</span></button>
      </div>
    </div>`);
}

// ------------------------------------------------------------------ render raíz
function render() {
  const app = $("#app");
  if (!state.session) {
    app.innerHTML = "";
    return;
  }
  if (!state.session.authed) {
    app.innerHTML = authView();
    bindAuth();
    return;
  }
  if (!state.data) {
    app.innerHTML = `<div class="auth"><span class="spinner"></span></div>`;
    return;
  }
  const count = approvalCount();
  const badge = (id) => (id === "approvals" && count ? `<span class="badge">${count}</span>` : "");
  const inMore = !TAB_NAV.includes(state.view);
  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <button class="brand" data-go="home"><span class="brand-mark"><i></i></span>Taskday</button>
        <nav class="topnav">${TOP_NAV.map((id) => `<button class="${state.view === id ? "on" : ""}" data-go="${id}">${navById(id).label}${badge(id)}</button>`).join("")}</nav>
        <div class="top-actions">
          <button class="icon-btn hide-m ${state.view === "accounts" ? "on" : ""}" data-go="accounts" title="Cuentas" aria-label="Cuentas">${icon("instagram")}</button>
          ${themeBtn()}
          <button class="icon-btn hide-m ${state.view === "settings" ? "on" : ""}" data-go="settings" title="Ajustes" aria-label="Ajustes">${icon("gear")}</button>
          <button class="icon-btn hide-m" data-action="logout" title="Cerrar sesión" aria-label="Cerrar sesión">${icon("logout")}</button>
          <button class="icon-btn show-m" data-action="new-post" title="Nuevo arte" aria-label="Nuevo arte">${icon("plus")}</button>
          <button class="btn btn-primary hide-m" data-action="new-post">${icon("plus")}Nuevo arte</button>
        </div>
      </header>
      <main class="main" id="view">${viewHtml()}</main>
      <nav class="tabbar">
        ${TAB_NAV.map((id) => `<button class="${state.view === id ? "active" : ""}" data-go="${id}">${icon(navById(id).icon)}<span>${navById(id).short || navById(id).label}</span>${badge(id)}</button>`).join("")}
        <button class="${inMore ? "active" : ""}" data-action="more">${icon("more")}<span>Más</span></button>
      </nav>
    </div>`;
}

function rerenderView() {
  const el = $("#view");
  if (!el) return render();
  // No re-pintamos mientras el usuario escribe en la vista principal.
  if (el.contains(document.activeElement) && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
  el.innerHTML = viewHtml();
  const count = approvalCount();
  document.querySelectorAll('.topnav [data-go="approvals"], .tabbar [data-go="approvals"]').forEach((b) => {
    b.querySelector(".badge")?.remove();
    if (count) b.insertAdjacentHTML("beforeend", `<span class="badge">${count}</span>`);
  });
}

function viewHtml() {
  const views = { plan: planView, research: researchView, home: homeView, approvals: approvalsView, library: libraryView, calendar: calendarView, accounts: accountsView, settings: settingsView };
  return (views[state.view] || homeView)();
}

// ------------------------------------------------------------------ acceso
function authView() {
  const setup = state.session.needsSetup;
  return `
    <div class="auth">
      <form class="auth-card" id="auth-form">
        <div class="brand-mark"><i></i></div>
        <h1>${setup ? "Bienvenido a Taskday" : "Taskday"}</h1>
        <p>${setup ? "Crea una contraseña para proteger tus cuentas." : "Introduce tu contraseña para continuar."}</p>
        <input class="input" type="password" name="password" placeholder="Contraseña" autocomplete="${setup ? "new-password" : "current-password"}" autofocus required minlength="${setup ? 8 : 1}">
        <button class="btn btn-primary btn-lg" type="submit">${setup ? "Crear y entrar" : "Entrar"}</button>
      </form>
    </div>`;
}
function bindAuth() {
  $("#auth-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = e.target.querySelector("button");
    busy(btn, async () => {
      await api(state.session.needsSetup ? "/setup" : "/login", { body: { password: e.target.password.value } });
      state.session = { authed: true };
      await refresh();
      render();
      startPolling();
    });
  });
}

// ------------------------------------------------------------------ flujo de cada pieza del plan
// Propuesta → Aprobar → Crear borrador → Subir arte → Programar → Publicado.
const STEPS = ["Aprobar", "Borrador", "Arte", "Programar", "Publicado"];
const FORMAT_NOUN = { REEL: "el reel", CARRUSEL: "el carrusel", POST: "el post", STORIES: "las stories" };
const de = (name) => (name.startsWith("el ") ? "del " + name.slice(3) : "de " + name);
const MILESTONE = { date: "2026-10-20", label: "Días hasta el 20/10" };

// Devuelve el paso actual (0–4; 5 = terminado), qué botón toca y la frase de la tarea.
function slotFlow(s) {
  const post = s.postId ? postById(s.postId) : null;
  const noun = FORMAT_NOUN[s.format] || "la pieza";
  const name = `${noun} «${s.theme || "sin tema"}»`;
  if (s.status === "published" || post?.status === "published") return { step: 5, done: true, label: "Publicada" };
  if (s.status === "skipped") return { step: 0, label: "Descartada" };
  if (s.status === "proposed") return { step: 0, act: "approve", label: "Aprobar", todo: `Aprueba ${name}` };
  if (s.format === "STORIES") return { step: 2, act: "slot", label: "Hacer", todo: `Haz ${name} y márcalas como publicadas` };
  if (!post) return { step: 1, act: "draft", label: "Crear borrador", todo: `Crea el borrador ${de(name)}` };
  if (post.status === "idea" || !post.media.length) {
    const verb = s.format === "REEL" ? "Graba y sube" : "Diseña y sube";
    return { step: 2, act: "post", label: "Subir arte", todo: `${verb} ${name}` };
  }
  if (post.status === "review") return { step: 3, act: "post", label: "Validar", todo: `Valida el arte ${de(name)}` };
  if (post.status === "approved") return { step: 3, act: "post", label: "Programar", todo: `Programa ${name}` };
  if (post.status === "rejected" || post.status === "failed") return { step: 3, act: "post", label: "Revisar", todo: `Revisa ${name}: ${post.status === "failed" ? "falló al publicar" : "está rechazado"}` };
  if (post.status === "scheduled") return { step: 4, label: `Programada · ${fmtDate(post.scheduledAt, { month: undefined })}` };
  return { step: 4, label: "Publicando…" };
}

function stepsHtml(f) {
  return `<div class="fsteps">${STEPS.map((l, i) => `<span class="fstep ${i < f.step ? "done" : i === f.step ? "now" : ""}"><i>${i < f.step ? "✓" : i + 1}</i>${l}</span>`).join("")}</div>`;
}
const nextBtn = (s, f, cls = "btn-xs") =>
  f.act ? `<button class="btn btn-primary ${cls}" data-slot-next="${s.id}">${f.act === "approve" ? icon("check") : ""}${f.label}</button>` : `<span class="slot-state">${esc(f.label)}</span>`;

// Tarjetas con algo que hacer (desde hace una semana), de la más urgente a la menos.
function planTasks() {
  const from = pAddDays(planToday(), -7);
  return (state.data.plan?.slots || [])
    .filter((s) => s.date >= from && !["skipped", "published"].includes(s.status))
    .map((s) => ({ s, f: slotFlow(s) }))
    .filter((x) => x.f.act)
    .sort((a, b) => (a.s.date + a.s.time).localeCompare(b.s.date + b.s.time));
}
function whenLabel(date) {
  const t = planToday();
  if (date < t) return `atrasada · era el ${pDay(date, { weekday: "short", day: "numeric" })}`;
  if (date === t) return "para hoy";
  if (date === pAddDays(t, 1)) return "para mañana";
  return `para el ${pDay(date, { weekday: "long", day: "numeric" })}`;
}
const fmtName = (s) => (FORMAT_UI[s.format] || FORMAT_UI.POST)[0];

function dayPillsHtml(from, sel, slots, attr) {
  const today = planToday();
  return `<div class="daypills">${[0, 1, 2, 3, 4, 5, 6].map((i) => {
    const d = pAddDays(from, i);
    const dots = slots.filter((s) => s.date === d && s.status !== "skipped").slice(0, 3).map((s) => `<span class="d-${s.format}"></span>`).join("");
    return `<button class="dp ${d === sel ? "sel" : ""} ${d === today ? "today" : ""} ${d < today ? "past" : ""}" ${attr}="${d}"><small>${WEEKDAYS[i]}</small><b>${Number(d.slice(8))}</b><span class="dots">${dots}</span></button>`;
  }).join("")}</div>`;
}

function agendaRow(s) {
  const f = slotFlow(s);
  const multi = state.data.accounts.length > 1;
  return `<div class="ag f-${s.format} st-${s.status} ${f.done ? "done" : ""}" data-plan-open="${s.id}" role="button" tabindex="0">
      <span class="ag-time">${esc(s.time)}</span>
      <span class="ag-main"><strong>${esc(s.theme || "Sin tema")}</strong><small>${pDay(s.date, { weekday: "short", day: "numeric" })} · ${fmtName(s)}${multi ? ` · @${esc(accountById(s.accountId)?.username || "—")}` : ""}${s.production ? ` · ${esc(s.production.slice(0, 48))}` : ""}</small></span>
      ${nextBtn(s, f)}
    </div>`;
}

// ------------------------------------------------------------------ Hoy
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Buenos días" : h < 20 ? "Buenas tardes" : "Buenas noches";
}

// Avisos de cuentas reales: token caducado o a punto de caducar (los de Facebook duran 60 días).
function accountAlertsHtml() {
  return state.data.accounts
    .filter((a) => !a.demo)
    .map((a) => {
      if (a.status === "error") return `<strong>@${esc(a.username)} no funciona.</strong> ${esc(a.statusMsg || "Vuelve a conectarla con un token nuevo.")}`;
      const left = 60 - Math.floor((Date.now() - Date.parse(a.tokenSetAt || a.connectedAt)) / 86400000);
      if (a.tokenKind === "facebook" && left <= 10) return `<strong>El token de @${esc(a.username)} caduca en ${Math.max(left, 0)} días.</strong> Genera uno nuevo y pégalo en Cuentas → Conectar Instagram.`;
      return "";
    })
    .filter(Boolean)
    .map((t) => `<div class="note note-warn" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><div style="flex:1;min-width:200px">${t}</div><button class="btn" data-go="accounts">Ir a Cuentas</button></div>`)
    .join("");
}

function heroHtml() {
  const tasks = planTasks();
  const top = tasks[0];
  const tomorrow = pAddDays(planToday(), 1);
  const reviews = reviewPosts().filter((p) => !(p.planSlotId && slotById(p.planSlotId)));
  const props = pendingProposals();
  // 1) Lo del plan que vence hoy o mañana (o atrasado).
  if (top && top.s.date <= tomorrow) return heroSlot(top, tasks);
  // 2) Artes subidos a mano o propuestas del agente: no tienen fecha, van ya.
  if (reviews.length) {
    const p = reviews[0];
    return `<div class="hero">
        <span class="kicker">${icon("spark")}Lo siguiente · validar arte</span>
        <h2>Valida el arte «${esc(p.title)}»</h2>
        <div class="hero-meta"><span>${TYPE_LABEL[p.type]}</span><span>${p.accountId ? "@" + esc(accountById(p.accountId)?.username || "—") : "Sin cuenta"}</span>${reviews.length > 1 ? `<span>+${reviews.length - 1} más por validar</span>` : ""}</div>
        <div class="hero-acts"><button class="btn btn-primary btn-lg" data-open="${p.id}">${icon("check")}Revisar y aprobar</button></div>
      </div>`;
  }
  if (props.length) {
    const pr = props[0];
    return `<div class="hero">
        <span class="kicker">${icon("spark")}Lo siguiente · propuesta del agente</span>
        <h2>${KIND[pr.kind].label}: «${esc(postById(pr.postId)?.title || "")}»</h2>
        <div class="hero-meta"><span>${esc(pr.reason || "")}</span></div>
        <div class="hero-acts"><button class="btn btn-primary btn-lg" data-proposal-approve="${pr.id}">${icon("check")}${KIND[pr.kind].verb}</button><button class="btn btn-soft btn-lg" data-go="approvals">Ver todas</button></div>
      </div>`;
  }
  // 3) Lo siguiente del plan aunque falten días.
  if (top) return heroSlot(top, tasks);
  return `<div class="hero calm">
      <span class="kicker">${icon("checkCircle")}Todo al día</span>
      <h2>No hay nada pendiente. Planifica lo que viene.</h2>
      <div class="hero-acts"><button class="btn btn-primary btn-lg" data-go="plan">${icon("calendar")}Abrir el plan</button><button class="btn btn-soft btn-lg" data-action="new-post">${icon("plus")}Nuevo arte</button></div>
    </div>`;
}
function heroSlot({ s, f }, tasks) {
  const late = s.date < planToday();
  const after = tasks.filter((x) => x.s.id !== s.id).slice(0, 2);
  return `<div class="hero">
      <span class="kicker ${late ? "late" : ""}">${icon(late ? "warn" : "spark")}Lo siguiente · ${whenLabel(s.date)}</span>
      <h2>${esc(f.todo)}</h2>
      <div class="hero-meta"><span>${pDay(s.date, { weekday: "short", day: "numeric" })} · ${esc(s.time)}</span><span>${fmtName(s)}</span>${s.goal ? `<span>Objetivo: ${esc((GOAL_UI[s.goal] || s.goal).toLowerCase())}</span>` : ""}${s.phase ? `<span>${esc(s.phase)}</span>` : ""}${state.data.accounts.length > 1 ? `<span>@${esc(accountById(s.accountId)?.username || "—")}</span>` : ""}</div>
      <div class="hero-acts">${nextBtn(s, f, "btn-lg")}<button class="btn btn-soft btn-lg" data-plan-open="${s.id}">Ver ficha</button></div>
      ${stepsHtml(f)}
      ${after.length ? `<div class="hero-after">Después: ${after.map((x) => `<b>${esc(x.f.label)}</b> ${esc(x.s.theme || "")} (${pDay(x.s.date, { weekday: "short", day: "numeric" })})`).join(" · ")}</div>` : ""}
    </div>`;
}

function countersHtml() {
  const d = state.data;
  const slots = d.plan?.slots || [];
  const scheduled = d.posts.filter((p) => p.status === "scheduled").length;
  const published = slots.filter((s) => s.status === "published").length + d.posts.filter((p) => p.status === "published" && !(p.planSlotId && slotById(p.planSlotId)?.status === "published")).length;
  const t = planToday();
  const left = Math.round((Date.parse(MILESTONE.date) - Date.parse(t)) / 86400000);
  const upcoming = slots.filter((s) => s.date >= t && !["skipped", "published"].includes(s.status)).length;
  const c = (cls, n, label, view) => `<button class="counter ${cls}" data-go="${view}"><span class="n">${n}</span><span class="l">${label}</span></button>`;
  return `<div class="counters">
      ${c("c-oro", approvalCount(), "Por aprobar", "approvals")}
      ${c("c-vio", scheduled, "Programados", "calendar")}
      ${c("c-lima", published, "Publicados", "plan")}
      ${left >= 0 ? c("c-ink", left, MILESTONE.label, "plan") : c("c-ink", upcoming, "En el plan", "plan")}
    </div>`;
}

// «Cómo va la semana»: cada pieza en la columna de su paso.
function flowLaneHtml() {
  const from = pWeekStart(planToday());
  const to = pAddDays(from, 6);
  const week = (state.data.plan?.slots || []).filter((s) => s.date >= from && s.date <= to && s.status !== "skipped").sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  if (!week.length) return "";
  const cols = STEPS.map(() => []);
  for (const s of week) cols[Math.min(slotFlow(s).step, 4)].push(s);
  const hints = ["Nada por aprobar.", "Aprueba una tarjeta y crea su borrador.", "Graba o diseña y súbelo al borrador.", "Arte validado → elige la hora.", "Aún nada publicado esta semana."];
  return `<div class="lane">
      <div class="lane-head"><h3>Cómo va la semana</h3><span class="muted small">cada pieza avanza de izquierda a derecha</span></div>
      <div class="flow">${cols.map((list, i) => `
        <div class="fcol"><div class="fcol-h">${i + 1} · ${STEPS[i]}<span>${list.length}</span></div>
          ${list.slice(0, 3).map((s) => `<button class="mini ${i === 4 ? (slotFlow(s).done ? "done" : "f-" + s.format) : "f-" + s.format}" data-plan-open="${s.id}">${esc(s.theme || "Sin tema")}<small>${pDay(s.date, { weekday: "short", day: "numeric" })} · ${esc(s.time)}${slotFlow(s).done ? " ✓" : ""}</small></button>`).join("") || `<div class="muted">${hints[i]}</div>`}
          ${list.length > 3 ? `<div class="more">+${list.length - 3} más</div>` : ""}
        </div>`).join("")}</div>
    </div>`;
}

function weekCardHtml() {
  const t = planToday();
  const from = pWeekStart(t);
  const sel = state.homeDay && state.homeDay >= from && state.homeDay <= pAddDays(from, 6) ? state.homeDay : t;
  const all = (state.data.plan?.slots || []).filter((s) => s.status !== "skipped").sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const day = all.filter((s) => s.date === sel);
  const next = all.filter((s) => s.date > sel && s.status !== "published").slice(0, 3);
  const dayName = sel === t ? "Hoy" : pDay(sel, { weekday: "long", day: "numeric" });
  let body;
  if (day.length) body = `<div class="agenda-label">${dayName[0].toUpperCase() + dayName.slice(1)}</div>${day.map(agendaRow).join("")}`;
  else body = `<div class="agenda-label">${sel === t ? "Hoy no se publica nada." : "Nada planificado este día."}${next.length ? " Lo próximo:" : ""}</div>${next.map(agendaRow).join("")}`;
  return `<div class="card">
      <h3 class="side-h">Esta semana</h3>
      ${dayPillsHtml(from, sel, all, "data-home-day")}
      <div class="agenda">${body || ""}</div>
    </div>`;
}

function activityHtml() {
  const d = state.data;
  const scheduled = d.posts.filter((p) => p.status === "scheduled").sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  return `${scheduled.length ? `<div class="card">
        <h3 class="side-h">${icon("clock")}Programado</h3>
        ${scheduled.slice(0, 4).map((p) => `<div class="list-row" data-open="${p.id}">${thumb(p)}<div class="row-main"><div class="row-title">${esc(p.title)}</div><div class="row-sub">${fmtDate(p.scheduledAt)} · @${esc(accountById(p.accountId)?.username || "—")}</div></div></div>`).join("")}
      </div>` : ""}
      <div class="card">
        <h3 class="side-h">Actividad reciente</h3>
        ${d.activity.length ? d.activity.slice(0, 6).map((a) => `<div class="activity-item ${a.kind}"><span class="dot"></span><div style="flex:1">${esc(a.text)}<div class="muted small">${relative(a.at)}</div></div></div>`).join("") : `<p class="muted small" style="margin:0">Aquí verás todo lo que pasa.</p>`}
      </div>`;
}

function homeView() {
  const d = state.data;
  const acc = d.accounts.length === 1 ? ` · @${esc(d.accounts[0].username)}` : "";
  return `
    <div class="page-head">
      <div>
        <h1 class="page-title">${greeting()}</h1>
        <p class="page-sub">${new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}${acc}</p>
      </div>
    </div>
    ${!d.accounts.length ? `
      <div class="card" style="display:flex;align-items:center;gap:16px;margin-bottom:16px;flex-wrap:wrap">
        <div class="stat-icon" style="margin:0;background:var(--accent-soft);color:var(--accent)">${icon("instagram")}</div>
        <div style="flex:1;min-width:200px"><strong>Conecta tu primera cuenta de Instagram</strong><div class="muted small">O empieza con una cuenta de prueba para ver cómo funciona todo.</div></div>
        <button class="btn btn-primary" data-go="accounts">Conectar</button>
      </div>` : ""}
    ${accountAlertsHtml()}
    <div class="home">
      <div class="home-main">${heroHtml()}${countersHtml()}${flowLaneHtml()}</div>
      <aside class="home-side">${weekCardHtml()}${composerHtml()}${activityHtml()}</aside>
    </div>`;
}

function composerHtml() {
  const hasAI = state.data.settings.hasAnthropic;
  const chips = [
    "Programa los artes aprobados esta semana a las 7 pm",
    "Mejora el copy de los artes en revisión",
    "Publica ahora el último arte aprobado",
  ];
  return `
    <div class="card composer">
      <div class="composer-head"><span class="agent-dot">${icon("spark")}</span>Agente
        <span class="muted small" style="font-weight:400">· propone, tú apruebas</span></div>
      ${hasAI ? `
        <form class="composer-row" id="agent-form">
          <textarea name="command" rows="1" placeholder="¿Qué quieres que haga?"></textarea>
          <button class="btn btn-primary btn-icon" type="submit" aria-label="Enviar">${icon("send")}</button>
        </form>
        <div class="chips">${chips.map((c) => `<button class="chip" data-chip="${esc(c)}">${esc(c)}</button>`).join("")}</div>
        ${state.agentReply ? `<div class="agent-reply">${esc(state.agentReply)}</div>` : ""}
        ${state.agentProposals.filter((p) => p.status === "pending").length ? `<div style="padding:0 8px 8px">${state.agentProposals.filter((p) => p.status === "pending").map(proposalCard).join("")}</div>` : ""}
      ` : `
        <div style="padding:6px 16px 16px" class="muted">Para activar el agente añade tu API key de Anthropic en <a href="#settings" data-go="settings">Ajustes</a>. Mientras tanto puedes subir, validar, aprobar y programar artes a mano.</div>`}
    </div>`;
}

// ------------------------------------------------------------------ Aprobaciones
const KIND = {
  schedule: { label: "Programar", verb: "Programar" },
  publish_now: { label: "Publicar ahora", verb: "Publicar" },
  update_caption: { label: "Nuevo copy", verb: "Aplicar" },
  unschedule: { label: "Desprogramar", verb: "Desprogramar" },
};

const TYPE_FORMAT = { IMAGE: "POST", CAROUSEL: "CARRUSEL", REELS: "REEL" };

function proposalCard(pr) {
  const post = postById(pr.postId);
  if (!post) return "";
  const acc = accountById(post.accountId);
  const detail =
    pr.kind === "schedule" ? `${fmtDate(pr.scheduledAt)} · @${esc(acc?.username || "—")}`
    : pr.kind === "publish_now" ? `En @${esc(acc?.username || "—")}, en cuanto apruebes`
    : pr.kind === "unschedule" ? `Programado para ${post.scheduledAt ? fmtDate(post.scheduledAt) : "—"}`
    : "Reemplaza el texto actual";
  return `
    <div class="ap-card">
      <div class="ap-art">
        <div class="ap-thumb" data-open="${post.id}">${thumb(post, "thumb")}</div>
        <div class="row-main">
          <div class="approval-kind">${icon("spark")}${KIND[pr.kind].label}</div>
          <h4>${esc(post.title)}</h4>
          <div class="row-sub">${detail}</div>
        </div>
      </div>
      ${pr.reason ? `<div class="ap-why">${esc(pr.reason)}</div>` : ""}
      ${pr.kind === "update_caption" ? `<div class="quote">${esc(pr.caption)}</div>` : ""}
      <div class="ap-acts">
        <button class="btn btn-primary" data-proposal-approve="${pr.id}">${icon("check")}${KIND[pr.kind].verb}</button>
        <button class="btn btn-ghost-danger" data-proposal-reject="${pr.id}">Rechazar</button>
      </div>
    </div>`;
}

function reviewCard(post) {
  const acc = accountById(post.accountId);
  const errors = post.checks.filter((c) => c.level === "error").length;
  const warns = post.checks.filter((c) => c.level === "warn").length;
  const r = post.aiReview;
  const fmt = TYPE_FORMAT[post.type] || "POST";
  return `
    <div class="ap-card">
      <div class="ap-art">
        <div class="ap-thumb" data-open="${post.id}">${thumb(post, "thumb")}</div>
        <div class="row-main">
          <div class="ap-tags"><span class="ftag ft-${fmt}">${icon(TYPE_ICON[post.type])}${TYPE_LABEL[post.type]}</span><span class="tag tag-soft">${acc ? "@" + esc(acc.username) : "Sin cuenta"}</span></div>
          <h4>${esc(post.title)}</h4>
          <div class="ap-checks">
            ${errors ? `<span style="color:var(--red)">● ${errors} ${errors === 1 ? "error" : "errores"} de validación</span>` : warns ? `<span style="color:var(--orange)">● ${warns} ${warns === 1 ? "aviso" : "avisos"}</span>` : `<span style="color:var(--green)">● Requisitos de Instagram OK</span>`}
            ${r?.pending ? `<span><span class="spinner" style="width:12px;height:12px;vertical-align:-1px"></span> IA revisando…</span>` : r?.score != null ? `<span>IA ${scoreBadge(r)}</span>` : ""}
            <span class="muted">Subido ${relative(post.createdAt)}</span>
          </div>
        </div>
      </div>
      <div class="ap-acts"><button class="btn btn-primary" data-open="${post.id}">${icon("check")}Revisar y aprobar</button></div>
    </div>`;
}

function planProposalCard(s) {
  const [fl, fi] = FORMAT_UI[s.format] || FORMAT_UI.POST;
  const multi = state.data.accounts.length > 1;
  return `
    <div class="ap-card">
      <div class="ap-top">
        <div class="ap-date f-${s.format}"><small>${pDay(s.date, { weekday: "short" })}</small><b>${Number(s.date.slice(8))}</b></div>
        <div class="row-main">
          <div class="ap-tags"><span class="ftag ft-${s.format}">${icon(fi)}${fl}</span><span class="tag tag-soft">${esc(s.time)}</span>${s.goal ? `<span class="tag tag-soft">${esc(GOAL_UI[s.goal] || s.goal)}</span>` : ""}${multi ? `<span class="tag tag-soft">@${esc(accountById(s.accountId)?.username || "—")}</span>` : ""}</div>
          <h4>${esc(s.theme || "Sin tema")}</h4>
        </div>
      </div>
      ${s.hook ? `<div class="ap-hook">“${esc(s.hook.trim().replace(/^["“”]+|["“”]+$/g, ""))}”</div>` : ""}
      ${s.why ? `<div class="ap-why"><strong>Por qué:</strong> ${esc(s.why)}</div>` : s.production ? `<div class="ap-why"><strong>Producción:</strong> ${esc(s.production)}</div>` : ""}
      <div class="ap-acts">
        <button class="btn btn-primary" data-plan-approve="${s.id}">${icon("check")}Aprobar</button>
        <button class="btn" data-plan-open="${s.id}">Cambiar</button>
        <button class="btn btn-ghost-danger" data-plan-skip="${s.id}">Descartar</button>
      </div>
    </div>`;
}

const apState = { tab: "all" };
function approvalsView() {
  const props = pendingProposals();
  const reviews = reviewPosts();
  const plans = planProposals();
  const total = props.length + reviews.length + plans.length;
  const tabs = [["all", "Todo", total], ["plan", "Plan", plans.length], ["arts", "Artes", reviews.length], ["agent", "Agente", props.length]];
  const show = (k) => apState.tab === "all" || apState.tab === k;
  const section = (k, title, list, card) =>
    show(k) && list.length ? `<div class="section-title">${title} <span class="count">${list.length}</span></div><div class="ap-list">${list.map(card).join("")}</div>` : "";
  const shown = (show("plan") ? plans.length : 0) + (show("arts") ? reviews.length : 0) + (show("agent") ? props.length : 0);
  return `
    <div class="page-head"><div>
      <h1 class="page-title">Aprobaciones</h1>
      <p class="page-sub">Nada se publica ni cambia sin tu visto bueno.</p>
    </div></div>
    <div class="ap-tabs">${tabs.map(([k, l, n]) => `<button class="${apState.tab === k ? "on" : ""}" data-ap-tab="${k}">${l}<span>${n}</span></button>`).join("")}</div>
    ${!shown ? `<div class="card empty">${icon("checkCircle")}<h3>Todo al día</h3><p>No hay nada esperando tu aprobación${apState.tab === "all" ? "" : " aquí"}.</p></div>` : ""}
    ${show("plan") && plans.length > 1 ? `
      <div class="bulk">
        <div><strong>${plans.length} propuestas del plan</strong><span>Lo aprobado no lo vuelve a tocar el agente sin preguntarte.</span></div>
        <button class="btn" data-plan-approve-all="${plans.map((s) => s.id).join(",")}">${icon("check")}Aprobar las ${plans.length}</button>
      </div>` : ""}
    ${section("arts", "Artes por validar", reviews, reviewCard)}
    ${section("agent", "Propuestas del agente", props, proposalCard)}
    ${section("plan", "Propuestas del plan", plans, planProposalCard)}`;
}

// ------------------------------------------------------------------ Artes
const FILTERS = [
  ["all", "Todos"],
  ["idea", "Ideas"],
  ["review", "En revisión"],
  ["approved", "Aprobados"],
  ["scheduled", "Programados"],
  ["published", "Publicados"],
  ["issues", "Con problemas"],
];
function libraryView() {
  const posts = state.data.posts.filter((p) =>
    state.filter === "all" ? true : state.filter === "issues" ? ["rejected", "failed"].includes(p.status) : p.status === state.filter
  );
  return `
    <div class="page-head">
      <div><h1 class="page-title">Artes</h1><p class="page-sub">${state.data.posts.length} en total</p></div>
      <button class="btn btn-primary" data-action="new-post">${icon("plus")}Nuevo arte</button>
    </div>
    <div class="toolbar">
      <div class="segmented">${FILTERS.map(([id, label]) => `<button class="${state.filter === id ? "on" : ""}" data-filter="${id}">${label}</button>`).join("")}</div>
    </div>
    ${posts.length ? `<div class="post-grid">${posts.map(postCard).join("")}</div>` : `
      <div class="card empty">${icon("image")}<h3>No hay artes aquí</h3><p>Sube tu primer arte y envíalo a revisión.</p>
      <button class="btn btn-primary" data-action="new-post" style="margin-top:8px">${icon("plus")}Nuevo arte</button></div>`}`;
}
function postCard(p) {
  const acc = accountById(p.accountId);
  const when = p.status === "scheduled" ? fmtDate(p.scheduledAt) : p.status === "published" ? relative(p.publishedAt) : relative(p.createdAt);
  return `
    <button class="post-card" data-open="${p.id}">
      <div class="post-media">${thumb(p, "")}<span class="type">${icon(TYPE_ICON[p.type])}</span></div>
      <div class="post-body">
        <div class="row-title">${esc(p.title)}</div>
        <div class="post-meta">${pill(p.status)}${scoreBadge(p.aiReview)}</div>
        <div class="post-meta" style="margin-top:6px"><span>${acc ? "@" + esc(acc.username) : "Sin cuenta"}</span><span>${when}</span></div>
      </div>
    </button>`;
}

// ------------------------------------------------------------------ Calendario
function calendarView() {
  const m = state.calMonth;
  const start = new Date(m);
  start.setDate(1 - ((m.getDay() + 6) % 7)); // semana empieza en lunes
  const events = state.data.posts
    .filter((p) => (p.status === "scheduled" && p.scheduledAt) || (p.status === "published" && p.publishedAt))
    .map((p) => ({ post: p, at: new Date(p.status === "scheduled" ? p.scheduledAt : p.publishedAt) }));
  const today = new Date().toDateString();
  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const evs = events.filter((e) => e.at.toDateString() === d.toDateString()).sort((a, b) => a.at - b.at);
    days.push(`
      <div class="cal-day ${d.getMonth() !== m.getMonth() ? "out" : ""} ${d.toDateString() === today ? "today" : ""}">
        <span class="cal-num">${d.getDate()}</span>
        ${evs.map((e) => `<div class="cal-ev ${e.post.status}" data-open="${e.post.id}" title="${esc(e.post.title)}">${thumb(e.post, "")}<span>${e.at.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })} ${esc(e.post.title)}</span></div>`).join("")}
      </div>`);
    if (i >= 34 && d.getMonth() !== m.getMonth() && d.getDay() === 0) break;
  }
  const raw = m.toLocaleDateString("es", { month: "long", year: "numeric" });
  const title = raw[0].toUpperCase() + raw.slice(1);
  return `
    <div class="page-head">
      <div><h1 class="page-title">${title}</h1><p class="page-sub">Violeta: programado · Verde: publicado</p></div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-icon" data-cal="-1" aria-label="Mes anterior">${icon("left")}</button>
        <button class="btn" data-cal="0">Hoy</button>
        <button class="btn btn-icon" data-cal="1" aria-label="Mes siguiente">${icon("right")}</button>
      </div>
    </div>
    <div class="cal">
      ${["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => `<div class="cal-head">${d}</div>`).join("")}
      ${days.join("")}
    </div>`;
}

// ------------------------------------------------------------------ Cuentas
function accountsView() {
  const accs = state.data.accounts;
  return `
    <div class="page-head">
      <div><h1 class="page-title">Cuentas</h1><p class="page-sub">Tus cuentas de Instagram conectadas.</p></div>
      <button class="btn btn-primary" data-action="connect">${icon("plus")}Conectar cuenta</button>
    </div>
    ${accs.length ? `<div class="grid grid-2">${accs.map((a) => `
      <div class="card account">
        ${avatar(a)}
        <div class="row-main">
          <div class="row-title">@${esc(a.username)} ${a.demo ? `<span class="pill pill-review" style="margin-left:4px">Prueba</span>` : a.status === "error" ? `<span class="pill pill-failed" style="margin-left:4px" title="${esc(a.statusMsg || "")}">Revisar</span>` : ""}</div>
          <div class="row-sub">${esc(a.name || "")}${a.followers != null ? ` · ${a.followers.toLocaleString("es")} seguidores` : ""}</div>
          <div class="row-sub" style="margin-top:4px">${profileComplete(a) ? `${esc(a.profile.kind || "Perfil")} · ${esc((a.profile.about || "").slice(0, 70))}` : `<span style="color:var(--orange)">Falta el perfil de marca</span>`}${a.canResearch ? ` · <span style="color:var(--green)">métricas de referencias activas</span>` : ""}</div>
        </div>
        <button class="btn ${profileComplete(a) ? "" : "btn-primary"}" data-profile="${a.id}">Perfil de marca</button>
        <button class="btn" data-test-account="${a.id}">Probar</button>
        <button class="btn btn-icon btn-danger" data-remove-account="${a.id}" aria-label="Desconectar">${icon("trash")}</button>
      </div>`).join("")}</div>` : `
      <div class="card empty">${icon("instagram")}<h3>Sin cuentas todavía</h3>
        <p>Conecta una cuenta profesional de Instagram, o añade una de prueba para explorar.</p>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:10px;flex-wrap:wrap">
          <button class="btn btn-primary" data-action="connect">Conectar Instagram</button>
          <button class="btn" data-action="demo-account">Usar cuenta de prueba</button>
        </div></div>`}
    ${accs.length ? `<div style="margin-top:14px"><button class="btn btn-ghost" data-action="demo-account">${icon("plus")}Añadir cuenta de prueba</button></div>` : ""}`;
}

function openConnect() {
  openSheet(`
    <div class="sheet sheet-sm">
      <div class="sheet-head"><h2>Conectar Instagram</h2><button class="btn btn-icon" data-close>${icon("x")}</button></div>
      <div class="sheet-body">
        <div class="note note-info">Necesitas una cuenta de Instagram <strong>profesional</strong> (Empresa o Creador). Es gratis y se cambia desde la app de Instagram en Configuración → Tipo de cuenta.</div>
        <ol class="steps">
          <li>Vincula tu Instagram a una página de Facebook: <a href="https://business.facebook.com/latest/settings/profiles" target="_blank" rel="noopener">Meta Business Suite → Configuración → Perfiles</a> → tu página → <strong>Conectar Instagram</strong>.</li>
          <li>Abre el <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noopener">Explorador de la Graph API</a>, elige tu app y añade los permisos <code>instagram_basic</code>, <code>instagram_content_publish</code>, <code>instagram_manage_insights</code>, <code>pages_show_list</code>, <code>pages_read_engagement</code> y <code>business_management</code>.</li>
          <li>Pulsa <strong>Generate Access Token</strong> y marca tu página <em>y</em> tu cuenta de Instagram.</li>
          <li>Alarga el token a 60 días en el <a href="https://developers.facebook.com/tools/debug/accesstoken/" target="_blank" rel="noopener">depurador</a> (<em>Ampliar token de acceso</em>) y pega aquí el token largo (empieza por <code>EAA…</code>).</li>
        </ol>
        <p class="muted small">Sin página de Facebook: en tu app de Meta → Instagram → «API con inicio de sesión de Instagram» → <strong>Generar token</strong> (empieza por <code>IG…</code>). Se renueva solo, pero no permite investigar otras cuentas.</p>
        <form id="connect-form">
          <div class="field"><label>Token de acceso</label><textarea class="textarea" name="token" style="min-height:90px;font-family:ui-monospace,monospace;font-size:13px" placeholder="EAA… o IG…" required></textarea></div>
          <button class="btn btn-primary btn-lg" style="width:100%" type="submit">Conectar</button>
        </form>
        <p class="muted small" style="margin-top:12px">El token se guarda solo en tu servidor y nunca se muestra en el navegador. Los tokens de larga duración caducan a los 60 días: si una cuenta deja de funcionar, vuelve a pegar un token nuevo.</p>
      </div>
    </div>`);
  $("#connect-form").addEventListener("submit", (e) => {
    e.preventDefault();
    busy(e.target.querySelector("button"), async () => {
      const r = await api("/accounts", { body: { token: e.target.token.value } });
      closeSheet();
      toast("Conectada: " + r.added.join(", "));
      await refresh();
      rerenderView();
    });
  });
}

// ------------------------------------------------------------------ Perfil de marca
const PROFILE_KINDS = ["Personal / profesional independiente", "Marca personal", "Empresa", "App o producto digital"];
const PROFILE_UI = [
  ["about", "Quién es / qué ofrece", "Ej.: Diseñador gráfico freelance especializado en branding e identidad visual."],
  ["audience", "Público objetivo", "Ej.: Emprendedores y pymes de 25–45 años que necesitan una marca profesional."],
  ["goals", "Objetivos", "Ej.: Ganar seguidores del sector y conseguir 5 clientes nuevos al mes (leads por DM)."],
  ["tone", "Tono y estilo", "Ej.: Cercano, creativo y experto. Tuteo. Visual minimalista con color de acento."],
  ["pillars", "Temas principales", "Ej.: Antes y después de marcas, consejos de diseño, proceso creativo, casos de clientes."],
  ["cta", "Llamadas a la acción y captación de leads", "Ej.: «Escríbeme MARCA por DM», link en bio a formulario, guardar el post."],
  ["avoid", "Qué evitar", "Ej.: Política, memes vulgares, prometer resultados que no se pueden garantizar."],
];

function profileComplete(a) {
  const p = a.profile || {};
  return ["about", "audience", "goals"].every((k) => (p[k] || "").trim());
}

function openProfile(accId) {
  const a = accountById(accId);
  const p = a.profile || {};
  openSheet(`
    <div class="sheet sheet-sm" id="profile-sheet">
      <div class="sheet-head"><div style="display:flex;align-items:center;gap:10px">${avatar(a, "avatar-sm")}<h2>Perfil de marca · @${esc(a.username)}</h2></div><button class="btn btn-icon" data-close>${icon("x")}</button></div>
      <form id="profile-form">
        <div class="sheet-body">
          <p class="muted small" style="margin-top:0">El agente usa este perfil para revisar artes, escribir copies e investigar contenido <strong>solo para esta cuenta</strong>. Cuanto más concreto, mejores ideas.</p>
          <div class="field"><label>Tipo de cuenta</label>
            <select class="select" name="kind"><option value="">Elige…</option>${PROFILE_KINDS.map((k) => `<option ${p.kind === k ? "selected" : ""}>${k}</option>`).join("")}</select></div>
          ${PROFILE_UI.map(([k, label, ph]) => `<div class="field"><label>${label}</label><textarea class="textarea" style="min-height:64px" name="${k}" placeholder="${esc(ph)}">${esc(p[k] || "")}</textarea></div>`).join("")}
          <div class="field"><label>Guía de contenido</label>
            <textarea class="textarea" name="guide" placeholder="Pega aquí tu guía: lo que quieres, ejemplos que te gustan, reglas de marca… El agente la seguirá al pie de la letra.">${esc(p.guide || "")}</textarea>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:6px">
              <label class="btn" style="cursor:pointer">${icon("doc")}Subir guía (PDF, TXT o MD)<input type="file" id="guide-file" accept="application/pdf,.txt,.md,text/plain,text/markdown" hidden></label>
              <span id="guide-file-info" class="small muted">${p.guideFile ? `📄 ${esc(p.guideFile.name)} <button type="button" class="btn btn-ghost small" data-guide-remove>Quitar</button>` : ""}</span>
            </div>
          </div>
        </div>
        <div class="sheet-foot">
          <button class="btn" type="button" data-profile-suggest style="margin-right:auto">${icon("spark")}Completar con IA</button>
          <button class="btn" type="button" data-close>Cancelar</button>
          <button class="btn btn-primary" type="submit">Guardar perfil</button>
        </div>
      </form>
    </div>`);
  const form = $("#profile-form");
  const values = () => Object.fromEntries([...new FormData(form).entries()]);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    busy(form.querySelector('[type="submit"]'), async () => {
      await api(`/accounts/${accId}/profile`, { method: "PUT", body: values() });
      await refresh();
      closeSheet();
      rerenderView();
      toast("Perfil guardado");
    });
  });
  $("#guide-file").addEventListener("change", async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    $("#guide-file-info").innerHTML = '<span class="spinner" style="width:14px;height:14px"></span>';
    try {
      await api(`/accounts/${accId}/profile`, { method: "PUT", body: values() });
      const res = await fetch(`/api/accounts/${accId}/guide`, { method: "POST", headers: { "Content-Type": f.type || "text/plain", "X-Filename": encodeURIComponent(f.name) }, body: f });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await refresh();
      openProfile(accId);
      toast(f.type === "application/pdf" ? "Guía PDF añadida" : "Guía añadida al texto");
    } catch (err) {
      toast(err.message, "error");
      $("#guide-file-info").textContent = "";
    }
  });
  $("#profile-sheet").addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.matches("[data-guide-remove]")) {
      busy(t, async () => {
        await api(`/accounts/${accId}/guide`, { method: "DELETE" });
        await refresh();
        openProfile(accId);
      });
    }
    if (t.matches("[data-profile-suggest]")) {
      busy(t, async () => {
        const sug = await api(`/accounts/${accId}/profile/suggest`, { body: values() });
        for (const [k, v] of Object.entries(sug)) if (form[k]) form[k].value = v;
        toast("Revisa la propuesta y guarda");
      });
    }
  });
}

// ------------------------------------------------------------------ Investigación
const research = { images: [], count: 8, web: true, accountId: "", draft: {} };

function researchView() {
  const accs = state.data.accounts;
  if (!accs.length) {
    return `<div class="page-head"><div><h1 class="page-title">Investigación</h1></div></div>
      <div class="card empty">${icon("flask")}<h3>Conecta una cuenta primero</h3><p>La investigación se hace para una cuenta concreta y su perfil de marca.</p><button class="btn btn-primary" data-go="accounts">Ir a Cuentas</button></div>`;
  }
  if (!accountById(research.accountId)) research.accountId = accs[0].id;
  const acc = accountById(research.accountId);
  const anyReader = accs.some((a) => a.canResearch);
  const runs = state.data.research || [];
  const hasAI = state.data.settings.hasAnthropic;
  return `
    <div class="page-head"><div>
      <h1 class="page-title">Investigación</h1>
      <p class="page-sub">Analiza lo que funciona en otras cuentas y en tu nicho, y conviértelo en contenido para cada marca.</p>
    </div></div>

    <form class="card research-form" id="research-form">
      <div class="research-for">
        <span class="muted small">Investigar para</span>
        <div class="segmented">${accs.map((a) => `<button type="button" class="${a.id === acc.id ? "on" : ""}" data-res-account="${a.id}">@${esc(a.username)}</button>`).join("")}</div>
        ${profileComplete(acc) ? `<span class="small" style="color:var(--green)">${icon("checkCircle", 'style="width:14px;height:14px;vertical-align:-2px"')} Perfil de marca listo</span>` : `<button type="button" class="btn btn-ghost small" data-profile="${acc.id}">${icon("warn", 'style="width:14px;height:14px"')} Completa su perfil de marca</button>`}
      </div>
      <div class="grid grid-2" style="gap:14px">
        <div class="field" style="margin:0"><label for="res-refs">Cuentas de referencia</label>
          <input class="input" id="res-refs" name="references" value="${esc(research.draft.references || "")}" placeholder="@cuenta1, @cuenta2 (hasta 5)">
          <div class="hint"><span>Personas o empresas cuyo contenido te inspira o que compiten contigo.</span></div></div>
        <div class="field" style="margin:0"><label for="res-tags">Hashtags a vigilar</label>
          <input class="input" id="res-tags" name="hashtags" value="${esc(research.draft.hashtags || "")}" placeholder="#finanzaspersonales, #ahorro">
          <div class="hint"><span>Para ver qué publicaciones están funcionando ahora en ese tema.</span></div></div>
      </div>
      <div class="field" style="margin-top:14px"><label for="res-ideas">Ideas, temas o lo que viste</label>
        <textarea class="textarea" id="res-ideas" name="ideas" style="min-height:90px" placeholder="Ej.: Vi un reel que explicaba la regla 50/30/20 con billetes reales y tenía millones de vistas. Quiero algo así para Loxita, enfocado en jóvenes que empiezan a ahorrar.">${esc(research.draft.ideas || "")}</textarea></div>
      <div class="field"><label for="res-links">Enlaces (posts, reels, vídeos, artículos)</label>
        <textarea class="textarea" id="res-links" name="links" style="min-height:52px" placeholder="https://www.instagram.com/reel/…  https://www.tiktok.com/…  (uno por línea)">${esc(research.draft.links || "")}</textarea></div>
      <div class="field"><label>Capturas de contenido viral (opcional)</label>
        <label class="dropzone small-zone" id="res-zone">${icon("image")}<div><strong>Sube capturas</strong> del perfil o de los posts con sus vistas y likes</div>
          <div class="muted small">La IA lee lo que se ve: números, ganchos, diseño</div>
          <input type="file" id="res-file" accept="image/*" multiple hidden></label>
        <div class="previews" id="res-previews">${research.images.map((f, i) => `<div class="preview"><img src="${f.preview}" alt=""><button type="button" data-res-remove="${i}">${icon("x")}</button></div>`).join("")}</div>
      </div>
      <div class="research-opts">
        <label class="switch"><input type="checkbox" id="res-web" ${research.web ? "checked" : ""}><span></span> Buscar tendencias y referencias en internet</label>
        <div style="display:flex;align-items:center;gap:8px"><span class="small muted">Ideas</span>
          <div class="segmented">${[6, 8, 10].map((n) => `<button type="button" class="${research.count === n ? "on" : ""}" data-res-count="${n}">${n}</button>`).join("")}</div></div>
        <button class="btn btn-primary btn-lg" type="submit" ${hasAI ? "" : "disabled"}>${icon("flask")}Investigar</button>
      </div>
      ${hasAI ? "" : `<div class="note note-warn" style="margin:12px 0 0">Para investigar necesitas tu API key de Anthropic en <a href="#settings" data-go="settings">Ajustes</a>.</div>`}
      ${anyReader ? "" : `<div class="note note-info" style="margin:12px 0 0"><strong>Métricas reales:</strong> para leer likes y comentarios de otras cuentas y hashtags, Instagram exige una cuenta conectada con token de Facebook (empieza por EAA). Mientras tanto, sube capturas: la IA analiza los números que se ven.</div>`}
    </form>

    <div class="section-title">Investigaciones <span class="count">${runs.length}</span></div>
    ${runs.length ? runs.map(researchRow).join("") : `<div class="card empty">${icon("bulb")}<h3>Aún no hay investigaciones</h3><p>Empieza con una cuenta de referencia o una idea.</p></div>`}`;
}

function researchRow(r) {
  const acc = accountById(r.accountId);
  const i = r.inputs;
  const what = [...i.references.map((u) => "@" + u), ...i.hashtags.map((t) => "#" + t), i.ideas ? `“${i.ideas.slice(0, 60)}${i.ideas.length > 60 ? "…" : ""}”` : "", i.images.length ? `${i.images.length} capturas` : "", i.webSearch ? "internet" : ""].filter(Boolean).join(" · ");
  const ideas = r.result?.ideas || [];
  return `
    <div class="card list-row research-row" data-research="${r.id}">
      <div class="stat-icon" style="margin:0;background:var(--purple-soft);color:var(--purple)">${icon(r.status === "running" ? "clock" : "flask")}</div>
      <div class="row-main">
        <div class="row-title">Para @${esc(acc?.username || "—")}${r.parentId ? " · más ideas" : ""}</div>
        <div class="row-sub">${esc(what) || "Tendencias en internet"}</div>
        <div class="row-sub">${relative(r.createdAt)}</div>
      </div>
      ${r.status === "running" ? `<span class="small muted"><span class="spinner" style="width:14px;height:14px;vertical-align:-2px"></span> ${esc(r.step)}</span>`
        : r.status === "error" ? `<span class="pill pill-failed">Error</span>`
        : `<span class="pill pill-idea">${ideas.length} ideas</span>`}
    </div>`;
}

let sheetResearchId = null;
function openResearch(id) {
  const r = (state.data.research || []).find((x) => x.id === id);
  if (!r) return;
  sheetResearchId = id;
  openSheet(`<div class="sheet" id="research-sheet">${researchSheetHtml(r)}</div>`);
  bindResearchSheet();
}

function researchSheetHtml(r) {
  const acc = accountById(r.accountId);
  const res = r.result;
  const head = `<div class="sheet-head"><h2>Investigación para @${esc(acc?.username || "—")}</h2>
    <div style="display:flex;gap:6px"><button class="btn btn-icon btn-danger" data-research-delete aria-label="Eliminar">${icon("trash")}</button><button class="btn btn-icon" data-close aria-label="Cerrar">${icon("x")}</button></div></div>`;
  if (r.status === "running") return head + `<div class="sheet-body"><div class="empty"><span class="spinner" style="width:28px;height:28px"></span><h3 style="margin-top:14px">${esc(r.step)}</h3><p>Puedes cerrar esto: te aviso en Actividad cuando esté lista.</p></div></div>`;
  if (r.status === "error") return head + `<div class="sheet-body"><div class="note note-error">${esc(r.error)}</div></div>`;
  const refs = r.sources?.references || [];
  const tags = r.sources?.hashtags || [];
  const fitColor = (n) => (n >= 75 ? "var(--green)" : n >= 50 ? "var(--orange)" : "var(--red)");
  const ideas = res.ideas.filter((i) => i.status !== "dismissed");
  return head + `
    <div class="sheet-body research-body">
      ${(res.warnings || []).map((w) => `<div class="note note-warn">${esc(w)}</div>`).join("")}
      <div class="panel"><h4>Conclusión</h4><p style="margin:0;font-size:15.5px">${esc(res.summary)}</p></div>

      ${refs.length || tags.length ? `<div class="panel"><h4>Lo que más funciona en las referencias</h4>
        ${refs.map((x) => x.error ? `<p class="small" style="margin:6px 0"><strong>@${esc(x.username)}</strong> <span class="muted">— ${esc(x.error)}</span></p>` : `
          <p style="margin:6px 0 4px"><strong>@${esc(x.username)}</strong> <span class="muted small">${x.followers != null ? x.followers.toLocaleString("es") + " seguidores" : ""}</span></p>
          ${topTable(x.top)}`).join("")}
        ${tags.map((x) => x.error ? `<p class="small" style="margin:6px 0"><strong>#${esc(x.tag)}</strong> <span class="muted">— ${esc(x.error)}</span></p>` : `<p style="margin:10px 0 4px"><strong>#${esc(x.tag)}</strong></p>${topTable(x.top.slice(0, 5))}`).join("")}
      </div>` : ""}

      ${res.patterns.length ? `<div class="panel"><h4>Por qué funciona</h4><div class="patterns">${res.patterns.map((p) => `<div><strong>${esc(p.title)}</strong><p>${esc(p.detail)}</p>${p.evidence ? `<p class="small muted">${esc(p.evidence)}</p>` : ""}</div>`).join("")}</div></div>` : ""}

      <div class="grid grid-2" style="gap:14px;margin-bottom:16px">
        <div class="panel" style="margin:0"><h4>Tendencias que encajan</h4>
          ${res.trends.length ? res.trends.map((t) => `<div class="trend"><div class="trend-head"><strong>${esc(t.topic)}</strong><span class="fit" style="--v:${t.fit};--c:${fitColor(t.fit)}"><i></i>${t.fit}</span></div><p class="small">${esc(t.why)}</p><p class="small"><strong>Cómo usarla:</strong> ${esc(t.angle)}</p></div>`).join("") : `<p class="small muted">Sin tendencias destacadas.</p>`}
        </div>
        <div class="panel" style="margin:0"><h4>Descartado para esta marca</h4>
          ${res.discarded.length ? res.discarded.map((d) => `<div class="trend"><strong class="muted" style="text-decoration:line-through">${esc(d.topic)}</strong><p class="small">${esc(d.reason)}</p></div>`).join("") : `<p class="small muted">Nada descartado.</p>`}
        </div>
      </div>

      <div class="section-title" style="margin-top:8px">Serie de contenido propuesta <span class="count">${ideas.length}</span></div>
      <div class="ideas">${ideas.map((i) => ideaCard(r, i, fitColor)).join("")}</div>

      <div class="panel" style="margin-top:20px"><h4>Traer más contenido similar</h4>
        <textarea class="textarea" id="more-feedback" style="min-height:70px" placeholder="Ej.: Más ideas como el carrusel de errores comunes, en formato Reel y con tono más divertido."></textarea>
        <button class="btn btn-primary" style="margin-top:10px" data-research-more>${icon("spark")}Generar más ideas</button>
      </div>
    </div>`;
}

function topTable(top) {
  if (!top?.length) return `<p class="small muted">Sin publicaciones disponibles.</p>`;
  return `<div class="table-wrap"><table class="table"><thead><tr><th>Formato</th><th>Publicación</th><th class="num">Likes</th><th class="num">Coment.</th><th class="num">× mediana</th></tr></thead><tbody>
    ${top.slice(0, 6).map((m) => `<tr><td>${esc(m.format)}</td><td class="cap">${m.permalink ? `<a href="${esc(m.permalink)}" target="_blank" rel="noopener">${esc(m.caption.slice(0, 70) || "(sin texto)")}</a>` : esc(m.caption.slice(0, 70))}</td><td class="num">${m.likes ?? "—"}</td><td class="num">${m.comments ?? "—"}</td><td class="num"><strong>${m.timesMedian ?? "—"}</strong></td></tr>`).join("")}
  </tbody></table></div>`;
}

function ideaCard(r, i, fitColor) {
  const done = i.status === "drafted";
  return `
    <div class="idea ${done ? "done" : ""}">
      <div class="idea-top"><span class="pill pill-idea">${esc(i.format)}</span><span class="small muted">${esc(i.goal)}</span><span class="fit" style="--v:${i.fit};--c:${fitColor(i.fit)}"><i></i>${i.fit}</span></div>
      <h3>${esc(i.title)}</h3>
      <p class="hook">“${esc(i.hook)}”</p>
      <p class="small muted"><strong>Fórmula:</strong> ${esc(i.formula)}${i.inspiredBy ? ` · <em>${esc(i.inspiredBy)}</em>` : ""}</p>
      <details><summary>Estructura, copy y diseño</summary>
        <ol class="outline">${i.outline.map((o) => `<li>${esc(o)}</li>`).join("")}</ol>
        <div class="quote">${esc(i.caption)}${i.hashtags.length ? "\n\n" + esc(i.hashtags.join(" ")) : ""}</div>
        <p class="small"><strong>CTA:</strong> ${esc(i.cta)}</p>
        <p class="small muted"><strong>Diseño:</strong> ${esc(i.designNotes)}</p>
      </details>
      <div class="idea-actions">
        ${done ? `<button class="btn" data-open="${i.postId}">Ver en Artes</button>` : `
          <button class="btn btn-ghost" data-idea-dismiss="${i.id}">Descartar</button>
          <button class="btn btn-primary" data-idea-draft="${i.id}">${icon("plus")}Crear borrador</button>`}
      </div>
    </div>`;
}

function bindResearchSheet() {
  const sheet = $("#research-sheet");
  sheet.addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    const r = state.data.research.find((x) => x.id === sheetResearchId);
    if (t.dataset.ideaDraft) {
      busy(t, async () => {
        await api(`/research/${r.id}/ideas/${t.dataset.ideaDraft}/draft`, { body: {} });
        await refresh();
        refreshResearchSheet(true);
        rerenderView();
        toast("Borrador creado en Artes → Ideas");
      });
    } else if (t.dataset.ideaDismiss) {
      busy(t, async () => {
        await api(`/research/${r.id}/ideas/${t.dataset.ideaDismiss}/dismiss`, { body: {} });
        await refresh();
        refreshResearchSheet(true);
      });
    } else if (t.matches("[data-research-delete]")) {
      busy(t, async () => {
        await api(`/research/${r.id}`, { method: "DELETE" });
        closeSheet();
        await refresh();
        rerenderView();
      });
    } else if (t.matches("[data-research-more]")) {
      busy(t, async () => {
        const liked = r.result.ideas.filter((i) => i.status === "drafted").map((i) => `«${i.title}» (${i.format})`);
        const feedback = [$("#more-feedback").value.trim(), liked.length ? `Ideas que el usuario eligió (trae más en esa línea): ${liked.join(", ")}` : "", `No repitas estas ideas: ${r.result.ideas.map((i) => i.title).join("; ")}`].filter(Boolean).join("\n");
        const i = r.inputs;
        const created = await api("/research", {
          body: { accountId: r.accountId, parentId: r.id, references: i.references.join(","), hashtags: i.hashtags.join(","), links: i.links.join("\n"), ideas: i.ideas, images: i.images, webSearch: i.webSearch, count: i.count, feedback },
        });
        await refresh();
        rerenderView();
        openResearch(created.id);
      });
    }
  });
}

function refreshResearchSheet(force) {
  if (!sheetResearchId) return;
  const sheet = $("#research-sheet");
  const r = (state.data.research || []).find((x) => x.id === sheetResearchId);
  if (!sheet || !r) return;
  if (sheet.contains(document.activeElement) && document.activeElement.tagName === "TEXTAREA") return;
  const html = researchSheetHtml(r);
  if (force || sheet.dataset.status !== r.status || r.status === "running") {
    const scroll = sheet.scrollTop;
    sheet.innerHTML = html;
    sheet.dataset.status = r.status;
    sheet.scrollTop = scroll;
  }
}

async function submitResearch(form) {
  const btn = form.querySelector('[type="submit"]');
  await busy(btn, async () => {
    const images = [];
    for (const f of research.images) images.push(await uploadOne(f, () => {}));
    const r = await api("/research", {
      body: {
        accountId: research.accountId,
        references: form.references.value,
        hashtags: form.hashtags.value,
        ideas: form.ideas.value,
        links: form.links.value,
        images,
        webSearch: $("#res-web").checked,
        count: research.count,
      },
    });
    research.images = [];
    research.draft = {};
    await refresh();
    rerenderView();
    openResearch(r.id);
  });
}

async function addResearchImages(list) {
  const prev = upload.size;
  upload.size = "original";
  for (const f of [...list].slice(0, 10 - research.images.length)) {
    try {
      research.images.push(await prepareFile(f));
    } catch (e) {
      toast(e.message, "error");
    }
  }
  upload.size = prev;
  rerenderView();
}

// ------------------------------------------------------------------ Plan
const PLAN_STATUS = {
  proposed: { label: "Propuesta", cls: "pill-review" },
  approved: { label: "Aprobada", cls: "pill-approved" },
  modified: { label: "Modificada", cls: "pill-scheduled" },
  published: { label: "Publicada", cls: "pill-published" },
  skipped: { label: "Descartada", cls: "pill-idea" },
};
const planPill = (s) => `<span class="pill ${PLAN_STATUS[s].cls}">${PLAN_STATUS[s].label}</span>`;
const FORMAT_UI = { REEL: ["Reel", "play"], CARRUSEL: ["Carrusel", "stack"], POST: ["Post", "image"], STORIES: ["Stories", "stories"] };
const GOAL_UI = { seguidores: "Seguidores", leads: "Leads", comunidad: "Comunidad", autoridad: "Autoridad", ventas: "Ventas", activacion: "Activación" };
const METRIC_UI = { views: "Reproducciones", likes: "Me gusta", comments: "Comentarios", saves: "Guardados", shares: "Compartidos", follows: "Seguidores nuevos", signups: "Registros" };
const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const planState = { accountId: "", mode: "week", cursor: "", day: "" };

const planTz = () => state.data.plan?.timezone || "America/Sao_Paulo";
const planToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: planTz() }).format(new Date());
function pAddDays(date, n) {
  const d = new Date(date + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
const pWeekday = (date) => (new Date(date + "T12:00:00Z").getUTCDay() + 6) % 7; // 0 = lunes
const pWeekStart = (date) => pAddDays(date, -pWeekday(date));
const pDay = (date, opts = { weekday: "short", day: "numeric", month: "short" }) => new Date(date + "T12:00:00Z").toLocaleDateString("es", { timeZone: "UTC", ...opts });
const planSlots = (accId) => (state.data.plan?.slots || []).filter((s) => s.accountId === accId).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
const slotById = (id) => state.data.plan?.slots.find((s) => s.id === id);

// Horas de referencia (Brasil, finanzas) según el día de la semana. Se sustituyen por las de tus métricas cuando las haya.
function suggestedTimes(date) {
  const w = pWeekday(date);
  if (w <= 3) return ["12:00", "12:30", "19:00", "20:00"];
  if (w === 4) return ["12:00", "18:30"];
  if (w === 5) return ["10:00", "10:30", "11:00"];
  return ["18:00", "19:00", "20:00"];
}

function planView() {
  const accs = state.data.accounts;
  if (!accs.length) {
    return `<div class="page-head"><div><h1 class="page-title">Plan</h1></div></div>
      <div class="card empty">${icon("calendar")}<h3>Primero, una cuenta</h3><p>Conecta tu Instagram o crea una cuenta de prueba con el mismo nombre de usuario: al conectar la real, hereda el plan.</p>
      <button class="btn btn-primary" data-go="accounts" style="margin-top:8px">Ir a Cuentas</button></div>`;
  }
  const acc = accountById(planState.accountId) || accs.find((a) => planSlots(a.id).length) || accs[0];
  planState.accountId = acc.id;
  if (!planState.cursor) planState.cursor = planToday();
  const slots = planSlots(acc.id);
  const today = planToday();
  const summary = state.data.plan?.summaries?.[acc.id];
  const reviews = (state.data.plan?.reviews || []).filter((r) => r.accountId === acc.id && r.changes.some((c) => c.status === "pending"));

  // Periodo visible
  let from, to, label;
  if (planState.mode === "month") {
    const c = planState.cursor;
    from = c.slice(0, 8) + "01";
    to = pAddDays(pAddDays(from, 32).slice(0, 8) + "01", -1);
    label = pDay(from, { month: "long", year: "numeric" });
  } else if (planState.mode === "week") {
    from = pWeekStart(planState.cursor);
    to = pAddDays(from, 6);
    const sameMonth = from.slice(0, 7) === to.slice(0, 7);
    label = sameMonth ? pDay(from, { month: "long", year: "numeric" }) : `${pDay(from, { month: "short" })} – ${pDay(to, { month: "short", year: "numeric" })}`;
  } else {
    from = today;
    to = "9999-12-31";
    label = "Desde hoy";
  }

  // Columna «Esta semana»: lo que toca en la semana a la vista (o la actual en mes/lista).
  const wFrom = planState.mode === "week" ? from : pWeekStart(today);
  const wTo = pAddDays(wFrom, 6);
  const week = slots.filter((s) => s.date >= wFrom && s.date <= wTo && s.status !== "skipped");
  const flows = week.map((s) => ({ s, f: slotFlow(s) }));
  const nApprove = flows.filter((x) => x.f.act === "approve").length;
  const nMake = flows.filter((x) => x.f.step === 1 || x.f.step === 2).length;
  const nScheduled = flows.filter((x) => x.f.step === 4 && !x.f.done).length;
  const nPublished = flows.filter((x) => x.f.done).length;
  const toApprove = week.filter((s) => s.status === "proposed" && s.date >= today);
  const isThisWeek = wFrom === pWeekStart(today);
  const byFormat = Object.keys(FORMAT_UI).map((k) => [k, week.filter((s) => s.format === k).length]).filter(([, n]) => n);
  const left = Math.round((Date.parse(MILESTONE.date) - Date.parse(today)) / 86400000);
  const sentence = !week.length
    ? "No hay nada planificado esta semana."
    : nApprove || nMake
      ? `Tienes <b>${nApprove} ${nApprove === 1 ? "propuesta" : "propuestas"}</b> por aprobar y <b>${nMake} ${nMake === 1 ? "pieza" : "piezas"}</b> por preparar.`
      : "Todo lo de esta semana está listo o programado.";
  const counter = (cls, n, l) => `<div class="counter ${cls}"><span class="n">${n}</span><span class="l">${l}</span></div>`;

  let body;
  if (planState.mode === "week") body = planWeekHtml(slots, from, today);
  else if (planState.mode === "month") body = planMonthHtml(slots, from, today);
  else body = planListHtml(slots.filter((s) => s.date >= from && s.status !== "published" && s.status !== "skipped"));

  const published = slots.filter((s) => s.status === "published").reverse();

  return `
    <div class="plan">
      <aside class="plan-side">
        <h2 class="side-title">${isThisWeek ? "Esta semana" : `Semana del ${pDay(wFrom, { day: "numeric", month: "short" })}`}</h2>
        ${accs.length > 1 ? `<div class="side-accounts">${accs.map((a) => `<button class="chip ${a.id === acc.id ? "chip-on" : ""}" data-plan-account="${a.id}">@${esc(a.username)}</button>`).join("")}</div>` : ""}
        <div class="todo-card">
          <p>${sentence}</p>
          ${byFormat.length ? `<div class="tags">${byFormat.map(([k, n]) => `<span class="ftag ft-${k}">${FORMAT_UI[k][0]} ${n}</span>`).join("")}</div>` : ""}
        </div>
        <div class="counter-stack">
          ${counter("c-oro", nApprove, "Por aprobar")}
          ${counter("c-rosa", nMake, "Borrador o arte por hacer")}
          ${counter("c-vio", nScheduled, "Programadas")}
          ${counter("c-lima", nPublished, "Publicadas")}
          ${left >= 0 ? counter("c-ink", left, MILESTONE.label) : ""}
        </div>
        <div class="side-acts">
          ${toApprove.length ? `<button class="btn btn-primary" data-plan-approve-all="${toApprove.map((s) => s.id).join(",")}">${icon("check")}Aprobar ${toApprove.length === 1 ? "la propuesta" : `las ${toApprove.length}`}</button>` : ""}
          <button class="btn" data-plan-action="generate">${icon("spark")}Proponer con IA</button>
          <button class="btn" data-plan-action="replan">${icon("spark")}Revisión semanal</button>
          <button class="btn" data-plan-action="new">${icon("plus")}Añadir tarjeta</button>
        </div>
        ${summary ? `<details class="side-note"><summary>El camino propuesto${summary.from ? ` (${pDay(summary.from, { day: "numeric", month: "short" })} – ${pDay(summary.to, { day: "numeric", month: "short" })})` : ""}</summary><p>${esc(summary.text)}</p></details>` : `<p class="muted small">Aún no hay plan. Pulsa «Proponer con IA» o añade tarjetas a mano.</p>`}
      </aside>

      <div class="plan-main">
        <div class="cal-top">
          <h2>${esc(label)}</h2>
          <div class="segmented">${[["week", "Semana"], ["month", "Mes"], ["list", "Lista"]].map(([m, l]) => `<button class="${planState.mode === m ? "on" : ""}" data-plan-mode="${m}">${l}</button>`).join("")}</div>
          <span class="tz">@${esc(acc.username)} · hora de Brasília</span>
          ${planState.mode !== "list" ? `<div class="cal-arrows">
            <button class="btn btn-sm" data-plan-move="0">Hoy</button>
            <button class="round" data-plan-move="-1" aria-label="Anterior">${icon("left")}</button>
            <button class="round" data-plan-move="1" aria-label="Siguiente">${icon("right")}</button>
          </div>` : ""}
        </div>
        ${reviews.map(reviewHtml).join("")}
        ${body}
        <div class="cal-legend plan-legend-row">
          <span><i style="background:var(--violeta)"></i>Reel</span><span><i style="background:var(--lima)"></i>Carrusel</span><span><i style="background:var(--rosa)"></i>Stories</span><span><i style="background:var(--cielo)"></i>Post</span>
          <span>· Borde punteado: propuesta sin aprobar · Apagada: publicada · El botón negro es el siguiente paso</span>
        </div>

      </div>

      <div class="plan-extra">
        <div class="section-title">Ya publicado <span class="count">${published.length}</span>
          <button class="btn btn-ghost" style="margin-left:auto" data-plan-action="published">${icon("plus")}Registrar publicado</button></div>
        ${published.length ? `<div class="card plan-published">${published.map(publishedRow).join("")}</div>` : `<div class="card muted small">Registra lo que ya salió (con su enlace y, si quieres, sus números): el agente lo usa para no repetir y para ver qué funciona.</div>`}

        <div class="plan-foot small muted">
          <a href="/api/plan/export?accountId=${acc.id}" download>Exportar plan (JSON)</a> ·
          <label class="link-like">Importar plan<input type="file" accept="application/json,.json" id="plan-import" hidden></label>
        </div>
      </div>
    </div>`;
}

function slotCard(s) {
  const [fl, fi] = FORMAT_UI[s.format] || FORMAT_UI.POST;
  const f = slotFlow(s);
  return `
    <div class="slot f-${s.format} st-${s.status} ${f.done ? "done" : ""}" data-plan-open="${s.id}" role="button" tabindex="0" title="${esc(s.theme || "")}">
      <div class="slot-top"><span class="slot-time">${esc(s.time)}</span><span class="ftag ft-${s.format}">${icon(fi)}${fl}</span></div>
      <div class="slot-theme">${esc(s.theme || "Sin tema")}</div>
      <div class="slot-foot">${nextBtn(s, f)}</div>
    </div>`;
}

// Semana: rejilla por horas en escritorio; selector de días + agenda en el móvil.
function planWeekHtml(slots, from, today) {
  const days = [0, 1, 2, 3, 4, 5, 6].map((i) => pAddDays(from, i));
  const week = slots.filter((s) => s.date >= from && s.date <= days[6] && s.status !== "skipped");
  const hours = week.map((s) => Number(s.time.slice(0, 2)));
  const h0 = Math.min(9, ...hours);
  const h1 = Math.max(21, ...hours);
  const head = days.map((d, i) => {
    const phase = week.find((s) => s.date === d && s.phase)?.phase;
    return `<div class="tg-day ${d === today ? "today" : ""} ${d < today ? "past" : ""}"><b>${Number(d.slice(8))}</b><small>${WEEKDAYS[i]}</small>${phase ? `<em title="${esc(phase)}">${esc(phase)}</em>` : ""}</div>`;
  }).join("");
  let rows = "";
  for (let h = h0; h <= h1; h++) {
    const hh = String(h).padStart(2, "0");
    rows += `<div class="tg-row"><div class="tg-hour">${hh}:00</div>${days.map((d) => {
      const cell = week.filter((s) => s.date === d && Number(s.time.slice(0, 2)) === h);
      if (cell.length) return `<div class="tg-cell ${d < today ? "past" : ""}">${cell.map(slotCard).join("")}</div>`;
      return d < today ? `<div class="tg-cell past"></div>` : `<div class="tg-cell" data-plan-new-slot="${d}|${hh}:00" title="Añadir a las ${hh}:00"></div>`;
    }).join("")}</div>`;
  }

  const sel = planState.day >= from && planState.day <= days[6] ? planState.day : today >= from && today <= days[6] ? today : from;
  const dayList = week.filter((s) => s.date === sel);
  const selName = pDay(sel, { weekday: "long", day: "numeric", month: "long" });
  return `
    <div class="tgrid"><div class="tg-head"><div></div>${head}</div>${rows}</div>
    <div class="mday">
      ${dayPillsHtml(from, sel, week, "data-plan-pick")}
      <div class="mday-label">${selName[0].toUpperCase() + selName.slice(1)}</div>
      ${dayList.map(agendaRow).join("") || `<div class="card empty" style="padding:28px 16px"><p style="margin:0 0 10px">Nada planificado este día.</p>${sel >= today ? `<button class="btn" data-plan-new-date="${sel}">${icon("plus")}Añadir tarjeta</button>` : ""}</div>`}
    </div>`;
}

function planMonthHtml(slots, from, today) {
  const start = pWeekStart(from);
  const month = from.slice(0, 7);
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = pAddDays(start, i);
    if (i >= 35 && d.slice(0, 7) !== month) break;
    const day = slots.filter((s) => s.date === d && s.status !== "skipped");
    cells.push(`
      <div class="cal-day ${d.slice(0, 7) !== month ? "out" : ""} ${d === today ? "today" : ""}" data-plan-day="${d}">
        <span class="cal-num">${Number(d.slice(8))}</span>
        ${day.map((s) => `<div class="cal-ev plan-ev f-${s.format} st-${s.status}" data-plan-open="${s.id}" title="${esc(s.theme)}">${icon((FORMAT_UI[s.format] || FORMAT_UI.POST)[1])}<span>${esc(s.time)} ${esc(s.theme)}</span></div>`).join("")}
      </div>`);
  }
  return `<div class="cal">${WEEKDAYS.map((d) => `<div class="cal-head">${d}</div>`).join("")}${cells.join("")}</div>`;
}

function planListHtml(slots) {
  if (!slots.length) return `<div class="card empty">${icon("calendar")}<h3>Nada planificado desde hoy</h3><p>Pide una propuesta al agente o añade tarjetas.</p></div>`;
  const weeks = {};
  for (const s of slots) (weeks[pWeekStart(s.date)] ||= []).push(s);
  return Object.entries(weeks)
    .map(([ws, list]) => `
      <div class="section-title small-title">Semana del ${pDay(ws, { day: "numeric", month: "long" })}</div>
      <div class="card plan-list">${list.map((s) => `
        <div class="list-row" data-plan-open="${s.id}">
          <div class="plan-date"><strong>${pDay(s.date, { weekday: "short" })}</strong><span>${Number(s.date.slice(8))}</span></div>
          <div class="row-main">
            <div class="row-title">${esc(s.theme)}</div>
            <div class="row-sub">${esc(s.time)} · ${(FORMAT_UI[s.format] || FORMAT_UI.POST)[0]} · ${esc(GOAL_UI[s.goal] || "")}${s.phase ? ` · ${esc(s.phase)}` : ""}</div>
          </div>
          ${planPill(s.status)}
        </div>`).join("")}</div>`)
    .join("");
}

function publishedRow(s) {
  const m = s.metrics || {};
  const nums = Object.keys(METRIC_UI).filter((k) => m[k] != null).map((k) => `${Number(m[k]).toLocaleString("es")} ${METRIC_UI[k].toLowerCase()}`);
  return `
    <div class="list-row" data-plan-open="${s.id}">
      <div class="plan-date"><strong>${pDay(s.date, { weekday: "short" })}</strong><span>${Number(s.date.slice(8))}</span></div>
      <div class="row-main">
        <div class="row-title">${esc(s.theme)}</div>
        <div class="row-sub">${(FORMAT_UI[s.format] || FORMAT_UI.POST)[0]} · ${esc(s.time)}${nums.length ? " · " + nums.join(" · ") : ` · <span style="color:var(--orange)">sin números todavía</span>`}</div>
      </div>
      ${s.publishedUrl ? `<a class="btn btn-icon" href="${esc(s.publishedUrl)}" target="_blank" rel="noopener" aria-label="Abrir en Instagram">${icon("link")}</a>` : ""}
    </div>`;
}

function reviewHtml(r) {
  const pending = r.changes.filter((c) => c.status === "pending");
  return `
    <div class="card plan-review">
      <div class="approval-kind">${icon("spark", 'style="width:13px;height:13px;vertical-align:-2px"')} Revisión semanal · semana del ${pDay(r.weekStart, { day: "numeric", month: "long" })}</div>
      <p style="margin:6px 0 8px">${esc(r.summary)}</p>
      ${r.learnings.length ? `<ul class="issues small">${r.learnings.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>` : ""}
      ${pending.map((c) => {
        const s = c.slotId && slotById(c.slotId);
        const what = c.kind === "add" ? `Añadir: ${esc(c.fields.theme || "pieza nueva")} (${esc(c.fields.date || "")} ${esc(c.fields.time || "")})`
          : c.kind === "remove" ? `Quitar: ${esc(s?.theme || "tarjeta")}`
          : `Cambiar «${esc(s?.theme || "tarjeta")}»: ${Object.entries(c.fields).map(([k, v]) => `${esc(k)} → ${esc(Array.isArray(v) ? v.join(" / ") : v).slice(0, 120)}`).join("; ")}`;
        return `<div class="review-change"><div class="row-main"><div>${what}</div><div class="muted small">${esc(c.reason)}</div></div>
          <button class="btn btn-sm btn-danger" data-plan-change="${r.id}:${c.id}:reject">No</button>
          <button class="btn btn-sm btn-primary" data-plan-change="${r.id}:${c.id}:apply">Aplicar</button></div>`;
      }).join("")}
    </div>`;
}

// ---------- ficha de una tarjeta ----------
function slotFlowHtml(s) {
  const f = slotFlow(s);
  return `<div class="slot-flow">${f.act ? `<div class="slot-flow-next">${esc(f.todo)}<small>Siguiente paso · ${whenLabel(s.date)}</small></div>` : `<div class="slot-flow-next">${esc(f.label)}</div>`}${stepsHtml(f)}</div>`;
}
function openSlot(id, preset = {}) {
  const existing = id ? slotById(id) : null;
  const s = existing || { date: preset.date || pAddDays(planToday(), 1), time: preset.time || "19:00", format: "REEL", goal: "leads", status: preset.status || "approved", outline: [], hashtags: [], metrics: {}, history: [] };
  const isNew = !existing;
  const asPublished = s.status === "published";
  const acc = accountById(existing?.accountId || planState.accountId);
  const opt = (list, val) => list.map(([v, l]) => `<option value="${v}" ${v === val ? "selected" : ""}>${l}</option>`).join("");
  openSheet(`
    <div class="sheet sheet-md" id="slot-sheet">
      <div class="sheet-head">
        <div style="display:flex;align-items:center;gap:10px;min-width:0"><h2 style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${isNew ? (asPublished ? "Registrar publicado" : "Nueva tarjeta") : esc(s.theme || "Tarjeta")}</h2>${isNew ? "" : planPill(s.status)}</div>
        <div style="display:flex;gap:6px">
          ${isNew ? "" : `<button class="btn btn-icon btn-danger" data-slot="delete" aria-label="Eliminar">${icon("trash")}</button>`}
          <button class="btn btn-icon" data-close aria-label="Cerrar">${icon("x")}</button>
        </div>
      </div>
      <form id="slot-form">
        <div class="sheet-body">
          ${isNew ? "" : slotFlowHtml(s)}
          ${s.why ? `<div class="note note-info small"><strong>Por qué:</strong> ${esc(s.why)}</div>` : ""}
          <div class="grid grid-3" style="gap:12px">
            <div class="field"><label>Día</label><input class="input" type="date" name="date" value="${esc(s.date)}" required></div>
            <div class="field"><label>Hora (Brasília)</label><input class="input" type="time" name="time" value="${esc(s.time)}" required></div>
            <div class="field"><label>Formato</label><select class="select" name="format">${opt(Object.entries(FORMAT_UI).map(([k, v]) => [k, v[0]]), s.format)}</select></div>
          </div>
          <div class="chips" style="padding:0 0 14px" id="slot-times">${suggestedTimes(s.date).map((t) => `<button type="button" class="chip" data-slot-time="${t}">${t}</button>`).join("")}<span class="muted small" style="align-self:center">horas de referencia</span></div>
          <div class="grid grid-2" style="gap:12px">
            <div class="field"><label>Tema</label><input class="input" name="theme" value="${esc(s.theme || "")}" placeholder="De qué va la pieza" required></div>
            <div class="field"><label>Objetivo</label><select class="select" name="goal">${opt(Object.entries(GOAL_UI), s.goal)}</select></div>
          </div>
          ${asPublished ? `
            <div class="field"><label>Enlace de la publicación</label><input class="input" name="publishedUrl" value="${esc(s.publishedUrl || "")}" placeholder="https://www.instagram.com/reel/…"></div>
            <div class="field"><label>Números (opcional; mejor a las 48 h)</label><div class="metric-grid">${Object.entries(METRIC_UI).map(([k, l]) => `<label><span>${l}</span><input class="input" type="number" min="0" name="m_${k}" value="${s.metrics?.[k] ?? ""}"></label>`).join("")}</div></div>` : ""}
          <div class="field"><label>Fase</label><input class="input" name="phase" value="${esc(s.phase || "")}" placeholder="Ej.: Lista de espera"></div>
          <div class="field"><label>Gancho (PT-BR)</label><textarea class="textarea" name="hook" style="min-height:60px">${esc(s.hook || "")}</textarea></div>
          <div class="field"><label>Estructura: diapositivas o escenas (una por línea)</label><textarea class="textarea" name="outline" style="min-height:110px">${esc((s.outline || []).join("\n"))}</textarea></div>
          <div class="field"><label>Copy (PT-BR)</label><textarea class="textarea" name="caption" style="min-height:150px">${esc(s.caption || "")}</textarea><div class="hint"><span id="slot-count"></span></div></div>
          <div class="grid grid-2" style="gap:12px">
            <div class="field"><label>CTA</label><input class="input" name="cta" value="${esc(s.cta || "")}"></div>
            <div class="field"><label>Hashtags</label><input class="input" name="hashtags" value="${esc((s.hashtags || []).join(" "))}"></div>
          </div>
          <div class="field"><label>Producción</label><textarea class="textarea" name="production" style="min-height:60px" placeholder="Quién lo hace y con qué material">${esc(s.production || "")}</textarea></div>
          <div class="field"><label>Notas</label><textarea class="textarea" name="notes" style="min-height:60px">${esc(s.notes || "")}</textarea></div>
          ${!isNew && !asPublished ? `<details class="small muted"><summary>Ya se publicó</summary>
            <div style="display:flex;gap:8px;margin-top:8px"><input class="input" id="slot-pub-url" placeholder="Enlace de Instagram (opcional)"><button class="btn" type="button" data-slot="published">Marcar publicada</button></div></details>` : ""}
          ${s.history?.length ? `<div class="small muted" style="margin-top:12px">${s.history.slice(0, 4).map((h) => `<div>${esc(h.text)} · ${relative(h.at)}</div>`).join("")}</div>` : ""}
        </div>
        <div class="sheet-foot">
          ${!isNew && !asPublished && s.status !== "skipped" ? `<button class="btn btn-ghost" type="button" data-slot="skip" style="margin-right:auto;color:var(--red)">Descartar</button>` : ""}
          ${s.status === "skipped" ? `<button class="btn" type="button" data-slot="restore" style="margin-right:auto">Recuperar</button>` : ""}
          ${!isNew && !asPublished && s.format !== "STORIES" ? `<button class="btn" type="button" data-slot="draft">${icon("image")}${s.postId ? "Abrir borrador" : "Crear borrador"}</button>` : ""}
          <button class="btn ${s.status === "proposed" ? "" : "btn-primary"}" type="submit">${isNew ? (asPublished ? "Registrar" : "Añadir") : "Guardar"}</button>
          ${s.status === "proposed" ? `<button class="btn btn-primary" type="button" data-slot="approve">${icon("check")}Aprobar</button>` : ""}
        </div>
      </form>
    </div>`);
  bindSlot(existing, acc, asPublished);
}

function slotValues(form, asPublished) {
  const f = Object.fromEntries(new FormData(form).entries());
  const v = { date: f.date, time: f.time, format: f.format, theme: f.theme, goal: f.goal, phase: f.phase, hook: f.hook, outline: f.outline, caption: f.caption, cta: f.cta, hashtags: f.hashtags, production: f.production, notes: f.notes };
  if (asPublished) {
    v.publishedUrl = f.publishedUrl || "";
    v.metrics = Object.fromEntries(Object.keys(METRIC_UI).map((k) => [k, f["m_" + k]]));
  }
  return v;
}

function bindSlot(slot, acc, asPublished) {
  const form = $("#slot-form");
  const initial = JSON.stringify(slotValues(form, asPublished));
  const dirty = () => JSON.stringify(slotValues(form, asPublished)) !== initial;
  const done = async (msg) => {
    await refresh();
    closeSheet();
    rerenderView();
    if (msg) toast(msg);
  };
  const counter = () => ($("#slot-count").textContent = `${form.caption.value.length} / 2200`);
  counter();
  form.caption.addEventListener("input", counter);
  form.date.addEventListener("change", () => {
    $("#slot-times").innerHTML = suggestedTimes(form.date.value).map((t) => `<button type="button" class="chip" data-slot-time="${t}">${t}</button>`).join("") + `<span class="muted small" style="align-self:center">horas de referencia</span>`;
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    busy(form.querySelector('[type="submit"]'), async () => {
      if (!slot) {
        await api("/plan/slots", { body: { accountId: acc.id, status: asPublished ? "published" : "approved", ...slotValues(form, asPublished) } });
        return done(asPublished ? "Registrado" : "Tarjeta añadida");
      }
      await api(`/plan/slots/${slot.id}`, { method: "PATCH", body: slotValues(form, asPublished) });
      done(dirty() ? "Guardado" : "");
    });
  });
  $("#slot-sheet").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-slot-time]");
    if (chip) return (form.time.value = chip.dataset.slotTime);
    const b = e.target.closest("[data-slot]");
    if (!b || !slot) return;
    const act = b.dataset.slot;
    busy(b, async () => {
      if (act === "approve") {
        if (dirty()) {
          await api(`/plan/slots/${slot.id}`, { method: "PATCH", body: slotValues(form, asPublished) });
          return done("Aprobada con tus cambios (modificada)");
        }
        await api(`/plan/slots/${slot.id}/status`, { body: { status: "approved" } });
        return done("Aprobada");
      }
      if (act === "skip" || act === "restore") {
        await api(`/plan/slots/${slot.id}/status`, { body: { status: act === "skip" ? "skipped" : "proposed" } });
        return done(act === "skip" ? "Descartada" : "Recuperada");
      }
      if (act === "published") {
        if (dirty()) await api(`/plan/slots/${slot.id}`, { method: "PATCH", body: slotValues(form, asPublished) });
        await api(`/plan/slots/${slot.id}/status`, { body: { status: "published", publishedUrl: $("#slot-pub-url").value.trim() } });
        return done("Marcada como publicada");
      }
      if (act === "delete") {
        if (!confirm("¿Eliminar esta tarjeta del plan?")) return;
        await api(`/plan/slots/${slot.id}`, { method: "DELETE" });
        return done("Eliminada");
      }
      if (act === "draft") {
        if (dirty()) await api(`/plan/slots/${slot.id}`, { method: "PATCH", body: slotValues(form, asPublished) });
        const post = await api(`/plan/slots/${slot.id}/draft`, { body: {} });
        await refresh();
        closeSheet();
        rerenderView();
        openPost(post.id);
      }
    });
  });
}

// ---------- pedir plan o revisión al agente ----------
function openPlanAgent(kind) {
  const acc = accountById(planState.accountId);
  const hasAI = state.data.settings.hasAnthropic;
  const t = planToday();
  const endOfMonth = pAddDays(pAddDays(t.slice(0, 8) + "01", 32).slice(0, 8) + "01", -1);
  const isGen = kind === "generate";
  openSheet(`
    <div class="sheet sheet-sm" id="plan-agent-sheet">
      <div class="sheet-head"><h2>${isGen ? "Proponer plan con IA" : "Revisión semanal"} · @${esc(acc.username)}</h2><button class="btn btn-icon" data-close>${icon("x")}</button></div>
      <form id="plan-agent-form">
        <div class="sheet-body">
          ${hasAI ? "" : `<div class="note note-warn">Necesita la API key de Anthropic (Ajustes). Mientras tanto puedes editar el plan a mano.</div>`}
          <p class="muted small" style="margin-top:0">${isGen
            ? "El agente usa el perfil de marca, lo ya publicado, lo aprobado (no lo toca), las ideas buenas de Investigación y los horarios de referencia de Brasil. Las propuestas sin aprobar de ese periodo se sustituyen."
            : "El agente mira lo publicado y sus números, y propone cambios para las próximas tarjetas. Tú aplicas o descartas cada uno."}</p>
          ${isGen ? `<div class="grid grid-2" style="gap:12px">
              <div class="field"><label>Desde</label><input class="input" type="date" name="from" value="${pAddDays(t, 1)}" required></div>
              <div class="field"><label>Hasta</label><input class="input" type="date" name="to" value="${endOfMonth}" required></div>
            </div>` : `<div class="field"><label>Semana que empieza el</label><input class="input" type="date" name="weekStart" value="${pWeekStart(t)}" required></div>`}
          <div class="field"><label>Indicaciones (opcional)</label><textarea class="textarea" name="instructions" placeholder="${isGen ? "Ej.: prioriza registros en la lista antes del 20/10; máximo 5 piezas por semana; yo grabo los martes." : "Ej.: el reel de la foto de la cuenta funcionó muy bien; repite ese formato."}"></textarea></div>
          <p class="muted small" id="plan-agent-wait" hidden>${icon("clock", 'style="width:13px;height:13px;vertical-align:-2px"')} Pensando el plan… tarda 1–3 minutos.</p>
        </div>
        <div class="sheet-foot"><button class="btn" type="button" data-close>Cancelar</button><button class="btn btn-primary" type="submit" ${hasAI ? "" : "disabled"}>${icon("spark")}${isGen ? "Proponer" : "Revisar"}</button></div>
      </form>
    </div>`);
  $("#plan-agent-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target).entries());
    $("#plan-agent-wait").hidden = false;
    busy(e.target.querySelector('[type="submit"]'), async () => {
      const r = await api(isGen ? "/plan/generate" : "/plan/replan", { body: { accountId: acc.id, ...f } });
      await refresh();
      closeSheet();
      if (isGen) {
        planState.mode = "list";
        toast(`${r.created} piezas propuestas`);
      } else toast(r.changes.length ? `${r.changes.length} cambios para revisar` : "Sin cambios: el plan sigue bien");
      rerenderView();
    });
  });
}

async function importPlan(file) {
  try {
    const data = JSON.parse(await file.text());
    const acc = accountById(planState.accountId);
    if (!confirm(`¿Importar ${data.slots?.length || 0} tarjetas en @${acc.username}? Sustituye las tarjetas actuales de esta cuenta (salvo las que ya tienen borrador).`)) return;
    const r = await api("/plan/import", { body: { accountId: acc.id, data, replace: true, includeProfile: !profileComplete(acc) } });
    await refresh();
    rerenderView();
    toast(`${r.imported} tarjetas importadas`);
  } catch (e) {
    toast(e.message.includes("JSON") ? "Ese archivo no es un plan válido." : e.message, "error");
  }
}

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-slot-next],[data-plan-skip],[data-plan-pick],[data-plan-new-slot],[data-home-day],[data-ap-tab],[data-plan-open],[data-plan-approve],[data-plan-approve-all],[data-plan-mode],[data-plan-move],[data-plan-account],[data-plan-action],[data-plan-change],[data-plan-new-date],[data-plan-day],[data-plan-focus]");
  if (!t || t.closest(".sheet")) return;
  if (t.dataset.slotNext) {
    e.stopPropagation();
    return slotNext(t.dataset.slotNext, t);
  }
  if (t.dataset.planSkip) {
    return busy(t, async () => {
      await api(`/plan/slots/${t.dataset.planSkip}/status`, { body: { status: "skipped" } });
      await refresh();
      rerenderView();
      toast("Descartada");
    });
  }
  if (t.dataset.planPick) {
    planState.day = t.dataset.planPick;
    return rerenderView();
  }
  if (t.dataset.homeDay) {
    state.homeDay = t.dataset.homeDay;
    return rerenderView();
  }
  if (t.dataset.apTab) {
    apState.tab = t.dataset.apTab;
    return rerenderView();
  }
  if (t.dataset.planNewSlot) {
    const [date, time] = t.dataset.planNewSlot.split("|");
    return openSlot(null, { date, time });
  }
  if (t.dataset.planFocus) {
    const s = slotById(t.dataset.planFocus);
    if (s) {
      planState.accountId = s.accountId;
      planState.cursor = s.date;
      planState.mode = "week";
    }
    return rerenderView(); // el clic global ya cambió a la vista Plan
  }
  if (t.dataset.planApprove) {
    e.stopPropagation();
    return busy(t, async () => {
      await api(`/plan/slots/${t.dataset.planApprove}/status`, { body: { status: "approved" } });
      await refresh();
      rerenderView();
      toast("Aprobada · siguiente paso: crear el borrador");
    });
  }
  if (t.dataset.planApproveAll) {
    return busy(t, async () => {
      const r = await api("/plan/approve", { body: { ids: t.dataset.planApproveAll.split(",") } });
      await refresh();
      rerenderView();
      toast(`${r.approved} aprobadas`);
    });
  }
  if (t.dataset.planOpen) return openSlot(t.dataset.planOpen);
  if (t.dataset.planNewDate) return openSlot(null, { date: t.dataset.planNewDate });
  if (t.dataset.planDay && e.target === t) return openSlot(null, { date: t.dataset.planDay });
  if (t.dataset.planMode) {
    planState.mode = t.dataset.planMode;
    return rerenderView();
  }
  if (t.dataset.planMove) {
    const n = Number(t.dataset.planMove);
    if (n === 0) planState.cursor = planToday();
    else if (planState.mode === "month") planState.cursor = pAddDays(pAddDays(planState.cursor.slice(0, 8) + "01", n > 0 ? 32 : -1).slice(0, 8) + "01", 0);
    else planState.cursor = pAddDays(planState.cursor, 7 * n);
    planState.day = "";
    return rerenderView();
  }
  if (t.dataset.planAccount) {
    planState.accountId = t.dataset.planAccount;
    return rerenderView();
  }
  if (t.dataset.planChange) {
    const [rid, cid, decision] = t.dataset.planChange.split(":");
    return busy(t, async () => {
      await api(`/plan/reviews/${rid}/changes/${cid}`, { body: { decision } });
      await refresh();
      rerenderView();
    });
  }
  const a = t.dataset.planAction;
  if (a === "new") openSlot(null);
  if (a === "published") openSlot(null, { status: "published", date: planToday() });
  if (a === "generate" || a === "replan") openPlanAgent(a);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.matches?.(".slot[data-plan-open], .ag[data-plan-open]")) openSlot(e.target.dataset.planOpen);
});

// Botón negro de cada tarjeta: hace el siguiente paso del flujo.
function slotNext(id, btn) {
  const s = slotById(id);
  if (!s) return;
  const f = slotFlow(s);
  if (f.act === "approve") {
    return busy(btn, async () => {
      await api(`/plan/slots/${id}/status`, { body: { status: "approved" } });
      await refresh();
      rerenderView();
      toast("Aprobada · siguiente paso: crear el borrador");
    });
  }
  if (f.act === "draft") {
    return busy(btn, async () => {
      const post = await api(`/plan/slots/${id}/draft`, { body: {} });
      await refresh();
      rerenderView();
      openPost(post.id);
      toast("Borrador creado · sube aquí el arte");
    });
  }
  if (f.act === "post") return openPost(s.postId);
  openSlot(id);
}
document.addEventListener("change", (e) => {
  if (e.target.id === "plan-import" && e.target.files[0]) importPlan(e.target.files[0]);
});

// ------------------------------------------------------------------ Ajustes
function settingsView() {
  const s = state.data.settings;
  const localUrl = /localhost|127\.0\.0\.1|^http:/.test(s.effectivePublicUrl);
  return `
    <div class="page-head"><div><h1 class="page-title">Ajustes</h1></div></div>
    <form id="settings-form" style="max-width:720px">
      <div class="card">
        <h3 style="margin:0 0 4px;font-size:17px">Agente de IA</h3>
        <p class="muted small" style="margin:0 0 16px">Revisa tus artes y prepara propuestas. Usa la API de Anthropic (Claude).</p>
        <div class="field"><label>API key de Anthropic ${s.hasAnthropic ? `<span style="color:var(--green)">· conectada</span>` : ""}</label>
          <input class="input" name="anthropicKey" type="password" placeholder="${s.hasAnthropic ? "•••••••• (deja vacío para mantenerla)" : "sk-ant-…"}" autocomplete="off"></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn" type="button" data-action="test-ai">Probar conexión</button>
          ${s.hasAnthropic ? `<button class="btn btn-ghost" type="button" data-action="remove-ai" style="color:var(--red)">Quitar key</button>` : ""}
        </div>
        <label class="switch" style="margin-top:16px"><input type="checkbox" name="autoReview" ${s.autoReview ? "checked" : ""}><span></span> Revisión semanal automática los lunes a las 8:00 (te deja los cambios para aprobar en Plan)</label>
      </div>
      <div class="card">
        <h3 style="margin:0 0 4px;font-size:17px">Guía de marca</h3>
        <p class="muted small" style="margin:0 0 16px">El agente la usa al revisar artes y escribir copies: tono, colores, palabras prohibidas, CTA habituales…</p>
        <textarea class="textarea" name="brandGuide" placeholder="Ej.: Tono cercano y optimista. Tuteamos. Colores: azul #0A2540 y coral. Evitar 'barato'. CTA: 'Reserva en el link de la bio'.">${esc(s.brandGuide)}</textarea>
      </div>
      <div class="card">
        <h3 style="margin:0 0 4px;font-size:17px">URL pública</h3>
        <p class="muted small" style="margin:0 0 16px">Instagram descarga tus artes desde aquí al publicar. Normalmente se detecta sola.</p>
        <div class="field"><label>URL de esta app</label><input class="input" name="publicUrl" placeholder="${esc(s.effectivePublicUrl || "https://tu-app.onrender.com")}" value="${esc(s.publicUrl)}"></div>
        ${localUrl ? `<div class="note note-warn" style="margin:0">Ahora mismo la app está en <strong>${esc(s.effectivePublicUrl)}</strong>, que Instagram no puede ver. Para publicar de verdad, despliega la app (por ejemplo en Render). Las cuentas de prueba funcionan igual.</div>` : ""}
      </div>
      ${s.passwordFromEnv ? "" : `
      <div class="card">
        <h3 style="margin:0 0 16px;font-size:17px">Contraseña</h3>
        <div class="grid grid-2">
          <div class="field" style="margin:0"><label>Actual</label><input class="input" type="password" name="currentPassword" autocomplete="current-password"></div>
          <div class="field" style="margin:0"><label>Nueva</label><input class="input" type="password" name="newPassword" autocomplete="new-password" minlength="8"></div>
        </div>
      </div>`}
      <div style="margin-top:16px"><button class="btn btn-primary btn-lg" type="submit">Guardar cambios</button></div>
    </form>`;
}

// ------------------------------------------------------------------ hoja modal genérica
let sheetPostId = null;
function openSheet(html) {
  $("#modal").innerHTML = `<div class="overlay">${html}</div>`;
  document.body.style.overflow = "hidden";
}
function closeSheet() {
  $("#modal").innerHTML = "";
  document.body.style.overflow = "";
  sheetPostId = null;
  sheetResearchId = null;
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && $("#modal").innerHTML) closeSheet();
});

// ------------------------------------------------------------------ detalle de un arte
const detailState = { slide: 0, mode: "schedule" };

function openPost(id) {
  const post = postById(id);
  if (!post) return;
  sheetPostId = id;
  detailState.slide = 0;
  detailState.mode = "schedule";
  const locked = ["publishing", "published"].includes(post.status);
  openSheet(`
    <div class="sheet" data-sheet-post="${post.id}">
      <div class="sheet-head">
        <div style="display:flex;align-items:center;gap:10px;min-width:0"><h2 style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(post.title)}</h2><span id="d-status">${pill(post.status)}</span></div>
        <div style="display:flex;gap:6px">
          ${post.status !== "publishing" ? `<button class="btn btn-icon btn-danger" data-delete-post="${post.id}" aria-label="Eliminar">${icon("trash")}</button>` : ""}
          <button class="btn btn-icon" data-close aria-label="Cerrar">${icon("x")}</button>
        </div>
      </div>
      <div class="sheet-body">
        <div class="detail">
          <div id="d-preview">${previewHtml(post)}</div>
          <div>
            <div id="d-notes">${notesHtml(post)}</div>
            ${briefHtml(post)}
            <div class="grid grid-2" style="gap:12px">
              <div class="field"><label>Título interno</label><input class="input" id="d-title" value="${esc(post.title)}" ${locked ? "disabled" : ""}></div>
              <div class="field"><label>Cuenta</label>
                <select class="select" id="d-account" ${locked ? "disabled" : ""}>
                  <option value="">Elige una cuenta…</option>
                  ${state.data.accounts.map((a) => `<option value="${a.id}" ${a.id === post.accountId ? "selected" : ""}>@${esc(a.username)}${a.demo ? " (prueba)" : ""}</option>`).join("")}
                </select></div>
            </div>
            <div class="field">
              <label>Copy</label>
              <textarea class="textarea" id="d-caption" style="min-height:150px" ${locked ? "disabled" : ""} placeholder="Escribe el texto de la publicación…">${esc(post.caption)}</textarea>
              <div class="hint"><span id="d-counter"></span>${["approved", "scheduled"].includes(post.status) ? "<span>Si lo editas, vuelve a revisión</span>" : ""}</div>
            </div>
            <div class="panel"><h4>Validación automática</h4><div id="d-checks">${checksHtml(post)}</div></div>
            <div class="panel" id="d-review">${aiHtml(post)}</div>
            <div class="panel" style="margin:0"><h4>Historial</h4>
              <div class="small muted">${post.history.slice(0, 6).map((h) => `<div style="padding:3px 0">${esc(h.text.replace(/\d{4}-\d{2}-\d{2}T[\d:.]+Z/, (m) => fmtDate(m)))} · ${relative(h.at)}</div>`).join("")}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="sheet-foot" id="d-actions">${actionsHtml(post)}</div>
    </div>`);
  bindDetail(post.id);
}

function previewHtml(post) {
  const acc = accountById(post.accountId);
  const m = post.media[Math.min(detailState.slide, post.media.length - 1)];
  const multi = post.media.length > 1;
  const caption = $("#d-caption")?.value ?? post.caption;
  if (!m) {
    const ratio = post.type === "REELS" ? "9 / 16" : "4 / 5";
    return `
    <div class="phone">
      <div class="ig-head">${avatar(acc)}<span>${acc ? esc(acc.username) : "tu_cuenta"}</span></div>
      <div class="ig-empty" style="aspect-ratio:${ratio}">${icon("image")}<strong>Aún sin arte</strong><span>${post.type === "REELS" ? "Reel 1080×1920" : "1080×1350"}${post.type === "CAROUSEL" ? ` · hasta ${CAROUSEL_MAX} diapositivas` : ""}</span></div>
      <div class="ig-caption"><strong>${acc ? esc(acc.username) : "tu_cuenta"}</strong> ${esc(caption)}</div>
    </div>`;
  }
  return `
    <div class="phone">
      <div class="ig-head">${avatar(acc)}<span>${acc ? esc(acc.username) : "tu_cuenta"}</span></div>
      <div class="ig-media">
        ${m.mime.startsWith("video/") ? `<video src="${esc(m.url)}" controls playsinline></video>` : `<img src="${esc(m.url)}" alt="">`}
        ${multi && detailState.slide > 0 ? `<button class="ig-nav prev" data-slide="-1">${icon("left")}</button>` : ""}
        ${multi && detailState.slide < post.media.length - 1 ? `<button class="ig-nav next" data-slide="1">${icon("right")}</button>` : ""}
      </div>
      ${multi ? `<div class="ig-dots">${post.media.map((_, i) => `<i class="${i === detailState.slide ? "on" : ""}"></i>`).join("")}</div>` : ""}
      <div class="ig-icons">${icon("heart")}${icon("comment")}${icon("share")}</div>
      <div class="ig-caption"><strong>${acc ? esc(acc.username) : "tu_cuenta"}</strong> ${esc(caption)}</div>
    </div>
    <p class="muted small" style="text-align:center;margin-top:8px">${TYPE_LABEL[post.type]}${multi ? ` · ${post.media.length} archivos` : ""}${m.width ? ` · ${m.width}×${m.height}` : ""}</p>`;
}

function notesHtml(post) {
  if (post.status === "idea")
    return `<label class="dropzone small-zone" id="idea-zone">${icon("upload")}<div><strong>Sube el arte de esta idea</strong></div>
      <div class="muted small">${post.type === "REELS" ? "Vídeo vertical 1080×1920" : post.type === "CAROUSEL" ? `Varias imágenes, 1080×1350, máximo ${CAROUSEL_MAX}` : "Imagen 1080×1350"} · se adapta sola a la medida</div>
      <input type="file" id="idea-file" accept="image/*,video/mp4,video/quicktime" ${post.type === "CAROUSEL" ? "multiple" : ""} hidden></label>`;
  if (post.status === "rejected" && post.note) return `<div class="note note-error"><strong>Rechazado:</strong> ${esc(post.note)}</div>`;
  if (post.status === "failed") return `<div class="note note-error"><strong>No se pudo publicar.</strong> ${esc(post.error || "")}</div>`;
  if (post.status === "scheduled") return `<div class="note note-info">Se publicará automáticamente el <strong>${fmtDate(post.scheduledAt, { weekday: "long" })}</strong>.</div>`;
  if (post.status === "published")
    return `<div class="note" style="background:var(--green-soft)">Publicado ${relative(post.publishedAt)}.${post.permalink ? ` <a href="${esc(post.permalink)}" target="_blank" rel="noopener">Ver en Instagram ↗</a>` : ""}</div>`;
  if (post.status === "publishing") return `<div class="note note-info"><span class="spinner" style="width:14px;height:14px;vertical-align:-2px"></span> Publicando en Instagram…</div>`;
  return "";
}

function checksHtml(post) {
  const ic = { ok: "checkCircle", warn: "warn", error: "xCircle" };
  const canAdapt = post.checks.some((c) => c.fix === "adapt") && post.media.some((m) => m.mime.startsWith("image/")) && !["publishing", "published"].includes(post.status);
  return `<ul class="checks">${post.checks.map((c) => `<li class="${c.level}">${icon(ic[c.level])}<span>${esc(c.text)}</span></li>`).join("")}</ul>
    ${canAdapt ? `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:center">
      <span class="small muted">Adaptar a la medida de Instagram:</span>
      <button class="btn" data-adapt="contain">Ajustar sin recortar</button>
      <button class="btn" data-adapt="cover">Recortar al centro</button></div>` : ""}`;
}

function briefHtml(post) {
  const b = post.brief;
  if (!b) return "";
  return `<div class="panel"><h4><span>${icon("bulb", 'style="width:13px;height:13px;vertical-align:-2px"')} Brief de la idea</span><span class="pill pill-idea">${esc(b.format)}</span></h4>
    ${b.hook ? `<p style="margin:0 0 8px"><strong>Gancho:</strong> ${esc(b.hook)}</p>` : ""}
    ${b.outline?.length ? `<ol class="outline">${b.outline.map((o) => `<li>${esc(o)}</li>`).join("")}</ol>` : ""}
    ${b.formula ? `<p class="small muted" style="margin:8px 0 0"><strong>Fórmula:</strong> ${esc(b.formula)}</p>` : ""}
    ${b.cta ? `<p class="small muted" style="margin:4px 0 0"><strong>CTA:</strong> ${esc(b.cta)}</p>` : ""}
    ${b.designNotes ? `<p class="small muted" style="margin:4px 0 0"><strong>Diseño:</strong> ${esc(b.designNotes)}</p>` : ""}
  </div>`;
}

function aiHtml(post) {
  const r = post.aiReview;
  const hasAI = state.data.settings.hasAnthropic;
  const locked = ["publishing", "published"].includes(post.status);
  const head = (extra = "") => `<h4><span>${icon("spark", 'style="width:13px;height:13px;vertical-align:-2px"')} Revisión del agente</span>${extra}</h4>`;
  if (!hasAI) return head() + `<p class="small muted" style="margin:0">Añade tu API key de Anthropic en Ajustes para que el agente revise tus artes.</p>`;
  if (r?.pending) return head() + `<p class="small muted" style="margin:0"><span class="spinner" style="width:13px;height:13px;vertical-align:-2px"></span> Analizando imagen y copy…</p>`;
  const again = locked ? "" : `<button class="btn btn-ghost small" style="height:26px" data-ai-review="${post.id}">${r ? "Volver a revisar" : "Revisar ahora"}</button>`;
  if (!r) return head(again) + `<p class="small muted" style="margin:0">Aún sin revisar.</p>`;
  if (r.error) return head(again) + `<p class="small" style="margin:0;color:var(--red)">${esc(r.error)}</p>`;
  const verdict = { listo: "Listo para publicar", mejorable: "Mejorable", no_publicar: "No recomendado" }[r.verdict];
  const fullSuggestion = [r.suggestedCaption, r.hashtags.join(" ")].filter(Boolean).join("\n\n");
  return `
    ${head(again)}
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">${scoreBadge(r)}<strong>${verdict}</strong></div>
    <p style="margin:0;font-size:14px">${esc(r.summary)}</p>
    ${r.issues.length ? `<ul class="issues">${r.issues.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : ""}
    ${r.suggestedCaption ? `
      <div class="quote">${esc(r.suggestedCaption)}</div>
      ${r.hashtags.length ? `<div class="tags">${r.hashtags.map((h) => `<span class="tag">${esc(h)}</span>`).join("")}</div>` : ""}
      ${locked ? "" : `<button class="btn" style="margin-top:12px" data-use-suggestion="${esc(fullSuggestion)}">Usar este copy</button>`}` : ""}`;
}

function actionsHtml(post) {
  const errors = post.checks.some((c) => c.level === "error");
  if (post.status === "published") return `<button class="btn" data-close>Cerrar</button>`;
  if (post.status === "idea") return `<span class="muted small" style="margin-right:auto;align-self:center">Diseña el arte siguiendo el brief y súbelo arriba: pasará a revisión.</span><button class="btn" data-close>Cerrar</button>`;
  if (post.status === "publishing") return `<button class="btn" disabled><span class="spinner"></span> Publicando…</button>`;
  if (post.status === "scheduled") {
    return `<span class="muted small" style="margin-right:auto;align-self:center">${icon("clock", 'style="width:14px;height:14px;vertical-align:-2px"')} ${fmtDate(post.scheduledAt)}</span>
      <button class="btn" data-post-action="unschedule">Cancelar programación</button>
      <button class="btn btn-primary" data-post-action="publish">Publicar ahora</button>`;
  }
  if (post.status === "approved" || (post.status === "failed" && post.history.some((h) => h.text.startsWith("Aprobado")))) {
    return `<input class="input" type="datetime-local" id="d-when" value="${slotDefault(post)}" style="width:auto;margin-right:auto">
      <button class="btn" data-post-action="schedule">${icon("clock")}Programar</button>
      <button class="btn btn-primary" data-post-action="publish">${post.status === "failed" ? "Reintentar ahora" : "Publicar ahora"}</button>`;
  }
  // En revisión / rechazado: decisión de aprobación.
  const m = detailState.mode;
  return `
    <div style="display:flex;gap:10px;align-items:center;margin-right:auto;flex-wrap:wrap">
      <div class="segmented">
        <button class="${m === "schedule" ? "on" : ""}" data-mode="schedule">Programar</button>
        <button class="${m === "now" ? "on" : ""}" data-mode="now">Publicar ya</button>
        <button class="${m === "only" ? "on" : ""}" data-mode="only">Solo aprobar</button>
      </div>
      ${m === "schedule" ? `<input class="input" type="datetime-local" id="d-when" value="${slotDefault(post)}" style="width:auto">` : ""}
    </div>
    <button class="btn btn-danger" data-post-action="reject">Rechazar</button>
    <button class="btn btn-primary" data-post-action="approve" ${errors ? 'disabled title="Corrige los errores de validación"' : ""}>${icon("check")}Aprobar</button>`;
}

function updateCounter() {
  const v = $("#d-caption")?.value || "";
  const tags = (v.match(/#[\p{L}\p{N}_]+/gu) || []).length;
  const c = $("#d-counter");
  if (c) c.innerHTML = `<span style="color:${v.length > 2200 ? "var(--red)" : "inherit"}">${v.length.toLocaleString("es")}/2.200</span> · <span style="color:${tags > 30 ? "var(--red)" : "inherit"}">${tags}/30 hashtags</span>`;
}

// Refresca las partes no editables del detalle sin tocar lo que el usuario está escribiendo.
function refreshDetail() {
  if (!sheetPostId) return;
  const post = postById(sheetPostId);
  if (!post) return closeSheet();
  const set = (sel, html) => {
    const el = $(sel);
    if (el && el.innerHTML !== html) el.innerHTML = html;
  };
  set("#d-status", pill(post.status));
  set("#d-notes", notesHtml(post));
  set("#d-checks", checksHtml(post));
  set("#d-review", aiHtml(post));
  const actions = $("#d-actions");
  if (actions && !actions.contains(document.activeElement)) set("#d-actions", actionsHtml(post));
}

function bindDetail(id) {
  const sheet = $(`[data-sheet-post="${id}"]`);
  updateCounter();
  const save = async (body) => {
    try {
      const updated = await api("/posts/" + id, { method: "PATCH", body });
      Object.assign(postById(id), updated);
      refreshDetail();
      rerenderView();
    } catch (e) {
      toast(e.message, "error");
    }
  };
  $("#d-caption")?.addEventListener("input", () => {
    updateCounter();
    $(".ig-caption").innerHTML = `<strong>${esc(accountById($("#d-account").value)?.username || "tu_cuenta")}</strong> ${esc($("#d-caption").value)}`;
  });
  $("#d-caption")?.addEventListener("change", (e) => save({ caption: e.target.value }));
  $("#d-title")?.addEventListener("change", (e) => save({ title: e.target.value }));
  $("#d-account")?.addEventListener("change", async (e) => {
    await save({ accountId: e.target.value });
    $("#d-preview").innerHTML = previewHtml(postById(id));
  });

  sheet.addEventListener("change", async (e) => {
    if (e.target.id !== "idea-file" || !e.target.files.length) return;
    const zone = $("#idea-zone");
    zone.innerHTML = '<span class="spinner"></span> Subiendo…';
    try {
      const updated = await attachFiles(postById(id), e.target.files);
      Object.assign(postById(id), updated);
      await refresh();
      openPost(id);
      rerenderView();
      toast("Arte subido: pasa a revisión");
    } catch (err) {
      toast(err.message, "error");
      refreshDetail();
    }
  });
  sheet.addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    const post = postById(id);
    if (t.dataset.slide) {
      detailState.slide += Number(t.dataset.slide);
      $("#d-preview").innerHTML = previewHtml(post);
    } else if (t.dataset.mode) {
      detailState.mode = t.dataset.mode;
      $("#d-actions").innerHTML = actionsHtml(post);
    } else if (t.dataset.adapt) {
      busy(t, async () => {
        Object.assign(post, await adaptPost(post, t.dataset.adapt));
        detailState.slide = 0;
        $("#d-preview").innerHTML = previewHtml(post);
        refreshDetail();
        rerenderView();
        toast("Adaptado a la medida de Instagram");
      });
    } else if (t.dataset.useSuggestion) {
      $("#d-caption").value = t.dataset.useSuggestion;
      $("#d-caption").dispatchEvent(new Event("input"));
      save({ caption: t.dataset.useSuggestion });
      toast("Copy actualizado");
    } else if (t.dataset.aiReview) {
      busy(t, async () => {
        Object.assign(post, await api(`/posts/${id}/review`, { body: {} }));
        refreshDetail();
      });
    } else if (t.dataset.deletePost) {
      if (!confirm("¿Eliminar este arte? No se puede deshacer.")) return;
      busy(t, async () => {
        await api("/posts/" + id, { method: "DELETE" });
        closeSheet();
        toast("Arte eliminado");
        await refresh();
        rerenderView();
      });
    } else if (t.dataset.postAction) {
      postAction(t, post, t.dataset.postAction);
    }
  });
}

function whenValue() {
  const v = $("#d-when")?.value;
  if (!v) throw new Error("Elige fecha y hora.");
  return new Date(v).toISOString();
}

async function postAction(btn, post, action) {
  await busy(btn, async () => {
    const id = post.id;
    let msg = "";
    if (action === "approve") {
      const body = detailState.mode === "schedule" ? { scheduledAt: whenValue() } : detailState.mode === "now" ? { publishNow: true } : {};
      if (detailState.mode === "now" && !confirm("¿Publicar ahora en Instagram?")) return;
      const r = await api(`/posts/${id}/approve`, { body });
      msg = r.status === "published" ? "Aprobado y publicado" : r.status === "scheduled" ? "Aprobado y programado" : r.status === "failed" ? "Aprobado, pero falló la publicación" : "Aprobado";
    } else if (action === "reject") {
      const note = prompt("¿Qué hay que cambiar? (opcional)");
      if (note === null) return;
      await api(`/posts/${id}/reject`, { body: { note } });
      msg = "Rechazado";
    } else if (action === "schedule") {
      await api(`/posts/${id}/schedule`, { body: { scheduledAt: whenValue() } });
      msg = "Programado";
    } else if (action === "unschedule") {
      await api(`/posts/${id}/unschedule`, { body: {} });
      msg = "Programación cancelada";
    } else if (action === "publish") {
      if (!confirm("¿Publicar ahora en Instagram?")) return;
      const r = await api(`/posts/${id}/publish`, { body: {} });
      msg = r.status === "published" ? "¡Publicado!" : "No se pudo publicar";
    }
    await refresh();
    const updated = postById(id);
    toast(msg, updated?.status === "failed" ? "error" : "");
    if (["approve", "reject"].includes(action)) closeSheet();
    else refreshDetail();
    rerenderView();
  });
}

// ------------------------------------------------------------------ nuevo arte
// Medidas que acepta la API de Instagram. 3:4 (1080×1440/1450) se puede subir desde la app, pero no por API.
const SIZES = {
  portrait: { label: "Vertical", dims: "1080×1350", w: 1080, h: 1350 },
  square: { label: "Cuadrado", dims: "1080×1080", w: 1080, h: 1080 },
  landscape: { label: "Horizontal", dims: "1080×566", w: 1080, h: 566 },
  original: { label: "Original", dims: "sin cambiar" },
};
const CAROUSEL_MAX = 10;
const upload = { files: [], size: "portrait", fit: "contain" };

function sizeControls() {
  return `
    <div class="field">
      <label>Medida de publicación</label>
      <div class="segmented" id="size-seg">${Object.entries(SIZES).map(([k, s]) => `<button type="button" class="${upload.size === k ? "on" : ""}" data-size="${k}">${s.label} <span class="muted">${s.dims}</span></button>`).join("")}</div>
      ${upload.size !== "original" ? `
      <div class="segmented" id="fit-seg" style="margin-top:8px">
        <button type="button" class="${upload.fit === "contain" ? "on" : ""}" data-fit="contain">Ajustar sin recortar</button>
        <button type="button" class="${upload.fit === "cover" ? "on" : ""}" data-fit="cover">Recortar al centro</button>
      </div>` : ""}
      <div class="hint"><span>Las imágenes se adaptan solas. «Ajustar» añade bordes del color del arte; «Recortar» llena el formato. Los vídeos no se modifican (Reels: 1080×1920).</span></div>
    </div>`;
}

function openNewPost() {
  if (!state.data.accounts.length) {
    toast("Primero conecta una cuenta (o añade una de prueba).");
    return go("accounts");
  }
  upload.files = [];
  openSheet(`
    <div class="sheet sheet-sm">
      <div class="sheet-head"><h2>Nuevo arte</h2><button class="btn btn-icon" data-close>${icon("x")}</button></div>
      <form id="new-form">
        <div class="sheet-body">
          <label class="dropzone" id="dz">
            ${icon("upload")}
            <div><strong>Arrastra tus archivos</strong> o haz clic para elegir</div>
            <div class="muted small">1 imagen = post · 2–${CAROUSEL_MAX} = carrusel · 1 vídeo = Reel</div>
            <input type="file" id="file-input" accept="image/jpeg,image/png,image/webp,image/heic,video/mp4,video/quicktime" multiple hidden>
          </label>
          <div class="previews" id="previews"></div>
          <div id="size-box">${sizeControls()}</div>
          <div class="field"><label>Cuenta</label>
            <select class="select" name="accountId">${state.data.accounts.map((a) => `<option value="${a.id}">@${esc(a.username)}${a.demo ? " (prueba)" : ""}</option>`).join("")}</select></div>
          <div class="field"><label>Título interno (opcional)</label><input class="input" name="title" placeholder="Ej.: Lanzamiento colección verano"></div>
          <div class="field"><label>Copy</label><textarea class="textarea" name="caption" placeholder="Escribe el texto… o déjalo vacío y el agente te sugerirá uno."></textarea></div>
          <div class="progress hidden" id="up-progress"><i></i></div>
        </div>
        <div class="sheet-foot">
          <button class="btn" type="button" data-close>Cancelar</button>
          <button class="btn btn-primary" type="submit">Enviar a revisión</button>
        </div>
      </form>
    </div>`);
  bindDropzone($("#dz"), $("#file-input"), addFiles);
  $("#previews").addEventListener("click", (e) => {
    const b = e.target.closest("[data-remove]");
    if (!b) return;
    upload.files.splice(Number(b.dataset.remove), 1);
    renderPreviews();
  });
  $("#size-box").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-size],[data-fit]");
    if (!b) return;
    if (b.dataset.size) upload.size = b.dataset.size;
    if (b.dataset.fit) upload.fit = b.dataset.fit;
    $("#size-box").innerHTML = sizeControls();
    // Vuelve a preparar las imágenes con la nueva medida.
    upload.files = await Promise.all(upload.files.map((f) => prepareFile(f.original)));
    renderPreviews();
  });
  $("#new-form").addEventListener("submit", submitNewPost);
}

function bindDropzone(dz, input, onFiles) {
  input.addEventListener("change", () => onFiles(input.files));
  dz.addEventListener("dragover", (e) => {
    e.preventDefault();
    dz.classList.add("drag");
  });
  dz.addEventListener("dragleave", () => dz.classList.remove("drag"));
  dz.addEventListener("drop", (e) => {
    e.preventDefault();
    dz.classList.remove("drag");
    onFiles(e.dataTransfer.files);
  });
}

async function addFiles(list) {
  for (const f of list) {
    if (upload.files.length >= CAROUSEL_MAX) {
      toast(`Por API Instagram permite máximo ${CAROUSEL_MAX} archivos por carrusel.`);
      break;
    }
    try {
      upload.files.push(await prepareFile(f));
    } catch (e) {
      toast(e.message, "error");
    }
  }
  renderPreviews();
}

function renderPreviews() {
  $("#previews").innerHTML = upload.files
    .map((f, i) => `<div class="preview">${f.mime.startsWith("video/") ? `<video src="${f.preview}" muted></video>` : `<img src="${f.preview}" alt="">`}<button type="button" data-remove="${i}">${icon("x")}</button><span class="dims">${f.width ? `${f.width}×${f.height}` : ""}</span></div>`)
    .join("");
}

function loadImage(src, name = "imagen") {
  return new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error(`${name}: no se pudo leer la imagen.`));
    i.src = src;
  });
}

// Color medio del borde de la imagen: se usa de fondo al ajustar sin recortar.
function edgeColor(img) {
  const c = document.createElement("canvas");
  c.width = c.height = 16;
  const x = c.getContext("2d");
  x.drawImage(img, 0, 0, 16, 16);
  const d = x.getImageData(0, 0, 16, 16).data;
  let r = 0, g = 0, b = 0, n = 0;
  for (let y = 0; y < 16; y++) {
    for (let xx = 0; xx < 16; xx++) {
      if (y && y < 15 && xx && xx < 15) continue;
      const i = (y * 16 + xx) * 4;
      r += d[i]; g += d[i + 1]; b += d[i + 2]; n++;
    }
  }
  return `rgb(${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)})`;
}

// Dibuja la imagen en la medida exacta (o solo la convierte a JPEG si es «original»).
async function renderJpeg(img, size, fit) {
  const s = SIZES[size];
  let w = img.naturalWidth, h = img.naturalHeight;
  if (!s.w) {
    const scale = Math.min(1, 2160 / w);
    w = Math.round(w * scale);
    h = Math.round(h * scale);
  } else {
    w = s.w;
    h = s.h;
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = s.w && fit === "contain" ? edgeColor(img) : "#fff";
  ctx.fillRect(0, 0, w, h);
  if (!s.w) {
    ctx.drawImage(img, 0, 0, w, h);
  } else {
    const scale = (fit === "cover" ? Math.max : Math.min)(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }
  const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.92));
  return { blob, width: w, height: h, preview: URL.createObjectURL(blob) };
}

// Prepara un archivo: mide, adapta a la medida elegida y convierte a JPEG (lo único que acepta Instagram).
async function prepareFile(file) {
  if (file.type.startsWith("video/")) {
    const url = URL.createObjectURL(file);
    const meta = await new Promise((resolve) => {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () => resolve({ width: v.videoWidth, height: v.videoHeight, duration: v.duration });
      v.onerror = () => resolve({});
      v.src = url;
    });
    return { original: file, blob: file, mime: file.type === "video/quicktime" ? "video/quicktime" : "video/mp4", name: file.name, preview: url, ...meta };
  }
  if (!file.type.startsWith("image/")) throw new Error(`${file.name}: formato no admitido.`);
  const img = await loadImage(URL.createObjectURL(file), file.name);
  const untouched = upload.size === "original" && file.type === "image/jpeg" && img.naturalWidth <= 2160 && file.size <= 8 * 1024 * 1024;
  if (untouched) return { original: file, blob: file, mime: "image/jpeg", name: file.name, preview: img.src, width: img.naturalWidth, height: img.naturalHeight };
  const out = await renderJpeg(img, upload.size, upload.fit);
  return { original: file, mime: "image/jpeg", name: file.name, ...out };
}

// Adapta los artes ya subidos de un arte a 1080×1350 (todas las diapositivas a la misma medida).
async function adaptPost(post, fit) {
  const first = post.media.find((m) => m.mime.startsWith("image/"));
  const r = first?.width ? first.width / first.height : 0.8;
  const size = post.type === "CAROUSEL" && Math.abs(r - 1) < 0.02 ? "square" : post.type === "CAROUSEL" && r > 1.5 ? "landscape" : "portrait";
  const media = [];
  for (const m of post.media) {
    if (m.mime.startsWith("video/")) {
      media.push(m);
      continue;
    }
    const img = await loadImage(m.url, m.name);
    const out = await renderJpeg(img, size, fit);
    media.push(await uploadOne({ ...out, mime: "image/jpeg", name: m.name }, () => {}));
  }
  return api("/posts/" + post.id, { method: "PATCH", body: { media } });
}

// Sube el arte de una idea (o reemplaza el de un arte en revisión).
async function attachFiles(post, list) {
  upload.size = post.type === "REELS" ? "original" : "portrait";
  const prepared = [];
  for (const f of [...list].slice(0, CAROUSEL_MAX)) prepared.push(await prepareFile(f));
  const media = [];
  for (const f of prepared) media.push(await uploadOne(f, () => {}));
  return api("/posts/" + post.id, { method: "PATCH", body: { media } });
}

function uploadOne(f, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/media");
    xhr.setRequestHeader("Content-Type", f.mime);
    xhr.setRequestHeader("X-Filename", encodeURIComponent(f.name));
    if (f.width) xhr.setRequestHeader("X-Width", String(f.width));
    if (f.height) xhr.setRequestHeader("X-Height", String(f.height));
    if (f.duration) xhr.setRequestHeader("X-Duration", String(f.duration));
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText || "{}");
      xhr.status < 300 ? resolve(data) : reject(new Error(data.error || "Error al subir el archivo."));
    };
    xhr.onerror = () => reject(new Error("Se perdió la conexión al subir."));
    xhr.send(f.blob);
  });
}

async function submitNewPost(e) {
  e.preventDefault();
  if (!upload.files.length) return toast("Añade al menos un archivo.");
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  await busy(btn, async () => {
    const bar = $("#up-progress");
    bar.classList.remove("hidden");
    const media = [];
    for (let i = 0; i < upload.files.length; i++) {
      media.push(await uploadOne(upload.files[i], (p) => (bar.firstElementChild.style.width = ((i + p) / upload.files.length) * 100 + "%")));
    }
    const post = await api("/posts", {
      body: { media, accountId: form.accountId.value, title: form.title.value, caption: form.caption.value },
    });
    closeSheet();
    await refresh();
    rerenderView();
    toast("Arte enviado a revisión");
    openPost(post.id);
  });
}

// ------------------------------------------------------------------ eventos globales
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-profile],[data-research],[data-res-account],[data-res-count],[data-res-remove],[data-go],[data-action],[data-open],[data-filter],[data-cal],[data-chip],[data-proposal-approve],[data-proposal-reject],[data-test-account],[data-remove-account],[data-close]");
  if (!t) return;
  if (t.matches("[data-close]")) return closeSheet();
  if (t.closest(".sheet") && !t.matches("[data-open],[data-go]") && !t.closest(".more-menu")) return; // la hoja maneja sus propios botones
  if (t.dataset.go) {
    e.preventDefault();
    closeSheet();
    return go(t.dataset.go);
  }
  if (t.dataset.open) return openPost(t.dataset.open);
  if (t.dataset.profile) return openProfile(t.dataset.profile);
  if (t.dataset.research) return openResearch(t.dataset.research);
  if (t.dataset.resAccount) {
    research.accountId = t.dataset.resAccount;
    return rerenderView();
  }
  if (t.dataset.resCount) {
    research.count = Number(t.dataset.resCount);
    return rerenderView();
  }
  if (t.dataset.resRemove) {
    research.images.splice(Number(t.dataset.resRemove), 1);
    return rerenderView();
  }
  if (t.dataset.filter) {
    state.filter = t.dataset.filter;
    return rerenderView();
  }
  if (t.dataset.cal) {
    const n = Number(t.dataset.cal);
    const m = state.calMonth;
    state.calMonth = n === 0 ? new Date(new Date().getFullYear(), new Date().getMonth(), 1) : new Date(m.getFullYear(), m.getMonth() + n, 1);
    return rerenderView();
  }
  if (t.dataset.chip) {
    const ta = $("#agent-form textarea");
    ta.value = t.dataset.chip;
    ta.focus();
    return;
  }
  if (t.dataset.proposalApprove) {
    return busy(t, async () => {
      await api(`/proposals/${t.dataset.proposalApprove}/approve`, { body: {} });
      markProposal(t.dataset.proposalApprove, "done");
      await refresh();
      rerenderView();
      toast("Hecho");
    });
  }
  if (t.dataset.proposalReject) {
    return busy(t, async () => {
      await api(`/proposals/${t.dataset.proposalReject}/reject`, { body: {} });
      markProposal(t.dataset.proposalReject, "rejected");
      await refresh();
      rerenderView();
    });
  }
  if (t.dataset.testAccount) {
    return busy(t, async () => {
      const r = await api(`/accounts/${t.dataset.testAccount}/test`, { body: {} });
      toast(r.msg);
      await refresh();
      rerenderView();
    });
  }
  if (t.dataset.removeAccount) {
    if (!confirm("¿Desconectar esta cuenta?")) return;
    return busy(t, async () => {
      await api(`/accounts/${t.dataset.removeAccount}`, { method: "DELETE" });
      await refresh();
      rerenderView();
    });
  }
  const action = t.dataset.action;
  if (action === "theme") return toggleTheme();
  if (action === "more") return openMore();
  if (action === "new-post") openNewPost();
  if (action === "connect") openConnect();
  if (action === "logout") api("/logout", { body: {} }).then(() => location.reload());
  if (action === "demo-account") {
    busy(t, async () => {
      await api("/accounts/demo", { body: {} });
      await refresh();
      rerenderView();
      toast("Cuenta de prueba lista");
    });
  }
  if (action === "test-ai") {
    busy(t, async () => {
      const key = $('[name="anthropicKey"]').value.trim();
      if (key) await api("/settings", { body: { anthropicKey: key } });
      const r = await api("/settings/test-ai", { body: {} });
      toast(r.msg);
      await refresh();
    });
  }
  if (action === "remove-ai") {
    busy(t, async () => {
      await api("/settings", { body: { removeAnthropicKey: true } });
      await refresh();
      rerenderView();
    });
  }
});

function markProposal(id, status) {
  const p = state.agentProposals.find((x) => x.id === id);
  if (p) p.status = status;
}

document.addEventListener("dragover", (e) => {
  if (e.target.closest?.("#res-zone")) e.preventDefault();
});
document.addEventListener("drop", (e) => {
  if (!e.target.closest?.("#res-zone")) return;
  e.preventDefault();
  addResearchImages(e.dataTransfer.files);
});

document.addEventListener("change", (e) => {
  if (e.target.id === "res-file") addResearchImages(e.target.files);
  if (e.target.id === "res-web") research.web = e.target.checked;
});

document.addEventListener("submit", (e) => {
  if (e.target.id === "research-form") {
    e.preventDefault();
    return submitResearch(e.target);
  }
  if (e.target.id === "agent-form") {
    e.preventDefault();
    const ta = e.target.command;
    const command = ta.value.trim();
    if (!command) return;
    busy(e.target.querySelector("button"), async () => {
      const r = await api("/agent", { body: { command, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone } });
      state.agentReply = r.reply;
      state.agentProposals = r.proposals;
      ta.value = "";
      ta.blur();
      await refresh();
      rerenderView();
    });
  }
  if (e.target.id === "settings-form") {
    e.preventDefault();
    const f = e.target;
    const body = { brandGuide: f.brandGuide.value, publicUrl: f.publicUrl.value, autoReview: f.autoReview.checked };
    if (f.anthropicKey.value.trim()) body.anthropicKey = f.anthropicKey.value.trim();
    if (f.newPassword?.value) Object.assign(body, { newPassword: f.newPassword.value, currentPassword: f.currentPassword.value });
    busy(f.querySelector('button[type="submit"]'), async () => {
      await api("/settings", { body });
      await refresh();
      f.blur?.();
      document.activeElement?.blur();
      rerenderView();
      toast("Ajustes guardados");
    });
  }
});

// Enter envía al agente; Shift+Enter hace salto de línea. El textarea crece con el texto.
document.addEventListener("keydown", (e) => {
  if (e.target.matches?.("#agent-form textarea") && e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    e.target.form.requestSubmit();
  }
});
document.addEventListener("input", (e) => {
  if (e.target.form?.id === "research-form" && e.target.name) research.draft[e.target.name] = e.target.value;
  if (e.target.matches?.("#agent-form textarea")) {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }
});

// ------------------------------------------------------------------ arranque y sincronización
let pollTimer;
function startPolling() {
  clearInterval(pollTimer);
  pollTimer = setInterval(async () => {
    if (document.hidden || !state.session?.authed) return;
    try {
      const before = JSON.stringify(state.data);
      await refresh();
      if (JSON.stringify(state.data) !== before) {
        rerenderView();
        refreshDetail();
        refreshResearchSheet();
      }
    } catch {
      // sin conexión momentánea: lo intentamos en el siguiente ciclo
    }
  }, 5000);
}

(async function boot() {
  try {
    state.session = await fetch("/api/session").then((r) => r.json());
  } catch {
    state.session = { authed: false, needsSetup: false };
  }
  if (state.session.authed) {
    render();
    await refresh();
    startPolling();
  }
  render();
})();
