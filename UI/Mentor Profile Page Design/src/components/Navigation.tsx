import { Bell } from 'lucide-react';
import waikatoLogo from 'figma:asset/db2e9e04f65d3b029ee3458fee7925cd0a8c7f70.png';

export function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-8 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <img src={waikatoLogo} alt="Waikato University" className="h-10" />
        </div>

        {/* Center: Menu */}
        <div className="flex items-center gap-8">
          <a href="#" className="text-gray-700 hover:text-[#D50000] transition-colors">
            Home
          </a>
          <a href="#" className="text-gray-700 hover:text-[#D50000] transition-colors">
            Sessions
          </a>
          <a href="#" className="text-gray-700 hover:text-[#D50000] transition-colors">
            Mentors
          </a>
          <a href="#" className="text-gray-700 hover:text-[#D50000] transition-colors">
            Students
          </a>
        </div>

        {/* Right: Notifications & User */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#D50000] rounded-full"></span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D50000] to-red-700 flex items-center justify-center text-white">
              N
            </div>
            <span className="text-gray-700">Neeraj</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
