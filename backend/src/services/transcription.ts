import { AppError } from "../lib/httpError";

// Audio transcription wrapper.
//
// Per the project decision, transcription is left as a configurable stub:
// the upload path and service are wired, but until an OPENAI_API_KEY is set
// (and TRANSCRIPTION_ENABLED is turned on) it returns a clear "not configured"
// error instead of guessing. To enable Whisper later, set OPENAI_API_KEY in
// .env and flip the check below.

export function isTranscriptionConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function transcribeAudio(
  _buffer: Buffer,
  _filename: string
): Promise<string> {
  if (!isTranscriptionConfigured()) {
    throw new AppError(
      501,
      "Transcripción de audio no configurada. Define OPENAI_API_KEY en el .env del backend para habilitar Whisper."
    );
  }

  // Whisper implementation (enabled once OPENAI_API_KEY is present).
  const form = new FormData();
  const blob = new Blob([_buffer]);
  form.append("file", blob, _filename);
  form.append("model", "whisper-1");

  let res: Response;
  try {
    res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: form,
    });
  } catch (err: any) {
    throw new AppError(
      502,
      `No se pudo contactar con la API de transcripción: ${err?.message ?? "error de red"}.`
    );
  }

  if (!res.ok) {
    const detail = await res.text();
    throw new AppError(res.status, `Error de transcripción: ${detail}`);
  }

  const data = (await res.json()) as { text?: string };
  return data.text ?? "";
}
