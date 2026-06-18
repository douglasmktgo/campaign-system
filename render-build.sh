#!/usr/bin/env bash
# Build de despliegue: compila el frontend y el backend.
# --include=dev fuerza instalar las dev-deps (vite, typescript, prisma…),
# que Render omitiría por NODE_ENV=production.
set -e

echo "==> Frontend: install + build"
cd frontend
npm install --include=dev
npm run build
cd ..

echo "==> Backend: install + generate + build"
cd backend
npm install --include=dev
npx prisma generate
npm run build
cd ..

echo "==> Build completo."
