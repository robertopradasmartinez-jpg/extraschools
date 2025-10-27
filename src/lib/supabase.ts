import { createClient } from '@supabase/supabase-js'

// Extraer Project Reference desde DATABASE_URL
const getDatabaseUrl = process.env.DATABASE_URL || ''
const projectRef = getDatabaseUrl.match(/postgres\.([a-z0-9]+):/)?.[1] || ''

// Construir Supabase URL desde el project reference
const supabaseUrl = projectRef 
  ? `https://${projectRef}.supabase.co`
  : process.env.NEXT_PUBLIC_SUPABASE_URL || ''

// Anon key - necesitarás añadirla al .env
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Service role key para operaciones de servidor
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Cliente para operaciones públicas (cliente)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para operaciones de servidor (con más permisos)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export { supabaseUrl, supabaseAnonKey }
