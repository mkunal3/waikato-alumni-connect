import waikatoLogo from 'figma:asset/db2e9e04f65d3b029ee3458fee7925cd0a8c7f70.png';

export function WaikatoNavigation() {
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

          {/* Center - Menu Items */}
          <div className="flex items-center gap-8 flex-1 justify-center">
            <a href="#" className="text-center hover:opacity-70 transition-opacity whitespace-nowrap">
              <div className="text-gray-800 text-sm">Home</div>
              <div className="text-xs text-gray-500">Kāinga</div>
            </a>
            <a href="#" className="text-center hover:opacity-70 transition-opacity whitespace-nowrap">
              <div className="text-gray-800 text-sm">Events</div>
              <div className="text-xs text-gray-500">Ngā Takunetanga</div>
            </a>
            <a href="#" className="text-center hover:opacity-70 transition-opacity whitespace-nowrap">
              <div className="text-gray-800 text-sm">Students</div>
              <div className="text-xs text-gray-500">Ākonga</div>
            </a>
            <a href="#" className="text-center hover:opacity-70 transition-opacity whitespace-nowrap">
              <div className="text-gray-800 text-sm">Mentors</div>
              <div className="text-xs text-gray-500">Kaitohutohu</div>
            </a>
          </div>

          {/* Right - Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="px-5 py-2.5 border-2 rounded-xl transition-all hover:bg-gray-50"
              style={{ borderColor: '#D50000', color: '#D50000' }}>
              <div className="text-sm">Student Login</div>
              <div className="text-xs whitespace-nowrap">Takiuru Ākonga</div>
            </button>
            <button className="px-5 py-2.5 rounded-xl text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: '#D50000' }}>
              <div className="text-sm">Mentor Login</div>
              <div className="text-xs whitespace-nowrap">Takiuru Kaitohutohu</div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}