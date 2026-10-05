"""Genera la demo interactiva de Studio en un solo archivo HTML (para publicarla como página).

Uso: python3 studio/demo/build.py salida.html
Reutiliza la interfaz real (public/) y sustituye el servidor por demo/mock.js.
"""
import json
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
css = (root / "public/styles.css").read_text()
app = (root / "public/app.js").read_text()
validate = (root / "lib/validate.js").read_text().replace("export function", "function")
mock = (root / "demo/mock.js").read_text().replace('"__VALIDATE__"', json.dumps(validate))

# Tema en tres estados (sistema / claro / oscuro), como exige el visor de páginas.
dark = re.search(r"@media \(prefers-color-scheme: dark\) \{\n  :root \{(.*?)\n  \}\n\}", css, re.S)
css = css.replace(dark.group(0), '@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {' + dark.group(1) + "\n  }\n}\n:root[data-theme=\"dark\"] {" + dark.group(1) + "\n}")
css = css.replace("@media (prefers-color-scheme: dark) { .segmented button.on { background: #636366; } }", "")
css = css.replace(".segmented button.on { background: var(--surface);", ".segmented button.on { background: var(--seg-on);")
css = css.replace("  --radius: 18px;", "  --radius: 18px;\n  --seg-on: #ffffff;")
css = css.replace("    --shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);", "    --seg-on: #636366;\n    --shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);")
css += """
.demo-bar { position: fixed; top: calc(10px + env(safe-area-inset-top, 0px)); right: 14px; z-index: 40; display: flex; align-items: center; gap: 8px;
  padding: 6px 12px; border-radius: 999px; font-size: 12.5px; font-weight: 550; background: var(--orange-soft); color: var(--orange);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
@media (max-width: 760px) { .demo-bar { position: static; justify-content: center; margin: 10px 16px 0; } }
"""

# La subida va al simulador en vez de al servidor.
app, n = re.subn(r"function uploadOne\(f, onProgress\) \{.*?\n\}\n", "async function uploadOne(f, onProgress) {\n  onProgress(1);\n  return window.__demoUpload(f);\n}\n", app, flags=re.S)
assert n == 1
app = app.replace('history.replaceState(null, "", "#" + view);', 'try { history.replaceState(null, "", "#" + view); } catch {}')

html = f"""<title>Studio</title>
<style>
{css}
</style>
<div class="demo-bar" role="note">Demo · datos de ejemplo, no publica en Instagram</div>
<div id="app"></div>
<div id="modal"></div>
<script>
{mock}
</script>
<script>
{app}
</script>
"""
Path(sys.argv[1]).write_text(html)
print("ok", len(html) // 1024, "KB")
