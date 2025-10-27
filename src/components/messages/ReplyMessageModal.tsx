'use client'

import { useState } from 'react'
import { X, Send, Loader2 } from 'lucide-react'

interface ReplyMessageModalProps {
  isOpen: boolean
  onClose: () => void
  originalMessage: {
    id: string
    subject: string
    content: string
    sender: {
      id: string
      name: string | null
      email: string
    }
    activity?: {
      id: string
      title: string
    }
  }
  onSuccess?: () => void
}

export default function ReplyMessageModal({ 
  isOpen, 
  onClose, 
  originalMessage,
  onSuccess 
}: ReplyMessageModalProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      setError('El mensaje no puede estar vacío')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: originalMessage.sender.id,
          activityId: originalMessage.activity?.id,
          subject: `Re: ${originalMessage.subject}`,
          content: content,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setContent('')
        
        // Cerrar modal después de 2 segundos
        setTimeout(() => {
          setSuccess(false)
          onClose()
          onSuccess?.()
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.error || 'Error al enviar el mensaje')
      }
    } catch (err) {
      setError('Error al enviar el mensaje')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setContent('')
      setError('')
      setSuccess(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Responder Mensaje</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mensaje Original */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">
              <strong>De:</strong> {originalMessage.sender.name || 'Usuario'} ({originalMessage.sender.email})
            </p>
            <p className="text-sm text-gray-600">
              <strong>Asunto:</strong> {originalMessage.subject}
            </p>
            {originalMessage.activity && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>Actividad:</strong> {originalMessage.activity.title}
              </p>
            )}
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-2 font-medium">Mensaje original:</p>
            <p className="text-sm text-gray-700 whitespace-pre-line max-h-32 overflow-y-auto">
              {originalMessage.content}
            </p>
          </div>
        </div>

        {/* Formulario de Respuesta */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="reply-content" className="block text-sm font-medium text-gray-700 mb-2">
              Tu respuesta
            </label>
            <textarea
              id="reply-content"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              disabled={loading || success}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              El padre recibirá un email con tu respuesta y podrá verla en su panel de mensajes.
            </p>
          </div>

          {/* Mensajes de Error/Éxito */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600 flex items-center gap-2">
                <span className="text-lg">✓</span>
                Respuesta enviada correctamente
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || success || !content.trim()}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Respuesta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
