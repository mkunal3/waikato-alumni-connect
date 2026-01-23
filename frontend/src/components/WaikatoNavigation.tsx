import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Globe, LayoutDashboard, LogOut, MessageSquare, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useMessageNotification } from '../contexts/MessageNotificationContext';
import { content } from '../config/content';

const waikatoLogo = '/waikato-logo.png';

export function WaikatoNavigation() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useMessageNotification();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isRegisterHovered, setIsRegisterHovered] = React.useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleDashboardClick = () => {
    if (!user) return;
    if (user.role === 'student') {
      navigate('/student/dashboard');
    } else if (user.role === 'alumni') {
      navigate('/mentor/dashboard');
    } else if (user.role === 'admin') {
      navigate('/admin/dashboard');
    }
  };

  const handleMessagesClick = () => {
    if (!user) return;
    // Navigate to dashboard where they can access chat
    if (user.role === 'student') {
      navigate('/student/dashboard');
    } else if (user.role === 'alumni') {
      navigate('/mentor/dashboard');
    }
  };

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
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/')}
            />
          </div>

          {/* Right - Language Toggle & Login */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-3 py-2 rounded-xl bg-white hover:bg-gray-50 transition-all flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
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

            {isAuthenticated && user ? (
              <>
                {/* Messages Icon (only for students and alumni) */}
                {(user.role === 'student' || user.role === 'alumni') && (
                  <button
                    onClick={handleMessagesClick}
                    className="relative px-3 py-2 rounded-xl bg-white hover:bg-gray-50 transition-all flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
                    style={{ border: 'none', position: 'relative' }}
                    title={unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'Messages'}
                  >
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                    {unreadCount > 0 && (
                      <span
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                        style={{
                          minWidth: '20px',
                          height: '20px',
                          padding: '0 6px',
                          fontSize: '0.75rem',
                        }}
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>
                )}
                
                {/* Profile Avatar */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="rounded-full transition-all focus:outline-none flex items-center justify-center cursor-pointer border-2 border-transparent hover:border-gray-200"
                      style={{ 
                        width: '40px',
                        height: '40px',
                        padding: '0',
                        aspectRatio: '1 / 1'
                      }}
                    >
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '9999px', 
                        backgroundColor: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b7280',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        flexShrink: 0
                      }}>
                        {user.name ? (
                          user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={5} className="min-w-[180px] bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-2xl p-2">
                    <DropdownMenuItem 
                      className="cursor-pointer px-4 py-3 rounded-xl hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100/80 focus:bg-gradient-to-br focus:from-gray-50 focus:to-gray-100/80 transition-all duration-200 ease-out"
                      onClick={handleDashboardClick}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      <span className="font-medium text-gray-900">Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer px-4 py-3 rounded-xl hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100/80 focus:bg-gradient-to-br focus:from-red-50 focus:to-red-100/80 transition-all duration-200 ease-out"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" style={{ color: '#D50000' }} />
                      <span className="font-medium" style={{ color: '#D50000' }}>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Login Button */}
                <button
                  className="px-2 py-2.5 rounded-xl transition-all focus:outline-none flex items-center justify-center gap-2 min-w-[120px] cursor-pointer"
                  style={{ 
                    width: '120px',
                    border: '2px solid #000000',
                    backgroundColor: isHovered ? '#D50000' : 'white',
                    color: isHovered ? 'white' : '#111827',
                    boxShadow: isHovered ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() => navigate('/login')}
                >
                  <span className="text-sm font-medium whitespace-nowrap">{t(content.nav.login.en, content.nav.login.mi)}</span>
                </button>

                {/* Register Button */}
                <button
                  className="px-2 py-2.5 rounded-xl transition-all focus:outline-none flex items-center justify-center gap-2 min-w-[120px] cursor-pointer"
                  style={{ 
                    width: '120px',
                    border: '2px solid #D50000',
                    backgroundColor: isRegisterHovered ? '#D50000' : 'white',
                    color: isRegisterHovered ? 'white' : '#D50000',
                    boxShadow: isRegisterHovered ? '0 10px 15px -3px rgba(213, 0, 0, 0.2)' : 'none'
                  }}
                  onMouseEnter={() => setIsRegisterHovered(true)}
                  onMouseLeave={() => setIsRegisterHovered(false)}
                  onClick={() => navigate('/register')}
                >
                  <span className="text-sm font-medium whitespace-nowrap">Register</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}