import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

// Configuración
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB en bytes
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const STORAGE_BUCKET = 'uploads' // Nombre del bucket en Supabase Storage

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación (solo usuarios logueados pueden subir)
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener el archivo del FormData
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Usa JPG, PNG, WebP o GIF' },
        { status: 400 }
      )
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `El archivo es demasiado grande. Máximo ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExt = file.name.split('.').pop()
    const fileName = `${timestamp}-${randomString}.${fileExt}`
    const filePath = `${fileName}`

    // Convertir archivo a buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Supabase Storage
      const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json(
        { error: 'Error al subir el archivo a Supabase Storage' },
        { status: 500 }
      )
    }

    // Obtener URL pública del archivo
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
      type: file.type,
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Error al subir el archivo' },
      { status: 500 }
    )
  }
}

// GET - Información sobre límites de subida
export async function GET() {
  return NextResponse.json({
    maxFileSize: MAX_FILE_SIZE,
    maxFileSizeMB: MAX_FILE_SIZE / 1024 / 1024,
    allowedTypes: ALLOWED_TYPES,
    recommendations: {
      maxWidth: 1920,
      maxHeight: 1080,
      format: 'JPG o WebP para mejor compresión',
      tools: 'Usa tinypng.com o squoosh.app para optimizar',
    }
  })
}
