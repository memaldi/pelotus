#!/usr/bin/env bash
# Bootstrapping script for Pelotus Nuxt application

set -e

cd "$(dirname "$0")/.." || exit

echo "Installing Node dependencies..."
cd nuxt-app
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Bootstrap complete. Run 'npm run dev' inside nuxt-app to start."