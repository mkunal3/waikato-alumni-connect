import { Play } from 'lucide-react';

export function TutorialVideoSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1080px] mx-auto px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
            <div className="text-left">
              <h2 className="text-black">Watch: How to Use the Platform</h2>
              <p className="text-gray-600">Mātaki: Me pēhea te whakamahi</p>
            </div>
          </div>

          <p className="text-gray-600 mb-8 max-w-[600px] mx-auto">
            Learn how to get the most out of Waikato Navigator with our step-by-step tutorial video. 
            See how easy it is to find your perfect mentor match.
          </p>

          <button className="px-8 py-3.5 bg-black text-white rounded-lg font-medium transition-all hover:bg-gray-800 hover:shadow-lg inline-flex items-center gap-2">
            <Play className="w-5 h-5" />
            Watch Tutorial Video / Mātaki Ataata
          </button>
        </div>
      </div>
    </section>
  );
}
