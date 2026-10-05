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
      fields: "instagram_business_account{id,username,name,profile_picture_url,followers_count}",
    });
    const found = (pages.data || []).map((p) => p.instagram_business_account).filter(Boolean);
    if (!found.length) {
      throw new InstagramError(
        "El token no tiene cuentas de Instagram profesionales vinculadas a una página de Facebook."
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
