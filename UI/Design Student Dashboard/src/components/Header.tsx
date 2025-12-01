import { User, Home, Users, Calendar, MessageSquare, UserCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#D50000] rounded flex items-center justify-center">
              <span className="text-white font-semibold">W</span>
            </div>
            <span className="text-gray-900">Waikato Alumni Connect</span>
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-900 border-b-2 border-[#D50000] pb-1">
              Dashboard
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Find a Mentor
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Events
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Messages
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Profile
            </a>
          </nav>
          
          {/* User Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
