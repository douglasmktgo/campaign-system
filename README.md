# Campaign System — Captura de campañas con IA + ClickUp + Dashboard

Aplicación web **local** (localhost) para que un diseñador:

1. Pegue o transcriba el brief de una campaña (texto libre).
2. Pida a un modelo de IA que lo segmente en tareas y subtareas priorizadas.
3. Revise y edite la propuesta antes de confirmarla.
4. Sincronice las tareas confirmadas con **ClickUp** vía su API oficial.
5. Al cerrar cada tarea, registre el modo de producción (IA / híbrido / manual) y el tiempo ahorrado.
6. Vea un **dashboard** con métricas agregadas.

---

## Stack

| Capa        | Tecnología |
|-------------|------------|
| Frontend    | React + Vite + TypeScript + Tailwind CSS + recharts |
| Backend     | Node.js + Express + TypeScript |
| Base de datos | SQLite vía Prisma ORM (un solo archivo `dev.db`, sin servidor aparte) |
| IA          | Anthropic API — modelo `claude-sonnet-4-6` con **tool use** para forzar JSON válido |
| Transcripción | Stub configurable (OpenAI Whisper `whisper-1`); desactivado hasta definir `OPENAI_API_KEY` |
| Integración | ClickUp API v2 (REST, Personal API Token) |

---

## Requisitos previos

- **Node.js 18 o superior** (recomendado 20 LTS+). Verifica con `node --version`.

> ⚠️ **Importante en equipos corporativos gestionados.** Si la máquina tiene EDR/antivirus
> corporativo (p. ej. **Sophos Intercept X**, **SentinelOne**), es posible que el runtime de
> Node.js recién instalado sea **puesto en cuarentena/eliminado** automáticamente. Si ves que
> `node.exe`, `npm` o archivos dentro de `node_modules` desaparecen tras instalarlos, pide a tu
> equipo de **IT que añada Node.js (y la carpeta del proyecto) a la lista de exclusiones** del
> EDR, o ejecuta el proyecto en un equipo sin esas restricciones. No es un problema del código.

---

## Configuración

### 1. Backend

```bash
cd campaign-system/backend
npm install
cp .env.example .env        # luego edita .env con tus claves reales
npx prisma migrate dev      # crea la base SQLite y aplica el esquema
npm run dev                 # levanta en http://localhost:4000
```

Variables en `.env` (ninguna se commitea — `.env` está en `.gitignore`):

| Variable            | Para qué sirve |
|---------------------|----------------|
| `ANTHROPIC_API_KEY` | Llamadas a la IA (interpretación del brief). **Obligatoria** para interpretar. |
| `CLICKUP_API_TOKEN` | Personal API Token de ClickUp. Obligatoria para sincronizar. |
| `CLICKUP_SPACE_ID`  | Space donde se crean las Listas de campaña. |
| `CLICKUP_LIST_ID`   | (Opcional) Lista por defecto si no se crea una nueva. |
| `OPENAI_API_KEY`    | (Opcional) Habilita la transcripción de audio con Whisper. |
| `PORT`              | Puerto del backend (por defecto 4000). |
| `DATABASE_URL`      | Ruta del archivo SQLite. Por defecto `file:./dev.db`. |

> El backend **arranca aunque falten claves**. Cada endpoint que necesita una clave devuelve un
> error JSON claro (HTTP 4xx/5xx) sin tumbar el servidor. Así puedes probar el flujo por partes.

### 2. Frontend

```bash
cd campaign-system/frontend
npm install
npm run dev                 # levanta en http://localhost:5173
```

El frontend habla con el backend mediante la ruta relativa `/api`, que Vite **proxya** a
`http://localhost:4000` en desarrollo (ver `vite.config.ts`). No hace falta configurar CORS ni URLs.

---

## Flujo de uso

1. **Capturar brief** (`/`): escribe/pega el brief y pulsa *Interpretar con IA*.
2. **Revisar** (`/campaigns/:id/review`): edita tareas, prioridades, fechas, opcionalidad y
   subtareas. Nada se envía a ClickUp hasta que pulsas *Confirmar y enviar a ClickUp*.
3. **Confirmación de sync** (`/campaigns/:id/sync`): enlaces directos a cada tarea creada en ClickUp.
4. **Cierre de tareas** (`/campaigns/:id/close`): elige modo de producción y tiempo ahorrado.
5. **Dashboard** (`/dashboard`): horas ahorradas, distribución por modo, cumplimiento de plazos.

---

## ClickUp — Custom Fields (¡leer antes de sincronizar!)

El registro de producción escribe en dos **Custom Fields** de la Lista de ClickUp:

- **`Modo de producción`** — tipo *dropdown* con las opciones: `IA 100%`, `Híbrido`, `Manual 100%`.
- **`Tiempo ahorrado (min)`** — tipo *número*.

> La API pública de ClickUp v2 **no permite crear Custom Fields** de forma fiable (solo leerlos y
> asignar valores). Por eso debes **crearlos manualmente una vez** en la Lista (o en el Space) desde
> la interfaz de ClickUp, lo cual puede requerir **permisos de administrador del Space**.
>
> El sistema detecta automáticamente estos campos por nombre:
> - Si **existen**, al cerrar una tarea se rellenan también en ClickUp.
> - Si **faltan**, la sincronización **no falla**: crea las tareas igual y muestra un *aviso*
>   indicando qué campos faltan. El dato de producción se guarda localmente en cualquier caso.

Mapeo de prioridad interna → escala de ClickUp: `alta=1`, `media=3`, `baja=4`.

---

## Estructura del proyecto

```
campaign-system/
├── backend/
│   ├── src/
│   │   ├── routes/      briefs · tasks · clickup · production · dashboard
│   │   ├── services/    aiInterpreter · clickupClient · transcription
│   │   ├── lib/         prisma (cliente) · httpError (errores + asyncHandler)
│   │   ├── prisma/      schema.prisma + migrations
│   │   ├── app.ts       Express app + manejo central de errores
│   │   └── server.ts    arranque
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/       BriefCapture · TaskReview · SyncConfirmation · TaskClose · Dashboard
│   │   ├── components/  Layout · ui (Button, Card, Banner, Badge, Spinner)
│   │   ├── api/         client.ts (cliente tipado del backend)
│   │   ├── App.tsx      rutas
│   │   └── main.tsx
│   └── package.json
└── README.md
```

---

## Endpoints del backend

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET  | `/health` | Healthcheck. |
| POST | `/api/briefs` | Crea brief/campaña (estado `draft`). |
| POST | `/api/briefs/:id/interpret` | Interpreta con IA y guarda tareas (`pending`). No toca ClickUp. |
| GET  | `/api/briefs` · `/api/briefs/:id` | Lista / detalle de campañas. |
| GET  | `/api/briefs/config/transcription` | Indica si la transcripción está habilitada. |
| POST | `/api/briefs/transcribe` | Transcribe audio (stub hasta configurar Whisper). |
| PATCH/DELETE | `/api/tasks/...` | Edición de tareas y subtareas. |
| POST | `/api/clickup/sync/:campaignId` | Sincroniza tareas `pending` con ClickUp (solo bajo confirmación). |
| POST | `/api/production/:taskId` | Registra modo + minutos ahorrados, cierra tarea y refleja en ClickUp. |
| GET  | `/api/dashboard/summary` | Métricas agregadas. |

---

## Notas de seguridad

- Las API keys viven solo en `.env` (gitignored); nunca se hardcodean.
- El brief se envía a la IA delimitado y con instrucción explícita de tratarlo como **datos**,
  mitigando inyección de prompt.
- Los endpoints de ClickUp y de cierre tienen manejo de errores explícito (token inválido,
  rate limit 429, etc.) y devuelven mensajes claros sin crashear el servidor.
