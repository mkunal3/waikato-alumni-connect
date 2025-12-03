import { Video } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { content } from '../config/content';

export function TutorialSectionWaikato() {
  const { t } = useLanguage();

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
            <h2 className="text-black">
              {t(content.tutorial.title.en, content.tutorial.title.mi)}
            </h2>
          </div>

          <p className="text-gray-600 mb-10 max-w-[700px] mx-auto text-lg">
            {t(content.tutorial.description.en, content.tutorial.description.mi)}
          </p>

          {/* Button */}
          <button className="px-10 py-4 bg-black text-white rounded-xl transition-all hover:bg-gray-800 hover:shadow-xl inline-flex items-center gap-3">
            <Video className="w-5 h-5" />
            <span>{t(content.tutorial.button.en, content.tutorial.button.mi)}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
