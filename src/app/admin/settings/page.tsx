'use client';

import { Settings as SettingsIcon, Save } from 'lucide-react';
import { useState } from 'react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'ExtraSchools',
    supportEmail: 'soporte@extraschools.com',
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: false,
    maxActivitiesPerCompany: 100,
    subscriptionPrice: 29.99,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // TODO: Implementar guardado en base de datos
    console.log('Settings saved:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-2">Ajustes generales de la plataforma</p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <SettingsIcon className="w-6 h-6 mr-2 text-primary-600" />
          Configuración General
        </h2>

        <div className="space-y-6">
          {/* Site Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Sitio
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Support Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de Soporte
            </label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) =>
                setSettings({ ...settings, supportEmail: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Subscription Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio de Suscripción Mensual (€)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.subscriptionPrice}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  subscriptionPrice: parseFloat(e.target.value),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Max Activities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máximo de Actividades por Empresa
            </label>
            <input
              type="number"
              value={settings.maxActivitiesPerCompany}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxActivitiesPerCompany: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Feature Flags */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Opciones de Plataforma</h2>

        <div className="space-y-4">
          {/* Maintenance Mode */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Modo Mantenimiento</p>
              <p className="text-sm text-gray-600">
                Deshabilita el acceso público al sitio
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  setSettings({ ...settings, maintenanceMode: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Allow Registrations */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Permitir Registros</p>
              <p className="text-sm text-gray-600">
                Permite que nuevos usuarios se registren
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowRegistrations}
                onChange={(e) =>
                  setSettings({ ...settings, allowRegistrations: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Email Verification */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Verificación de Email</p>
              <p className="text-sm text-gray-600">
                Requiere verificación de email para nuevos usuarios
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    requireEmailVerification: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium flex items-center"
        >
          <Save className="w-5 h-5 mr-2" />
          Guardar Configuración
        </button>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          ✓ Configuración guardada correctamente
        </div>
      )}
    </div>
  );
}
