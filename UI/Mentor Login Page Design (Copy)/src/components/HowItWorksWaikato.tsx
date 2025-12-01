export function HowItWorksWaikato() {
  return (
    <section className="py-20" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-[1440px] mx-auto px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-black mb-3">How It Works</h2>
          <p className="text-gray-600 text-xl" style={{ fontStyle: 'italic' }}>
            Me Pēhea te Mahi
          </p>
          <p className="text-gray-600 mt-4 text-lg">
            Four simple steps to connect with your mentor.
          </p>
          <p className="text-gray-500" style={{ fontStyle: 'italic' }}>
            E whā ngā hipanga māmā hei hono atu ki tō kaitohutohu.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: '#D50000' }}>
              <span className="text-4xl">1</span>
            </div>
            <h3 className="text-black mb-2">Register</h3>
            <p className="text-gray-600 mb-4" style={{ fontStyle: 'italic' }}>
              Rēhita
            </p>
            <p className="text-gray-700 mb-2">
              Complete your profile with focus and preferences.
            </p>
            <p className="text-gray-600 text-sm" style={{ fontStyle: 'italic' }}>
              Tāurua ō kōrero whaiaro me ngā manakohanga.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: '#D50000' }}>
              <span className="text-4xl">2</span>
            </div>
            <h3 className="text-black mb-2">Browse & Match</h3>
            <p className="text-gray-600 mb-4" style={{ fontStyle: 'italic' }}>
              Tirotiro & Tautuhi
            </p>
            <p className="text-gray-700 mb-2">
              Explore mentors and match scores.
            </p>
            <p className="text-gray-600 text-sm" style={{ fontStyle: 'italic' }}>
              Tīkina ngā kaitohutohu pai ki a koe.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: '#D50000' }}>
              <span className="text-4xl">3</span>
            </div>
            <h3 className="text-black mb-2">Connect</h3>
            <p className="text-gray-600 mb-4" style={{ fontStyle: 'italic' }}>
              Hono
            </p>
            <p className="text-gray-700 mb-2">
              Send a match request and wait for acceptance.
            </p>
            <p className="text-gray-600 text-sm" style={{ fontStyle: 'italic' }}>
              Tuku tono hono.
            </p>
          </div>

          {/* Step 4 */}
          <div className="text-center">
            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: '#D50000' }}>
              <span className="text-4xl">4</span>
            </div>
            <h3 className="text-black mb-2">Grow</h3>
            <p className="text-gray-600 mb-4" style={{ fontStyle: 'italic' }}>
              Tupu
            </p>
            <p className="text-gray-700 mb-2">
              Meet, track sessions, and grow your career.
            </p>
            <p className="text-gray-600 text-sm" style={{ fontStyle: 'italic' }}>
              Tūhono ki te kaitohutohu, ā, whakatipu tō umanga.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
