#!/usr/bin/env bash
# Runs once when the Codespace is created. Installs deps and prepares the DB.
set -e

echo "==> Backend: instalando dependencias…"
cd backend
npm install

# Crea .env desde el ejemplo si no existe (luego pones tus API keys reales).
if [ ! -f .env ]; then
  cp .env.example .env
  echo "==> Creado backend/.env (rellena ANTHROPIC_API_KEY, CLICKUP_API_TOKEN, CLICKUP_SPACE_ID)."
fi

echo "==> Prisma: generando cliente y aplicando migraciones…"
npx prisma generate
npx prisma migrate deploy

cd ../frontend
echo "==> Frontend: instalando dependencias…"
npm install

echo ""
echo "✅ Listo. Para arrancar:"
echo "   Terminal 1:  cd backend  && npm run dev   (puerto 4000)"
echo "   Terminal 2:  cd frontend && npm run dev   (puerto 5173)"
echo ""
echo "⚠️  Antes de usar la IA o ClickUp, edita backend/.env con tus API keys."
