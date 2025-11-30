import logoImage from 'figma:asset/db2e9e04f65d3b029ee3458fee7925cd0a8c7f70.png';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <img src={logoImage} alt="University of Waikato" className="h-20" />
          </div>
          <nav className="flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
              Study
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
              Research
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
