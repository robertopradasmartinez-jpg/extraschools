'use client';

import { User } from 'next-auth';
import { Mail, Shield, User as UserIcon } from 'lucide-react';
import ProfileEditForm from './ProfileEditForm';
import PasswordChangeForm from './PasswordChangeForm';

interface ProfileClientProps {
  user: User;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-primary-100 text-primary-800';
      case 'COMPANY':
        return 'bg-blue-100 text-blue-800';
      case 'PARENT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'COMPANY':
        return 'Empresa';
      case 'PARENT':
        return 'Padre/Madre';
      default:
        return role;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* User Info Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || 'User'}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-white" />
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <div className="flex items-center space-x-2 text-gray-600 mt-1">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role || 'PARENT')}`}>
                {getRoleDisplayName(user.role || 'PARENT')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Edit Form */}
        <div className="bg-white rounded-lg shadow-sm">
          <ProfileEditForm user={user} />
        </div>

        {/* Password Change Form */}
        <div className="bg-white rounded-lg shadow-sm">
          <PasswordChangeForm />
        </div>
      </div>
    </div>
  );
}
