# Primeros pasos: de cero a tu primera publicación

Hazlo desde el **PC**. Calcula alrededor de 1 hora. Ve marcando cada paso.

> 🔒 Las claves y tokens se pegan **solo** en tu Studio (Ajustes, Cuentas) o en Render. Nunca en un chat.

## 1. Instagram (desde la app del celular)
- [ ] Cuenta personal → *Configuración → Tipo de cuenta y herramientas → Cambiar a cuenta profesional* (Creador o Empresa).
- [ ] Lo mismo con la cuenta de **Loxita**.

## 2. Página de Facebook para cada cuenta
Necesaria para la Investigación con métricas reales y para el token de Facebook.
- [ ] Entra en <https://business.facebook.com> → crea una página por cuenta (o usa una que ya tengas).
- [ ] Vincula cada Instagram con su página (*Configuración → Cuentas → Cuentas de Instagram*).

## 3. API key de Anthropic (el agente)
- [ ] <https://console.anthropic.com/settings/keys> → *Create key* → cópiala en un lugar seguro.
- [ ] <https://console.anthropic.com/settings/billing> → carga saldo (5–10 USD alcanzan para probar).

## 4. Token de Instagram (para publicar e investigar)
- [ ] <https://developers.facebook.com/apps> → *Crear app* → caso de uso **«Gerenciar mensagens e conteúdo no Instagram»** (sin portafolio empresarial).
  En *Casos de uso → Personalizar → Permissões e recursos* añade: `instagram_basic`, `instagram_content_publish`,
  `instagram_manage_insights`, `pages_show_list`, `pages_read_engagement`, `business_management`.
- [ ] Comprueba que tu Instagram está vinculado a tu página: <https://business.facebook.com/latest/settings/profiles> → tu página →
  si sale **Conectar Instagram**, todavía no lo está.
- [ ] <https://developers.facebook.com/tools/explorer/> → elige tu app → añade los 6 permisos → **Generate Access Token** →
  en la ventana de Facebook marca tu página **y** tu cuenta de Instagram.
- [ ] Alarga el token a 60 días en <https://developers.facebook.com/tools/debug/accesstoken/> (*Ampliar token de acceso*).
  Copia el token largo (empieza por `EAA…`). Studio te avisará en Inicio 10 días antes de que caduque.

> Si Meta dice «conta restringida / restrição temporária», no insistas: espera unas horas (hasta 24 h) y repite.

## 5. Desplegar Studio en Render
- [ ] Crea tu cuenta con GitHub: <https://dashboard.render.com/register>
- [ ] *New + → Blueprint →* repositorio `campaign-system` (rama con la última versión) → *Apply*.
  El Blueprint ya crea Studio en **Starter + Disk** (`DATA_DIR=/var/data`): no se duerme y no pierde datos (~7 USD/mes).
- [ ] Cuando lo pida, rellena `APP_PASSWORD` (la contraseña para entrar) y `ANTHROPIC_API_KEY`
  (clave con escopo **Default**, no «Organização»).
- [ ] Espera a que **campaign-studio** diga *Live* y abre su enlace (`https://campaign-studio-xxxx.onrender.com`).
- [ ] Si preparaste el plan en tu PC: allí *Plan → Exportar plan* y aquí *Plan → Importar plan*.

## 6. Configurar Studio
- [ ] Entra con tu contraseña.
- [ ] *Ajustes → Probar conexión* del agente → debe decir «El agente está listo».
- [ ] *Cuentas → Conectar cuenta* → pega el token `EAA…` → aparecen tus dos cuentas.
- [ ] *Perfil de marca* de cada cuenta → «Completar con IA», revisa y guarda. Sube tu guía si la tienes.

## 7. Probar (en este orden)
1. **Ensayo sin riesgo:** *Cuentas → Añadir cuenta de prueba* → sube un arte a esa cuenta → apruébalo con «Publicar ya».
   Debe quedar *Publicado (simulado)*. Así ves el flujo completo sin tocar Instagram.
2. **Primera publicación real:** sube un arte de 1080×1350 a tu cuenta personal → revisa la validación y la
   revisión de la IA → *Aprobar → Publicar ya*. Comprueba en Instagram que salió y abre el enlace «Ver en Instagram».
3. **Programación:** aprueba otro arte con «Programar» para dentro de 10 minutos y comprueba que sale a su hora
   (con Starter no hace falta dejar Studio abierto).
4. **Investigación:** *Investigación →* elige Loxita → pon 1 o 2 cuentas de referencia de finanzas → *Investigar*.
   Convierte una idea en borrador, diseña el arte y súbelo.
5. **Agente:** en Inicio escribe «programa los aprobados esta semana a las 7 pm» y aprueba lo que proponga.

## Si algo falla
| Mensaje | Qué hacer |
|---|---|
| «El token caducó o no es válido» | Genera un token nuevo (paso 4) y vuelve a pegarlo en *Cuentas*. |
| «La cuenta debe ser profesional» | Repite el paso 1 en esa cuenta. |
| «Instagram necesita descargar el arte desde una URL pública» | Estás en localhost: usa el enlace de Render. |
| «Sin métricas» en Investigación | Falta el token de Facebook `EAA…` o la cuenta de referencia no es profesional. Sube capturas. |
| La programación no salió a su hora | En el plan gratuito Render se duerme: deja Studio abierto o pasa a **Starter + Disk** (ver README). |

## Plan de Render
El Blueprint usa **Starter + Disk**. Si lo cambias al plan gratuito: «Publicar ya» funciona, pero las programaciones
y la revisión automática de los lunes solo salen si el servicio está despierto, y los datos se borran en cada despliegue.
