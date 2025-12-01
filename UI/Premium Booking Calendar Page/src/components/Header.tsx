import { Search } from 'lucide-react';
import waikatoLogo from 'figma:asset/db2e9e04f65d3b029ee3458fee7925cd0a8c7f70.png';

interface HeaderProps {
  viewMode: 'month' | 'week' | 'day';
  onViewModeChange: (mode: 'month' | 'week' | 'day') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ viewMode, onViewModeChange, searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <img src={waikatoLogo} alt="Waikato Logo" className="h-12" />
          <h1 className="text-gray-900">Booking Calendar</h1>
        </div>

        {/* View Mode Toggles */}
        <div className="flex items-center gap-4">
          <div className="flex bg-[#F4F4F8] rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('month')}
              className={`px-4 py-2 rounded-md transition-all ${
                viewMode === 'month'
                  ? 'bg-white shadow-sm text-[#D50000]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => onViewModeChange('week')}
              className={`px-4 py-2 rounded-md transition-all ${
                viewMode === 'week'
                  ? 'bg-white shadow-sm text-[#D50000]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => onViewModeChange('day')}
              className={`px-4 py-2 rounded-md transition-all ${
                viewMode === 'day'
                  ? 'bg-white shadow-sm text-[#D50000]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Day
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search mentor, student, session…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D50000] focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
