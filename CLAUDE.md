# Contexto del proyecto (para Claude y cualquier sesión nueva)

El dueño escribe en español; responde y documenta en español. Prioriza que todo **funcione y sea fácil
de usar** por alguien no técnico. Los despliegues son en **Render** (ver `render.yaml`); en el pasado los
pasos de compilación dieron problemas, por eso las apps nuevas van **sin build** (Node + JS plano).

## Apps en este repo

| Carpeta | Qué es | Estado |
|---|---|---|
| `simple/` | Brief → IA → tareas en ClickUp. Express + fetch, sin DB. | En uso (servicio `campaign-system` en Render). |
| `backend/` + `frontend/` | Versión completa anterior (Prisma/SQLite + React/Vite). | Histórica; Render ya no la usa. |
| `studio/` | **Instagram**: subir artes, validarlos, revisión con IA, aprobaciones, agente, programación y publicación. | Nueva (servicio `campaign-studio`). |

## Studio — decisiones clave

- **El agente nunca ejecuta solo.** Crea propuestas (`proposals`) que el usuario aprueba en *Aprobaciones*.
  Aprobar una propuesta de programar/publicar también aprueba el arte.
- Editar el copy o la cuenta de un arte aprobado/programado lo **devuelve a revisión**.
- Publicación con la API oficial de Instagram (`studio/lib/instagram.js`): tokens `IG…` →
  graph.instagram.com; tokens `EAA…` → graph.facebook.com. Cuentas *demo* simulan la publicación.
- Instagram descarga los archivos desde la URL pública de la app → en localhost no se puede publicar de verdad.
- Datos en `DATA_DIR/db.json` + `DATA_DIR/media/` (por defecto `studio/data/`, fuera de git).
- IA: `@anthropic-ai/sdk`, modelo `claude-opus-5-5`, salida JSON con `output_config.format` (json_schema)
  y `fallbacks: "default"`.
- Programador: `setInterval` cada 30 s en `server.js`. En el plan gratis de Render el servicio se duerme,
  así que las programaciones solo son fiables en plan de pago con Disk.

## Comandos

```bash
cd studio && npm install && npm start   # http://localhost:4100
cd studio && npm test                   # pruebas de validación
```

## Ideas pendientes (no hechas aún)

- Renovación automática de tokens de Instagram (caducan a los 60 días).
- Inicio de sesión con Instagram (OAuth) en vez de pegar el token.
- Métricas de cada publicación (alcance, likes) desde la API de Insights.
- Varios usuarios/roles (diseñador sube, cliente aprueba).
