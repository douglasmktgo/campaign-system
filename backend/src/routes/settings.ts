import { Router } from "express";
import { z } from "zod";
import { AppError, asyncHandler } from "../lib/httpError";
import { getSetting, getSettingsStatus, saveSettings } from "../lib/settings";

export const settingsRouter = Router();

// Estado actual (sin exponer secretos completos).
settingsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(getSettingsStatus());
  })
);

const saveSchema = z.object({
  anthropicApiKey: z.string().optional(),
  clickupApiToken: z.string().optional(),
  clickupSpaceId: z.string().optional(),
  clickupListId: z.string().optional(),
  openaiApiKey: z.string().optional(),
});

// Guardar/actualizar credenciales. Cadena vacía borra; campo ausente no toca.
settingsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = saveSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, "Datos de configuración inválidos.");
    }
    saveSettings(parsed.data);
    res.json(getSettingsStatus());
  })
);

// Probar las conexiones con las credenciales guardadas.
settingsRouter.post(
  "/test",
  asyncHandler(async (_req, res) => {
    const result: {
      anthropic: { ok: boolean; message: string };
      clickup: { ok: boolean; message: string };
    } = {
      anthropic: { ok: false, message: "No configurada." },
      clickup: { ok: false, message: "No configurado." },
    };

    // --- Anthropic: llamada mínima para validar la key ---
    const anthropicKey = getSetting("anthropicApiKey");
    if (anthropicKey) {
      try {
        const r = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 1,
            messages: [{ role: "user", content: "hi" }],
          }),
        });
        if (r.ok) {
          result.anthropic = { ok: true, message: "Conexión correcta." };
        } else {
          const body = await r.json().catch(() => ({} as any));
          const msg = body?.error?.message || `HTTP ${r.status}`;
          result.anthropic = { ok: false, message: `Falló: ${msg}` };
        }
      } catch (err: any) {
        result.anthropic = {
          ok: false,
          message: `Error de red: ${err?.message ?? "desconocido"}`,
        };
      }
    }

    // --- ClickUp: GET /user valida el token ---
    const clickupToken = getSetting("clickupApiToken");
    if (clickupToken) {
      try {
        const r = await fetch("https://api.clickup.com/api/v2/user", {
          headers: { Authorization: clickupToken },
        });
        if (r.ok) {
          const body = (await r.json()) as { user?: { username?: string } };
          const name = body?.user?.username ?? "usuario";
          result.clickup = { ok: true, message: `Conectado como ${name}.` };
        } else if (r.status === 401) {
          result.clickup = { ok: false, message: "Token inválido (401)." };
        } else {
          result.clickup = { ok: false, message: `Falló: HTTP ${r.status}` };
        }
      } catch (err: any) {
        result.clickup = {
          ok: false,
          message: `Error de red: ${err?.message ?? "desconocido"}`,
        };
      }
    }

    res.json(result);
  })
);
