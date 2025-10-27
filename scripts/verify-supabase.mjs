// Script para verificar la conexión con Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('🔍 Verificando configuración de Supabase...\n');

// Verificar variables
console.log('📋 Variables de entorno:');
console.log('✓ NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ ' + supabaseUrl : '❌ NO configurada');
console.log('✓ NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Configurada' : '❌ NO configurada');
console.log('✓ SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓ Configurada' : '❌ NO configurada');
console.log('');

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.log('❌ Error: Faltan variables de entorno de Supabase');
  process.exit(1);
}

// Crear clientes
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Verificar conexión a la base de datos
console.log('🔗 Verificando conexión a base de datos...');
try {
  const { data, error } = await supabase.from('User').select('count').limit(1);
  if (error) {
    console.log('⚠️  No se pudo conectar a la tabla User:', error.message);
  } else {
    console.log('✅ Conexión a base de datos exitosa');
  }
} catch (error) {
  console.log('⚠️  Error al verificar BD:', error.message);
}

// Verificar Storage
console.log('\n📦 Verificando Supabase Storage...');
try {
  const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();
  
  if (error) {
    console.log('❌ Error al listar buckets:', error.message);
  } else {
    console.log('✅ Storage accesible');
    console.log('\n📁 Buckets disponibles:');
    
    if (buckets && buckets.length > 0) {
      buckets.forEach(bucket => {
        console.log(`  - ${bucket.name} (${bucket.public ? 'público' : 'privado'})`);
      });
      
      // Verificar si existe el bucket 'uploads'
      const uploadsBucket = buckets.find(b => b.name === 'uploads');
      if (uploadsBucket) {
        console.log('\n✅ Bucket "uploads" existe y está', uploadsBucket.public ? 'público ✓' : 'privado ⚠️');
        if (!uploadsBucket.public) {
          console.log('   ⚠️  IMPORTANTE: El bucket debería ser público para que las imágenes sean accesibles');
        }
      } else {
        console.log('\n❌ El bucket "uploads" NO existe');
        console.log('   📝 Debes crear el bucket "uploads" en Supabase Storage');
        console.log('   🔗 https://supabase.com/dashboard/project/dsgqgircnjqlvodmgqla/storage/buckets');
      }
    } else {
      console.log('  ⚠️  No hay buckets creados');
      console.log('  📝 Debes crear el bucket "uploads" en Supabase Storage');
    }
  }
} catch (error) {
  console.log('❌ Error al verificar Storage:', error.message);
}

console.log('\n✨ Verificación completa');
