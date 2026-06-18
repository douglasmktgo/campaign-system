import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  api,
  ApiError,
  type Campaign,
  type Priority,
  type Task,
} from "../api/client";
import { Banner, Button, Card, PriorityBadge, Spinner } from "../components/ui";

export default function TaskReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [reinterpreting, setReinterpreting] = useState(false);

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const c = await api.getCampaign(id);
      setCampaign(c);
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

  function patchTaskLocal(taskId: string, patch: Partial<Task>) {
    setCampaign((c) =>
      c
        ? { ...c, tasks: c.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)) }
        : c
    );
  }

  async function saveTask(taskId: string, patch: Parameters<typeof api.updateTask>[1]) {
    try {
      const updated = await api.updateTask(taskId, patch);
      patchTaskLocal(taskId, updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al guardar la tarea.");
    }
  }

  async function removeTask(taskId: string) {
    if (!confirm("¿Eliminar esta tarea de la propuesta?")) return;
    await api.deleteTask(taskId);
    setCampaign((c) =>
      c ? { ...c, tasks: c.tasks.filter((t) => t.id !== taskId) } : c
    );
  }

  async function addSubtask(taskId: string, name: string) {
    const sub = await api.addSubtask(taskId, name);
    setCampaign((c) =>
      c
        ? {
            ...c,
            tasks: c.tasks.map((t) =>
              t.id === taskId ? { ...t, subtasks: [...t.subtasks, sub] } : t
            ),
          }
        : c
    );
  }

  async function removeSubtask(taskId: string, subId: string) {
    await api.deleteSubtask(subId);
    setCampaign((c) =>
      c
        ? {
            ...c,
            tasks: c.tasks.map((t) =>
              t.id === taskId
                ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subId) }
                : t
            ),
          }
        : c
    );
  }

  async function handleReinterpret() {
    if (!id) return;
    if (!confirm("Reinterpretar reemplazará las tareas pendientes actuales. ¿Continuar?"))
      return;
    setReinterpreting(true);
    setError(null);
    try {
      const c = await api.interpret(id);
      setCampaign(c);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al reinterpretar.");
    } finally {
      setReinterpreting(false);
    }
  }

  async function handleSync() {
    if (!id) return;
    setSyncing(true);
    setError(null);
    try {
      const result = await api.sync(id);
      navigate(`/campaigns/${id}/sync`, { state: { result } });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al sincronizar con ClickUp.");
    } finally {
      setSyncing(false);
    }
  }

  if (loading) return <Spinner label="Cargando propuesta…" />;
  if (!campaign) return <Banner kind="error">{error ?? "Campaña no encontrada."}</Banner>;

  const pendingTasks = campaign.tasks.filter((t) => t.status === "pending");
  const alreadySynced = campaign.tasks.length > 0 && pendingTasks.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{campaign.name}</h1>
          {campaign.objective && (
            <p className="mt-1 text-sm text-slate-500">{campaign.objective}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            Estado: {campaign.status} · {campaign.tasks.length} tareas
          </p>
        </div>
        <Button variant="secondary" onClick={handleReinterpret} disabled={reinterpreting}>
          {reinterpreting ? "Reinterpretando…" : "Reinterpretar con IA"}
        </Button>
      </div>

      {error && <Banner kind="error">{error}</Banner>}

      {alreadySynced && (
        <Banner kind="info">
          Esta campaña ya fue sincronizada con ClickUp. Puedes{" "}
          <button
            className="font-semibold underline"
            onClick={() => navigate(`/campaigns/${campaign.id}/close`)}
          >
            cerrar sus tareas
          </button>
          .
        </Banner>
      )}

      <div className="space-y-4">
        {campaign.tasks.map((task) => (
          <TaskEditor
            key={task.id}
            task={task}
            onSave={(patch) => saveTask(task.id, patch)}
            onLocalChange={(patch) => patchTaskLocal(task.id, patch)}
            onDelete={() => removeTask(task.id)}
            onAddSubtask={(name) => addSubtask(task.id, name)}
            onRemoveSubtask={(subId) => removeSubtask(task.id, subId)}
          />
        ))}
        {campaign.tasks.length === 0 && (
          <Banner kind="warning">
            La IA no propuso tareas. Vuelve a la captura y ajusta el brief.
          </Banner>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
        <Button variant="ghost" onClick={() => navigate("/")}>
          ← Volver
        </Button>
        {!alreadySynced && (
          <Button onClick={handleSync} disabled={syncing || pendingTasks.length === 0}>
            {syncing ? "Enviando a ClickUp…" : "Confirmar y enviar a ClickUp"}
          </Button>
        )}
      </div>
    </div>
  );
}

function TaskEditor({
  task,
  onSave,
  onLocalChange,
  onDelete,
  onAddSubtask,
  onRemoveSubtask,
}: {
  task: Task;
  onSave: (patch: Parameters<typeof api.updateTask>[1]) => void;
  onLocalChange: (patch: Partial<Task>) => void;
  onDelete: () => void;
  onAddSubtask: (name: string) => void;
  onRemoveSubtask: (subId: string) => void;
}) {
  const [newSub, setNewSub] = useState("");
  const readOnly = task.status !== "pending";

  return (
    <Card className={task.isOptional ? "border-dashed opacity-90" : ""}>
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={task.name}
              disabled={readOnly}
              onChange={(e) => onLocalChange({ name: e.target.value })}
              onBlur={(e) => onSave({ name: e.target.value })}
              className="flex-1 min-w-[12rem] rounded-md border border-transparent px-2 py-1 text-base font-semibold text-slate-800 hover:border-slate-200 focus:border-indigo-400 focus:outline-none disabled:bg-transparent"
            />
            <PriorityBadge priority={task.priority} />
            {task.isOptional && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                opcional
              </span>
            )}
            {task.status !== "pending" && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                {task.status}
              </span>
            )}
          </div>

          {task.description !== null && (
            <textarea
              value={task.description ?? ""}
              disabled={readOnly}
              rows={2}
              onChange={(e) => onLocalChange({ description: e.target.value })}
              onBlur={(e) => onSave({ description: e.target.value })}
              className="w-full resize-y rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none disabled:bg-slate-50"
            />
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <label className="flex items-center gap-1.5 text-slate-600">
              Prioridad:
              <select
                value={task.priority}
                disabled={readOnly}
                onChange={(e) => {
                  const priority = e.target.value as Priority;
                  onLocalChange({ priority });
                  onSave({ priority });
                }}
                className="rounded-md border border-slate-300 px-2 py-1 text-sm disabled:opacity-60"
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </label>

            <label className="flex items-center gap-1.5 text-slate-600">
              Vence:
              <input
                type="date"
                value={task.dueDate ? task.dueDate.slice(0, 10) : ""}
                disabled={readOnly}
                onChange={(e) => {
                  const dueDate = e.target.value || null;
                  onLocalChange({ dueDate });
                  onSave({ dueDate });
                }}
                className="rounded-md border border-slate-300 px-2 py-1 text-sm disabled:opacity-60"
              />
            </label>

            <label className="flex items-center gap-1.5 text-slate-600">
              <input
                type="checkbox"
                checked={task.isOptional}
                disabled={readOnly}
                onChange={(e) => {
                  onLocalChange({ isOptional: e.target.checked });
                  onSave({ isOptional: e.target.checked });
                }}
              />
              Opcional
            </label>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Tags:</span>
            <input
              value={task.tags ?? ""}
              disabled={readOnly}
              placeholder="redes, video"
              onChange={(e) => onLocalChange({ tags: e.target.value })}
              onBlur={(e) =>
                onSave({
                  tags: e.target.value
                    ? e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                    : null,
                })
              }
              className="flex-1 rounded-md border border-slate-200 px-2 py-1 text-sm focus:border-indigo-400 focus:outline-none disabled:bg-slate-50"
            />
          </div>

          {/* Subtasks */}
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Subtareas
            </p>
            {task.subtasks.length === 0 && (
              <p className="text-xs text-slate-400">Sin subtareas.</p>
            )}
            <ul className="space-y-1">
              {task.subtasks.map((s) => (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">• {s.name}</span>
                  {!readOnly && (
                    <button
                      onClick={() => onRemoveSubtask(s.id)}
                      className="text-xs text-slate-400 hover:text-red-600"
                    >
                      quitar
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {!readOnly && (
              <div className="mt-2 flex gap-2">
                <input
                  value={newSub}
                  onChange={(e) => setNewSub(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newSub.trim()) {
                      onAddSubtask(newSub.trim());
                      setNewSub("");
                    }
                  }}
                  placeholder="Añadir subtarea y Enter"
                  className="flex-1 rounded-md border border-slate-200 px-2 py-1 text-sm focus:border-indigo-400 focus:outline-none"
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (newSub.trim()) {
                      onAddSubtask(newSub.trim());
                      setNewSub("");
                    }
                  }}
                >
                  +
                </Button>
              </div>
            )}
          </div>
        </div>

        {!readOnly && (
          <button
            onClick={onDelete}
            className="text-xs text-slate-400 hover:text-red-600"
            title="Eliminar tarea"
          >
            ✕
          </button>
        )}
      </div>
    </Card>
  );
}
