import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useLanguage } from '../contexts/LanguageContext';
import { content } from '../config/content';

const waikatoLogo = '/waikato-logo.png';

export function WaikatoNavigation() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-8 py-3">
        <div className="flex items-center justify-between gap-8">
          {/* Left - Logo */}
          <div className="flex items-center flex-shrink-0">
            <img 
              src={waikatoLogo} 
              alt="University of Waikato" 
              className="h-12 object-contain"
            />
          </div>

          {/* Right - Language Toggle & Login */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-3 py-2 rounded-xl bg-white hover:bg-gray-50 transition-all flex items-center justify-center gap-2 focus:outline-none"
                  style={{ width: '100px', border: 'none' }}>
                  <Globe className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 inline-block text-center" style={{ width: '24px' }}>
                    {language === 'en' ? 'EN' : 'MI'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={5} className="min-w-[160px] bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-2xl p-2">
                <DropdownMenuItem 
                  className={`cursor-pointer px-4 py-2.5 rounded-xl transition-all duration-200 ${language === 'en' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  onClick={() => setLanguage('en')}
                >
                  <span className="font-medium text-gray-900">English</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={`cursor-pointer px-4 py-2.5 rounded-xl transition-all duration-200 ${language === 'mi' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  onClick={() => setLanguage('mi')}
                >
                  <span className="font-medium text-gray-900">Te Reo Maori</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Login Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger 
                className="px-2 py-2.5 rounded-xl transition-all focus:outline-none flex items-center justify-center gap-2 min-w-[120px]"
                style={{ 
                  width: '120px',
                  border: '2px solid #000000',
                  backgroundColor: isHovered ? '#D50000' : 'white',
                  color: isHovered ? 'white' : '#111827',
                  boxShadow: isHovered ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>
                <span className="text-sm font-medium whitespace-nowrap">{t(content.nav.login.en, content.nav.login.mi)}</span>
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={5} className="min-w-[200px] bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-2xl p-3">
                <DropdownMenuItem 
                  className="cursor-pointer px-4 py-3 rounded-xl hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100/80 focus:bg-gradient-to-br focus:from-gray-50 focus:to-gray-100/80 transition-all duration-200 ease-out"
                  onClick={() => navigate('/login')}
                >
                  <span className="font-medium text-gray-900">{t(content.nav.studentLogin.en, content.nav.studentLogin.mi)}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer px-4 py-3 rounded-xl hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100/80 focus:bg-gradient-to-br focus:from-gray-50 focus:to-gray-100/80 transition-all duration-200 ease-out"
                  onClick={() => navigate('/login')}
                >
                  <span className="font-medium text-gray-900">{t(content.nav.mentorLogin.en, content.nav.mentorLogin.mi)}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer px-4 py-3 rounded-xl hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100/80 focus:bg-gradient-to-br focus:from-gray-50 focus:to-gray-100/80 transition-all duration-200 ease-out"
                  onClick={() => navigate('/login')}
                >
                  <span className="font-medium text-gray-900">{t(content.nav.adminLogin.en, content.nav.adminLogin.mi)}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}