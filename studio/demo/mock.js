// Demo interactiva de Studio: simula el servidor dentro del navegador.
// Intercepta fetch("/api/...") con datos de ejemplo en memoria. No conecta con Instagram ni con la IA.
(function () {
  const VALIDATE_SRC = "__VALIDATE__";

  const uid = (p) => p + "_" + Math.random().toString(16).slice(2, 10);
  const now = () => new Date().toISOString();
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const ago = (hours) => new Date(Date.now() - hours * 3600000).toISOString();
  const at = (days, hour, min = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(hour, min, 0, 0);
    return d.toISOString();
  };

  // ---------- artes de ejemplo dibujados en canvas ----------
  function art(w, h, colors, title, sub) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const x = c.getContext("2d");
    const g = x.createLinearGradient(0, 0, w, h);
    colors.forEach((col, i) => g.addColorStop(i / (colors.length - 1), col));
    x.fillStyle = g;
    x.fillRect(0, 0, w, h);
    x.globalAlpha = 0.18;
    x.fillStyle = "#fff";
    x.beginPath();
    x.arc(w * 0.8, h * 0.25, Math.min(w, h) * 0.35, 0, Math.PI * 2);
    x.fill();
    x.beginPath();
    x.arc(w * 0.15, h * 0.85, Math.min(w, h) * 0.22, 0, Math.PI * 2);
    x.fill();
    x.globalAlpha = 1;
    x.fillStyle = "#fff";
    const base = Math.min(w, h * 0.9);
    x.font = `700 ${Math.round(base * 0.085)}px -apple-system, Helvetica, Arial, sans-serif`;
    const lines = title.split("\n");
    lines.forEach((l, i) => x.fillText(l, w * 0.08, h * 0.62 + i * base * 0.1));
    x.font = `500 ${Math.round(base * 0.035)}px -apple-system, Helvetica, Arial, sans-serif`;
    x.globalAlpha = 0.85;
    x.fillText(sub, w * 0.08, h * 0.62 + lines.length * base * 0.1 + base * 0.02);
    return { url: c.toDataURL("image/jpeg", 0.85), width: w, height: h };
  }
  const media = (a, name) => ({ file: uid("f"), url: a.url, mime: "image/jpeg", size: 380000, width: a.width, height: a.height, duration: null, name });

  const db = { accounts: [], posts: [], proposals: [], activity: [], settings: { brandGuide: "Tono cercano y optimista. Tuteamos. CTA habitual: «Reserva en el link de la bio».", publicUrl: "" } };
  const log = (text, kind = "info") => db.activity.unshift({ id: uid("act"), at: now(), text, kind });

  function seed() {
    db.accounts.push({ id: "acc_demo", igUserId: "demo1", username: "tu.marca", name: "Cuenta de prueba", avatar: "", followers: 12840, demo: true, status: "ok", connectedAt: now() });
    const mk = (o) => {
      const p = { id: uid("post"), accountId: "acc_demo", type: "IMAGE", caption: "", status: "review", scheduledAt: null, checks: [], aiReview: null, history: [], note: "", createdAt: now(), ...o };
      p.checks = validatePost(p);
      db.posts.push(p);
      return p;
    };
    const otono = mk({
      title: "Lanzamiento colección otoño",
      media: [media(art(1080, 1350, ["#ff9f0a", "#ff375f"], "Colección\nOtoño", "Disponible desde el 12 de octubre"), "otono.jpg")],
      caption: "nueva coleccion de otoño ya disponible",
      createdAt: ago(3),
      history: [{ at: ago(3), text: "Arte subido y enviado a revisión" }],
      aiReview: {
        score: 74, verdict: "mejorable", at: now(),
        summary: "La imagen es clara y llamativa, pero el copy es muy plano y no tiene llamada a la acción.",
        issues: ["Empieza el copy con mayúscula y corrige la tilde de «colección».", "Añade una llamada a la acción (link en la bio).", "Faltan hashtags para alcanzar a nuevo público."],
        suggestedCaption: "Llegó el otoño 🍂 Nuestra nueva colección ya está disponible: tonos cálidos, tejidos suaves y piezas para todo el día.\n\nDescúbrela en el link de la bio.",
        hashtags: ["#otoño", "#nuevacoleccion", "#moda", "#estilo", "#tendencias"],
      },
    });
    mk({
      title: "Banner web reutilizado",
      media: [media(art(2000, 600, ["#0a84ff", "#5e5ce6"], "Envíos gratis", "Todo octubre"), "banner.jpg")],
      caption: "Envíos gratis todo octubre 📦 #envios",
      createdAt: ago(1.5),
      history: [{ at: ago(1.5), text: "Arte subido y enviado a revisión" }],
    });
    const tips = mk({
      title: "Carrusel: 3 tips de cuidado",
      type: "CAROUSEL",
      status: "approved",
      media: [
        media(art(1080, 1080, ["#30d158", "#0a84ff"], "3 tips", "para cuidar tus prendas"), "tip0.jpg"),
        media(art(1080, 1080, ["#64d2ff", "#0a84ff"], "1. Lava\nen frío", "Los colores duran más"), "tip1.jpg"),
        media(art(1080, 1080, ["#5e5ce6", "#bf5af2"], "2. Seca\na la sombra", "Evita que se decoloren"), "tip2.jpg"),
      ],
      caption: "Tus prendas favoritas duran más con estos 3 tips 👇 Guarda este post para no olvidarlos.\n\n#cuidadoderopa #tips #modasostenible",
      createdAt: at(-1, 16),
      history: [{ at: at(-1, 17), text: "Aprobado por ti" }, { at: at(-1, 16), text: "Arte subido y enviado a revisión" }],
      aiReview: { score: 91, verdict: "listo", at: now(), summary: "Carrusel coherente, buena legibilidad y copy con llamada a guardar.", issues: [], suggestedCaption: "", hashtags: [] },
    });
    mk({
      title: "Promo 2x1 fin de semana",
      status: "scheduled",
      scheduledAt: at(1, 19),
      media: [media(art(1080, 1350, ["#bf5af2", "#ff375f"], "2x1", "Solo este fin de semana"), "promo.jpg")],
      caption: "Este finde, 2x1 en toda la tienda 🛍️ Válido sábado y domingo. Reserva en el link de la bio.\n\n#promo #2x1 #findesemana",
      createdAt: at(-2, 11),
      history: [{ at: at(-1, 12), text: "Programado para " + at(1, 19) }, { at: at(-1, 12), text: "Aprobado por ti" }],
      aiReview: { score: 88, verdict: "listo", at: now(), summary: "Oferta clara y fácil de leer.", issues: [], suggestedCaption: "", hashtags: [] },
    });
    mk({
      title: "Detrás de cámaras",
      status: "published",
      publishedAt: at(-1, 13, 30),
      media: [media(art(1080, 1350, ["#1c1c1e", "#636366"], "Detrás\nde cámaras", "Sesión de fotos de otoño"), "bts.jpg")],
      caption: "Así preparamos la sesión de la nueva colección 📸",
      createdAt: at(-3, 10),
      history: [{ at: at(-1, 13, 30), text: "Publicado (simulado en cuenta de prueba)" }],
    });
    db.proposals.push({
      id: uid("prop"), kind: "update_caption", postId: otono.id, scheduledAt: null,
      caption: otono.aiReview.suggestedCaption + "\n\n" + otono.aiReview.hashtags.join(" "),
      reason: "El copy actual no tiene llamada a la acción ni hashtags.", command: "Mejora el copy de los artes en revisión", status: "pending", createdAt: now(),
    });
    log("Cuenta de prueba conectada: @tu.marca", "success");
    log("Publicado en @tu.marca: «Detrás de cámaras»", "success");
    log("Aprobado: «" + tips.title + "»", "success");
    log("IA revisó «Lanzamiento colección otoño»: 74/100");
    log("El agente propone 1 acción");
  }

  // ---------- reglas compartidas con el servidor real ----------
  const validatePost = new Function(VALIDATE_SRC + "; return validatePost;")();
  const hasErrors = (checks) => checks.some((c) => c.level === "error");
  const hist = (p, text) => p.history.unshift({ at: now(), text });
  const findPost = (id) => {
    const p = db.posts.find((x) => x.id === id);
    if (!p) throw err(404, "Ese arte ya no existe.");
    return p;
  };
  const err = (status, message) => Object.assign(new Error(message), { status });
  const LOCKED = ["publishing", "published"];

  function schedule(p, when) {
    const t = Date.parse(when);
    if (Number.isNaN(t)) throw err(400, "Fecha no válida.");
    if (t < Date.now() - 60000) throw err(400, "Esa fecha ya pasó. Elige una futura.");
    p.status = "scheduled";
    p.scheduledAt = new Date(t).toISOString();
    hist(p, "Programado para " + p.scheduledAt);
  }

  async function publish(p) {
    p.status = "publishing";
    await sleep(1400);
    p.status = "published";
    p.publishedAt = now();
    p.permalink = null;
    hist(p, "Publicado (simulado en cuenta de prueba)");
    log(`Publicado en @tu.marca: «${p.title}»`, "success");
  }

  function fakeReview(p) {
    p.aiReview = { pending: true };
    setTimeout(() => {
      const errors = p.checks.filter((c) => c.level === "error").length;
      const cap = p.caption || "";
      const hasCta = /bio|link|reserva|compra|descubre|guarda/i.test(cap);
      const score = Math.max(35, 92 - errors * 25 - (cap.length < 40 ? 12 : 0) - (hasCta ? 0 : 8));
      const words = p.title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/\W+/).filter((w) => w.length > 3);
      p.aiReview = {
        score,
        verdict: score >= 80 ? "listo" : score >= 60 ? "mejorable" : "no_publicar",
        summary: errors ? "El arte no cumple los requisitos de Instagram; corrígelo antes de publicar." : score >= 80 ? "Buen arte: mensaje claro y legible." : "El arte funciona, pero el copy puede rendir más.",
        issues: [
          ...(errors ? ["Ajusta la imagen a una proporción entre 4:5 y 1.91:1 (por ejemplo 1080×1350)."] : []),
          ...(cap.length < 40 ? ["El copy es muy corto: cuenta qué es y por qué importa."] : []),
          ...(hasCta ? [] : ["Añade una llamada a la acción, como «Descúbrelo en el link de la bio»."]),
        ],
        suggestedCaption: `${p.title} ✨ ${cap && cap.length > 40 ? cap.split("\n")[0] : "Te lo contamos todo en este post."}\n\nDescúbrelo en el link de la bio.`,
        hashtags: [...new Set(words.map((w) => "#" + w))].slice(0, 4).concat(["#tumarca", "#novedades"]),
        at: now(),
      };
      log(`IA revisó «${p.title}»: ${score}/100`, score >= 80 ? "success" : "info");
    }, 1800);
  }

  // Agente simulado con reglas sencillas (el real usa IA y entiende cualquier instrucción).
  function plan(command) {
    const t = command.toLowerCase();
    const actions = [];
    const hourMatch = t.match(/(\d{1,2})(?::(\d{2}))?\s*(pm|p\.m\.|am|a\.m\.|h)?/);
    let hour = 19;
    if (hourMatch) {
      hour = Number(hourMatch[1]) % 24;
      if (/p/.test(hourMatch[3] || "") && hour < 12) hour += 12;
    }
    if (/program/.test(t)) {
      const targets = db.posts.filter((p) => p.status === "approved");
      targets.forEach((p, i) => actions.push({ kind: "schedule", postId: p.id, scheduledAt: at(i + 1, hour), caption: null, reason: `Franja de alta actividad (${String(hour).padStart(2, "0")}:00), un arte por día.` }));
    }
    if (/copy|texto|mejora/.test(t)) {
      db.posts.filter((p) => p.status === "review" && !db.proposals.some((x) => x.postId === p.id && x.status === "pending" && x.kind === "update_caption")).forEach((p) => {
        actions.push({ kind: "update_caption", postId: p.id, scheduledAt: null, caption: `${p.title} ✨ ${p.caption ? p.caption.split("\n")[0] : ""}\n\nDescúbrelo en el link de la bio.\n\n#tumarca #novedades`.replace("✨ \n", "✨\n"), reason: "Añade llamada a la acción y hashtags." });
      });
    }
    if (/publica/.test(t) && !/program/.test(t)) {
      const last = db.posts.find((p) => p.status === "approved");
      if (last) actions.push({ kind: "publish_now", postId: last.id, scheduledAt: null, caption: null, reason: "Es el último arte aprobado y aún no está programado." });
    }
    const reply = actions.length
      ? `Te propongo ${actions.length} ${actions.length === 1 ? "acción" : "acciones"}. Revísalas y aprueba las que quieras.`
      : "No encontré artes que encajen con eso. Prueba con: «programa los aprobados a las 7 pm», «mejora el copy de los artes en revisión» o «publica el último aprobado».";
    return { reply: reply + " (Demo: el agente real usa IA y entiende instrucciones libres.)", actions };
  }

  // ---------- rutas ----------
  const routes = [
    ["GET", /^\/session$/, () => ({ needsSetup: false, authed: true })],
    ["POST", /^\/logout$/, () => ({ ok: true })],
    ["GET", /^\/state$/, () => ({
      accounts: db.accounts, posts: db.posts, proposals: db.proposals.slice(0, 100), activity: db.activity.slice(0, 40),
      settings: { hasAnthropic: true, publicUrl: db.settings.publicUrl, effectivePublicUrl: "https://tu-studio.onrender.com", brandGuide: db.settings.brandGuide, passwordFromEnv: true },
    })],
    ["POST", /^\/accounts$/, () => { throw err(400, "En la demo no se conecta Instagram real. Usa «Añadir cuenta de prueba»."); }],
    ["POST", /^\/accounts\/demo$/, () => {
      const n = db.accounts.length + 1;
      db.accounts.push({ id: uid("acc"), igUserId: "demo" + n, username: "tu.marca" + n, name: "Cuenta de prueba", avatar: "", followers: null, demo: true, status: "ok", connectedAt: now() });
      log(`Cuenta de prueba añadida: @tu.marca${n}`);
      return { ok: true };
    }],
    ["POST", /^\/accounts\/([^/]+)\/test$/, () => ({ ok: true, msg: "Cuenta de prueba: todo correcto." })],
    ["DELETE", /^\/accounts\/([^/]+)$/, (id) => {
      if (db.posts.some((p) => p.accountId === id && p.status === "scheduled")) throw err(400, "Esta cuenta tiene publicaciones programadas. Desprográmalas primero.");
      db.accounts = db.accounts.filter((a) => a.id !== id);
      return { ok: true };
    }],
    ["POST", /^\/posts$/, (_, b) => {
      const isVideo = b.media.length === 1 && b.media[0].mime.startsWith("video/");
      const p = {
        id: uid("post"), title: (b.title || b.media[0].name.replace(/\.[^.]+$/, "") || "Arte sin título").slice(0, 80),
        accountId: b.accountId, type: isVideo ? "REELS" : b.media.length > 1 ? "CAROUSEL" : "IMAGE", media: b.media,
        caption: b.caption || "", status: "review", scheduledAt: null, checks: [], aiReview: null, history: [], note: "", createdAt: now(),
      };
      p.checks = validatePost(p);
      hist(p, "Arte subido y enviado a revisión");
      db.posts.unshift(p);
      log(`Nuevo arte para revisar: «${p.title}»`);
      fakeReview(p);
      return p;
    }],
    ["PATCH", /^\/posts\/([^/]+)$/, (id, b) => {
      const p = findPost(id);
      if (LOCKED.includes(p.status)) throw err(400, "Un arte publicado no se puede editar.");
      let changed = false;
      if (typeof b.title === "string") p.title = b.title.slice(0, 80) || p.title;
      if (typeof b.caption === "string" && b.caption !== p.caption) { p.caption = b.caption; changed = true; }
      if (typeof b.accountId === "string" && b.accountId !== p.accountId) { p.accountId = b.accountId; changed = true; }
      p.checks = validatePost(p);
      if (changed && ["approved", "scheduled", "rejected", "failed"].includes(p.status)) {
        p.status = "review";
        p.scheduledAt = null;
        hist(p, "Editado: vuelve a revisión");
      }
      return p;
    }],
    ["POST", /^\/posts\/([^/]+)\/approve$/, async (id, b) => {
      const p = findPost(id);
      p.checks = validatePost(p);
      if (hasErrors(p.checks)) throw err(400, "Corrige los errores de validación antes de aprobar.");
      p.status = "approved";
      p.note = "";
      hist(p, "Aprobado por ti");
      if (b.scheduledAt) schedule(p, b.scheduledAt);
      log(`Aprobado: «${p.title}»`, "success");
      if (b.publishNow) await publish(p);
      return p;
    }],
    ["POST", /^\/posts\/([^/]+)\/schedule$/, (id, b) => { const p = findPost(id); schedule(p, b.scheduledAt); return p; }],
    ["POST", /^\/posts\/([^/]+)\/unschedule$/, (id) => {
      const p = findPost(id);
      p.status = "approved";
      p.scheduledAt = null;
      hist(p, "Programación cancelada");
      return p;
    }],
    ["POST", /^\/posts\/([^/]+)\/reject$/, (id, b) => {
      const p = findPost(id);
      p.status = "rejected";
      p.scheduledAt = null;
      p.note = b.note || "";
      hist(p, "Rechazado" + (p.note ? ": " + p.note : ""));
      log(`Rechazado: «${p.title}»`);
      return p;
    }],
    ["POST", /^\/posts\/([^/]+)\/publish$/, async (id) => { const p = findPost(id); await publish(p); return p; }],
    ["POST", /^\/posts\/([^/]+)\/review$/, (id) => { const p = findPost(id); fakeReview(p); return p; }],
    ["DELETE", /^\/posts\/([^/]+)$/, (id) => {
      const p = findPost(id);
      db.posts = db.posts.filter((x) => x.id !== id);
      db.proposals.forEach((pr) => { if (pr.postId === id && pr.status === "pending") pr.status = "rejected"; });
      log(`Eliminado: «${p.title}»`);
      return { ok: true };
    }],
    ["POST", /^\/agent$/, async (_, b) => {
      await sleep(900);
      const r = plan(b.command || "");
      const created = r.actions.map((a) => ({ id: uid("prop"), ...a, command: b.command, status: "pending", createdAt: now() }));
      db.proposals.unshift(...created);
      if (created.length) log(`El agente propone ${created.length} ${created.length === 1 ? "acción" : "acciones"}`);
      return { reply: r.reply, proposals: created };
    }],
    ["POST", /^\/proposals\/([^/]+)\/approve$/, async (id) => {
      const pr = db.proposals.find((x) => x.id === id);
      if (!pr || pr.status !== "pending") throw err(404, "Esta propuesta ya no está pendiente.");
      const p = findPost(pr.postId);
      try {
        if (pr.kind === "update_caption") {
          p.caption = pr.caption;
          p.checks = validatePost(p);
          hist(p, "Copy actualizado por el agente (aprobado por ti)");
        } else if (pr.kind === "unschedule") {
          p.status = "approved";
          p.scheduledAt = null;
        } else {
          p.checks = validatePost(p);
          if (hasErrors(p.checks)) throw err(400, "El arte tiene errores de validación.");
          if (!["approved", "scheduled"].includes(p.status)) hist(p, "Aprobado por ti (vía agente)");
          p.status = "approved";
          if (pr.kind === "schedule") schedule(p, pr.scheduledAt);
        }
        pr.status = "done";
        if (pr.kind === "publish_now") await publish(p);
        return { ok: true };
      } catch (e) {
        pr.status = "failed";
        throw e;
      }
    }],
    ["POST", /^\/proposals\/([^/]+)\/reject$/, (id) => {
      const pr = db.proposals.find((x) => x.id === id);
      if (pr) pr.status = "rejected";
      return { ok: true };
    }],
    ["POST", /^\/settings$/, (_, b) => {
      if (typeof b.brandGuide === "string") db.settings.brandGuide = b.brandGuide;
      if (typeof b.publicUrl === "string") db.settings.publicUrl = b.publicUrl;
      return { ok: true };
    }],
    ["POST", /^\/settings\/test-ai$/, () => ({ ok: true, msg: "Demo: en la versión real aquí se prueba tu API key." })],
  ];

  const realFetch = window.fetch.bind(window);
  window.fetch = async function (input, opts = {}) {
    const url = typeof input === "string" ? input : input.url;
    if (!url.startsWith("/api/")) return realFetch(input, opts);
    const path = url.slice(4);
    const method = (opts.method || "GET").toUpperCase();
    let body = {};
    try { body = opts.body ? JSON.parse(opts.body) : {}; } catch { /* sin cuerpo */ }
    await sleep(120);
    for (const [m, re, fn] of routes) {
      const match = path.match(re);
      if (m === method && match) {
        try {
          const data = await fn(match[1], body);
          return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
        } catch (e) {
          return new Response(JSON.stringify({ error: e.message }), { status: e.status || 500, headers: { "Content-Type": "application/json" } });
        }
      }
    }
    return new Response(JSON.stringify({ error: "Ruta no disponible en la demo." }), { status: 404 });
  };

  // Subida de archivos: en la demo se quedan en el navegador.
  window.__demoUpload = async (f) => ({
    file: uid("f"), url: URL.createObjectURL(f.blob), mime: f.mime, size: f.blob.size,
    width: f.width || null, height: f.height || null, duration: f.duration || null, name: f.name,
  });

  // Programador simulado.
  setInterval(() => {
    db.posts.filter((p) => p.status === "scheduled" && Date.parse(p.scheduledAt) <= Date.now()).forEach(publish);
  }, 5000);

  // En el visor no hay diálogos nativos: confirmamos siempre y el rechazo va sin nota.
  window.confirm = () => true;
  window.prompt = () => "";

  seed();
})();
