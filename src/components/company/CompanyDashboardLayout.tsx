'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  CreditCard,
  PlusCircle,
  Menu,
  X,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const t = useTranslations('company');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Para móvil
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Para escritorio

  // Cargar estado del sidebar desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('companySidebarCollapsed');
    if (saved !== null) {
      setSidebarCollapsed(saved === 'true');
    }
  }, []);

  // Guardar estado en localStorage cuando cambie
  const toggleSidebarCollapse = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('companySidebarCollapsed', newState.toString());
  };

  const navigation = [
    {
      name: t('dashboard'),
      href: '/company/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: t('myActivities'),
      href: '/company/activities',
      icon: FileText,
    },
    {
      name: t('messages'),
      href: '/company/messages',
      icon: MessageSquare,
    },
    {
      name: 'Perfil de Empresa',
      href: '/company/profile',
      icon: Building2,
    },
    {
      name: t('subscription'),
      href: '/company/subscription',
      icon: CreditCard,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        <div className="flex flex-col h-full relative">
          {/* Logo - Solo visible cuando está expandido */}
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <Link href="/" className="flex items-center overflow-hidden">
                <span className="text-xl font-bold text-primary-500 whitespace-nowrap">
                  ExtraSchools
                </span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}
          
          {/* Logo colapsado - Solo visible en móvil cuando está colapsado */}
          {sidebarCollapsed && (
            <div className="lg:flex items-center justify-center h-16 px-6 border-b border-gray-200 hidden">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-primary-500">
                  ES
                </span>
              </Link>
            </div>
          )}

          {/* Collapse button - flotante en el medio del borde derecho - solo en desktop */}
          <button
            onClick={toggleSidebarCollapse}
            className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 items-center justify-center w-6 h-12 bg-white border border-gray-200 rounded-r-lg shadow-sm hover:bg-gray-50 transition z-40"
            title={sidebarCollapsed ? 'Expandir menú' : 'Contraer menú'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Navigation */}
          <nav className="flex-1 px-6 pt-8 pb-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center rounded-lg transition ${
                    isActive
                      ? 'bg-secondary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${sidebarCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'}`}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <item.icon 
                    className={`w-5 h-5 flex-shrink-0 ${!sidebarCollapsed && 'mr-3'} ${
                      isActive ? 'text-primary-600' : 'text-gray-700'
                    }`} 
                    style={{ opacity: 1 }}
                  />
                  {!sidebarCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                </Link>
              );
            })}

            {/* Add Activity Button - Siempre visible */}
            <Link
              href="/company/activities/new"
              className={`flex items-center text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition mt-4 ${
                sidebarCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'
              }`}
              title={sidebarCollapsed ? t('addActivity') : undefined}
            >
              <PlusCircle 
                className={`w-5 h-5 flex-shrink-0 ${!sidebarCollapsed && 'mr-3'}`}
                style={{ opacity: 1 }}
              />
              {!sidebarCollapsed && <span>{t('addActivity')}</span>}
            </Link>
          </nav>

          {/* Footer - Solo visible cuando está expandido */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-gray-200">
              <Link
                href="/"
                className="block text-sm text-center text-gray-600 hover:text-gray-900"
              >
                {t('backToSite')}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main content - se ajusta según el estado del sidebar */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center h-16 bg-white border-b border-gray-200 px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="ml-4 lg:ml-0 text-xl font-semibold text-gray-900">
            {t('companyPortal')}
          </h1>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
