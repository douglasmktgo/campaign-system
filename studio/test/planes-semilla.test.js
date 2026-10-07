import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const seed = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "seed");
const FORMATS = ["REEL", "CARRUSEL", "POST", "STORIES"];
const GOALS = ["seguidores", "leads", "comunidad", "autoridad", "ventas", "activacion"];

for (const f of fs.readdirSync(seed).filter((x) => /^plan-.*\.json$/.test(x))) {
  test(`el plan semilla ${f} se puede importar`, () => {
    const p = JSON.parse(fs.readFileSync(path.join(seed, f), "utf8"));
    assert.equal(p.kind, "studio-plan");
    assert.match(p.username, /^[\w.]{2,30}$/);
    assert.ok(p.slots.length > 0);
    const ids = new Set();
    for (const s of p.slots) {
      // Sin id es válido: al importar se le asigna uno.
      if (s.id) {
        assert.match(s.id, /^slot_[a-f0-9]{12}$/, s.theme);
        assert.ok(!ids.has(s.id), "id repetido " + s.id);
        ids.add(s.id);
      }
      assert.match(s.date, /^\d{4}-\d{2}-\d{2}$/, s.theme);
      assert.match(s.time, /^\d{2}:\d{2}$/, s.theme);
      assert.ok(FORMATS.includes(s.format), s.theme);
      assert.ok(GOALS.includes(s.goal), s.theme);
      assert.ok(s.theme, "sin tema");
    }
  });
}

test("el plan de Soy Gio no mezcla la identidad de Loxita", () => {
  const p = JSON.parse(fs.readFileSync(path.join(seed, "plan-soygio-octubre-2026.json"), "utf8"));
  const txt = JSON.stringify(p.slots).toLowerCase();
  for (const w of ["lochito", "cada locha conta", "vagas", "comenta lista"]) assert.ok(!txt.includes(w), w);
  // Loxita solo aparece en la serie «Construyendo» (10 % del mix).
  assert.ok(p.slots.filter((s) => JSON.stringify(s).includes("@loxita.app")).length <= 2);
});
