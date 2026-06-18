// Typed API client for the backend. All requests go through "/api",
// which Vite proxies to the Express server in dev.

export type Priority = "alta" | "media" | "baja";
export type TaskStatus = "pending" | "synced" | "closed";
export type ProductionMode = "ia" | "hibrido" | "manual";

export interface Subtask {
  id: string;
  taskId: string;
  name: string;
  clickupTaskId: string | null;
  status: string;
}

export interface ProductionLog {
  id: string;
  taskId: string;
  mode: ProductionMode;
  estimatedSavedMinutes: number;
  actualMinutes: number | null;
  closedAt: string;
}

export interface Task {
  id: string;
  campaignId: string;
  name: string;
  description: string | null;
  priority: Priority;
  isOptional: boolean;
  dueDate: string | null;
  tags: string | null;
  clickupTaskId: string | null;
  clickupUrl: string | null;
  status: TaskStatus;
  subtasks: Subtask[];
  production: ProductionLog | null;
}

export interface Campaign {
  id: string;
  name: string;
  objective: string | null;
  sourceType: string;
  rawBrief: string;
  status: "draft" | "reviewed" | "synced";
  clickupListId: string | null;
  createdAt: string;
  tasks: Task[];
}

export interface SyncResult {
  campaignId: string;
  clickupListId: string;
  createdCount: number;
  created: { id: string; name: string; clickupUrl: string }[];
  warning: string | null;
}

export interface DashboardSummary {
  totalSavedMinutes: number;
  totalSavedHours: number;
  totalClosedTasks: number;
  modeDistribution: { mode: ProductionMode; count: number; percentage: number }[];
  savedByCampaign: {
    campaignId: string;
    campaignName: string;
    tasks: number;
    savedMinutes: number;
    savedHours: number;
  }[];
  deadlineCompliance: {
    onTime: number;
    late: number;
    withDueDate: number;
    onTimePercentage: number;
  };
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
      ...options,
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor backend (¿está corriendo en :4000?).");
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const message = data?.error ?? `Error ${res.status}`;
    throw new ApiError(res.status, message);
  }
  return data as T;
}

export const api = {
  // Briefs / campaigns
  listCampaigns: () => request<Campaign[]>("/briefs"),
  getCampaign: (id: string) => request<Campaign>(`/briefs/${id}`),
  createBrief: (input: { name?: string; rawBrief: string; sourceType?: string }) =>
    request<Campaign>("/briefs", { method: "POST", body: JSON.stringify(input) }),
  interpret: (id: string) =>
    request<Campaign>(`/briefs/${id}/interpret`, { method: "POST" }),
  transcriptionConfig: () =>
    request<{ enabled: boolean }>("/briefs/config/transcription"),
  transcribe: async (file: File) => {
    const form = new FormData();
    form.append("audio", file);
    const res = await fetch("/api/briefs/transcribe", { method: "POST", body: form });
    const text = await res.text();
    const data = text ? JSON.parse(text) : undefined;
    if (!res.ok) throw new ApiError(res.status, data?.error ?? "Error al transcribir.");
    return data as { text: string };
  },

  // Tasks
  updateTask: (
    id: string,
    patch: Partial<{
      name: string;
      description: string | null;
      priority: Priority;
      isOptional: boolean;
      dueDate: string | null;
      tags: string[] | null;
    }>
  ) => request<Task>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  deleteTask: (id: string) => request<void>(`/tasks/${id}`, { method: "DELETE" }),
  addSubtask: (taskId: string, name: string) =>
    request<Subtask>(`/tasks/${taskId}/subtasks`, {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  deleteSubtask: (subId: string) =>
    request<void>(`/tasks/subtasks/${subId}`, { method: "DELETE" }),

  // ClickUp
  sync: (campaignId: string) =>
    request<SyncResult>(`/clickup/sync/${campaignId}`, { method: "POST" }),

  // Production
  closeTask: (
    taskId: string,
    input: { mode: ProductionMode; estimatedSavedMinutes: number; actualMinutes?: number }
  ) =>
    request<{ productionLog: ProductionLog; warning: string | null }>(
      `/production/${taskId}`,
      { method: "POST", body: JSON.stringify(input) }
    ),

  // Dashboard
  dashboard: () => request<DashboardSummary>("/dashboard/summary"),
};
