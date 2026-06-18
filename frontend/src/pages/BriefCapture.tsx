import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, ApiError, type Campaign } from "../api/client";
import { Banner, Button, Card, Spinner } from "../components/ui";

export default function BriefCapture() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [rawBrief, setRawBrief] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [transcriptionEnabled, setTranscriptionEnabled] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const [recent, setRecent] = useState<Campaign[]>([]);

  useEffect(() => {
    api.transcriptionConfig().then((c) => setTranscriptionEnabled(c.enabled)).catch(() => {});
    api.listCampaigns().then(setRecent).catch(() => {});
  }, []);

  async function handleInterpret() {
    setError(null);
    if (rawBrief.trim().length < 5) {
      setError("Escribe o pega un brief antes de interpretarlo.");
      return;
    }
    setBusy(true);
    try {
      setStep("Guardando el brief…");
      const campaign = await api.createBrief({
        name: name.trim() || undefined,
        rawBrief,
        sourceType: "text",
      });
      setStep("Interpretando con IA…");
      await api.interpret(campaign.id);
      navigate(`/campaigns/${campaign.id}/review`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error inesperado.");
    } finally {
      setBusy(false);
      setStep("");
    }
  }

  async function handleAudio(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setTranscribing(true);
    try {
      const { text } = await api.transcribe(file);
      setRawBrief((prev) => (prev ? `${prev}\n${text}` : text));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al transcribir.");
    } finally {
      setTranscribing(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Capturar brief de campaña</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pega el brief en texto libre y deja que la IA lo segmente en tareas priorizadas.
          Podrás revisar y editar todo antes de enviarlo a ClickUp.
        </p>
      </div>

      {error && <Banner kind="error">{error}</Banner>}

      <Card className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Nombre de la campaña <span className="text-slate-400">(opcional)</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Lanzamiento verano 2026"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Brief
          </label>
          <textarea
            value={rawBrief}
            onChange={(e) => setRawBrief(e.target.value)}
            rows={9}
            placeholder="Describe la campaña: objetivos, entregables, plazos, condicionales ('si da el tiempo…')…"
            className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="rounded-lg border border-dashed border-slate-300 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-700">Audio (opcional)</p>
              <p className="text-xs text-slate-500">
                {transcriptionEnabled
                  ? "Sube un audio y lo transcribimos al brief."
                  : "Transcripción no configurada. Define OPENAI_API_KEY en el backend para habilitarla."}
              </p>
            </div>
            <div>
              <input
                ref={fileInput}
                type="file"
                accept="audio/*"
                disabled={!transcriptionEnabled || transcribing}
                onChange={handleAudio}
                className="text-xs file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium disabled:opacity-50"
              />
            </div>
          </div>
          {transcribing && (
            <div className="mt-2">
              <Spinner label="Transcribiendo audio…" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 pt-1">
          <Button onClick={handleInterpret} disabled={busy}>
            {busy ? "Procesando…" : "Interpretar con IA"}
          </Button>
          {busy && step && <span className="text-sm text-slate-500">{step}</span>}
        </div>
      </Card>

      {recent.length > 0 && (
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Campañas recientes
          </h2>
          <ul className="divide-y divide-slate-100">
            {recent.slice(0, 8).map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between py-2.5 text-sm"
              >
                <div>
                  <span className="font-medium text-slate-700">{c.name}</span>
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                    {c.status}
                  </span>
                  <span className="ml-2 text-xs text-slate-400">
                    {c.tasks.length} tareas
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/campaigns/${c.id}/review`)}
                  >
                    Revisar
                  </Button>
                  {c.status === "synced" && (
                    <Button
                      variant="ghost"
                      onClick={() => navigate(`/campaigns/${c.id}/close`)}
                    >
                      Cerrar tareas
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
