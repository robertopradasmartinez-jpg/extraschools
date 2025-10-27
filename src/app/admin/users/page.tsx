'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Edit2,
  Trash2,
  Shield,
  Building2,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: 'PARENT' | 'COMPANY' | 'ADMIN';
  image: string | null;
  createdAt: string;
  _count: {
    favorites: number;
    sentMessages: number;
    reviews: number;
  };
  company: {
    id: string;
    name: string;
  } | null;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>('');

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search,
        role: roleFilter,
      });

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchUsers();
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      });

      if (response.ok) {
        setEditingUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Error al actualizar el rol');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error al eliminar usuario');
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: 'bg-primary-100 text-primary-800',
      COMPANY: 'bg-blue-100 text-blue-800',
      PARENT: 'bg-green-100 text-green-800',
    };
    const icons = {
      ADMIN: Shield,
      COMPANY: Building2,
      PARENT: User,
    };
    const Icon = icons[role as keyof typeof icons];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[role as keyof typeof styles]}`}>
        <Icon className="w-3 h-3 mr-1" />
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-2">
            Total: {pagination.total} usuarios
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
              >
                <option value="ALL">Todos los roles</option>
                <option value="PARENT">Padres</option>
                <option value="COMPANY">Empresas</option>
                <option value="ADMIN">Administradores</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Cargando usuarios...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No se encontraron usuarios
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estadísticas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registro
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name || ''}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || 'Sin nombre'}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingUser === user.id ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              className="px-3 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="PARENT">PARENT</option>
                              <option value="COMPANY">COMPANY</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                            <button
                              onClick={() => handleUpdateRole(user.id, newRole)}
                              className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          getRoleBadge(user.role)
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.company ? (
                          <div className="text-sm text-gray-900">{user.company.name}</div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user._count.favorites} favoritos • {user._count.reviews} reseñas • {user._count.sentMessages} mensajes
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditingUser(user.id);
                            setNewRole(user.role);
                          }}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                          title="Editar rol"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Mostrando {(pagination.page - 1) * pagination.limit + 1} -{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                {pagination.total} usuarios
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
