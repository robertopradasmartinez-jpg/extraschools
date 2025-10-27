'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Search,
  Trash2,
  ExternalLink,
  Phone,
  Globe,
  ChevronLeft,
  ChevronRight,
  FileText,
  Star,
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  phone: string | null;
  website: string | null;
  createdAt: string;
  user: {
    email: string;
    createdAt: string;
  };
  _count: {
    activities: number;
  };
  totalReviews: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  useEffect(() => {
    fetchCompanies();
  }, [pagination.page]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search,
      });

      const response = await fetch(`/api/admin/companies?${params}`);
      const data = await response.json();

      if (response.ok) {
        setCompanies(data.companies);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchCompanies();
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (
      !confirm(
        '¿Estás seguro de eliminar esta empresa? Se eliminarán todas sus actividades. Esta acción no se puede deshacer.'
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/companies?companyId=${companyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCompanies();
      } else {
        const data = await response.json();
        alert(data.error || 'Error al eliminar empresa');
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Error al eliminar empresa');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Empresas</h1>
          <p className="text-gray-600 mt-2">Total: {pagination.total} empresas</p>
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
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Companies Grid */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Cargando empresas...</div>
        ) : companies.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No se encontraron empresas
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  {/* Logo and Name */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900">{company.name}</h3>
                        <p className="text-xs text-gray-500">{company.user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {company.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {company.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      {company._count.activities} actividades
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      {company.totalReviews} reseñas
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4 text-sm">
                    {company.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {company.phone}
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center text-gray-600">
                        <Globe className="w-4 h-4 mr-2" />
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary-600"
                        >
                          {company.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Registration Date */}
                  <div className="text-xs text-gray-500 mb-4">
                    Registrado: {new Date(company.createdAt).toLocaleDateString('es-ES')}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/empresas/${company.id}`}
                      target="_blank"
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium text-center flex items-center justify-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Ver perfil
                    </Link>
                    <button
                      onClick={() => handleDeleteCompany(company.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      title="Eliminar empresa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Mostrando {(pagination.page - 1) * pagination.limit + 1} -{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                {pagination.total} empresas
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page - 1 })
                  }
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </button>
                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
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
