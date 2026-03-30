#!/bin/sh
set -e

# Run migrations (resolve initial if needed, then deploy)
npx prisma migrate resolve --applied "0_init" 2>/dev/null || true
npx prisma migrate deploy

exec node api/server.js
