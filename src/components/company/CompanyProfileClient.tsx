'use client';

import { useState } from 'react';
import { Building2, Mail, Phone, Globe, Star } from "lucide-react";
import CompanyProfileEditForm from './CompanyProfileEditForm';

interface CompanyData {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  website: string | null;
  logo: string | null;
  whatsappEnabled: boolean;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface CompanyProfileClientProps {
  initialCompany: CompanyData;
}

export default function CompanyProfileClient({ initialCompany }: CompanyProfileClientProps) {
  const [company, setCompany] = useState<CompanyData>(initialCompany);

  const handleCompanyUpdate = (updatedCompany: CompanyData) => {
    setCompany(updatedCompany);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Company Info Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start space-x-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <Building2 className="w-12 h-12 text-white" />
              </div>
            )}
          </div>

          {/* Company Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                <p className="text-gray-600 mt-1">Perfil de Empresa</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Empresa Verificada
              </span>
            </div>

            {/* Description */}
            {company.description && (
              <p className="text-gray-700 mt-4 leading-relaxed">
                {company.description}
              </p>
            )}

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* Email */}
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email de contacto</p>
                  <p className="font-medium">{company.user.email}</p>
                </div>
              </div>

              {/* Phone */}
              {company.phone && (
                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Teléfono</p>
                    <p className="font-medium">{company.phone}</p>
                  </div>
                </div>
              )}

              {/* Website */}
              {company.website && (
                <div className="flex items-center space-x-3 text-gray-600">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Sitio web</p>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}

              {/* Member Since */}
              <div className="flex items-center space-x-3 text-gray-600">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Miembro desde</p>
                  <p className="font-medium">
                    {new Date(company.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-lg shadow-sm">
        <CompanyProfileEditForm
          company={company}
          onCompanyUpdate={handleCompanyUpdate}
        />
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Información importante</p>
            <p>
              Tu perfil de empresa es visible para todos los usuarios. Asegúrate de mantener
              tu información actualizada para que los padres puedan contactarte fácilmente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
