import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { profileText } from "../lib/agent.js";
import { encargoVideo } from "../lib/produccion.js";

test("el perfil incluye idiomas, mezcla, rutina, marcas, identidad visual y referencias", () => {
  const t = profileText({ about: "Diseñador", language: "Español", mix: "30 % bici", routine: "Gym 6:00", brands: "Loxita como proceso", visual: "Oliva apagado", references: "@bossa.dsg" });
  for (const s of ["Idiomas: Español", "Mezcla de contenido: 30 % bici", "Rutina y vida real: Gym 6:00", "Marcas propias y publicidad: Loxita como proceso", "Oliva apagado", "@bossa.dsg"]) assert.ok(t.includes(s), s);
});

test("el encargo de reel va a la carpeta de la cuenta y con sus propias reglas", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "taskday-cuenta-"));
  try {
    const r = encargoVideo({ id: "slot_x", date: "2026-11-03", theme: "Ruta por la Lagoa", format: "REEL" }, { carpeta: dir, reglasVideo: "- Español, filtro oliva apagado." });
    assert.ok(r.file.startsWith(path.join(dir, "2026", "11 NOVIEMBRE", "VIDEOS", "ENCARGOS")));
    const md = fs.readFileSync(r.file, "utf8");
    assert.ok(md.includes("filtro oliva apagado"));
    assert.ok(!md.includes("vagas"), "no se cuelan las reglas de Loxita");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
