export function HeroSection() {
  return (
    <section className="relative h-[500px] overflow-hidden">
      {/* Background Image */}
      <img
        src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E"
        alt="University of Waikato Students"
        className="w-full h-full object-cover"
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1080px] mx-auto px-8 w-full">
          <div className="max-w-[600px]">
            <h1 className="text-white mb-2">Welcome to Waikato Navigator</h1>
            <p className="text-white/90 mb-1">Nau mai ki Waikato Navigator</p>
            
            <p className="text-white mt-6 mb-1">
              Where students and alumni grow together.
            </p>
            <p className="text-white/90 mb-8">
              Ka tipu ngātahi ngā ākonga me ngā tauira ō mua.
            </p>

            {/* Buttons */}
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-lg text-white font-medium transition-all hover:shadow-lg hover:bg-[#B71C1C]"
                style={{ backgroundColor: '#D50000' }}>
                Find a Mentor / Kimihia he Kaitohutohu
              </button>
              <button className="px-6 py-3 rounded-lg border-2 border-white text-white font-medium transition-all hover:bg-white/10">
                Become a Mentor / Tangohia te Tūranga Kaitohutohu
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
