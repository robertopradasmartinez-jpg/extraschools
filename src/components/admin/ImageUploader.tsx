'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  maxSizeMB?: number;
}

export default function ImageUploader({ 
  value, 
  onChange, 
  label = 'Imagen',
  maxSizeMB = 2 
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen');
      return;
    }

    // Validar tamaño
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`La imagen debe ser menor a ${maxSizeMB}MB. Tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    // Mostrar preview local inmediatamente
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Subir archivo
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir la imagen');
      }

      // Actualizar con la URL del servidor
      onChange(data.url);
      setPreview(data.url);
      
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen');
      setPreview(null);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Label y recomendaciones */}
      <div className="flex items-start justify-between">
        <label className="block text-sm font-medium text-gray-900">
          {label}
        </label>
        <div className="text-xs text-gray-500 text-right">
          <div>Máximo: {maxSizeMB}MB</div>
          <div>Recomendado: 1920x1080px</div>
        </div>
      </div>

      {/* Preview de imagen actual */}
      {preview && !uploading && (
        <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover"
            onError={() => {
              setPreview(null);
              setError('Error al cargar la imagen');
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
            title="Eliminar imagen"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition">
            <p className="text-white text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Imagen cargada correctamente
            </p>
          </div>
        </div>
      )}

      {/* Área de subida */}
      {!preview && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : uploading
              ? 'border-gray-300 bg-gray-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="space-y-3">
              <Loader2 className="w-12 h-12 text-primary-500 mx-auto animate-spin" />
              <p className="text-gray-600">Subiendo imagen...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-gray-700 font-medium">
                  Arrastra una imagen aquí o haz clic para seleccionar
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  JPG, PNG, WebP o GIF - Máximo {maxSizeMB}MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error al subir imagen</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Consejos de optimización */}
      {!preview && !uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-900">
            <strong>💡 Consejo:</strong> Para reducir el tamaño de tus imágenes sin perder calidad, 
            usa herramientas como <a href="https://tinypng.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">TinyPNG</a> o{' '}
            <a href="https://squoosh.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">Squoosh</a>.
          </p>
        </div>
      )}
    </div>
  );
}
