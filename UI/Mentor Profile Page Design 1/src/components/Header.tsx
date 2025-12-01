import { Search } from 'lucide-react';
import logo from 'figma:asset/db2e9e04f65d3b029ee3458fee7925cd0a8c7f70.png';

export function Header() {
  return (
    <header className="border-b" style={{ borderColor: 'var(--waikato-border)' }}>
      <div className="max-w-[1440px] mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <img src={logo} alt="University of Waikato" className="h-12" />
          </div>
          <nav className="flex items-center gap-6">
            <a href="#" className="hover:opacity-70" style={{ color: 'var(--waikato-dark)' }}>Home</a>
            <a href="#" className="hover:opacity-70" style={{ color: 'var(--waikato-dark)' }}>Find a Mentor</a>
            <a href="#" className="hover:opacity-70" style={{ color: 'var(--waikato-dark)' }}>Become a Mentor</a>
            <a href="#" className="hover:opacity-70" style={{ color: 'var(--waikato-dark)' }}>Resources</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:opacity-70">
            <Search className="w-5 h-5" style={{ color: 'var(--waikato-dark)' }} />
          </button>
          <button className="px-4 py-2 border rounded-lg hover:opacity-70" style={{ 
            borderColor: 'var(--waikato-border)',
            color: 'var(--waikato-dark)' 
          }}>
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}