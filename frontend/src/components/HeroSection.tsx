export function HeroSection() {
  return (
    <section className="relative h-[500px] overflow-hidden">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1730173737002-67e5b10d1182?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjB3YWxraW5nJTIwY2FtcHVzfGVufDF8fHx8MTc2NDEyMjA5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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
