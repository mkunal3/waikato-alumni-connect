import { Video } from 'lucide-react';

export function TutorialSectionWaikato() {
  return (
    <section className="py-20" style={{ backgroundColor: '#EDEDED' }}>
      <div className="max-w-[1440px] mx-auto px-12">
        <div className="text-center">
          {/* Icon and Heading */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#D50000' }}>
              <Video className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-black">Watch: How to Use the Platform</h2>
              <p className="text-gray-600 text-xl" style={{ fontStyle: 'italic' }}>
                Mātaki: Me pēhea te whakamahi i te papaaho
              </p>
            </div>
          </div>

          <p className="text-gray-600 mb-10 max-w-[700px] mx-auto text-lg">
            Learn how to get the most out of Waikato Navigator with our comprehensive tutorial video.
          </p>

          {/* Button */}
          <button className="px-10 py-4 bg-black text-white rounded-xl transition-all hover:bg-gray-800 hover:shadow-xl inline-flex items-center gap-3">
            <Video className="w-5 h-5" />
            <div>
              <div>Watch Tutorial Video</div>
              <div className="text-sm opacity-90">Mātaki Ataata Akoranga</div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
