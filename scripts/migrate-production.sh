#!/bin/bash

# Script para migrar tu base de datos a producción
# Ejecuta esto desde tu terminal local

echo "🔄 Migrando base de datos a producción..."

# 1. Asegúrate de tener la DATABASE_URL de producción en .env
# 2. Ejecuta las migraciones
npx prisma migrate deploy

# 3. (Opcional) Ejecuta el seed si quieres datos de ejemplo
# npx prisma db seed

echo "✅ Migración completada!"
echo ""
echo "📝 Notas:"
echo "- Verifica que DATABASE_URL apunte a tu BD de producción"
echo "- Haz backup de tu BD antes de migrar"
echo "- El seed es opcional (solo para datos de ejemplo)"
