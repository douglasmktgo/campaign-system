// Studio — interfaz. JavaScript plano, sin compilación.

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
  inbox: '<path d="M3 13h5l1.5 3h5l1.5-3h5"/><path d="M5 5h14l2 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z"/>',
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
};
const pill = (status) => `<span class="pill ${STATUS[status].cls}">${STATUS[status].label}</span>`;
const TYPE_ICON = { IMAGE: "image", CAROUSEL: "stack", REELS: "play" };
const TYPE_LABEL = { IMAGE: "Imagen", CAROUSEL: "Carrusel", REELS: "Reel" };

function mediaTag(m, attrs = "") {
  if (!m) return `<div class="thumb"></div>`;
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
};

const accountById = (id) => state.data?.accounts.find((a) => a.id === id);
const postById = (id) => state.data?.posts.find((p) => p.id === id);
const pendingProposals = () => (state.data?.proposals || []).filter((p) => p.status === "pending" && postById(p.postId));
const reviewPosts = () => (state.data?.posts || []).filter((p) => p.status === "review");
const approvalCount = () => pendingProposals().length + reviewPosts().length;

async function refresh() {
  state.data = await api("/state");
}

// ------------------------------------------------------------------ navegación
const NAV = [
  { id: "home", label: "Inicio", icon: "home" },
  { id: "approvals", label: "Aprobaciones", icon: "inbox" },
  { id: "library", label: "Artes", icon: "grid" },
  { id: "calendar", label: "Calendario", icon: "calendar" },
  { id: "accounts", label: "Cuentas", icon: "instagram" },
  { id: "settings", label: "Ajustes", icon: "gear" },
];

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
  const navBtn = (n, cls) =>
    `<button class="${cls} ${state.view === n.id ? "active" : ""}" data-go="${n.id}">${icon(n.icon)}<span>${n.label}</span>${
      n.id === "approvals" && count ? `<span class="badge">${count}</span>` : ""
    }</button>`;
  app.innerHTML = `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand"><div class="brand-mark">${icon("instagram", 'style="width:18px;height:18px"')}</div>Studio</div>
        ${NAV.map((n) => navBtn(n, "nav-item")).join("")}
        <div class="sidebar-foot">
          <button class="btn btn-primary" style="width:100%" data-action="new-post">${icon("plus")}Nuevo arte</button>
          <button class="nav-item" style="margin-top:8px" data-action="logout">${icon("logout")}<span>Cerrar sesión</span></button>
        </div>
      </aside>
      <main class="main" id="view">${viewHtml()}</main>
      <nav class="tabbar">${NAV.map((n) => navBtn(n, "")).join("")}</nav>
    </div>`;
}

function rerenderView() {
  const el = $("#view");
  if (!el) return render();
  // No re-pintamos mientras el usuario escribe en la vista principal.
  if (el.contains(document.activeElement) && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
  el.innerHTML = viewHtml();
  const count = approvalCount();
  document.querySelectorAll('.nav-item[data-go="approvals"], .tabbar [data-go="approvals"]').forEach((b) => {
    b.querySelector(".badge")?.remove();
    if (count) b.insertAdjacentHTML("beforeend", `<span class="badge">${count}</span>`);
  });
}

function viewHtml() {
  const views = { home: homeView, approvals: approvalsView, library: libraryView, calendar: calendarView, accounts: accountsView, settings: settingsView };
  return (views[state.view] || homeView)();
}

// ------------------------------------------------------------------ acceso
function authView() {
  const setup = state.session.needsSetup;
  return `
    <div class="auth">
      <form class="auth-card" id="auth-form">
        <div class="brand-mark">${icon("instagram")}</div>
        <h1>${setup ? "Bienvenido a Studio" : "Studio"}</h1>
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

// ------------------------------------------------------------------ Inicio
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Buenos días" : h < 20 ? "Buenas tardes" : "Buenas noches";
}

function homeView() {
  const d = state.data;
  const scheduled = d.posts.filter((p) => p.status === "scheduled").sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  const weekAgo = Date.now() - 7 * 86400000;
  const published = d.posts.filter((p) => p.status === "published" && Date.parse(p.publishedAt) > weekAgo);
  const stat = (num, label, ic, color, view) => `
    <div class="card stat" data-go="${view}">
      <div class="stat-icon" style="background:var(--${color}-soft);color:var(--${color})">${icon(ic)}</div>
      <div class="stat-num">${num}</div><div class="stat-label">${label}</div>
    </div>`;
  const noAccounts = !d.accounts.length;
  return `
    <div class="page-head">
      <div>
        <h1 class="page-title">${greeting()}</h1>
        <p class="page-sub">${new Date().toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>
      <button class="btn btn-primary" data-action="new-post">${icon("plus")}Nuevo arte</button>
    </div>

    ${noAccounts ? `
      <div class="card" style="display:flex;align-items:center;gap:16px;margin-bottom:16px;flex-wrap:wrap">
        <div class="stat-icon" style="margin:0;background:var(--accent-soft);color:var(--accent)">${icon("instagram")}</div>
        <div style="flex:1;min-width:200px"><strong>Conecta tu primera cuenta de Instagram</strong><div class="muted small">O empieza con una cuenta de prueba para ver cómo funciona todo.</div></div>
        <button class="btn btn-primary" data-go="accounts">Conectar</button>
      </div>` : ""}

    ${composerHtml()}

    <div class="grid grid-3 stats" style="margin-top:16px">
      ${stat(approvalCount(), "Esperan tu aprobación", "inbox", "orange", "approvals")}
      ${stat(scheduled.length, "Programados", "clock", "purple", "calendar")}
      ${stat(published.length, "Publicados esta semana", "checkCircle", "green", "library")}
    </div>

    <div class="grid grid-2" style="margin-top:16px">
      <div class="card">
        <h3 style="margin:0 0 6px;font-size:17px">Próximas publicaciones</h3>
        ${scheduled.length ? scheduled.slice(0, 5).map((p) => `
          <div class="list-row" data-open="${p.id}">
            ${thumb(p)}
            <div class="row-main"><div class="row-title">${esc(p.title)}</div>
            <div class="row-sub">${fmtDate(p.scheduledAt)} · @${esc(accountById(p.accountId)?.username || "—")}</div></div>
          </div>`).join("") : `<p class="muted small">Nada programado todavía. Aprueba un arte y elige cuándo publicarlo.</p>`}
      </div>
      <div class="card">
        <h3 style="margin:0 0 6px;font-size:17px">Actividad reciente</h3>
        ${d.activity.length ? d.activity.slice(0, 7).map((a) => `
          <div class="activity-item ${a.kind}"><span class="dot"></span><div style="flex:1">${esc(a.text)}<div class="muted small">${relative(a.at)}</div></div></div>`).join("") : `<p class="muted small">Aquí verás todo lo que pasa.</p>`}
      </div>
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
    <div class="card" style="box-shadow:none;border:1px solid var(--line)">
      <div class="approval">
        <div data-open="${post.id}" style="cursor:pointer">${thumb(post)}</div>
        <div class="row-main">
          <div class="approval-kind">${icon("spark", 'style="width:12px;height:12px;vertical-align:-1px"')} ${KIND[pr.kind].label}</div>
          <div class="approval-title">${esc(post.title)}</div>
          <div class="row-sub">${detail}</div>
          <div class="row-sub" style="margin-top:4px">${esc(pr.reason)}</div>
        </div>
        <div class="approval-actions">
          <button class="btn" data-proposal-reject="${pr.id}">Rechazar</button>
          <button class="btn btn-primary" data-proposal-approve="${pr.id}">${icon("check")}${KIND[pr.kind].verb}</button>
        </div>
      </div>
      ${pr.kind === "update_caption" ? `<div class="quote">${esc(pr.caption)}</div>` : ""}
    </div>`;
}

function reviewCard(post) {
  const acc = accountById(post.accountId);
  const errors = post.checks.filter((c) => c.level === "error").length;
  const warns = post.checks.filter((c) => c.level === "warn").length;
  const r = post.aiReview;
  return `
    <div class="card">
      <div class="approval">
        <div data-open="${post.id}" style="cursor:pointer">${thumb(post)}</div>
        <div class="row-main">
          <div class="approval-kind" style="color:var(--orange)">Validar arte · ${TYPE_LABEL[post.type]}</div>
          <div class="approval-title">${esc(post.title)}</div>
          <div class="row-sub">${acc ? "@" + esc(acc.username) : "Sin cuenta asignada"} · subido ${relative(post.createdAt)}</div>
          <div class="row-sub" style="margin-top:6px;display:flex;gap:12px;flex-wrap:wrap;align-items:center">
            ${errors ? `<span style="color:var(--red)">${errors} ${errors === 1 ? "error" : "errores"}</span>` : warns ? `<span style="color:var(--orange)">${warns} ${warns === 1 ? "aviso" : "avisos"}</span>` : `<span style="color:var(--green)">Requisitos OK</span>`}
            ${r?.pending ? `<span><span class="spinner" style="width:12px;height:12px;vertical-align:-1px"></span> IA revisando…</span>` : r?.score != null ? `<span>IA ${scoreBadge(r)}</span>` : ""}
          </div>
        </div>
        <div class="approval-actions">
          <button class="btn btn-primary" data-open="${post.id}">Revisar</button>
        </div>
      </div>
    </div>`;
}

function approvalsView() {
  const props = pendingProposals();
  const reviews = reviewPosts();
  return `
    <div class="page-head"><div>
      <h1 class="page-title">Aprobaciones</h1>
      <p class="page-sub">Nada se publica ni cambia sin tu visto bueno.</p>
    </div></div>
    ${!props.length && !reviews.length ? `
      <div class="card empty">${icon("checkCircle")}<h3>Todo al día</h3><p>No hay nada esperando tu aprobación.</p></div>` : ""}
    ${props.length ? `<div class="section-title" style="margin-top:0">Propuestas del agente <span class="count">${props.length}</span></div>${props.map(proposalCard).join("")}` : ""}
    ${reviews.length ? `<div class="section-title">Artes por validar <span class="count">${reviews.length}</span></div>${reviews.map(reviewCard).join("")}` : ""}`;
}

// ------------------------------------------------------------------ Artes
const FILTERS = [
  ["all", "Todos"],
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
      <div><h1 class="page-title">${title}</h1><p class="page-sub">Morado: programado · Verde: publicado</p></div>
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
          <div class="row-title">@${esc(a.username)} ${a.demo ? `<span class="pill pill-review" style="margin-left:4px">Prueba</span>` : a.status === "error" ? `<span class="pill pill-failed" style="margin-left:4px">Revisar</span>` : ""}</div>
          <div class="row-sub">${esc(a.name || "")}${a.followers != null ? ` · ${a.followers.toLocaleString("es")} seguidores` : ""}</div>
        </div>
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
          <li>Entra en <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener">developers.facebook.com/apps</a> y crea una app de tipo <em>Empresa</em>.</li>
          <li>Añade el producto <strong>Instagram</strong> → «API con inicio de sesión de Instagram».</li>
          <li>En «Generar tokens de acceso», añade tu cuenta y pulsa <strong>Generar token</strong>.</li>
          <li>Copia el token (empieza por <code>IG…</code>) y pégalo aquí.</li>
        </ol>
        <p class="muted small">También funciona un token de Facebook (<code>EAA…</code>) con permiso <code>instagram_content_publish</code>: se conectarán todas las cuentas vinculadas a tus páginas.</p>
        <form id="connect-form">
          <div class="field"><label>Token de acceso</label><textarea class="textarea" name="token" style="min-height:90px;font-family:ui-monospace,monospace;font-size:13px" placeholder="IGAA…" required></textarea></div>
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
  return `<ul class="checks">${post.checks.map((c) => `<li class="${c.level}">${icon(ic[c.level])}<span>${esc(c.text)}</span></li>`).join("")}</ul>`;
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
  if (post.status === "publishing") return `<button class="btn" disabled><span class="spinner"></span> Publicando…</button>`;
  if (post.status === "scheduled") {
    return `<span class="muted small" style="margin-right:auto;align-self:center">${icon("clock", 'style="width:14px;height:14px;vertical-align:-2px"')} ${fmtDate(post.scheduledAt)}</span>
      <button class="btn" data-post-action="unschedule">Cancelar programación</button>
      <button class="btn btn-primary" data-post-action="publish">Publicar ahora</button>`;
  }
  if (post.status === "approved" || (post.status === "failed" && post.history.some((h) => h.text.startsWith("Aprobado")))) {
    return `<input class="input" type="datetime-local" id="d-when" value="${defaultSlot()}" style="width:auto;margin-right:auto">
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
      ${m === "schedule" ? `<input class="input" type="datetime-local" id="d-when" value="${defaultSlot()}" style="width:auto">` : ""}
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
const upload = { files: [] };

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
            <div class="muted small">1 imagen = publicación · 2–10 = carrusel · 1 vídeo = Reel</div>
            <input type="file" id="file-input" accept="image/jpeg,image/png,image/webp,image/heic,video/mp4,video/quicktime" multiple hidden>
          </label>
          <div class="previews" id="previews"></div>
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
  const dz = $("#dz");
  const input = $("#file-input");
  input.addEventListener("change", () => addFiles(input.files));
  dz.addEventListener("dragover", (e) => {
    e.preventDefault();
    dz.classList.add("drag");
  });
  dz.addEventListener("dragleave", () => dz.classList.remove("drag"));
  dz.addEventListener("drop", (e) => {
    e.preventDefault();
    dz.classList.remove("drag");
    addFiles(e.dataTransfer.files);
  });
  $("#previews").addEventListener("click", (e) => {
    const b = e.target.closest("[data-remove]");
    if (!b) return;
    upload.files.splice(Number(b.dataset.remove), 1);
    renderPreviews();
  });
  $("#new-form").addEventListener("submit", submitNewPost);
}

async function addFiles(list) {
  for (const f of list) {
    if (upload.files.length >= 10) {
      toast("Máximo 10 archivos.");
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
    .map((f, i) => `<div class="preview">${f.mime.startsWith("video/") ? `<video src="${f.preview}" muted></video>` : `<img src="${f.preview}" alt="">`}<button type="button" data-remove="${i}">${icon("x")}</button></div>`)
    .join("");
}

// Prepara un archivo: mide dimensiones y convierte imágenes a JPEG (lo único que acepta Instagram).
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
    return { blob: file, mime: file.type === "video/quicktime" ? "video/quicktime" : "video/mp4", name: file.name, preview: url, ...meta };
  }
  if (!file.type.startsWith("image/")) throw new Error(`${file.name}: formato no admitido.`);
  const url = URL.createObjectURL(file);
  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error(`${file.name}: no se pudo leer la imagen.`));
    i.src = url;
  });
  let blob = file;
  let { naturalWidth: width, naturalHeight: height } = img;
  // Convierte a JPEG si hace falta, o si la imagen es enorme (Instagram recomienda máx. 1440 px de ancho).
  if (file.type !== "image/jpeg" || width > 2160 || file.size > 8 * 1024 * 1024) {
    const scale = Math.min(1, 2160 / width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff"; // fondo blanco para PNG con transparencia
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.92));
    width = canvas.width;
    height = canvas.height;
  }
  return { blob, mime: "image/jpeg", name: file.name, preview: url, width, height };
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
  const t = e.target.closest("[data-go],[data-action],[data-open],[data-filter],[data-cal],[data-chip],[data-proposal-approve],[data-proposal-reject],[data-test-account],[data-remove-account],[data-close]");
  if (!t) return;
  if (t.matches("[data-close]")) return closeSheet();
  if (t.closest(".sheet") && !t.matches("[data-open],[data-go]")) return; // la hoja maneja sus propios botones
  if (t.dataset.go) {
    e.preventDefault();
    closeSheet();
    return go(t.dataset.go);
  }
  if (t.dataset.open) return openPost(t.dataset.open);
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

document.addEventListener("submit", (e) => {
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
    const body = { brandGuide: f.brandGuide.value, publicUrl: f.publicUrl.value };
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
