'use client';

import { useEffect, useState } from 'react';
import { Trash2, ChevronLeft, ChevronRight, User, Building2, Shield } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  read: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
  receiver: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
  activity: {
    id: string;
    title: string;
  } | null;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 0,
  });

  useEffect(() => {
    fetchMessages();
  }, [pagination.page]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const response = await fetch(`/api/admin/messages?${params}`);
      const data = await response.json();

      if (response.ok) {
        setMessages(data.messages);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('¿Estás seguro de eliminar este mensaje?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/messages?messageId=${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error al eliminar mensaje');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return Shield;
      case 'COMPANY':
        return Building2;
      default:
        return User;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Mensajes</h1>
        <p className="text-gray-600 mt-2">Total: {pagination.total} mensajes</p>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Cargando mensajes...</div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No hay mensajes</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      De
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Para
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actividad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Mensaje
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {messages.map((message) => {
                    const SenderIcon = getRoleIcon(message.sender.role);
                    const ReceiverIcon = getRoleIcon(message.receiver.role);
                    return (
                      <tr key={message.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <SenderIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {message.sender.name || 'Sin nombre'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {message.sender.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <ReceiverIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {message.receiver.name || 'Sin nombre'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {message.receiver.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {message.activity ? (
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {message.activity.title}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-md line-clamp-2">
                            {message.content}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(message.createdAt).toLocaleString('es-ES')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              message.read
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {message.read ? 'Leído' : 'No leído'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar mensaje"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
              <div className="text-sm text-gray-700">
                Mostrando {(pagination.page - 1) * pagination.limit + 1} -{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                {pagination.total} mensajes
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </button>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
