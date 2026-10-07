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

  const db = { accounts: [], posts: [], proposals: [], research: [], activity: [], settings: { brandGuide: "", publicUrl: "" } };
  const log = (text, kind = "info") => db.activity.unshift({ id: uid("act"), at: now(), text, kind });

  const PROFILES = {
    acc_lox: {
      kind: "App o producto digital",
      about: "Loxita, app de finanzas personales: presupuesto, ahorro automático y control de gastos desde el móvil.",
      audience: "Jóvenes de 20 a 35 años que empiezan a ganar dinero y no saben ahorrar ni organizarse.",
      goals: "Ganar seguidores y conseguir descargas de la app (leads con la palabra clave AHORRO por DM).",
      tone: "Cercano, claro y optimista. Tuteo. Cero jerga bancaria. Datos concretos.",
      pillars: "Ahorro, presupuesto 50/30/20, gastos hormiga, retos de ahorro, educación financiera simple.",
      cta: "Comenta AHORRO y te enviamos la plantilla; descarga Loxita desde el link en bio.",
      avoid: "Promesas de hacerse rico, criptomonedas especulativas, consejos de inversión de riesgo.",
      guide: "",
    },
    acc_dis: {
      kind: "Personal / profesional independiente",
      about: "Diseñador gráfico especializado en branding e identidad visual para emprendedores.",
      audience: "Emprendedores y pymes que necesitan una marca profesional; también otros diseñadores.",
      goals: "Autoridad como diseñador y conseguir clientes (consultas por DM).",
      tone: "Creativo, experto y cercano. Muestra proceso. Visual minimalista.",
      pillars: "Antes y después de marcas, proceso creativo, errores de diseño, consejos de branding.",
      cta: "Escríbeme MARCA por DM para una propuesta; guarda el post.",
      avoid: "Criticar trabajos de otros con nombre, memes vulgares.",
      guide: "",
    },
  };

  function seed() {
    db.accounts.push({ id: "acc_lox", igUserId: "demo1", username: "loxita.app", name: "Loxita · finanzas (demo)", avatar: "", followers: 3480, demo: true, status: "ok", connectedAt: now(), profile: PROFILES.acc_lox, canResearch: true });
    db.accounts.push({ id: "acc_dis", igUserId: "demo2", username: "tu.estudio.diseno", name: "Tu cuenta de diseñador (demo)", avatar: "", followers: 1920, demo: true, status: "ok", connectedAt: now(), profile: PROFILES.acc_dis, canResearch: true });
    const mk = (o) => {
      const p = { id: uid("post"), accountId: "acc_lox", type: "IMAGE", caption: "", status: "review", scheduledAt: null, checks: [], aiReview: null, history: [], note: "", createdAt: now(), ...o };
      p.checks = validatePost(p);
      db.posts.push(p);
      return p;
    };
    const regla = mk({
      title: "La regla 50/30/20",
      media: [media(art(1080, 1350, ["#30d158", "#0a84ff"], "Regla\n50/30/20", "Ordena tu sueldo en 3 partes"), "regla.jpg")],
      caption: "la regla 50 30 20 te ayuda a organizar tu dinero",
      createdAt: ago(3),
      history: [{ at: ago(3), text: "Arte subido y enviado a revisión" }],
      aiReview: {
        score: 74, verdict: "mejorable", at: now(),
        summary: "El arte se entiende, pero el copy no engancha en los primeros 125 caracteres ni tiene llamada a la acción.",
        issues: ["Abre con un gancho de resultado (IG1): una cifra concreta.", "Añade una CTA para conseguir leads (palabra clave por DM).", "Usa 3–5 hashtags de nicho en vez de ninguno."],
        suggestedCaption: "Con un sueldo de 1.000 € puedes ahorrar 200 € al mes sin dejar de vivir. Así funciona la regla 50/30/20 👇\n\n50 % necesidades · 30 % gustos · 20 % ahorro.\n\nComenta AHORRO y te enviamos la plantilla gratis.",
        hashtags: ["#finanzaspersonales", "#ahorro", "#regla503020", "#educacionfinanciera"],
      },
    });
    mk({
      title: "Banner de la web reutilizado",
      media: [media(art(2000, 600, ["#0a84ff", "#5e5ce6"], "Descarga Loxita", "Gratis en iOS y Android"), "banner.jpg")],
      caption: "Descarga Loxita gratis 📲 #finanzas",
      createdAt: ago(1.5),
      history: [{ at: ago(1.5), text: "Arte subido y enviado a revisión" }],
    });
    mk({
      title: "Arte en 1080×1450 (3:4)",
      media: [media(art(1080, 1450, ["#ff9f0a", "#ff375f"], "Reto\n52 semanas", "Ahorra sin darte cuenta"), "reto.jpg")],
      caption: "¿Te apuntas al reto de las 52 semanas? Empieza con 1 € y termina el año con 1.378 €.\n\nComenta RETO y te mandamos el calendario. #ahorro #retodeahorro #finanzaspersonales",
      createdAt: ago(1),
      history: [{ at: ago(1), text: "Arte subido y enviado a revisión" }],
    });
    const tips = mk({
      title: "Carrusel: 5 gastos hormiga",
      type: "CAROUSEL",
      status: "approved",
      media: [
        media(art(1080, 1350, ["#5e5ce6", "#bf5af2"], "5 gastos\nhormiga", "que se comen tu sueldo"), "g0.jpg"),
        media(art(1080, 1350, ["#64d2ff", "#0a84ff"], "1. Cafés\nfuera", "≈ 60 € al mes"), "g1.jpg"),
        media(art(1080, 1350, ["#30d158", "#64d2ff"], "2. Suscripciones\nolvidadas", "≈ 25 € al mes"), "g2.jpg"),
      ],
      caption: "Estos 5 gastos pequeños pueden costarte más de 1.000 € al año 🐜 Guarda este post y revisa cuál es el tuyo.\n\n#gastoshormiga #ahorro #finanzaspersonales",
      createdAt: at(-1, 16),
      history: [{ at: at(-1, 17), text: "Aprobado por ti" }, { at: at(-1, 16), text: "Arte subido y enviado a revisión" }],
      aiReview: { score: 91, verdict: "listo", at: now(), summary: "Carrusel claro, gancho numérico fuerte y CTA de guardado.", issues: [], suggestedCaption: "", hashtags: [] },
    });
    mk({
      accountId: "acc_dis",
      title: "Antes y después: rebranding cafetería",
      status: "scheduled",
      scheduledAt: at(1, 19),
      media: [media(art(1080, 1350, ["#1c1c1e", "#ff9f0a"], "Antes\n→ Después", "Rebranding de una cafetería"), "rebrand.jpg")],
      caption: "De un logo genérico a una marca que se recuerda ☕ Desliza para ver el proceso completo.\n\n¿Tu marca necesita un cambio? Escríbeme MARCA por DM.\n\n#branding #identidadvisual #diseñografico",
      createdAt: at(-2, 11),
      history: [{ at: at(-1, 12), text: "Programado para " + at(1, 19) }, { at: at(-1, 12), text: "Aprobado por ti" }],
      aiReview: { score: 88, verdict: "listo", at: now(), summary: "Transformación clara (IG6) y CTA directa a clientes.", issues: [], suggestedCaption: "", hashtags: [] },
    });
    mk({
      accountId: "acc_dis",
      title: "Mi proceso de diseño de logo",
      status: "published",
      publishedAt: at(-1, 13, 30),
      media: [media(art(1080, 1350, ["#2c2c2e", "#636366"], "Mi proceso\nde logo", "En 4 pasos"), "proceso.jpg")],
      caption: "Así diseño un logo en 4 pasos ✏️",
      createdAt: at(-3, 10),
      history: [{ at: at(-1, 13, 30), text: "Publicado (simulado en cuenta de prueba)" }],
    });
    db.proposals.push({
      id: uid("prop"), kind: "update_caption", postId: regla.id, scheduledAt: null,
      caption: regla.aiReview.suggestedCaption + "\n\n" + regla.aiReview.hashtags.join(" "),
      reason: "El copy no tiene gancho ni llamada a la acción para captar leads.", command: "Mejora el copy de los artes en revisión", status: "pending", createdAt: now(),
    });
    db.research.push(makeResearch("acc_lox", { references: ["finanzasconjuli", "nubank"], hashtags: ["ahorro"], links: [], ideas: "Vi un reel que explicaba la regla 50/30/20 con billetes reales y se hizo viral. Quiero algo así para Loxita.", images: [], webSearch: true, count: 6, feedback: "" }, true));
    log("Cuentas de prueba conectadas: @loxita.app y @tu.estudio.diseno", "success");
    log("Publicado en @tu.estudio.diseno: «Mi proceso de diseño de logo»", "success");
    log("Aprobado: «" + tips.title + "»", "success");
    log("Investigación lista para @loxita.app: 4 ideas", "success");
    log("El agente propone 1 acción");
  }

  // ---------- investigación de ejemplo (en la app real la hace la IA con datos reales) ----------
  const refTop = (u, rows) => ({
    username: u, name: "", bio: "", followers: u === "nubank" ? 1250000 : 284000, posts: 900, median: 1800, count: 50,
    top: rows.map(([format, caption, likes, comments, tm]) => ({ format, caption, likes, comments, permalink: "", date: "", engagement: likes + 2 * comments, timesMedian: tm })),
  });
  const IDEAS = {
    acc_lox: [
      { title: "Tu sueldo en 3 cajas: la regla 50/30/20 con billetes", format: "REEL", formula: "IG9 Pattern-Interrupt: billetes reales repartidos en cámara en los primeros 2 s", inspiredBy: "@finanzasconjuli: reel de billetes (14× su mediana)", hook: "Si cobras 1.000 €, así deberías repartirlo", outline: ["0–2 s: billetes sobre la mesa + texto «Cobras 1.000 €»", "2–8 s: 500 € a NECESIDADES (alquiler, comida)", "8–14 s: 300 € a GUSTOS", "14–20 s: 200 € a AHORRO, se guardan en Loxita", "20–25 s: pantalla de Loxita creando las 3 cajas", "25–30 s: «Comenta AHORRO y te paso la plantilla»"], caption: "La regla que más me pidieron explicar, en 30 segundos. 50 % necesidades, 30 % gustos, 20 % ahorro. Si la aplicas desde este mes, en un año tienes 2.400 € guardados.", hashtags: ["#regla503020", "#ahorro", "#finanzaspersonales", "#educacionfinanciera"], cta: "Comenta AHORRO y te enviamos la plantilla (y el link para crear tus cajas en Loxita)", goal: "leads", designNotes: "Reel 1080×1920, texto grande en zona segura central, verde Loxita para el ahorro", fit: 94 },
      { title: "5 gastos hormiga que suman 1.000 € al año", format: "CARRUSEL", formula: "IG5 Listicle: número en portada + un error por diapositiva + cierre con CTA de guardado", inspiredBy: "#ahorro: carruseles de listas son los que más se guardan", hook: "Estos 5 gastos pequeños te cuestan más de 1.000 € al año", outline: ["Portada: «5 gastos hormiga que te roban 1.000 € al año»", "Cafés fuera: 60 €/mes", "Suscripciones olvidadas: 25 €/mes", "Delivery entre semana: 80 €/mes", "Comisiones del banco: 10 €/mes", "Compras impulsivas online: 40 €/mes", "Total: 2.580 €/año 😳", "Cómo detectarlos en 5 min con Loxita", "Guarda este post · Comenta HORMIGA"], caption: "No es que ganes poco: es que se te escapa por goteo. Revisa cuál de estos 5 tienes y cuánto te cuesta al año.", hashtags: ["#gastoshormiga", "#ahorro", "#finanzaspersonales"], cta: "Guarda el post y comenta HORMIGA para recibir la checklist", goal: "seguidores", designNotes: "Carrusel 1080×1350, 9 diapositivas, un dato grande por diapositiva", fit: 90 },
      { title: "Mito: «Ahorrar es para los que ganan mucho»", format: "CARRUSEL", formula: "IG7 Myth-Buster: mito tachado en portada + datos que lo desmontan", inspiredBy: "@nubank: carrusel de mitos financieros (9× su mediana)", hook: "«Con mi sueldo no se puede ahorrar» (spoiler: sí)", outline: ["Portada: el mito tachado", "Dato: ahorrar 1 € al día = 365 € al año", "El truco: págate a ti primero", "Automatiza el día de cobro", "Ejemplo real con 900 € de sueldo", "CTA: comenta MITO"], caption: "El mito que más escuchamos. Te enseñamos por qué no es verdad y cómo empezar con lo que tienes.", hashtags: ["#mitosfinancieros", "#ahorro", "#finanzasparajovenes"], cta: "Comenta MITO y te mandamos el plan de 30 días", goal: "leads", designNotes: "Carrusel 1080×1350, tipografía gruesa, tachado rojo en la portada", fit: 86 },
      { title: "Reto 52 semanas: ¿te apuntas?", format: "POST", formula: "IG1 Number-First: resultado concreto (1.378 €) como gancho", inspiredBy: "Tendencia de retos de ahorro de inicio de año", hook: "Empieza con 1 € y termina el año con 1.378 €", outline: ["Título grande: Reto 52 semanas", "Mini calendario: semana 1 = 1 €, semana 52 = 52 €", "Total destacado: 1.378 €", "Logo Loxita + «Síguelo en la app»"], caption: "Un reto fácil que funciona porque empiezas muy pequeño. ¿Te apuntas con nosotros esta semana?", hashtags: ["#retodeahorro", "#ahorro", "#reto52semanas"], cta: "Comenta RETO y te enviamos el calendario descargable", goal: "comunidad", designNotes: "Post 1080×1350, el número 1.378 € ocupa un tercio del arte", fit: 82 },
    ],
    acc_dis: [
      { title: "Rediseñé el logo de una marca famosa en 3 estilos", format: "REEL", formula: "IG10 How-I Reel: proceso acelerado con resultado al inicio", inspiredBy: "Reels de rediseño de logos (tendencia en diseñadores)", hook: "Así se vería este logo si lo diseñara hoy", outline: ["0–2 s: resultado final en pantalla", "2–10 s: bocetos rápidos", "10–20 s: tres versiones (minimal, retro, bold)", "20–25 s: pregunta: ¿cuál eliges?", "25–30 s: «Escríbeme MARCA si quieres el tuyo»"], caption: "Tres maneras de modernizar una marca sin perder su esencia. ¿Cuál te quedarías?", hashtags: ["#branding", "#rediseñodelogo", "#diseñografico"], cta: "Comenta 1, 2 o 3 · Escríbeme MARCA por DM para tu marca", goal: "autoridad", designNotes: "Reel 1080×1920, grabación de pantalla + manos dibujando", fit: 91 },
      { title: "5 errores que hacen que tu marca parezca amateur", format: "CARRUSEL", formula: "IG5 Listicle con ejemplos antes/después", inspiredBy: "Carruseles educativos de diseño con alto guardado", hook: "Tu marca parece amateur por estos 5 errores", outline: ["Portada: los 5 errores", "1. Demasiadas tipografías", "2. Colores sin sistema", "3. Logo ilegible en pequeño", "4. Fotos de banco genéricas", "5. Cada post con un estilo distinto", "Cómo lo soluciono con mis clientes", "CTA: escríbeme MARCA"], caption: "Si tu marca tiene 2 o más de estos, se nota. La buena noticia: todos tienen solución.", hashtags: ["#branding", "#emprendedores", "#identidadvisual"], cta: "Guarda el post · Escríbeme MARCA y reviso tu marca gratis", goal: "leads", designNotes: "Carrusel 1080×1350, mostrar mal vs bien en cada diapositiva", fit: 89 },
    ],
  };
  function makeResearch(accountId, inputs, done) {
    const r = { id: uid("res"), accountId, parentId: null, inputs, status: done ? "done" : "running", step: "Leyendo cuentas de referencia…", createdAt: done ? ago(5) : now(), result: null, sources: null, error: "" };
    if (done) finishResearch(r);
    return r;
  }
  function finishResearch(r) {
    const lox = r.accountId === "acc_lox" || /finan|ahorr|dinero|loxita/i.test(JSON.stringify(r.inputs));
    const refs = r.inputs.references.length ? r.inputs.references : lox ? ["finanzasconjuli"] : ["estudio.referencia"];
    r.sources = {
      ownTop: null,
      hashtags: [],
      references: refs.slice(0, 3).map((u, i) =>
        refTop(u, lox
          ? [["REEL", "Si cobras 1.000 €, así deberías repartirlo 💸", 48200, 1830, 14 - i * 3], ["CARRUSEL", "Los 3 mitos del ahorro que te están frenando", 22100, 960, 9], ["CARRUSEL", "Checklist: revisa tus suscripciones hoy", 15400, 410, 6.2], ["POST", "¿Cuánto ahorras al mes? Te leo 👇", 9800, 2300, 5.1]]
          : [["REEL", "Rediseñé este logo en 3 estilos", 31200, 1200, 11 - i * 2], ["CARRUSEL", "Errores de branding que veo cada semana", 18300, 640, 7.4], ["CARRUSEL", "Antes y después de una identidad completa", 12900, 380, 5.6]])
      ),
    };
    const ideas = (lox ? IDEAS.acc_lox : IDEAS.acc_dis).map((i) => ({ ...i, id: uid("idea"), status: "new" }));
    r.result = {
      summary: lox
        ? "En finanzas personales lo que más crece son explicaciones visuales y rápidas con cifras concretas (cuánto ahorras con X sueldo). Los reels con dinero real y los carruseles de listas superan 6–14× la mediana de las cuentas analizadas. Para Loxita conviene replicar esa fórmula mostrando la app como la herramienta que lo hace fácil."
        : "En diseño, el contenido que muestra el proceso y la transformación (antes/después, rediseños) es el que más se comparte y guarda. Para tu cuenta personal, combina autoridad (proceso) con una CTA clara para clientes.",
      patterns: lox
        ? [
            { title: "Cifra concreta en el gancho", detail: "Los posts que empiezan con un número de dinero (1.000 €, 200 €) retienen más en los primeros 125 caracteres.", evidence: "Top reel: 14× la mediana" },
            { title: "Dinero visible", detail: "Billetes o pantallas con saldo hacen el concepto tangible.", evidence: "3 de los 4 mejores posts muestran dinero real" },
            { title: "Palabra clave en comentarios", detail: "Pedir comentar una palabra multiplica comentarios y genera leads por DM.", evidence: "El post con más comentarios usa «Te leo 👇»" },
          ]
        : [
            { title: "Resultado primero", detail: "Mostrar el diseño final en el primer segundo y luego el proceso.", evidence: "Reels de rediseño: 7–11× la mediana" },
            { title: "Comparación", detail: "Antes/después y versiones A/B/C invitan a comentar.", evidence: "Los posts con pregunta final tienen 2× comentarios" },
          ],
      trends: lox
        ? [
            { topic: "Regla 50/30/20", why: "Búsquedas en aumento al inicio de cada mes y muy compartida en reels educativos.", fit: 94, angle: "Mostrar cómo crear las 3 cajas en Loxita." },
            { topic: "Retos de ahorro (52 semanas, 1 € al día)", why: "Contenido de comunidad que se repite cada año con mucho guardado.", fit: 84, angle: "Reto propio de Loxita con seguimiento semanal en historias." },
            { topic: "Gastos hormiga", why: "Tema recurrente con alta identificación del público joven.", fit: 88, angle: "Carrusel con cifras + función de detección de gastos de la app." },
          ]
        : [
            { topic: "Rediseño de logos famosos", why: "Formato viral entre diseñadores en Reels.", fit: 90, angle: "Rediseñar marcas locales conocidas en tu ciudad." },
            { topic: "Branding para emprendedores", why: "Mucha búsqueda de pymes que empiezan.", fit: 87, angle: "Consejos rápidos + oferta de revisión gratis." },
          ],
      discarded: lox
        ? [
            { topic: "Criptomonedas y trading", reason: "Va contra el perfil: Loxita evita inversiones especulativas y promesas de riqueza rápida." },
            { topic: "«Cómo me hice millonario a los 25»", reason: "Promesa poco creíble para el público y fuera del tono responsable de la marca." },
          ]
        : [{ topic: "Memes de clientes difíciles", reason: "Puede alejar a clientes potenciales; no encaja con un tono profesional." }],
      ideas,
      notes: "",
      warnings: [],
    };
    r.status = "done";
    r.step = "";
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
      accounts: db.accounts, posts: db.posts, proposals: db.proposals.slice(0, 100), research: db.research.slice(0, 30), activity: db.activity.slice(0, 40),
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
      if (Array.isArray(b.media) && b.media.length) {
        p.media = b.media;
        p.type = b.media.length === 1 && b.media[0].mime.startsWith("video/") ? "REELS" : b.media.length > 1 ? "CAROUSEL" : "IMAGE";
        changed = true;
      }
      p.checks = validatePost(p);
      if (changed && ["approved", "scheduled", "rejected", "failed"].includes(p.status)) {
        p.status = "review";
        p.scheduledAt = null;
        hist(p, "Editado: vuelve a revisión");
      }
      if (p.status === "idea" && p.media.length) {
        p.status = "review";
        hist(p, "Arte subido: pasa a revisión");
        log(`Nuevo arte para revisar: «${p.title}»`);
      }
      if (Array.isArray(b.media) && p.status === "review") fakeReview(p);
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
    ["PUT", /^\/accounts\/([^/]+)\/profile$/, (id, b) => {
      const a = db.accounts.find((x) => x.id === id);
      a.profile = { ...(a.profile || {}), ...b };
      return a;
    }],
    ["POST", /^\/accounts\/([^/]+)\/guide$/, (id, _b, opts) => {
      const a = db.accounts.find((x) => x.id === id);
      const name = decodeURIComponent((opts.headers || {})["X-Filename"] || "guia");
      a.profile = a.profile || {};
      if (/\.pdf$/i.test(name)) a.profile.guideFile = { file: "demo", name, size: 0 };
      else a.profile.guide = [a.profile.guide, `--- ${name} --- (en la demo no se lee el contenido)`].filter(Boolean).join("\n\n");
      log(`Guía de marca añadida a @${a.username}: ${name}`);
      return a;
    }],
    ["DELETE", /^\/accounts\/([^/]+)\/guide$/, (id) => {
      const a = db.accounts.find((x) => x.id === id);
      delete a.profile.guideFile;
      return a;
    }],
    ["POST", /^\/accounts\/([^/]+)\/profile\/suggest$/, async (id, b) => {
      await sleep(900);
      const base = PROFILES[id] || PROFILES.acc_dis;
      return Object.fromEntries(["about", "audience", "goals", "tone", "pillars", "cta", "avoid"].map((k) => [k, (b[k] || "").trim() || base[k]]));
    }],
    ["POST", /^\/research$/, (_, b) => {
      const split = (v, re) => String(v || "").split(/[\s,;\n]+/).map((x) => x.trim()).filter((x) => re.test(x));
      const inputs = {
        references: split(b.references, /^@?[\w.]{2,30}$/).map((u) => u.replace(/^@/, "").toLowerCase()).slice(0, 5),
        hashtags: split(b.hashtags, /^#?[\p{L}\p{N}_]{2,}$/u).map((t) => t.replace(/^#/, "").toLowerCase()).slice(0, 5),
        links: split(b.links, /^https?:\/\/\S+$/).slice(0, 10),
        ideas: b.ideas || "", images: b.images || [], webSearch: b.webSearch !== false, count: b.count || 8, feedback: b.feedback || "",
      };
      const r = makeResearch(b.accountId, inputs, false);
      r.parentId = b.parentId || null;
      db.research.unshift(r);
      const acc = db.accounts.find((a) => a.id === b.accountId);
      log(`Investigación iniciada para @${acc?.username}`);
      const steps = [...inputs.references.map((u) => `Leyendo @${u}…`), ...inputs.hashtags.map((t) => `Revisando #${t}…`), inputs.webSearch ? "Investigando en internet y analizando el contenido…" : "Analizando el contenido…"];
      steps.forEach((t, i) => setTimeout(() => { r.step = t; }, i * 1200));
      setTimeout(() => {
        finishResearch(r);
        log(`Investigación lista para @${acc?.username}: ${r.result.ideas.length} ideas`, "success");
      }, steps.length * 1200 + 1800);
      return r;
    }],
    ["POST", /^\/research\/([^/]+)\/ideas\/([^/]+)\/draft$/, (_, b, opts) => {
      const [, rid, iid] = opts.path.match(/^\/research\/([^/]+)\/ideas\/([^/]+)/);
      const r = db.research.find((x) => x.id === rid);
      const idea = r.result.ideas.find((i) => i.id === iid);
      const p = {
        id: uid("post"), title: idea.title.slice(0, 80), accountId: r.accountId,
        type: idea.format === "REEL" ? "REELS" : idea.format === "CARRUSEL" ? "CAROUSEL" : "IMAGE", media: [],
        caption: [idea.caption, idea.hashtags.join(" ")].filter(Boolean).join("\n\n"), status: "idea", scheduledAt: null, checks: [], aiReview: null,
        brief: { hook: idea.hook, outline: idea.outline, formula: idea.formula, cta: idea.cta, designNotes: idea.designNotes, format: idea.format, researchId: r.id },
        history: [], note: "", createdAt: now(),
      };
      p.checks = validatePost(p);
      hist(p, "Creado desde Investigación");
      db.posts.unshift(p);
      idea.status = "drafted";
      idea.postId = p.id;
      log(`Idea convertida en borrador: «${p.title}»`);
      return p;
    }],
    ["POST", /^\/research\/([^/]+)\/ideas\/([^/]+)\/dismiss$/, (_, b, opts) => {
      const [, rid, iid] = opts.path.match(/^\/research\/([^/]+)\/ideas\/([^/]+)/);
      db.research.find((x) => x.id === rid).result.ideas.find((i) => i.id === iid).status = "dismissed";
      return { ok: true };
    }],
    ["DELETE", /^\/research\/([^/]+)$/, (id) => {
      db.research = db.research.filter((x) => x.id !== id);
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
          const data = await fn(match[1], body, { ...opts, path });
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
