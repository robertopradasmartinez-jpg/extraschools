'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Inbox, Send, Mail, MailOpen, Loader2, RefreshCcw } from 'lucide-react';
import ReplyMessageModal from './ReplyMessageModal';

interface Message {
  id: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: string;
  senderId: string;
  receiverId: string;
  sender: {
    id: string;
    name: string | null;
    email: string;
  };
  receiver: {
    id: string;
    name: string | null;
    email: string;
  };
  activity?: {
    id: string;
    title: string;
  };
}

export default function CompanyMessagesClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/messages?type=${activeTab === 'received' ? 'received' : 'sent'}`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [activeTab]);

  const markAsRead = async (messageId: string) => {
    try {
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, read: true }),
      });
      
      // Actualizar localmente
      setMessages(messages.map(m => 
        m.id === messageId ? { ...m, read: true } : m
      ));
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, read: true });
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const receivedMessages = activeTab === 'received' ? messages : [];
  const unreadCount = receivedMessages.filter(m => !m.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mensajes</h1>
          <p className="mt-1 text-sm text-gray-600">
            Comunicación con padres y usuarios interesados
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCcw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">No leídos</p>
              <p className="text-2xl font-bold text-primary-600">{unreadCount}</p>
            </div>
            <Mail className="w-8 h-8 text-primary-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{activeTab === 'received' ? 'Recibidos' : 'Enviados'}</p>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
            </div>
            <Inbox className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => {
                setActiveTab('received');
                setSelectedMessage(null);
              }}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'received'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Recibidos
            </button>
            <button
              onClick={() => {
                setActiveTab('sent');
                setSelectedMessage(null);
              }}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'sent'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Enviados
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No hay mensajes {activeTab === 'received' ? 'recibidos' : 'enviados'}
              </p>
            </div>
          ) : selectedMessage ? (
            /* Message Detail */
            <div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-sm text-primary-600 hover:text-primary-700 mb-4"
              >
                ← Volver a la lista
              </button>
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {selectedMessage.subject}
                    </h3>
                    <div className="flex flex-col gap-2 text-sm text-gray-600">
                      <span>
                        <strong>De:</strong> {selectedMessage.sender.name || 'Usuario'} ({selectedMessage.sender.email})
                      </span>
                      {selectedMessage.activity && (
                        <span>
                          <strong>Actividad:</strong>{' '}
                          <a 
                            href={`/activity/${selectedMessage.activity.id}`}
                            className="text-primary-500 hover:text-primary-600 hover:underline"
                          >
                            {selectedMessage.activity.title}
                          </a>
                        </span>
                      )}
                      <span>
                        {new Date(selectedMessage.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                  {!selectedMessage.read && activeTab === 'received' && (
                    <button
                      onClick={() => markAsRead(selectedMessage.id)}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Marcar como leído
                    </button>
                  )}
                </div>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line text-gray-700">
                    {selectedMessage.content}
                  </p>
                </div>
                {activeTab === 'received' && (
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
            </div>
          ) : (
            /* Messages List */
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.read && activeTab === 'received') {
                      markAsRead(message.id);
                    }
                  }}
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    message.read || activeTab === 'sent'
                      ? 'border-gray-200 hover:border-gray-300 bg-white'
                      : 'border-secondary-200 bg-secondary-50 hover:bg-secondary-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!message.read && activeTab === 'received' && (
                          <Mail className="w-4 h-4 text-primary-500" />
                        )}
                        {message.read && activeTab === 'received' && (
                          <MailOpen className="w-4 h-4 text-gray-400" />
                        )}
                        <h3 className="font-semibold text-gray-900">
                          {message.subject}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {activeTab === 'received' 
                          ? `De: ${message.sender?.name || 'Usuario'} (${message.sender?.email || 'N/A'})`
                          : `Para: ${message.receiver?.name || 'Usuario'} (${message.receiver?.email || 'N/A'})`
                        }
                      </p>
                      {message.activity && (
                        <p className="text-xs text-gray-500 mb-2">
                          Re: {message.activity.title}
                        </p>
                      )}
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {message.content}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                      {new Date(message.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>📧 Notificaciones automáticas:</strong> Cuando recibes un mensaje, se te envía una notificación por email automáticamente. Puedes responder directamente desde tu correo o desde este panel.
        </p>
      </div>

      {/* Reply Modal */}
      {selectedMessage && (
        <ReplyMessageModal
          isOpen={isReplyModalOpen}
          onClose={() => setIsReplyModalOpen(false)}
          originalMessage={selectedMessage}
          onSuccess={() => {
            fetchMessages()
            setSelectedMessage(null)
          }}
        />
      )}
    </div>
  );
}
