import { MessageSquare, Target, Building2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { content } from '../config/content';

export function FeatureCardsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-black mb-3">
            {t(content.mentoringTypes.title.en, content.mentoringTypes.title.mi)}
          </h2>
          <p className="text-gray-600 text-lg">
            {t(content.mentoringTypes.subtitle.en, content.mentoringTypes.subtitle.mi)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Card 1 - One-Off Advice */}
          <div className="bg-white rounded-2xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: '#FFE5E5' }}>
              <MessageSquare className="w-8 h-8" style={{ color: '#D50000' }} />
            </div>
            
            <h3 className="text-black mb-4">
              {t(content.mentoringTypes.oneOff.title.en, content.mentoringTypes.oneOff.title.mi)}
            </h3>
            
            <div className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ backgroundColor: '#F5F5F5', color: '#333' }}>
              {t(content.mentoringTypes.oneOff.badge.en, content.mentoringTypes.oneOff.badge.mi)}
            </div>
            
            <p className="text-gray-700 text-left">
              {t(content.mentoringTypes.oneOff.description.en, content.mentoringTypes.oneOff.description.mi)}
            </p>
          </div>

          {/* Card 2 - Vocational Mentoring */}
          <div className="bg-white rounded-2xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: '#FFE5E5' }}>
              <Target className="w-8 h-8" style={{ color: '#D50000' }} />
            </div>
            
            <h3 className="text-black mb-4">
              {t(content.mentoringTypes.vocational.title.en, content.mentoringTypes.vocational.title.mi)}
            </h3>
            
            <div className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ backgroundColor: '#F5F5F5', color: '#333' }}>
              {t(content.mentoringTypes.vocational.badge.en, content.mentoringTypes.vocational.badge.mi)}
            </div>
            
            <p className="text-gray-700 text-left">
              {t(content.mentoringTypes.vocational.description.en, content.mentoringTypes.vocational.description.mi)}
            </p>
          </div>

          {/* Card 3 - Employment Opportunities */}
          <div className="bg-white rounded-2xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: '#FFE5E5' }}>
              <Building2 className="w-8 h-8" style={{ color: '#D50000' }} />
            </div>
            
            <h3 className="text-black mb-4">
              {t(content.mentoringTypes.employment.title.en, content.mentoringTypes.employment.title.mi)}
            </h3>
            
            <div className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ backgroundColor: '#F5F5F5', color: '#333' }}>
              {t(content.mentoringTypes.employment.badge.en, content.mentoringTypes.employment.badge.mi)}
            </div>
            
            <p className="text-gray-700 text-left">
              {t(content.mentoringTypes.employment.description.en, content.mentoringTypes.employment.description.mi)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
