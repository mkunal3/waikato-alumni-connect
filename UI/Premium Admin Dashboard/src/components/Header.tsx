import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import waikatoLogo from 'figma:asset/db2e9e04f65d3b029ee3458fee7925cd0a8c7f70.png';

export function Header() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showDropdown, setShowDropdown] = useState(false);

  const tabs = [
    'Dashboard',
    'Users',
    'Mentors',
    'Students',
    'Sessions',
    'Approvals',
    'Settings'
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src={waikatoLogo} 
            alt="University of Waikato" 
            className="h-10"
          />
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 flex-1 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-[#D50000] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Admin Profile */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <div className="text-right">
              <div className="text-sm">Admin User</div>
              <div className="text-xs text-gray-500">admin@waikato.ac.nz</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#D50000] flex items-center justify-center text-white">
              AU
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm">
                Profile Settings
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm">
                Account
              </button>
              <hr className="my-2" />
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-red-600">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
