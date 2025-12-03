import { useLanguage } from '../contexts/LanguageContext';
import { content } from '../config/content';

export function HowItWorksWaikato() {
  const { t } = useLanguage();

  return (
    <section className="py-20" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-[1440px] mx-auto px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-black mb-3">
            {t(content.howItWorks.title.en, content.howItWorks.title.mi)}
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            {t(content.howItWorks.subtitle.en, content.howItWorks.subtitle.mi)}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-4 gap-8">
          {content.howItWorks.steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: '#D50000' }}>
                <span className="text-4xl">{index + 1}</span>
              </div>
              <h3 className="text-black mb-4">
                {t(step.title.en, step.title.mi)}
              </h3>
              <p className="text-gray-700">
                {t(step.description.en, step.description.mi)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
