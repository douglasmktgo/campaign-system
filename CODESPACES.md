# Correr en GitHub Codespaces (sin tocar tu PC ni IT)

El antivirus corporativo (Sophos/SentinelOne) impide ejecutar Node.js en tu equipo.
Codespaces corre todo en una **máquina Linux en la nube**, así que el antivirus local
nunca interviene. Solo necesitas un **navegador** y una **cuenta de GitHub**.

> El proyecto ya viene con `.devcontainer/` configurado: al abrir el Codespace se instalan
> las dependencias, se genera la base SQLite y se aplican las migraciones automáticamente.

## Pasos

### 1. Crear el repositorio en GitHub
1. Entra a <https://github.com/new>.
2. Nombre: `campaign-system` (privado recomendado, porque más adelante pondrás API keys).
3. **No** marques "Add a README" (ya tenemos uno). Crea el repo.

### 2. Subir el código
En tu PC, dentro de la carpeta `campaign-system` (ya tiene el primer commit hecho), conecta
el repo remoto y haz push (cambia `TU-USUARIO`):

```bash
git remote add origin https://github.com/TU-USUARIO/campaign-system.git
git branch -M main
git push -u origin main
```

> Las API keys **no** se suben: `.env` está en `.gitignore`. Solo viaja `.env.example` (vacío).

### 3. Abrir el Codespace
1. En la página del repo en GitHub: botón verde **Code** → pestaña **Codespaces** →
   **Create codespace on main**.
2. Espera 1–2 min: se monta el contenedor y corre el setup automático.

### 4. Arrancar
Abre **dos terminales** en el Codespace (menú Terminal → Split):

```bash
# Terminal 1 — backend
cd backend && npm run dev      # http://localhost:4000

# Terminal 2 — frontend
cd frontend && npm run dev     # se abre el preview en el puerto 5173
```

Codespaces detecta el puerto 5173 y ofrece **"Open in Browser"** (o abre el preview solo).
El frontend habla con el backend por `/api`, que Vite redirige a `localhost:4000` dentro del
mismo contenedor — no hay que configurar URLs.

### 5. Vincular las API keys (desde la app, sin tocar archivos)
En la app abierta, ve a **Configuración** (menú superior) y pega:
- **Anthropic API key** — para interpretar el brief con IA.
- **ClickUp · Personal API Token** + **Space ID** — para sincronizar.
- (Opcional) **OpenAI API key** — para transcripción de audio.

Pulsa **Guardar** y luego **Probar conexión** para verificar que las keys son válidas.
Se guardan en `backend/config.local.json` (ignorado por git) — nunca se suben.

## Nota de seguridad
Estás poniendo el **token de ClickUp de la empresa** y la **API key de Anthropic** en un
servidor externo (GitHub). Para pruebas, usa un Space de ClickUp de pruebas y un token con el
mínimo de permisos. Si manejas datos sensibles de la empresa, consúltalo con seguridad/IT.
