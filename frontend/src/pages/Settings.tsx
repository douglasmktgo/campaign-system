import { useEffect, useState } from "react";
import {
  api,
  ApiError,
  type SettingsStatus,
  type SettingsTestResult,
} from "../api/client";
import { Banner, Button, Card, Spinner } from "../components/ui";

export default function Settings() {
  const [status, setStatus] = useState<SettingsStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [test, setTest] = useState<SettingsTestResult | null>(null);

  // Campos secretos: vacío = no cambiar. Los IDs sí se prellenan.
  const [anthropicApiKey, setAnthropicApiKey] = useState("");
  const [clickupApiToken, setClickupApiToken] = useState("");
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [clickupSpaceId, setClickupSpaceId] = useState("");
  const [clickupListId, setClickupListId] = useState("");

  async function load() {
    setLoading(true);
    try {
      const s = await api.getSettings();
      setStatus(s);
      setClickupSpaceId(s.clickupSpaceId ?? "");
      setClickupListId(s.clickupListId ?? "");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al cargar la configuración.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    setTest(null);
    try {
      const payload: Record<string, string> = {
        clickupSpaceId,
        clickupListId,
      };
      // Solo enviamos secretos si el usuario escribió algo nuevo.
      if (anthropicApiKey.trim()) payload.anthropicApiKey = anthropicApiKey.trim();
      if (clickupApiToken.trim()) payload.clickupApiToken = clickupApiToken.trim();
      if (openaiApiKey.trim()) payload.openaiApiKey = openaiApiKey.trim();

      const s = await api.saveSettings(payload);
      setStatus(s);
      setAnthropicApiKey("");
      setClickupApiToken("");
      setOpenaiApiKey("");
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    setTesting(true);
    setError(null);
    setTest(null);
    try {
      setTest(await api.testSettings());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al probar la conexión.");
    } finally {
      setTesting(false);
    }
  }

  if (loading) return <Spinner label="Cargando configuración…" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Configuración</h1>
        <p className="mt-1 text-sm text-slate-500">
          Vincula aquí tus API keys. Se guardan localmente (fuera de git) y la app las usa
          automáticamente. No necesitas editar archivos.
        </p>
      </div>

      {error && <Banner kind="error">{error}</Banner>}
      {saved && <Banner kind="success">Configuración guardada.</Banner>}

      <Card className="space-y-5">
        <Field
          label="Anthropic API key"
          hint="Para interpretar el brief con IA. Empieza por sk-ant-…"
          configured={status?.anthropicConfigured}
          configuredHint={status?.anthropicHint}
          type="password"
          value={anthropicApiKey}
          onChange={setAnthropicApiKey}
          placeholder={status?.anthropicConfigured ? "•••• guardada — deja vacío para no cambiar" : "sk-ant-..."}
        />

        <Field
          label="ClickUp · Personal API Token"
          hint="Para sincronizar tareas. Empieza por pk_…"
          configured={status?.clickupTokenConfigured}
          configuredHint={status?.clickupTokenHint}
          type="password"
          value={clickupApiToken}
          onChange={setClickupApiToken}
          placeholder={status?.clickupTokenConfigured ? "•••• guardado — deja vacío para no cambiar" : "pk_..."}
        />

        <Field
          label="ClickUp · Space ID"
          hint="ID del Space donde se crean las Listas de campaña."
          type="text"
          value={clickupSpaceId}
          onChange={setClickupSpaceId}
          placeholder="Ej: 90123456"
        />

        <Field
          label="ClickUp · List ID (opcional)"
          hint="Lista por defecto si no quieres crear una nueva por campaña."
          type="text"
          value={clickupListId}
          onChange={setClickupListId}
          placeholder="Opcional"
        />

        <Field
          label="OpenAI API key (opcional)"
          hint="Solo si quieres habilitar la transcripción de audio (Whisper)."
          configured={status?.openaiConfigured}
          type="password"
          value={openaiApiKey}
          onChange={setOpenaiApiKey}
          placeholder={status?.openaiConfigured ? "•••• guardada — deja vacío para no cambiar" : "sk-..."}
        />

        <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando…" : "Guardar"}
          </Button>
          <Button variant="secondary" onClick={handleTest} disabled={testing}>
            {testing ? "Probando…" : "Probar conexión"}
          </Button>
        </div>

        {test && (
          <div className="space-y-2">
            <TestRow label="Anthropic" ok={test.anthropic.ok} message={test.anthropic.message} />
            <TestRow label="ClickUp" ok={test.clickup.ok} message={test.clickup.message} />
          </div>
        )}
      </Card>
    </div>
  );
}

function Field({
  label,
  hint,
  configured,
  configuredHint,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint: string;
  configured?: boolean;
  configuredHint?: string | null;
  type: "text" | "password";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        {configured && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
            configurada{configuredHint ? ` ··· ${configuredHint}` : ""}
          </span>
        )}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    </div>
  );
}

function TestRow({ label, ok, message }: { label: string; ok: boolean; message: string }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
        ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <span className="font-semibold">{ok ? "✓" : "✕"} {label}:</span>
      <span>{message}</span>
    </div>
  );
}
