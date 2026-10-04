// Pista original sintetizada (pop alegre, 120 bpm) -> .music.wav
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SR = 44100, DUR = 16, BPM = 120, BEAT = 60 / BPM;
const N = SR * DUR, L = new Float32Array(N), R = new Float32Array(N);
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

function addNote(t0, dur, fn, gain = 1, pan = 0) {
  const s0 = Math.floor(t0 * SR), n = Math.floor(dur * SR);
  for (let i = 0; i < n && s0 + i < N; i++) {
    const v = fn(i / SR, i / n) * gain;
    L[s0 + i] += v * (1 - pan) * .5; R[s0 + i] += v * (1 + pan) * .5;
  }
}
const kick = t => Math.sin(2 * Math.PI * (50 * t + 90 * (1 - Math.exp(-t * 30)) / 30)) * Math.exp(-t * 9);
const clap = t => rnd() * Math.exp(-t * 22) * .8;
const hat = t => rnd() * Math.exp(-t * 70) * .35;
const pluck = f => (t, p) => (Math.sin(2 * Math.PI * f * t) + .5 * Math.sin(4 * Math.PI * f * t) + .25 * Math.sin(6 * Math.PI * f * t)) * Math.exp(-t * 7) * Math.min(1, t * 400);
const bass = f => (t, p) => Math.tanh(2 * Math.sin(2 * Math.PI * f * t)) * (1 - p) * Math.min(1, t * 200);

// I - V - vi - IV en Do mayor
const chords = [[60, 64, 67, 72], [55, 59, 62, 67], [57, 60, 64, 69], [53, 57, 60, 65]];
const roots = [36, 31, 33, 29];
const melody = [76, 79, 81, 79, 76, 74, 72, 74, 74, 76, 79, 76, 72, 69, 72, 74];
const bars = Math.ceil(DUR / (4 * BEAT));
for (let b = 0; b < bars; b++) {
  const c = b % 4, bt = b * 4 * BEAT;
  const intro = b === 0;
  for (let k = 0; k < 4; k++) {
    const t = bt + k * BEAT;
    if (!intro) addNote(t, .4, kick, .9);
    if (!intro && k % 2 === 1) addNote(t, .25, clap, .35);
    for (let h = 0; h < 2; h++) if (!intro) addNote(t + BEAT / 2 * h + BEAT / 2 * (h ? 0 : 1) * 0, .08, hat, .4, h ? .4 : -.4);
    addNote(t, BEAT * .9, bass(hz(roots[c])), intro ? 0 : .28);
  }
  chords[c].forEach((m, i) => [0, 1.5, 3].forEach(o => addNote(bt + o * BEAT, BEAT * 1.4, pluck(hz(m)), .07, i % 2 ? .3 : -.3)));
  melody.slice((b % 2) * 8, (b % 2) * 8 + 8).forEach((m, i) => addNote(bt + i * BEAT / 2, BEAT / 2, pluck(hz(m)), intro ? .08 : .12, .1));
}
// Fade out y normalización
let peak = 0;
for (let i = 0; i < N; i++) {
  const f = Math.min(1, (DUR - i / SR) / 1.2);
  L[i] *= f; R[i] *= f; peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVEfmt ", 8);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(L[i] / peak * .89 * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(R[i] / peak * .89 * 32767), 46 + i * 4);
}
writeFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), ".music.wav"), buf);
