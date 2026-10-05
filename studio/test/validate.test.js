import { test } from "node:test";
import assert from "node:assert/strict";
import { validatePost, hasErrors } from "../lib/validate.js";

const img = (w, h, extra = {}) => ({ mime: "image/jpeg", size: 500_000, width: w, height: h, ...extra });
const post = (media, extra = {}) => ({ accountId: "acc_1", type: media.length > 1 ? "CAROUSEL" : "IMAGE", media, caption: "Hola #marca", ...extra });

test("una imagen 4:5 en JPEG pasa sin avisos", () => {
  const checks = validatePost(post([img(1080, 1350)]));
  assert.equal(checks.length, 1);
  assert.equal(checks[0].level, "ok");
});

test("rechaza proporciones fuera de 4:5 – 1.91:1", () => {
  assert.ok(hasErrors(validatePost(post([img(2000, 500)]))));
  assert.ok(hasErrors(validatePost(post([img(1080, 1920)]))));
  assert.ok(!hasErrors(validatePost(post([img(1080, 566)]))));
});

test("solo acepta JPEG para imágenes y máximo 8 MB", () => {
  assert.ok(hasErrors(validatePost(post([img(1080, 1080, { mime: "image/png" })]))));
  assert.ok(hasErrors(validatePost(post([img(1080, 1080, { size: 9 * 1024 * 1024 })]))));
});

test("carrusel entre 2 y 10 archivos", () => {
  const eleven = Array.from({ length: 11 }, () => img(1080, 1080));
  assert.ok(hasErrors(validatePost(post(eleven))));
  assert.ok(!hasErrors(validatePost(post([img(1080, 1080), img(1080, 1080)]))));
});

test("límites del copy: 2.200 caracteres y 30 hashtags", () => {
  assert.ok(hasErrors(validatePost(post([img(1080, 1080)], { caption: "a".repeat(2201) }))));
  const tags = Array.from({ length: 31 }, (_, i) => "#t" + i).join(" ");
  assert.ok(hasErrors(validatePost(post([img(1080, 1080)], { caption: tags }))));
});

test("exige cuenta asignada", () => {
  assert.ok(hasErrors(validatePost(post([img(1080, 1080)], { accountId: "" }))));
});

test("reels: formato y duración", () => {
  const video = (extra) => ({ mime: "video/mp4", size: 10_000_000, width: 1080, height: 1920, duration: 20, ...extra });
  const reel = (m) => ({ accountId: "a", type: "REELS", media: [m], caption: "x" });
  assert.ok(!hasErrors(validatePost(reel(video()))));
  assert.ok(hasErrors(validatePost(reel(video({ duration: 2 })))));
  assert.ok(hasErrors(validatePost(reel(video({ mime: "video/webm" })))));
});
