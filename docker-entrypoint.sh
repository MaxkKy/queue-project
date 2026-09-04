#!/bin/sh
set -e

npx prisma migrate deploy
exec npx next start --hostname 0.0.0.0 --port 3000
