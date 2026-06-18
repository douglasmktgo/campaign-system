import { AppError } from "../lib/httpError";
import { getSetting } from "../lib/settings";

// Wrapper around the ClickUp API v2 (REST). Auth uses a Personal API Token,
// which is sent raw in the Authorization header (no "Bearer " prefix).
const BASE_URL = "https://api.clickup.com/api/v2";

// Names of the Custom Fields the system relies on for production logging.
export const FIELD_MODE = "Modo de producción";
export const FIELD_SAVED = "Tiempo ahorrado (min)";

// Map our internal priority labels to ClickUp's numeric scale.
export const PRIORITY_MAP: Record<string, number> = {
  alta: 1,
  media: 3,
  baja: 4,
};

function getToken(): string {
  const token = getSetting("clickupApiToken");
  if (!token) {
    throw new AppError(
      500,
      "El token de ClickUp no está configurado. Ponlo en la pantalla de Configuración (o en .env)."
    );
  }
  return token;
}

interface ClickUpField {
  id: string;
  name: string;
  type: string;
  type_config?: {
    options?: { id: string; name: string; orderindex?: number }[];
  };
}

interface ClickUpTaskResponse {
  id: string;
  url: string;
  name: string;
}

// Centralized fetch with explicit, non-crashing error handling.
async function clickupFetch<T>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (err: any) {
    throw new AppError(
      502,
      `No se pudo contactar con ClickUp: ${err?.message ?? "error de red"}.`
    );
  }

  if (res.status === 401 || res.status === 403) {
    throw new AppError(
      res.status,
      "ClickUp rechazó la autenticación. Revisa CLICKUP_API_TOKEN y los permisos del Space."
    );
  }
  if (res.status === 429) {
    throw new AppError(
      429,
      "ClickUp aplicó rate limit (429). Espera unos segundos y reintenta."
    );
  }

  const text = await res.text();
  let json: any = undefined;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      // Non-JSON body; keep raw text for the error message below.
    }
  }

  if (!res.ok) {
    const msg =
      json?.err || json?.error || text || `ClickUp respondió ${res.status}.`;
    throw new AppError(res.status, `Error de ClickUp: ${msg}`);
  }

  return json as T;
}

// Create a new List directly under a Space (folderless list).
export async function createList(spaceId: string, name: string): Promise<string> {
  if (!spaceId) {
    throw new AppError(
      500,
      "CLICKUP_SPACE_ID no está configurado; no se puede crear la Lista."
    );
  }
  const data = await clickupFetch<{ id: string }>(`/space/${spaceId}/list`, {
    method: "POST",
    body: { name },
  });
  return data.id;
}

export interface CreateTaskInput {
  name: string;
  description?: string | null;
  priority?: string | null; // alta | media | baja
  dueDate?: Date | null;
  parent?: string | null;
}

// Create a task (or subtask, when `parent` is set) inside a List.
export async function createTask(
  listId: string,
  input: CreateTaskInput
): Promise<ClickUpTaskResponse> {
  const body: Record<string, unknown> = { name: input.name };
  if (input.description) body.description = input.description;
  if (input.priority && PRIORITY_MAP[input.priority] !== undefined) {
    body.priority = PRIORITY_MAP[input.priority];
  }
  if (input.dueDate) body.due_date = input.dueDate.getTime();
  if (input.parent) body.parent = input.parent;

  return clickupFetch<ClickUpTaskResponse>(`/list/${listId}/task`, {
    method: "POST",
    body,
  });
}

// Fetch the Custom Fields accessible on a List.
export async function getListCustomFields(
  listId: string
): Promise<ClickUpField[]> {
  const data = await clickupFetch<{ fields: ClickUpField[] }>(
    `/list/${listId}/field`
  );
  return data.fields ?? [];
}

export interface ResolvedFields {
  modeFieldId?: string;
  modeOptions?: Record<string, string>; // option name -> option id
  savedFieldId?: string;
  missing: string[];
}

// Locate the two Custom Fields the system depends on, by name.
// ClickUp's public API does not officially support *creating* Custom Fields,
// so when they are absent we report them as missing with a clear instruction
// (see README) rather than silently failing.
export async function resolveProductionFields(
  listId: string
): Promise<ResolvedFields> {
  const fields = await getListCustomFields(listId);
  const result: ResolvedFields = { missing: [] };

  const modeField = fields.find((f) => f.name.trim() === FIELD_MODE);
  if (modeField) {
    result.modeFieldId = modeField.id;
    result.modeOptions = {};
    for (const opt of modeField.type_config?.options ?? []) {
      result.modeOptions[opt.name.trim().toLowerCase()] = opt.id;
    }
  } else {
    result.missing.push(FIELD_MODE);
  }

  const savedField = fields.find((f) => f.name.trim() === FIELD_SAVED);
  if (savedField) {
    result.savedFieldId = savedField.id;
  } else {
    result.missing.push(FIELD_SAVED);
  }

  return result;
}

// Set a Custom Field value on a task.
export async function setTaskCustomField(
  taskId: string,
  fieldId: string,
  value: unknown
): Promise<void> {
  await clickupFetch(`/task/${taskId}/field/${fieldId}`, {
    method: "POST",
    body: { value },
  });
}
