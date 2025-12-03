import { UserPlus, Search, Link2, TrendingUp } from 'lucide-react';

export function HowItWorksSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1080px] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-black mb-2">How It Works</h2>
          <p className="text-gray-600 mb-1">
            Four simple steps to connect with your ideal mentor.
          </p>
          <p className="text-gray-500">
            E whā ngā kaupae māmā kia hono ki tō kaitohutohu pai.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: '#D50000' }}>
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <div className="mb-2 text-2xl" style={{ color: '#D50000' }}>1️⃣</div>
            <h3 className="mb-2">Register / Rēhita</h3>
            <p className="text-gray-600">
              Complete your profile and tell us about your goals and interests.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: '#D50000' }}>
              <Search className="w-8 h-8 text-white" />
            </div>
            <div className="mb-2 text-2xl" style={{ color: '#D50000' }}>2️⃣</div>
            <h3 className="mb-2">Browse & Match / Rapu me te Tautuhi</h3>
            <p className="text-gray-600">
              Explore mentors by industry, expertise, and mentoring style.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: '#D50000' }}>
              <Link2 className="w-8 h-8 text-white" />
            </div>
            <div className="mb-2 text-2xl" style={{ color: '#D50000' }}>3️⃣</div>
            <h3 className="mb-2">Connect / Hono</h3>
            <p className="text-gray-600">
              Send a mentoring request and start building your connection.
            </p>
          </div>

          {/* Step 4 */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: '#D50000' }}>
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="mb-2 text-2xl" style={{ color: '#D50000' }}>4️⃣</div>
            <h3 className="mb-2">Grow / Whakatipu</h3>
            <p className="text-gray-600">
              Achieve your career goals with ongoing support and guidance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
