# Studio — publica en Instagram con un agente que solo actúa cuando tú apruebas

Studio es una app web para:

1. **Conectar** tus cuentas de Instagram (una o varias).
2. **Subir artes**: imagen, carrusel (2–10) o Reel.
3. **Validarlos automáticamente** contra los requisitos de Instagram (formato, proporción, peso, duración,
   longitud del copy, número de hashtags…). Las imágenes PNG se convierten solas a JPEG al subirlas.
4. **Revisarlos con IA**: el agente puntúa el arte, detecta problemas y sugiere un copy y hashtags.
5. **Aprobar o rechazar** cada arte, y decidir si se publica ya, se programa o solo queda aprobado.
6. **Pedirle cosas al agente** en lenguaje normal («programa los aprobados esta semana a las 7 pm»).
   El agente **solo propone**: cada acción espera en *Aprobaciones* hasta que la apruebas.
7. **Publicar automáticamente** a la hora programada.
8. **Investigar y desarrollar contenido** por cuenta: analiza cuentas de referencia, hashtags, enlaces,
   capturas e internet; detecta las fórmulas virales y propone una serie de contenido adaptada a tu marca.
9. **Perfil de marca por cuenta** (p. ej. tu cuenta personal de diseñador y la de tu app): público, tono,
   objetivos, temas, CTA, qué evitar y una guía (texto o PDF) que el agente sigue al pie de la letra.

## Medidas y formatos

| Formato | Medida recomendada | Notas |
|---|---|---|
| Post vertical | **1080×1350** (4:5) | El más alto que permite la API. |
| Post cuadrado / horizontal | 1080×1080 / 1080×566 | |
| Carrusel | 1080×1350 en todas | **Máximo 10** por API (la app permite 20, pero solo publicando a mano). Todas las diapositivas se recortan a la proporción de la primera. |
| Reel | 1080×1920 (9:16) | 3 s a 15 min, MP4 o MOV. |

> **1080×1440 / 1080×1450 (3:4)** se puede subir desde la app de Instagram, pero **la API no lo acepta**.
> Studio lo detecta y lo adapta solo a 1080×1350: «Ajustar sin recortar» (añade bordes del color del arte)
> o «Recortar al centro». Diseña con un margen de seguridad de ~50 px arriba y abajo si partes de 3:4.

## Investigación: de dónde salen los datos

| Fuente | Qué aporta | Requisito |
|---|---|---|
| Tus publicaciones | Lo que mejor funciona en tu cuenta | Cuenta conectada (cualquier token) |
| Cuentas de referencia (Business Discovery) | Likes, comentarios y top posts reales de otras cuentas **profesionales** | Una cuenta conectada con **token de Facebook (EAA…)** |
| Hashtags (top media) | Lo que está funcionando ahora en un tema | Token de Facebook (EAA…). Instagram limita a 30 hashtags distintos cada 7 días |
| Capturas | La IA lee vistas, likes, ganchos y diseño de lo que subas | Ninguno |
| Internet | Tendencias y conversación del nicho (búsqueda web de Claude) | API key de Anthropic |

Instagram **no ofrece** un listado oficial de «tendencias». Por eso Studio combina estas fuentes y la IA
filtra lo que no encaja con cada marca (aparece en «Descartado para esta marca» con el motivo).

Las ideas se convierten en **borradores** (estado *Idea*) con su brief: gancho, estructura por diapositiva o
escenas del reel, copy, CTA y notas de diseño. Al subir el arte pasan a revisión.

El agente usa una base de conocimiento de Instagram (fórmulas de gancho IG1–IG10, señales del algoritmo,
arquitectura de carruseles, hashtags y checklist anti-tono-IA) en `lib/knowledge/`, tomada de
[sergebulaev/instagram-skills](https://github.com/sergebulaev/instagram-skills) (MIT).

> **Regla de oro:** nada se publica ni cambia sin tu visto bueno. Si editas un arte ya aprobado,
> vuelve a revisión.

---

## Probarlo en tu computadora

Necesitas **Node.js 20 o superior**.

```bash
cd studio
npm install
npm start           # abre http://localhost:4100
```

La primera vez te pide crear una contraseña. Luego:

- **Cuentas → Usar cuenta de prueba** para ver todo el flujo sin tocar Instagram (simula la publicación).
- **Ajustes → API key de Anthropic** para activar el agente (opcional, pero es la parte más útil).

> En `localhost` puedes hacer todo **menos publicar de verdad**: Instagram necesita descargar el arte
> desde una URL pública `https`. Para eso, despliega la app (abajo).

---

## Conectar tu Instagram de verdad

Requisitos de Instagram (no de Studio):

- La cuenta debe ser **profesional** (Empresa o Creador). Se cambia gratis en la app de Instagram:
  *Configuración → Tipo de cuenta y herramientas*.
- Necesitas una app en **Meta for Developers** para obtener un token.

Pasos:

1. Entra en <https://developers.facebook.com/apps> → **Crear app** → tipo *Empresa*.
2. Añade el producto **Instagram** → *API con inicio de sesión de Instagram*.
3. En *Generar tokens de acceso*, añade tu cuenta de Instagram y pulsa **Generar token**.
4. Copia el token (empieza por `IG…`) y pégalo en **Studio → Cuentas → Conectar cuenta**.

Repite el paso 3 y 4 por cada cuenta. **Para la Investigación con métricas reales** de otras cuentas y
hashtags, conecta al menos una cuenta con token de Facebook (ver abajo). También sirve un token de Facebook (`EAA…`) con el permiso
`instagram_content_publish`: conecta de una vez todas las cuentas vinculadas a tus páginas.

> Los tokens de larga duración **caducan a los 60 días**. Si una cuenta deja de publicar, pega un token nuevo
> (la cuenta y sus artes se conservan). Mientras tu app de Meta esté en modo *Desarrollo*, solo puede publicar
> en cuentas que hayas añadido como probadoras en esa app; para uso propio es suficiente.

---

## Desplegar en Render (para publicar de verdad)

El archivo `render.yaml` de la raíz del repo ya incluye el servicio **campaign-studio**.

1. En Render → **New + → Blueprint** → elige este repositorio → **Apply**.
2. Cuando te pida variables:
   - `APP_PASSWORD`: la contraseña para entrar (obligatoria en internet).
   - `ANTHROPIC_API_KEY`: tu key de Anthropic (también puedes ponerla luego en Ajustes).
3. Abre la URL que te da Render (`https://campaign-studio-xxxx.onrender.com`).

### ⚠️ Importante: plan gratuito vs. de pago

| | Plan gratuito | Plan Starter + Disk |
|---|---|---|
| Probar la app | ✅ | ✅ |
| Publicar al momento | ✅ | ✅ |
| **Publicaciones programadas** | ❌ El servicio se duerme tras 15 min sin visitas y no publica a la hora | ✅ |
| **Conservar datos** (cuentas, artes) | ❌ Se borran en cada reinicio o despliegue | ✅ |

Para uso real: en Render cambia el servicio a **Starter**, añade un **Disk** montado en `/var/data`
y define la variable `DATA_DIR=/var/data`.

---

## Variables de entorno

| Variable | Para qué |
|---|---|
| `APP_PASSWORD` | Contraseña de acceso. Si no existe, la app pide crear una la primera vez. |
| `ANTHROPIC_API_KEY` | Activa el agente (alternativa a ponerla en Ajustes). |
| `DATA_DIR` | Carpeta donde se guardan datos y archivos. Por defecto `studio/data/`. |
| `PUBLIC_URL` | URL pública de la app, si no se detecta sola. |
| `PORT` | Puerto (por defecto 4100). |
| `IG_API_VERSION` | Versión de la API de Instagram (por defecto `v23.0`). |

---

## Cómo está hecho

Sin base de datos ni paso de compilación (como `simple/`): arranca en segundos.

```
studio/
├── server.js          API, acceso con contraseña, aprobaciones y programador (cada 30 s)
├── lib/
│   ├── store.js       datos en un archivo JSON (escritura atómica)
│   ├── validate.js    requisitos de Instagram
│   ├── instagram.js   API oficial de publicación de Instagram (+ cuentas de prueba)
│   ├── agent.js       agente con Claude: revisión, propuestas, perfil de marca e investigación
│   └── knowledge/     guías de Instagram que usa el agente
├── public/            interfaz (HTML + CSS + JS plano, modo claro y oscuro, móvil)
└── test/              pruebas de la validación (npm test)
```

**Estados de un arte:** En revisión → Aprobado → Programado → Publicado. También Rechazado (con nota) y
Error (con el motivo; se puede reintentar).

**Seguridad:**

- Todo requiere sesión (cookie firmada, `HttpOnly`); límite de intentos de login.
- Los tokens de Instagram y la key de Anthropic nunca se envían al navegador.
- Los archivos subidos son públicos (Instagram debe poder descargarlos) pero con nombres aleatorios
  imposibles de adivinar.
- Si el servidor se reinicia a mitad de una publicación, no reintenta a ciegas (evita publicar dos veces).
- El agente trata los copies y la guía de marca como datos, no como instrucciones, y solo puede proponer
  acciones sobre artes existentes.

---

## Demo interactiva (sin servidor)

`studio/demo/` genera una versión de la interfaz que funciona sola en el navegador con datos de ejemplo
(simula el servidor, la IA y la publicación). Sirve para enseñar la app sin desplegar nada:

```bash
python3 studio/demo/build.py studio-demo.html   # abre el archivo en el navegador
```
