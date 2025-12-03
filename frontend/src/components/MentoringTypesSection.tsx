import { MessageCircle, Briefcase, TrendingUp } from 'lucide-react';

export function MentoringTypesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1080px] mx-auto px-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-gray-50 rounded-xl p-8 shadow-[0_2px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-shadow">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#D50000' }}>
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            
            <h2 className="text-black mb-2">One-Off Advice</h2>
            <p className="text-gray-600 mb-4">Tohutohu Kotahi Anake</p>
            
            <div className="inline-block px-3 py-1 rounded-full text-sm mb-4"
              style={{ backgroundColor: '#FFE5E5', color: '#D50000' }}>
              Single Session / Kotahi Hui
            </div>
            
            <p className="text-gray-600">
              Get quick guidance on specific questions or challenges. Perfect for immediate advice on CV reviews, interview prep, or career decisions.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-50 rounded-xl p-8 shadow-[0_2px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-shadow">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#D50000' }}>
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            
            <h2 className="text-black mb-2">Vocational Mentoring</h2>
            <p className="text-gray-600 mb-4">Arataki Umanga</p>
            
            <div className="inline-block px-3 py-1 rounded-full text-sm mb-4"
              style={{ backgroundColor: '#FFE5E5', color: '#D50000' }}>
              2–3 Sessions / 2–3 Hui
            </div>
            
            <p className="text-gray-600">
              Build a short-term relationship focused on exploring career paths, skill development, and industry insights over a few meaningful sessions.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-50 rounded-xl p-8 shadow-[0_2px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-shadow">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#D50000' }}>
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            
            <h2 className="text-black mb-2">Employment Opportunities</h2>
            <p className="text-gray-600 mb-4">Ngā Ara Whiwhi Mahi</p>
            
            <div className="inline-block px-3 py-1 rounded-full text-sm mb-4"
              style={{ backgroundColor: '#FFE5E5', color: '#D50000' }}>
              Ongoing / Tonu Hoki
            </div>
            
            <p className="text-gray-600">
              Establish a long-term mentoring partnership with ongoing support, networking opportunities, and potential pathways to employment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
