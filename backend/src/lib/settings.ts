import fs from "fs";
import path from "path";

// Configuración de credenciales editable desde la UI.
//
// Las keys se guardan en backend/config.local.json (ignorado por git). Si una
// key no está en el archivo, se usa como respaldo la variable de entorno (.env).
// Así funciona tanto si las pones por la pantalla de Configuración como por .env.

const CONFIG_PATH = path.join(__dirname, "..", "..", "config.local.json");

// Claves soportadas → nombre de su variable de entorno de respaldo.
export const SETTING_KEYS = {
  anthropicApiKey: "ANTHROPIC_API_KEY",
  clickupApiToken: "CLICKUP_API_TOKEN",
  clickupSpaceId: "CLICKUP_SPACE_ID",
  clickupListId: "CLICKUP_LIST_ID",
  openaiApiKey: "OPENAI_API_KEY",
} as const;

export type SettingKey = keyof typeof SETTING_KEYS;

type StoredConfig = Partial<Record<SettingKey, string>>;

function readFile(): StoredConfig {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeFile(config: StoredConfig): void {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
}

/**
 * Devuelve el valor de una credencial: primero del archivo de configuración,
 * y si no, de la variable de entorno (.env). Vacío => undefined.
 */
export function getSetting(key: SettingKey): string | undefined {
  const fromFile = readFile()[key];
  if (fromFile && fromFile.trim()) return fromFile.trim();
  const fromEnv = process.env[SETTING_KEYS[key]];
  return fromEnv && fromEnv.trim() ? fromEnv.trim() : undefined;
}

/**
 * Guarda/actualiza credenciales. Una cadena vacía borra la del archivo
 * (volviendo a usar el respaldo de .env si existe). `undefined` no toca la clave.
 */
export function saveSettings(updates: Partial<Record<SettingKey, string>>): void {
  const config = readFile();
  for (const key of Object.keys(updates) as SettingKey[]) {
    if (!(key in SETTING_KEYS)) continue;
    const value = updates[key];
    if (value === undefined) continue;
    if (value.trim() === "") {
      delete config[key];
    } else {
      config[key] = value.trim();
    }
  }
  writeFile(config);
}

// Últimos 4 caracteres de un secreto, para mostrar sin exponerlo entero.
function last4(v?: string): string | null {
  return v && v.length >= 4 ? v.slice(-4) : v ? "••" : null;
}

/**
 * Estado para la UI. NUNCA devuelve los secretos completos: solo si están
 * configurados y una pista (últimos 4). Los IDs (no secretos) sí se devuelven.
 */
export function getSettingsStatus() {
  const anthropic = getSetting("anthropicApiKey");
  const clickupToken = getSetting("clickupApiToken");
  const openai = getSetting("openaiApiKey");
  return {
    anthropicConfigured: Boolean(anthropic),
    anthropicHint: last4(anthropic),
    clickupTokenConfigured: Boolean(clickupToken),
    clickupTokenHint: last4(clickupToken),
    clickupSpaceId: getSetting("clickupSpaceId") ?? null,
    clickupListId: getSetting("clickupListId") ?? null,
    openaiConfigured: Boolean(openai),
  };
}
