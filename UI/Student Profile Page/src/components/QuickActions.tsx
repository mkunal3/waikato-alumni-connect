import { UserCircle, Calendar, Users, MessageCircle } from 'lucide-react';

export function QuickActions() {
  const actions = [
    { icon: UserCircle, label: 'Update Profile' },
    { icon: Calendar, label: 'Book a Session' },
    { icon: Users, label: 'View Mentor List' },
    { icon: MessageCircle, label: 'Chat with Mentor' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="mb-4">Quick Actions</h2>
      
      <div className="space-y-2">
        {actions.map((action, index) => (
          <button 
            key={index}
            className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <action.icon className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
