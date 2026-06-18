import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api, ApiError, type DashboardSummary } from "../api/client";
import { Banner, Card, Spinner } from "../components/ui";

const MODE_COLORS: Record<string, string> = {
  ia: "#6366f1",
  hibrido: "#0ea5e9",
  manual: "#94a3b8",
};
const MODE_LABELS: Record<string, string> = {
  ia: "IA 100%",
  hibrido: "Híbrido",
  manual: "Manual 100%",
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .dashboard()
      .then(setData)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Error al cargar métricas.")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Cargando métricas…" />;
  if (error) return <Banner kind="error">{error}</Banner>;
  if (!data) return null;

  const pieData = data.modeDistribution
    .filter((m) => m.count > 0)
    .map((m) => ({ name: MODE_LABELS[m.mode], value: m.count, mode: m.mode }));

  const campaignData = data.savedByCampaign.map((c) => ({
    name: c.campaignName.length > 18 ? c.campaignName.slice(0, 17) + "…" : c.campaignName,
    horas: c.savedHours,
  }));

  const empty = data.totalClosedTasks === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard de productividad</h1>
        <p className="mt-1 text-sm text-slate-500">
          Métricas agregadas de las tareas cerradas.
        </p>
      </div>

      {empty && (
        <Banner kind="info">
          Aún no hay tareas cerradas. Registra cierres de producción para ver métricas.
        </Banner>
      )}

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          label="Horas ahorradas"
          value={`${data.totalSavedHours} h`}
          sub={`${data.totalSavedMinutes} min totales`}
          accent="text-indigo-600"
        />
        <Metric
          label="Tareas cerradas"
          value={`${data.totalClosedTasks}`}
          sub="con registro de producción"
          accent="text-sky-600"
        />
        <Metric
          label="Cumplimiento de plazos"
          value={`${data.deadlineCompliance.onTimePercentage}%`}
          sub={`${data.deadlineCompliance.onTime} a tiempo / ${data.deadlineCompliance.late} tarde`}
          accent="text-emerald-600"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Mode distribution */}
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Distribución por modo de producción
          </h2>
          {pieData.length === 0 ? (
            <p className="text-sm text-slate-400">Sin datos.</p>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {pieData.map((d) => (
                      <Cell key={d.mode} fill={MODE_COLORS[d.mode]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <ul className="space-y-2 text-sm">
                {data.modeDistribution.map((m) => (
                  <li key={m.mode} className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-sm"
                      style={{ backgroundColor: MODE_COLORS[m.mode] }}
                    />
                    <span className="text-slate-600">{MODE_LABELS[m.mode]}</span>
                    <span className="font-medium text-slate-800">
                      {m.percentage}% ({m.count})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        {/* Saved hours by campaign */}
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-slate-700">
            Horas ahorradas por campaña
          </h2>
          {campaignData.length === 0 ? (
            <p className="text-sm text-slate-400">Sin datos.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={campaignData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="horas" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <Card>
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accent}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-400">{sub}</p>
    </Card>
  );
}
