// Validación automática de un arte contra los requisitos de publicación de Instagram.
// Devuelve una lista de comprobaciones { level: "ok" | "warn" | "error", text }.
// Un arte con algún "error" no se puede aprobar hasta corregirlo.

const MB = 1024 * 1024;

function imageChecks(m, i, multi) {
  const label = multi ? `Imagen ${i + 1}: ` : "";
  const out = [];
  if (m.mime !== "image/jpeg") {
    out.push({ level: "error", text: `${label}Instagram solo publica imágenes JPEG.` });
  }
  if (m.size > 8 * MB) {
    out.push({ level: "error", text: `${label}pesa ${(m.size / MB).toFixed(1)} MB; el máximo es 8 MB.` });
  }
  if (m.width && m.height) {
    const ratio = m.width / m.height;
    if (ratio < 0.8 - 0.01 || ratio > 1.91 + 0.01) {
      out.push({
        level: "error",
        text: `${label}proporción ${ratio.toFixed(2)}:1 fuera de rango (de 4:5 a 1.91:1).`,
      });
    } else if (m.width < 1080) {
      out.push({ level: "warn", text: `${label}${m.width}px de ancho; se recomienda 1080px para máxima nitidez.` });
    }
    if (m.width < 320) out.push({ level: "error", text: `${label}demasiado pequeña (mínimo 320px de ancho).` });
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
      out.push({ level: "warn", text: `${label}los Reels se ven mejor en vertical 9:16 (1080×1920).` });
    }
  }
  return out;
}

export function validatePost(post) {
  const checks = [];
  const media = post.media || [];

  if (!post.accountId) checks.push({ level: "error", text: "Elige la cuenta de Instagram donde se publicará." });
  if (!media.length) checks.push({ level: "error", text: "Sube al menos un archivo." });
  if (post.type === "CAROUSEL" && (media.length < 2 || media.length > 10)) {
    checks.push({ level: "error", text: "Un carrusel lleva entre 2 y 10 archivos." });
  }

  const multi = media.length > 1;
  media.forEach((m, i) => {
    checks.push(...(m.mime.startsWith("video/") ? videoChecks(m, i, multi) : imageChecks(m, i, multi)));
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
