import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export function MentorDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-[#D50000] text-white rounded-lg hover:bg-[#B71C1C] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Dashboard</h2>
          <p className="text-gray-600">
            Mentor dashboard content will be implemented here.
          </p>
          {user && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Approval Status:</strong> {user.approvalStatus}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

