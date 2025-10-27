'use client';

import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityId: string;
  activityTitle: string;
  companyName: string;
}

export default function ContactModal({
  isOpen,
  onClose,
  activityId,
  activityTitle,
  companyName,
}: ContactModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    subject: `Consulta sobre: ${activityTitle}`,
    content: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityId,
          subject: formData.subject,
          content: formData.content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el mensaje');
      }

      setSuccess(true);
      
      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          subject: `Consulta sobre: ${activityTitle}`,
          content: '',
        });
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Contactar con {companyName}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Sobre: {activityTitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  ✅ Mensaje enviado correctamente
                </p>
                <p className="text-sm text-green-700 mt-1">
                  La empresa ha recibido una notificación por email y te responderá pronto.
                </p>
              </div>
            )}

            {/* Subject Field */}
            <div className="mb-4">
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Asunto *
              </label>
              <input
                type="text"
                id="subject"
                required
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ej: Consulta sobre horarios"
                disabled={loading || success}
              />
            </div>

            {/* Message Field */}
            <div className="mb-6">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mensaje *
              </label>
              <textarea
                id="content"
                required
                rows={6}
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Escribe tu consulta aquí..."
                disabled={loading || success}
              />
              <p className="text-xs text-gray-500 mt-1">
                La empresa recibirá tu mensaje y tu email para poder responderte.
              </p>
            </div>

            {/* Info Box */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>📧 Notificación automática:</strong> La empresa recibirá un email
                inmediatamente con tu mensaje y podrá responderte directamente.
              </p>
            </div>

            {/* Footer */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar mensaje
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
