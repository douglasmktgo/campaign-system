// Validación automática de un arte contra los requisitos de publicación de Instagram.
// Devuelve una lista de comprobaciones { level: "ok" | "warn" | "error", text, fix? }.
// Un arte con algún "error" no se puede aprobar hasta corregirlo.
// `fix: "adapt"` indica que la interfaz puede corregirlo sola (adaptar a la medida recomendada).

const MB = 1024 * 1024;

// Medidas que acepta la API de publicación de Instagram (la app permite algo más, la API no).
export const FORMATS = {
  portrait: { label: "Vertical 4:5", width: 1080, height: 1350 },
  square: { label: "Cuadrado 1:1", width: 1080, height: 1080 },
  landscape: { label: "Horizontal 1.91:1", width: 1080, height: 566 },
  reel: { label: "Reel 9:16", width: 1080, height: 1920 },
};
// Por API el carrusel admite 10 archivos (la app de Instagram permite 20, pero no se pueden publicar así por API).
export const CAROUSEL_MAX = 10;

const MIN_RATIO = 0.8; // 4:5
const MAX_RATIO = 1.91;

// Publicando a mano (desde la app de Instagram) valen PNG y el vertical 3:4 (1080×1440 / 1080×1450).
const isThreeFour = (r) => r >= 0.73 && r < MIN_RATIO - 0.01;

function imageChecks(m, i, multi, manual) {
  const label = multi ? `Imagen ${i + 1}: ` : "";
  const out = [];
  if (m.mime !== "image/jpeg" && !manual) {
    out.push({ level: "error", text: `${label}Instagram solo publica imágenes JPEG.`, fix: "adapt" });
  }
  if (m.size > 8 * MB) {
    out.push({ level: "error", text: `${label}pesa ${(m.size / MB).toFixed(1)} MB; el máximo es 8 MB.`, fix: "adapt" });
  }
  if (m.width && m.height) {
    const ratio = m.width / m.height;
    const size = `${m.width}×${m.height}`;
    if (manual && isThreeFour(ratio)) {
      // vertical 3:4: válido publicando a mano (la API lo recortaría a 4:5)
    } else if (ratio < MIN_RATIO - 0.01) {
      const hint = ratio >= 0.72 ? " (formato 3:4, como 1080×1440 o 1080×1450)" : "";
      out.push({
        level: "error",
        text: `${label}mide ${size}${hint}: es más alta de lo que permite Instagram por API (máximo vertical 4:5). Adáptala a 1080×1350.`,
        fix: "adapt",
      });
    } else if (ratio > MAX_RATIO + 0.01) {
      out.push({ level: "error", text: `${label}mide ${size}: es más ancha de lo permitido (máximo 1.91:1, p. ej. 1080×566).`, fix: "adapt" });
    } else if (m.width < 1080) {
      out.push({ level: "warn", text: `${label}${size}; se recomienda 1080 px de ancho (vertical: 1080×1350).`, fix: "adapt" });
    } else if (!multi && Math.abs(ratio - MIN_RATIO) > 0.01) {
      out.push({ level: "warn", text: `${label}${size}. El formato vertical 1080×1350 ocupa más pantalla y suele rendir mejor.` });
    }
    if (m.width < 320) out.push({ level: "error", text: `${label}demasiado pequeña (mínimo 320 px de ancho).` });
  }
  return out;
}

function videoChecks(m, i, multi) {
  const label = multi ? `Vídeo ${i + 1}: ` : "";
  const out = [];
  if (!["video/mp4", "video/quicktime"].includes(m.mime)) {
    out.push({ level: "error", text: `${label}el vídeo debe ser MP4 o MOV.` });
  }
  if (m.size > 300 * MB) out.push({ level: "error", text: `${label}pesa más de 300 MB.` });
  if (m.duration) {
    if (m.duration < 3) out.push({ level: "error", text: `${label}dura menos de 3 segundos.` });
    if (m.duration > 15 * 60) out.push({ level: "error", text: `${label}dura más de 15 minutos.` });
    if (multi && m.duration > 60) out.push({ level: "error", text: `${label}en un carrusel cada vídeo debe durar 60 s o menos.` });
  }
  if (m.width && m.height && !multi) {
    const ratio = m.width / m.height;
    if (Math.abs(ratio - 9 / 16) > 0.02) {
      out.push({ level: "warn", text: `${label}mide ${m.width}×${m.height}. Los Reels se ven a pantalla completa en vertical 9:16 (1080×1920).` });
    }
  }
  return out;
}

// `manual: true` = se publica a mano desde la app de Instagram (sin API): PNG y 3:4 son válidos.
export function validatePost(post, { manual = false } = {}) {
  const checks = [];
  const media = post.media || [];

  if (!post.accountId) checks.push({ level: "error", text: "Elige la cuenta de Instagram donde se publicará." });
  if (!media.length) checks.push({ level: "error", text: "Falta el arte: sube la imagen o el vídeo." });
  if (post.type === "CAROUSEL") {
    if (media.length < 2) checks.push({ level: "error", text: "Un carrusel lleva al menos 2 archivos." });
    if (media.length > CAROUSEL_MAX) {
      checks.push({
        level: "error",
        text: `Tiene ${media.length} archivos. Por API Instagram permite máximo ${CAROUSEL_MAX} por carrusel (los 20 de la app solo valen publicando a mano). Divídelo en dos carruseles.`,
      });
    }
    // Instagram recorta todas las diapositivas a la proporción de la primera.
    const first = media.find((m) => m.width && m.height);
    if (first) {
      const r0 = first.width / first.height;
      const odd = media.map((m, i) => (m.width && m.height && Math.abs(m.width / m.height - r0) > 0.02 ? i + 1 : 0)).filter(Boolean);
      if (odd.length) {
        checks.push({
          level: "warn",
          text: `Las diapositivas ${odd.join(", ")} tienen otra proporción: Instagram las recortará a la de la primera (${first.width}×${first.height}). Usa la misma medida en todas.`,
          fix: "adapt",
        });
      }
    }
  }

  const multi = media.length > 1;
  media.forEach((m, i) => {
    checks.push(...(m.mime.startsWith("video/") ? videoChecks(m, i, multi) : imageChecks(m, i, multi, manual)));
  });

  const caption = post.caption || "";
  const hashtags = caption.match(/#[\p{L}\p{N}_]+/gu) || [];
  const mentions = caption.match(/@[\w.]+/g) || [];
  if (!caption.trim()) checks.push({ level: "warn", text: "El texto (copy) está vacío." });
  if (caption.length > 2200) checks.push({ level: "error", text: `El texto tiene ${caption.length} caracteres; el máximo es 2.200.` });
  if (hashtags.length > 30) checks.push({ level: "error", text: `Tiene ${hashtags.length} hashtags; el máximo es 30.` });
  if (mentions.length > 20) checks.push({ level: "error", text: `Tiene ${mentions.length} menciones; el máximo es 20.` });

  if (!checks.some((c) => c.level !== "ok")) {
    checks.push({ level: "ok", text: "Cumple todos los requisitos de Instagram." });
  }
  return checks;
}

export function hasErrors(checks) {
  return checks.some((c) => c.level === "error");
}
