import { GraduationCap } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <GraduationCap className="w-7 h-7" style={{ color: '#D50000' }} />
            <span className="font-semibold text-xl text-black">Waikato Navigator</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-black transition-colors">
              <div>Home</div>
              <div className="text-xs text-gray-500">Kāinga</div>
            </a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors">
              <div>Browse Mentors</div>
              <div className="text-xs text-gray-500">Tirohia ngā Kaitohutohu</div>
            </a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors">
              <div>Programme Guide</div>
              <div className="text-xs text-gray-500">Aratohu Hōtaka</div>
            </a>
            <button className="px-5 py-2.5 border-2 rounded-lg transition-colors hover:bg-gray-50"
              style={{ borderColor: '#D50000', color: '#D50000' }}>
              <div>Student Login</div>
              <div className="text-xs">Takiuru Ākonga</div>
            </button>
            <button className="px-5 py-2.5 rounded-lg text-white transition-colors hover:bg-[#B71C1C]"
              style={{ backgroundColor: '#D50000' }}>
              <div>Mentor Login</div>
              <div className="text-xs">Takiuru Kaitohutohu</div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
