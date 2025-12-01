import { GraduationCap, Settings, HelpCircle } from 'lucide-react';

export function HomeNavigation() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1080px] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <div className="flex items-center gap-2">
            <GraduationCap className="w-7 h-7" style={{ color: '#D50000' }} />
            <span className="font-semibold text-xl text-black">Waikato Navigator</span>
          </div>

          {/* Center Navigation Tabs */}
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-700 hover:text-black transition-colors px-3 py-2">
              <div className="text-center">Home / Kāinga</div>
            </a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors px-3 py-2">
              <div className="text-center">Browse Mentors / Tirohia ngā Kaitohutohu</div>
            </a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors px-3 py-2">
              <div className="text-center">About Programme / Mō te Hōtaka</div>
            </a>
            <button className="px-5 py-2.5 rounded-lg text-white transition-colors hover:bg-[#B71C1C]"
              style={{ backgroundColor: '#D50000' }}>
              Student Login / Takiuru Ākonga
            </button>
            <button className="px-5 py-2.5 border-2 rounded-lg transition-colors hover:bg-gray-50"
              style={{ borderColor: '#D50000', color: '#D50000' }}>
              Mentor Login / Takiuru Kaitohutohu
            </button>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-black transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-black transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
