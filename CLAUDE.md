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

- **Formatos:** la API de Instagram acepta imágenes de 4:5 a 1.91:1 y carruseles de máx. 10. 3:4 (1080×1440/1450)
  NO se publica por API: la interfaz lo adapta a 1080×1350 (`adaptPost` / `renderJpeg` en `public/app.js`).
- **Perfil de marca por cuenta** (`account.profile`, guía PDF en `DATA_DIR/guides`, privado). El agente lo usa
  en revisión, propuestas e investigación. Cuentas del dueño: personal (diseñador gráfico) y **Loxita** (app de finanzas que inventó).
- **Investigación** (`/api/research`, `agent.research`): Business Discovery + hashtag top media (solo token EAA),
  publicaciones propias, capturas (visión), búsqueda web de Claude (`web_search_20260209`) y síntesis JSON con
  ideas → borradores con estado `idea` y `brief`.
- **Base de conocimiento** en `studio/lib/knowledge/` (de sergebulaev/instagram-skills, MIT) inyectada en los prompts.
- **Plan** (`db.plan`: `timezone`, `slots`, `reviews`, `summaries`; lógica en `lib/plan.js`): tarjetas por cuenta con `date`/`time` en la zona del plan (por defecto `America/Sao_Paulo`) y estados `proposed`, `approved`, `modified` (aprobada con cambios del usuario), `published`, `skipped`. «Crear borrador» crea un arte `idea` con `planSlotId` y `plannedAt`; al publicarse, la tarjeta pasa a `published`. El agente propone (`planPeriod`) y revisa (`replanWeek`); lo aprobado no lo toca sin propuesta. Plan de Loxita de octubre 2026 en `studio/seed/` (se carga con «Importar plan»).
- **Demo sin servidor:** `python3 studio/demo/build.py salida.html` (simulador en `studio/demo/mock.js`;
  mantenerlo al día cuando cambien las rutas). Publicada como artifact privado del dueño.

## Skills de Claude Code instaladas

`.claude/skills/ig-*` (de sergebulaev/instagram-skills, MIT): caption-writer, carousel-planner, hook-extractor,
hashtag-strategist, humanizer, content-planner, repurposer, profile-optimizer, audience-insights. Sus guías
compartidas están en `.claude/references/`. Mencionan Publora/Apify/Pixfaro (`lib/*.py`) que **no** están
instalados: aquí se publica con Studio (API oficial), así que úsalas en modo borrador.

## Comandos

```bash
cd studio && npm install && npm start   # http://localhost:4100
cd studio && npm test                   # pruebas de validación
```

## Próximos pasos

Ver **`studio/HOJA-DE-RUTA.md`**: WhatsApp (avisos, muestras y aprobaciones con botones, resumen diario) y
planificador mensual/semanal con días y horas óptimas según la audiencia de cada cuenta. Orden: desplegar →
planificador → WhatsApp.
