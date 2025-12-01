import campusImage from 'figma:asset/249661a28d1ade06b30e28a00377a03878215863.png';

export function WaikatoHeroSection() {
  return (
    <section className="relative h-[600px] overflow-hidden">
      {/* Background Image */}
      <img
        src={campusImage}
        alt="University of Waikato Graduates"
        className="w-full h-full object-cover"
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1440px] mx-auto px-12 w-full">
          <div className="max-w-[700px]">
            {/* Heading */}
            <p className="text-white/70 text-xl mb-3" style={{ fontStyle: 'italic', letterSpacing: '0.5px' }}>
              Haere mai ki Waikato Alumni Connect
            </p>
            <h1 className="text-white mb-6">Welcome to Waikato Alumni Connect</h1>
            
            {/* Sub-text */}
            <p className="text-white text-xl mb-2">
              Where students & alumni grow together.
            </p>
            <p className="text-white/70 text-lg mb-10" style={{ fontStyle: 'italic', letterSpacing: '0.5px' }}>
              Mā te mahi ngātahi e tipu ai ngā ākonga me ngā alumni.
            </p>

            {/* Buttons */}
            <div className="flex gap-4 mb-12">
              <button className="px-8 py-4 rounded-xl text-white transition-all hover:shadow-xl hover:scale-105"
                style={{ backgroundColor: '#D50000' }}>
                <div>Find a Mentor</div>
                <div className="text-sm opacity-90">Kimihia he Kaitohutohu</div>
              </button>
              <button className="px-8 py-4 rounded-xl border-2 border-white text-white transition-all hover:bg-white/10">
                <div>Become a Mentor</div>
                <div className="text-sm opacity-90">Hei Kaitohutohu</div>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-[600px]">
              <input
                type="text"
                placeholder="Search by name, industry, location… / Mā te ingoa, te rāngai, te wāhi…"
                className="w-full px-6 py-4 rounded-2xl bg-white/95 backdrop-blur-sm border-0 shadow-xl focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}