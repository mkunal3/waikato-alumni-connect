import { CheckCircle } from 'lucide-react';

export function ProgrammeGuideWaikato() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-black mb-3">Programme Guide</h2>
          <p className="text-gray-600 text-xl mb-6" style={{ fontStyle: 'italic' }}>
            Aratohu Hōtaka
          </p>
          <p className="text-gray-600 max-w-[800px] mx-auto text-lg">
            Everything you need to know about the Waikato Navigator Programme.
          </p>
          <p className="text-gray-500 mt-2" style={{ fontStyle: 'italic' }}>
            Ngā mea katoa mō Waikato Navigator.
          </p>
        </div>

        {/* Two Cards */}
        <div className="grid grid-cols-2 gap-10">
          {/* Left Card - For Students */}
          <div className="rounded-2xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
            style={{ backgroundColor: '#F5F5F5' }}>
            <h3 className="text-black mb-2">For Students</h3>
            <p className="text-gray-600 mb-8 text-lg" style={{ fontStyle: 'italic' }}>
              Mō ngā Ākonga
            </p>

            {/* English Checkpoints */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-800">
                  Available for final-year CMS students
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-800">
                  Upload CV and complete profile
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-800">
                  Choose mentoring styles and career interests
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-800">
                  Matched with one mentor for 4-month programme
                </p>
              </div>
            </div>

            {/* Māori Checkpoints */}
            <div className="space-y-4 pt-6 border-t border-gray-300">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-700" style={{ fontStyle: 'italic' }}>
                  Wātea ki ngā ākonga tau whakamutunga o CMS
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-700" style={{ fontStyle: 'italic' }}>
                  Tukuna tō CV me tō kōtaha
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-700" style={{ fontStyle: 'italic' }}>
                  Kōwhiria ngā momo arataki me ngā whāinga umanga
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-700" style={{ fontStyle: 'italic' }}>
                  Ka hono koe ki tētahi kaitohutohu mō te 4 marama
                </p>
              </div>
            </div>
          </div>

          {/* Right Card - For Mentors */}
          <div className="rounded-2xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
            style={{ backgroundColor: '#F5F5F5' }}>
            <h3 className="text-black mb-2">For Mentors</h3>
            <p className="text-gray-600 mb-8 text-lg" style={{ fontStyle: 'italic' }}>
              Mō Ngā Kaitohutohu
            </p>

            {/* English Checkpoints */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-800">
                  Open to all Waikato alumni
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-800">
                  Share expertise and professional journey
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-800">
                  Choose flexible mentoring types
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-800">
                  Give back and support future careers
                </p>
              </div>
            </div>

            {/* Māori Checkpoints */}
            <div className="space-y-4 pt-6 border-t border-gray-300">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-700" style={{ fontStyle: 'italic' }}>
                  Wātea ki ngā alumni katoa o Waikato
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-700" style={{ fontStyle: 'italic' }}>
                  Tohaina ō pūkenga me tō haerenga
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-700" style={{ fontStyle: 'italic' }}>
                  Kōwhiria ngā momo arataki
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                <p className="text-gray-700" style={{ fontStyle: 'italic' }}>
                  Āwhina ki te whakatipu i ngā umanga o ngā ākonga
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
