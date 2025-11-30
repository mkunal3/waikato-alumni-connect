import { MessageSquare, Target, Building2 } from 'lucide-react';

export function FeatureCardsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-12">
        <div className="grid grid-cols-3 gap-8">
          {/* Card 1 - One-Off Advice */}
          <div className="bg-white rounded-2xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: '#FFE5E5' }}>
              <MessageSquare className="w-8 h-8" style={{ color: '#D50000' }} />
            </div>
            
            <h3 className="text-black mb-2">One-Off Advice</h3>
            <p className="text-gray-600 mb-4" style={{ fontStyle: 'italic' }}>
              Tohutohu Kotahi Anake
            </p>
            
            <div className="inline-block px-4 py-2 rounded-full text-sm mb-6"
              style={{ backgroundColor: '#FFE5E5', color: '#D50000' }}>
              Single Session / Kotahi hui
            </div>
            
            <p className="text-gray-700 mb-2">
              Quick support for CV tips, interview prep, or industry insights.
            </p>
            <p className="text-gray-600" style={{ fontStyle: 'italic' }}>
              Āwhina tere mō te CV, te whakareri uiui, me ngā mōhiohio rāngai.
            </p>
          </div>

          {/* Card 2 - Vocational Mentoring */}
          <div className="bg-white rounded-2xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: '#FFE5E5' }}>
              <Target className="w-8 h-8" style={{ color: '#D50000' }} />
            </div>
            
            <h3 className="text-black mb-2">Vocational Mentoring</h3>
            <p className="text-gray-600 mb-4" style={{ fontStyle: 'italic' }}>
              Arataki Umanga
            </p>
            
            <div className="inline-block px-4 py-2 rounded-full text-sm mb-6"
              style={{ backgroundColor: '#FFE5E5', color: '#D50000' }}>
              2-3 Sessions / 2-3 Hui
            </div>
            
            <p className="text-gray-700 mb-2">
              Guidance on expectations, planning, and career direction.
            </p>
            <p className="text-gray-600" style={{ fontStyle: 'italic' }}>
              Arataki hohonu mō te mahere umanga me ngā whāinga.
            </p>
          </div>

          {/* Card 3 - Employment Opportunities */}
          <div className="bg-white rounded-2xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: '#FFE5E5' }}>
              <Building2 className="w-8 h-8" style={{ color: '#D50000' }} />
            </div>
            
            <h3 className="text-black mb-2">Employment Opportunities</h3>
            <p className="text-gray-600 mb-4" style={{ fontStyle: 'italic' }}>
              Whai Wāhitanga Mahi
            </p>
            
            <div className="inline-block px-4 py-2 rounded-full text-sm mb-6"
              style={{ backgroundColor: '#FFE5E5', color: '#D50000' }}>
              Ongoing / Tonu tonu
            </div>
            
            <p className="text-gray-700 mb-2">
              Access to workplace visits, internships, and placements.
            </p>
            <p className="text-gray-600" style={{ fontStyle: 'italic' }}>
              Ngā toronga mahi, ngā tūnga whakangungu, me ngā tūnga wheako.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
