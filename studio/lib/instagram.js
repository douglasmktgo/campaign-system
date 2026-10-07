// Cliente de la API oficial de Instagram (Content Publishing).
//
// Acepta dos tipos de token:
//  - "IG..."  -> Instagram API con inicio de sesión de Instagram (graph.instagram.com).
//                No requiere página de Facebook. Es la opción más sencilla.
//  - "EAA..." -> Instagram API con inicio de sesión de Facebook (graph.facebook.com).
//                La cuenta de Instagram debe estar vinculada a una página de Facebook.
//
// Las cuentas "demo" simulan todo el flujo sin tocar Instagram, para probar la app.

const VERSION = process.env.IG_API_VERSION || "v23.0";

export class InstagramError extends Error {}

function hostFor(token) {
  return token.startsWith("EAA") ? "https://graph.facebook.com" : "https://graph.instagram.com";
}

async function call(token, method, pathname, params = {}) {
  const url = new URL(`${hostFor(token)}/${VERSION}/${pathname}`);
  const body = new URLSearchParams({ ...params, access_token: token });
  let res;
  try {
    if (method === "GET") {
      body.forEach((v, k) => url.searchParams.set(k, v));
      res = await fetch(url);
    } else {
      res = await fetch(url, { method, body });
    }
  } catch (e) {
    throw new InstagramError("No se pudo contactar con Instagram: " + e.message);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    const msg = data.error?.error_user_msg || data.error?.message || `HTTP ${res.status}`;
    if (data.error?.code === 190) throw new InstagramError("El token caducó o no es válido. Vuelve a conectar la cuenta.");
    throw new InstagramError(msg);
  }
  return data;
}

// Devuelve las cuentas de Instagram a las que da acceso un token.
export async function discoverAccounts(token) {
  token = token.trim();
  if (token.startsWith("EAA")) {
    const pages = await call(token, "GET", "me/accounts", {
      fields: "name,instagram_business_account{id,username,name,profile_picture_url,followers_count}",
    });
    const found = (pages.data || []).map((p) => p.instagram_business_account).filter(Boolean);
    if (!found.length) {
      const names = (pages.data || []).map((p) => p.name).filter(Boolean);
      throw new InstagramError(
        names.length
          ? `El token ve tus páginas (${names.join(", ")}), pero ninguna tiene una cuenta de Instagram profesional vinculada. ` +
              "Vincúlala en Meta Business Suite → Configuración → Perfiles → tu página → Conectar Instagram, " +
              "y vuelve a generar el token marcando también la cuenta de Instagram."
          : "El token no ve ninguna página de Facebook. Al generarlo, marca tu página y tu cuenta de Instagram."
      );
    }
    return found.map((a) => ({
      igUserId: a.id,
      username: a.username,
      name: a.name || a.username,
      avatar: a.profile_picture_url || "",
      followers: a.followers_count ?? null,
    }));
  }
  const me = await call(token, "GET", "me", {
    fields: "user_id,username,name,profile_picture_url,account_type,followers_count",
  });
  if (me.account_type && !["BUSINESS", "MEDIA_CREATOR", "CREATOR"].includes(me.account_type)) {
    throw new InstagramError("La cuenta debe ser profesional (Empresa o Creador) para publicar por API.");
  }
  return [
    {
      igUserId: me.user_id || me.id,
      username: me.username,
      name: me.name || me.username,
      avatar: me.profile_picture_url || "",
      followers: me.followers_count ?? null,
    },
  ];
}

// Los tokens de Instagram (IG…) de larga duración se pueden renovar sin la clave secreta de la app;
// los de Facebook (EAA…) no: hay que generar uno nuevo antes de que caduquen (60 días).
export const canRefresh = (account) => Boolean(account.token) && !account.token.startsWith("EAA");

export async function refreshToken(token) {
  const url = new URL("https://graph.instagram.com/refresh_access_token");
  url.searchParams.set("grant_type", "ig_refresh_token");
  url.searchParams.set("access_token", token);
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) throw new InstagramError(data.error?.message || "No se pudo renovar el token de Instagram.");
  return data.access_token;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Espera a que Instagram termine de procesar un contenedor (obligatorio en vídeos).
async function waitReady(token, containerId) {
  for (let i = 0; i < 60; i++) {
    const s = await call(token, "GET", containerId, { fields: "status_code,status" });
    if (s.status_code === "FINISHED") return;
    if (s.status_code === "ERROR" || s.status_code === "EXPIRED") {
      throw new InstagramError("Instagram no pudo procesar el archivo: " + (s.status || s.status_code));
    }
    await sleep(5000);
  }
  throw new InstagramError("Instagram tardó demasiado en procesar el archivo.");
}

// Publica un arte. `mediaUrls` deben ser URLs públicas (https) que Instagram pueda descargar.
export async function publish(account, post, mediaUrls) {
  if (account.demo) {
    await sleep(1200);
    return { mediaId: "demo_" + Date.now(), permalink: null };
  }
  const { token, igUserId } = account;
  const caption = post.caption || "";
  let creationId;

  if (post.type === "REELS") {
    const c = await call(token, "POST", `${igUserId}/media`, {
      media_type: "REELS",
      video_url: mediaUrls[0],
      caption,
      share_to_feed: "true",
    });
    creationId = c.id;
  } else if (post.type === "CAROUSEL") {
    const children = [];
    for (let i = 0; i < mediaUrls.length; i++) {
      const isVideo = post.media[i].mime.startsWith("video/");
      const c = await call(token, "POST", `${igUserId}/media`, {
        is_carousel_item: "true",
        ...(isVideo ? { media_type: "VIDEO", video_url: mediaUrls[i] } : { image_url: mediaUrls[i] }),
      });
      children.push(c.id);
    }
    for (const child of children) await waitReady(token, child);
    const c = await call(token, "POST", `${igUserId}/media`, {
      media_type: "CAROUSEL",
      children: children.join(","),
      caption,
    });
    creationId = c.id;
  } else {
    const c = await call(token, "POST", `${igUserId}/media`, { image_url: mediaUrls[0], caption });
    creationId = c.id;
  }

  await waitReady(token, creationId);
  const published = await call(token, "POST", `${igUserId}/media_publish`, { creation_id: creationId });
  let permalink = null;
  try {
    permalink = (await call(token, "GET", published.id, { fields: "permalink" })).permalink || null;
  } catch {
    // El permalink es opcional; la publicación ya está hecha.
  }
  return { mediaId: published.id, permalink };
}

// ---------------------------------------------------------------- investigación

const MEDIA_FIELDS = "caption,like_count,comments_count,media_type,media_product_type,permalink,timestamp";

// Resume una lista de publicaciones: ordena por interacción y marca cuántas veces supera la mediana.
export function rankMedia(list) {
  const items = (list || []).map((m) => ({
    caption: (m.caption || "").slice(0, 600),
    likes: m.like_count ?? null,
    comments: m.comments_count ?? null,
    format: m.media_product_type === "REELS" ? "REEL" : m.media_type === "CAROUSEL_ALBUM" ? "CARRUSEL" : m.media_type === "VIDEO" ? "VIDEO" : "POST",
    permalink: m.permalink || "",
    date: m.timestamp || "",
    engagement: (m.like_count || 0) + 2 * (m.comments_count || 0),
  }));
  const sorted = [...items].map((x) => x.engagement).sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] || 1 : 1;
  for (const x of items) x.timesMedian = Math.round((x.engagement / Math.max(median, 1)) * 10) / 10;
  return { median, top: [...items].sort((a, b) => b.engagement - a.engagement).slice(0, 12), count: items.length };
}

// Publicaciones recientes de una cuenta conectada (funciona con los dos tipos de token).
export async function ownMedia(account) {
  if (account.demo) return null;
  const data = await call(account.token, "GET", `${account.igUserId}/media`, { fields: MEDIA_FIELDS, limit: "50" });
  return rankMedia(data.data);
}

export const canDiscover = (account) => !account.demo && account.token.startsWith("EAA");

// Datos públicos de otra cuenta profesional (Business Discovery). Solo con token de Facebook (EAA…).
export async function discoverProfile(account, username) {
  const u = username.replace(/^@/, "").trim();
  const data = await call(account.token, "GET", account.igUserId, {
    fields: `business_discovery.username(${u}){username,name,biography,followers_count,media_count,media.limit(50){${MEDIA_FIELDS}}}`,
  });
  const bd = data.business_discovery || {};
  return {
    username: bd.username || u,
    name: bd.name || "",
    bio: bd.biography || "",
    followers: bd.followers_count ?? null,
    posts: bd.media_count ?? null,
    ...rankMedia(bd.media?.data),
  };
}

// Publicaciones más populares de un hashtag (límite de Instagram: 30 hashtags distintos cada 7 días).
export async function hashtagTop(account, tag) {
  const q = tag.replace(/^#/, "").trim();
  const found = await call(account.token, "GET", "ig_hashtag_search", { user_id: account.igUserId, q });
  const id = found.data?.[0]?.id;
  if (!id) return { tag: q, top: [], count: 0, median: 0 };
  const media = await call(account.token, "GET", `${id}/top_media`, { user_id: account.igUserId, fields: MEDIA_FIELDS, limit: "30" });
  return { tag: q, ...rankMedia(media.data) };
}
