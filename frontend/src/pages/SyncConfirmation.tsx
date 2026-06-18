import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api, ApiError, type Campaign, type SyncResult } from "../api/client";
import { Banner, Button, Card, Spinner } from "../components/ui";

export default function SyncConfirmation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const passed = (location.state as { result?: SyncResult } | null)?.result;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(!passed);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .getCampaign(id)
      .then(setCampaign)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Error al cargar la campaña.")
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner label="Cargando resultado…" />;

  const syncedTasks = campaign?.tasks.filter((t) => t.clickupTaskId) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          ✅ Sincronizado con ClickUp
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {passed
            ? `Se crearon ${passed.createdCount} tareas en ClickUp.`
            : "Tareas enviadas a ClickUp."}
        </p>
      </div>

      {error && <Banner kind="error">{error}</Banner>}
      {passed?.warning && <Banner kind="warning">{passed.warning}</Banner>}

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Tareas creadas
        </h2>
        <ul className="divide-y divide-slate-100">
          {syncedTasks.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between py-2.5 text-sm"
            >
              <span className="font-medium text-slate-700">{t.name}</span>
              {t.clickupUrl ? (
                <a
                  href={t.clickupUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Abrir en ClickUp ↗
                </a>
              ) : (
                <span className="text-xs text-slate-400">sin enlace</span>
              )}
            </li>
          ))}
          {syncedTasks.length === 0 && (
            <li className="py-2 text-sm text-slate-400">
              No hay tareas sincronizadas todavía.
            </li>
          )}
        </ul>
      </Card>

      <div className="flex justify-between border-t border-slate-200 pt-4">
        <Button variant="ghost" onClick={() => navigate("/")}>
          ← Inicio
        </Button>
        <Button onClick={() => navigate(`/campaigns/${id}/close`)}>
          Registrar cierre de tareas →
        </Button>
      </div>
    </div>
  );
}
