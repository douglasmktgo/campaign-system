# Hoja de ruta de Studio

Peticiones del dueño, anotadas para construirlas en orden. Cada bloque dice **qué quiere**, **cómo se hará**
y **qué hace falta**. Al terminar un bloque, márcalo y muévelo a «Hecho».

---

## 1. WhatsApp: avisos, muestras y aprobaciones desde el móvil

**Qué quiere el dueño**
- Recibir en su WhatsApp los avisos del progreso (arte subido, revisión de la IA lista, investigación terminada,
  publicado, errores).
- Recibir **la muestra de lo que se va a publicar** (imagen o vídeo + copy + cuenta + día y hora) y responder
  **Aprobar / Rechazar / Cambiar hora** desde el propio WhatsApp.
- Que el agente le escriba **todos los días** con lo que toca publicar según el cronograma semanal.

**Cómo se hará**
- **WhatsApp Business Platform (Cloud API) de Meta**, en la **misma app de Meta** que ya usamos para Instagram
  (se añade el producto *WhatsApp*). Alternativa si Meta da problemas: Twilio WhatsApp (más fácil, de pago).
- Envíos desde Studio (`lib/whatsapp.js`):
  - Mensaje con imagen/vídeo (la URL pública del arte) + texto + **botones de respuesta rápida**
    (`Aprobar`, `Rechazar`, `Otra hora`).
  - Los mensajes que inicia Studio fuera de la ventana de 24 h (resumen diario, avisos) deben ser
    **plantillas aprobadas por Meta**: «resumen_diario», «aprobacion_pendiente», «publicado», «error_publicacion».
- Recepción: **webhook** `POST /api/whatsapp/webhook` (Render da la URL pública) que:
  - Verifica la firma de Meta (`X-Hub-Signature-256`) y **solo acepta mensajes del número del dueño**.
  - Convierte cada botón en la misma acción que en la web (aprobar arte, aprobar propuesta, rechazar con nota,
    reprogramar). Reutilizar las funciones de `server.js`, no duplicar lógica.
  - «Otra hora» → el agente propone 2–3 horarios como nuevos botones.
  - Texto libre → se pasa al agente (`planFromCommand`) y responde con propuestas para aprobar ahí mismo.
- Ajustes nuevos: número del dueño, qué avisos recibir, hora del resumen diario, zona horaria.
- Seguridad: publicar sigue requiriendo aprobación explícita; los botones caducan si el arte cambió desde que se envió.

**Qué hace falta**
- Producto WhatsApp en la app de Meta → número de prueba gratuito (luego un número propio verificado).
- Token permanente de WhatsApp (usuario del sistema en Meta Business) y *Phone number ID*.
- Plantillas aprobadas por Meta (tarda de minutos a 1 día).
- Coste: Meta cobra por mensaje de plantilla según el país; las respuestas dentro de 24 h son gratis o casi.
- Studio en **Render Starter** (el gratuito se duerme y no enviaría el resumen diario ni recibiría las respuestas).

---

## 2. Planificador mensual y semanal con días y horas óptimas

**Qué quiere el dueño**
- Que el sistema **planifique el mes** de cada cuenta (personal y Loxita), dividido por semanas.
- Que diga **qué publicar cada día**: formato (Reel, carrusel o post), tema, gancho y objetivo.
- Que diga **los días y horas** en que conviene publicar, según cómo se mueve el público de cada cuenta,
  y que se vaya ajustando con los resultados.
- Que avise de lo que toca (en la web y por WhatsApp).

**Cómo se hará**
- Nueva sección **Plan** (calendario mensual con vista semanal), por cuenta.
- Datos del público y rendimiento (API de Instagram, permiso `instagram_manage_insights`):
  - `online_followers`: a qué horas está conectada la audiencia, por día.
  - Métricas de cada publicación propia (alcance, guardados, compartidos, reproducciones) por formato y por hora.
  - Sin datos suficientes (cuenta nueva): horarios de referencia del sector y se ajustan a las 2–4 semanas.
- El agente genera el plan con:
  - Perfil de marca + guía + objetivos de la cuenta.
  - Pilares de contenido y mezcla de formatos (base de conocimiento: `ig-content-planner`, fórmulas IG1–IG10).
  - Ideas de la Investigación que el dueño marcó como buenas.
  - Mejores franjas horarias detectadas.
- Cada hueco del plan es una tarjeta: formato, tema, gancho, objetivo, día y hora → botón «Crear borrador»
  (la misma idea→borrador de Investigación). Al aprobar el arte, se programa en ese hueco.
- **Replanificación semanal:** cada lunes el agente revisa qué funcionó y propone ajustes (horas, formatos, temas)
  como propuestas para aprobar.
- **Resumen diario** (web + WhatsApp): qué toca hoy, qué falta diseñar, qué espera aprobación.

**Qué hace falta**
- Token con `instagram_manage_insights` (ya está en la lista de permisos de PRIMEROS-PASOS).
- Render Starter + Disk, para que el plan y las métricas persistan y las tareas diarias se ejecuten.

---

## Orden recomendado

1. Desplegar y publicar de verdad (PRIMEROS-PASOS.md) ← primero, para validar la base.
2. Planificador mensual/semanal (bloque 2): da el contenido que luego se avisa.
3. WhatsApp (bloque 1): avisos, muestras, aprobaciones y resumen diario sobre ese plan.

## Otras ideas pendientes
- Renovación automática de tokens de Instagram (caducan a los 60 días) con aviso previo.
- Inicio de sesión con Instagram (OAuth) en vez de pegar el token.
- Analizar vídeos/reels de referencia fotograma a fotograma.
- Varios usuarios y roles (diseñador sube, cliente aprueba).

## Hecho
- Studio base: cuentas, artes, validación y adaptación de medidas, aprobaciones, agente, programación, calendario.
- Investigación por marca, perfiles de marca, base de conocimiento de Instagram.
