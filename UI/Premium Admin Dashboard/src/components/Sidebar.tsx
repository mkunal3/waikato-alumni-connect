import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Award, 
  GraduationCap, 
  GitMerge, 
  FileText, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import { useState } from 'react';

export function Sidebar() {
  const [activeItem, setActiveItem] = useState('Overview');

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview' },
    { icon: Users, label: 'User Management' },
    { icon: Clock, label: 'Pending Approvals', badge: '17' },
    { icon: Award, label: 'Mentor Applications' },
    { icon: GraduationCap, label: 'Student Applications' },
    { icon: GitMerge, label: 'Active Matches' },
    { icon: FileText, label: 'System Logs' },
    { icon: BarChart3, label: 'Reports' },
    { icon: Settings, label: 'Settings' }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0 overflow-y-auto shadow-sm">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.label;

          return (
            <button
              key={item.label}
              onClick={() => setActiveItem(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-red-50 text-[#D50000]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="bg-[#D50000] text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
