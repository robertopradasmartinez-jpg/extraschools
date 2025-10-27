'use client'

import { useState, useEffect } from 'react'
import { Mail, MailOpen, Send, RefreshCw, Inbox, Clock } from 'lucide-react'
import ReplyMessageModal from './ReplyMessageModal'

interface Message {
  id: string
  subject: string
  content: string
  read: boolean
  createdAt: string
  sender?: {
    id: string
    name: string | null
    email: string
  }
  receiver?: {
    id: string
    name: string | null
    email: string
  }
  activity?: {
    id: string
    title: string
  }
}

export default function ParentMessagesClient() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received')
  const [loading, setLoading] = useState(true)

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/messages?type=${activeTab}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [activeTab])

  const handleSelectMessage = async (message: Message) => {
    setSelectedMessage(message)
    
    // Si es un mensaje recibido y no está leído, marcarlo como leído
    if (activeTab === 'received' && !message.read) {
      try {
        const response = await fetch('/api/messages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messageId: message.id }),
        })
        
        if (response.ok) {
          setMessages(prevMessages =>
            prevMessages.map(m =>
              m.id === message.id ? { ...m, read: true } : m
            )
          )
        }
      } catch (error) {
        console.error('Error al marcar mensaje como leído:', error)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Ayer'
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    }
  }

  const receivedMessages = messages.filter(m => activeTab === 'received')
  const sentMessages = messages.filter(m => activeTab === 'sent')
  const unreadCount = messages.filter(m => !m.read && activeTab === 'received').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mis Mensajes</h1>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                activeTab === 'received'
                  ? 'bg-secondary-50 text-primary-600 border-b-2 border-primary-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Inbox className="w-4 h-4" />
                Recibidos
                {unreadCount > 0 && (
                  <span className="bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                activeTab === 'sent'
                  ? 'bg-secondary-50 text-primary-600 border-b-2 border-primary-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Enviados
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          {/* Lista de mensajes */}
          <div className="lg:col-span-1 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Mail className="w-16 h-16 mb-4" />
                <p className="text-lg font-medium">No hay mensajes</p>
                <p className="text-sm">
                  {activeTab === 'received' 
                    ? 'Aún no has recibido ningún mensaje'
                    : 'Aún no has enviado ningún mensaje'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {messages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => handleSelectMessage(message)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                      selectedMessage?.id === message.id ? 'bg-secondary-50' : ''
                    } ${!message.read && activeTab === 'received' ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {!message.read && activeTab === 'received' ? (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        ) : (
                          <div className="w-2 h-2"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm truncate ${!message.read && activeTab === 'received' ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                            {activeTab === 'received' 
                              ? message.sender?.name || 'Usuario' 
                              : message.receiver?.name || 'Usuario'}
                          </p>
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <p className={`text-sm truncate ${!message.read && activeTab === 'received' ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                          {message.subject}
                        </p>
                        {message.activity && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            Re: {message.activity.title}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalle del mensaje */}
          <div className="lg:col-span-2 p-6 bg-gray-50">
            {selectedMessage ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                    {!selectedMessage.read && activeTab === 'received' && (
                      <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Nuevo
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {activeTab === 'received' ? 'De:' : 'Para:'}
                      </span>
                      <span>
                        {activeTab === 'received' 
                          ? `${selectedMessage.sender?.name} (${selectedMessage.sender?.email})`
                          : `${selectedMessage.receiver?.name} (${selectedMessage.receiver?.email})`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(selectedMessage.createdAt).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {selectedMessage.activity && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Actividad:</span>
                        <a 
                          href={`/activity/${selectedMessage.activity.id}`}
                          className="text-primary-500 hover:text-primary-600 hover:underline"
                        >
                          {selectedMessage.activity.title}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {selectedMessage.content}
                  </p>
                </div>

                {/* Botón de responder */}
                {activeTab === 'received' && selectedMessage.sender && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setIsReplyModalOpen(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-medium"
                    >
                      <Send className="w-4 h-4" />
                      Responder Mensaje
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MailOpen className="w-20 h-20 mb-4" />
                <p className="text-lg font-medium">Selecciona un mensaje</p>
                <p className="text-sm">Elige un mensaje de la lista para verlo</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {selectedMessage && selectedMessage.sender && (
        <ReplyMessageModal
          isOpen={isReplyModalOpen}
          onClose={() => setIsReplyModalOpen(false)}
          originalMessage={selectedMessage as any}
          onSuccess={() => {
            fetchMessages()
            setSelectedMessage(null)
          }}
        />
      )}
    </div>
  )
}
