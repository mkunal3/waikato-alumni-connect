import { MessageCircle, Heart, Calendar } from 'lucide-react';

interface HeroSectionProps {
  mentorImage: string;
  bannerImage: string;
}

export function HeroSection({ mentorImage, bannerImage }: HeroSectionProps) {
  return (
    <div className="relative h-[400px] overflow-hidden rounded-[20px]">
      {/* Banner Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-12">
        <div className="flex items-center gap-8 w-full">
          {/* Profile Photo */}
          <div className="relative">
            <div className="w-48 h-48 rounded-full overflow-hidden ring-4 ring-white shadow-2xl">
              <img 
                src={mentorImage} 
                alt="Dr. Aarav Kapadia" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full ring-4 ring-white"></div>
          </div>

          {/* Mentor Info */}
          <div className="flex-1">
            <h1 className="text-white text-4xl mb-2">Dr. Aarav Kapadia</h1>
            <p className="text-white/90 text-xl mb-4">Senior Data Scientist · Microsoft New Zealand</p>
            
            {/* Tags */}
            <div className="flex gap-2 mb-6">
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full border border-white/30">
                Data Science
              </span>
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full border border-white/30">
                Cloud
              </span>
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full border border-white/30">
                Career Strategy
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button className="px-8 py-3 bg-[#D50000] text-white rounded-[12px] hover:bg-[#B00000] transition-colors shadow-lg hover:shadow-xl flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Book Session
            </button>
            <button className="px-8 py-3 bg-white text-gray-700 rounded-[12px] hover:bg-gray-50 transition-colors shadow-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Chat with Mentor
            </button>
            <button className="px-8 py-3 bg-white/20 backdrop-blur-md text-white rounded-[12px] hover:bg-white/30 transition-colors border border-white/30 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Save to Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
