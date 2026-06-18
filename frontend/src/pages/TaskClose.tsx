import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  api,
  ApiError,
  type Campaign,
  type ProductionMode,
  type Task,
} from "../api/client";
import { Banner, Button, Card, Spinner } from "../components/ui";

const MODES: { value: ProductionMode; label: string }[] = [
  { value: "ia", label: "IA 100%" },
  { value: "hibrido", label: "Híbrido" },
  { value: "manual", label: "Manual 100%" },
];

export default function TaskClose() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!id) return;
    try {
      setCampaign(await api.getCampaign(id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al cargar la campaña.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Spinner label="Cargando tareas…" />;
  if (!campaign) return <Banner kind="error">{error ?? "Campaña no encontrada."}</Banner>;

  const closable = campaign.tasks.filter((t) => t.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Cierre de tareas · {campaign.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Registra cómo se produjo cada tarea y cuánto tiempo estimas que ahorraste.
          El dato se guarda local y se refleja en ClickUp.
        </p>
      </div>

      {error && <Banner kind="error">{error}</Banner>}

      <div className="space-y-4">
        {closable.map((task) => (
          <CloseRow key={task.id} task={task} onClosed={load} onError={setError} />
        ))}
        {closable.length === 0 && (
          <Banner kind="info">
            No hay tareas sincronizadas para cerrar. Sincroniza la campaña con ClickUp primero.
          </Banner>
        )}
      </div>

      <div className="flex justify-between border-t border-slate-200 pt-4">
        <Button variant="ghost" onClick={() => navigate("/")}>
          ← Inicio
        </Button>
        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
          Ver dashboard →
        </Button>
      </div>
    </div>
  );
}

function CloseRow({
  task,
  onClosed,
  onError,
}: {
  task: Task;
  onClosed: () => void;
  onError: (msg: string) => void;
}) {
  const existing = task.production;
  const [mode, setMode] = useState<ProductionMode>(existing?.mode ?? "hibrido");
  const [minutes, setMinutes] = useState<number>(existing?.estimatedSavedMinutes ?? 30);
  const [saving, setSaving] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const closed = task.status === "closed";

  async function save() {
    setSaving(true);
    setWarning(null);
    try {
      const res = await api.closeTask(task.id, {
        mode,
        estimatedSavedMinutes: minutes,
      });
      if (res.warning) setWarning(res.warning);
      onClosed();
    } catch (err) {
      onError(err instanceof ApiError ? err.message : "Error al cerrar la tarea.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className={closed ? "border-emerald-200 bg-emerald-50/40" : ""}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-semibold text-slate-800">{task.name}</span>
          {closed && (
            <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
              cerrada
            </span>
          )}
        </div>
        {task.clickupUrl && (
          <a
            href={task.clickupUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-indigo-600 hover:underline"
          >
            ClickUp ↗
          </a>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-sm font-medium text-slate-700">Modo de producción</p>
          <div className="flex gap-2">
            {MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                  mode === m.value
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-sm font-medium text-slate-700">
            Tiempo ahorrado:{" "}
            <span className="font-semibold text-indigo-600">{minutes} min</span>
          </p>
          <input
            type="range"
            min={0}
            max={480}
            step={5}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>0</span>
            <span>8 h</span>
          </div>
        </div>
      </div>

      {warning && (
        <div className="mt-3">
          <Banner kind="warning">{warning}</Banner>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button onClick={save} disabled={saving}>
          {saving ? "Guardando…" : closed ? "Actualizar cierre" : "Guardar cierre"}
        </Button>
      </div>
    </Card>
  );
}
