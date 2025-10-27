#!/bin/bash

# 🚀 Script de Deploy a Producción
# Ejecuta esto cuando estés listo para publicar

echo "🚀 Preparando para deploy a producción..."
echo ""

# Paso 1: Verificar que todo está commiteado
echo "📝 Verificando estado de Git..."
if [[ -n $(git status -s) ]]; then
    echo "⚠️  Tienes cambios sin commitear. Hazlo primero:"
    echo "   git add ."
    echo "   git commit -m 'Ready for production'"
    exit 1
fi

echo "✅ Todo commiteado"
echo ""

# Paso 2: Build local para verificar
echo "🔨 Haciendo build local..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build falló. Corrige los errores antes de continuar."
    exit 1
fi

echo "✅ Build exitoso"
echo ""

# Paso 3: Push a GitHub
echo "📤 Subiendo a GitHub..."
git push origin main

echo "✅ Código subido"
echo ""

# Paso 4: Instrucciones finales
echo "✨ ¡Casi listo!"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Ve a Vercel: https://vercel.com/"
echo "   - Vercel detectará el push y desplegará automáticamente"
echo "   - O importa el repo si es la primera vez"
echo ""
echo "2. Configura variables de entorno en Vercel:"
echo "   - DATABASE_URL"
echo "   - NEXTAUTH_URL (tu dominio de producción)"
echo "   - NEXTAUTH_SECRET (genera uno nuevo con: openssl rand -base64 32)"
echo "   - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"
echo "   - EMAIL_SERVER_* (si usas emails)"
echo ""
echo "3. Migra tu base de datos:"
echo "   DATABASE_URL='tu_url_de_produccion' npx prisma migrate deploy"
echo ""
echo "4. Actualiza Google Maps API restrictions:"
echo "   - Agrega https://tudominio.com/* en Google Cloud Console"
echo ""
echo "5. Configura DNS en GoDaddy:"
echo "   - A Record: @ → 76.76.21.21"
echo "   - CNAME: www → cname.vercel-dns.com"
echo ""
echo "🎉 ¡Listo para producción!"
