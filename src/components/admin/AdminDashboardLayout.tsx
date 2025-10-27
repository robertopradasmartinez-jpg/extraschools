'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Settings,
  Menu,
  X,
  Shield,
  BarChart3,
  MessageSquare,
  BookOpen,
} from 'lucide-react';
import { useState } from 'react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Usuarios',
      href: '/admin/users',
      icon: Users,
    },
    {
      name: 'Empresas',
      href: '/admin/companies',
      icon: Building2,
    },
    {
      name: 'Actividades',
      href: '/admin/activities',
      icon: FileText,
    },
    {
      name: 'Blog',
      href: '/admin/blog',
      icon: BookOpen,
    },
    {
      name: 'Mensajes',
      href: '/admin/messages',
      icon: MessageSquare,
    },
    {
      name: 'Estadísticas',
      href: '/admin/stats',
      icon: BarChart3,
    },
    {
      name: 'Configuración',
      href: '/admin/settings',
      icon: Settings,
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
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-primary-900 to-primary-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-primary-700">
            <Link href="/" className="flex items-center">
              <Shield className="w-8 h-8 text-primary-300 mr-3" />
              <span className="text-xl font-bold text-white">Admin Panel</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-primary-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition ${
                    isActive
                      ? 'bg-primary-700 text-white shadow-lg'
                      : 'text-primary-200 hover:bg-primary-700/50 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-primary-700">
            <Link
              href="/"
              className="flex items-center px-4 py-2 text-sm text-primary-200 hover:text-white transition"
            >
              <span>← Volver al sitio</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                <Shield className="w-3 h-3 mr-1" />
                Administrador
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
