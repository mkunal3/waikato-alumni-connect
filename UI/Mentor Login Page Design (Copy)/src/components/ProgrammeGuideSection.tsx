import { GraduationCap, Users, CheckCircle } from 'lucide-react';

export function ProgrammeGuideSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1080px] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-black mb-2">Programme Guide</h2>
          <p className="text-gray-600 mb-4">Aratohu Hōtaka</p>
          <p className="text-gray-600 max-w-[700px] mx-auto">
            Everything you need to know about the Waikato Navigator mentoring programme. 
            Whether you're a student seeking guidance or an alumni ready to give back, we're here to support your journey.
          </p>
        </div>

        {/* Two Cards */}
        <div className="grid grid-cols-2 gap-8">
          {/* For Students Card */}
          <div className="bg-gray-50 rounded-xl p-8 shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#D50000' }}>
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            
            <h2 className="text-black mb-2">For Students</h2>
            <p className="text-gray-600 mb-6">Mō ngā Ākonga</p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-700">
                  Final-year CMS students eligible to participate
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-700">
                  Upload CV and complete your academic profile
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-700">
                  Choose from three mentoring styles to suit your needs
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-700">
                  Get matched with mentors for a 4-month programme
                </p>
              </div>
            </div>

            <button className="mt-6 w-full py-3 rounded-lg text-white font-medium transition-all hover:bg-[#B71C1C]"
              style={{ backgroundColor: '#D50000' }}>
              Student Registration
            </button>
          </div>

          {/* For Mentors Card */}
          <div className="bg-gray-50 rounded-xl p-8 shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#D50000' }}>
              <Users className="w-7 h-7 text-white" />
            </div>
            
            <h2 className="text-black mb-2">For Mentors</h2>
            <p className="text-gray-600 mb-6">Mō ngā Kaitohutohu</p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-700">
                  Open to all Waikato University alumni
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-700">
                  Share your professional experience and insights
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-700">
                  Choose your preferred mentoring style and commitment
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-700">
                  Help shape the future careers of Waikato students
                </p>
              </div>
            </div>

            <button className="mt-6 w-full py-3 rounded-lg border-2 font-medium transition-all hover:bg-gray-100"
              style={{ borderColor: '#D50000', color: '#D50000' }}>
              Mentor Registration
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
