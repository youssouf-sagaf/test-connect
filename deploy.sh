#!/bin/bash
set -euo pipefail

# Déploiement permanent Cloudflare Workers (même méthode que uhaiocean)
cd "$(dirname "$0")"

echo "→ Build production..."
cd app
npm run build
cd ..

echo "→ Deploy Cloudflare Workers..."
npx wrangler deploy

echo "✓ Déployé. URL : https://testconnect.<votre-compte>.workers.dev"
