import { CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { content } from '../config/content';

export function ProgrammeGuideWaikato() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-black mb-3">
            {t(content.programmeGuide.title.en, content.programmeGuide.title.mi)}
          </h2>
          <p className="text-gray-600 max-w-[800px] mx-auto text-lg">
            {t(content.programmeGuide.subtitle.en, content.programmeGuide.subtitle.mi)}
          </p>
        </div>

        {/* Two Cards */}
        <div className="grid grid-cols-2 gap-10">
          {/* Left Card - For Students */}
          <div className="rounded-2xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
            style={{ backgroundColor: '#F5F5F5' }}>
            <h3 className="text-black mb-8">
              {t(content.programmeGuide.forStudents.title.en, content.programmeGuide.forStudents.title.mi)}
            </h3>

            <div className="space-y-4">
              {content.programmeGuide.forStudents.points.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                  <p className="text-gray-800">
                    {t(point.en, point.mi)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card - For Mentors */}
          <div className="rounded-2xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
            style={{ backgroundColor: '#F5F5F5' }}>
            <h3 className="text-black mb-8">
              {t(content.programmeGuide.forMentors.title.en, content.programmeGuide.forMentors.title.mi)}
            </h3>

            <div className="space-y-4">
              {content.programmeGuide.forMentors.points.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" style={{ color: '#D50000' }} />
                  <p className="text-gray-800">
                    {t(point.en, point.mi)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
