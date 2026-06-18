#!/usr/bin/env bash
# Arranque en Render: aplica migraciones y levanta el servidor.
set -e
cd backend
npx prisma migrate deploy
node dist/server.js
