#!/usr/bin/env bash
set -e
echo "== Node version ==" && node -v || true
echo "== npm version ==" && npm -v || true
if [ -f .env ]; then
  echo ".env exists"
else
  echo "Missing .env — انسخ .env.example إلى .env وعدل القيم"
fi
find . -maxdepth 3 -name package.json
