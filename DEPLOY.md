# Publicar como página web (una sola URL) — Render

Esto pone la app **en internet**. Desde internet, ClickUp y la IA funcionan sin el
antivírus corporativo de por medio. Tú solo abres un **enlace** en el navegador.

## Pasos (una vez)

### 1. Crear cuenta en Render
Entra a <https://render.com> y regístrate con tu cuenta de **GitHub** (botón "GitHub").
Es gratis.

### 2. Desplegar el proyecto
Haz clic en este enlace (despliega directo desde tu repo):

👉 **https://render.com/deploy?repo=https://github.com/douglasmktgo/campaign-system**

- Render leerá el archivo `render.yaml` y configurará todo solo.
- Pulsa **Apply** / **Create**.
- Espera **3–5 minutos** (compila el frontend y el backend).

> Si el botón no abre el blueprint: en Render → **New +** → **Blueprint** → elige el repo
> `campaign-system` → **Apply**.

### 3. Abrir tu página
Cuando termine, Render te da una URL del estilo:
`https://campaign-system-xxxx.onrender.com`

Esa es **tu página web**. Ábrela en cualquier navegador.

## Configurar las API keys (dentro de la app)
En tu página → pestaña **Configuración** → pega tu **Anthropic API key** y tu
**ClickUp Token + Space ID** → **Guardar** → **Probar conexión**.

## Notas del plan gratuito de Render
- La primera carga tras un rato sin uso tarda ~30 s (el servicio "despierta"). Normal.
- Si el servicio se reinicia, puede que tengas que volver a pegar las API keys en
  **Configuración** (es cuestión de segundos). Si quieres que queden fijas, dímelo y las
  ponemos como variables de entorno en Render.
