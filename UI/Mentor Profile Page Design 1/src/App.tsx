import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { MessageCircle, MapPin, Briefcase, Calendar, Clock } from 'lucide-react';

export default function App() {
  const expertiseTags = [
    'Product Management',
    'UX Design',
    'Leadership',
    'Career Development',
    'Technology Strategy',
    'Team Building',
  ];

  const aboutTags = [
    'Digital Transformation',
    'Agile Methodologies',
    'Product Strategy',
    'User Research',
    'Innovation',
    'Mentoring',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto px-8 py-12">
          {/* Mentor Profile Header */}
          <div className="bg-white rounded-lg border p-8 mb-8" style={{ borderColor: 'var(--waikato-border)' }}>
            <div className="flex gap-8">
              {/* Mentor Photo */}
              <div className="flex-shrink-0">
                <ImageWithFallback
                  src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E"
                  alt="Dr. Sarah Mitchell"
                  className="w-48 h-48 rounded-lg object-cover"
                />
              </div>

              {/* Mentor Info */}
              <div className="flex-1">
                <h1 style={{ color: 'var(--waikato-dark)' }}>Dr. Sarah Mitchell</h1>
                <p className="mt-1" style={{ color: 'var(--waikato-dark)' }}>
                  Senior Product Manager
                </p>
                <p className="mt-1 opacity-70" style={{ color: 'var(--waikato-dark)' }}>
                  Tech Innovation Co.
                </p>

                <div className="mt-6">
                  <p className="mb-3" style={{ color: 'var(--waikato-dark)' }}>Areas of Expertise:</p>
                  <div className="flex flex-wrap gap-2">
                    {expertiseTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: 'var(--waikato-gray)',
                          color: 'var(--waikato-dark)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    className="px-6 py-3 rounded-lg text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: 'var(--waikato-red)' }}
                  >
                    Request Mentorship
                  </button>
                  <button
                    className="px-6 py-3 rounded-lg border hover:opacity-70 transition-opacity flex items-center gap-2"
                    style={{
                      borderColor: 'var(--waikato-border)',
                      color: 'var(--waikato-dark)',
                      backgroundColor: 'white',
                    }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="col-span-2 space-y-8">
              {/* About the Mentor */}
              <div className="bg-white rounded-lg border p-8" style={{ borderColor: 'var(--waikato-border)' }}>
                <h2 className="mb-4" style={{ color: 'var(--waikato-dark)' }}>
                  About the Mentor
                </h2>
                <p className="opacity-80" style={{ color: 'var(--waikato-dark)' }}>
                  With over 15 years of experience in product management and technology leadership, 
                  I've had the privilege of building and scaling products that impact millions of users. 
                  My journey has taken me through startups and Fortune 500 companies, where I've learned 
                  the importance of user-centered design, data-driven decision making, and building 
                  high-performing teams.
                </p>
                <p className="mt-4 opacity-80" style={{ color: 'var(--waikato-dark)' }}>
                  I'm passionate about helping the next generation of product leaders navigate their careers, 
                  develop their skills, and make meaningful impacts in their organizations. Whether you're 
                  just starting out or looking to level up your product management career, I'm here to share 
                  insights, provide guidance, and support your professional growth.
                </p>
              </div>

              {/* Areas of Expertise */}
              <div className="bg-white rounded-lg border p-8" style={{ borderColor: 'var(--waikato-border)' }}>
                <h2 className="mb-4" style={{ color: 'var(--waikato-dark)' }}>
                  Areas of Expertise
                </h2>
                <div className="flex flex-wrap gap-3">
                  {aboutTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-lg border"
                      style={{
                        borderColor: 'var(--waikato-border)',
                        color: 'var(--waikato-dark)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg border p-6 sticky top-8" style={{ 
                borderColor: 'var(--waikato-border)',
                backgroundColor: 'var(--waikato-gray)' 
              }}>
                <h3 className="mb-6" style={{ color: 'var(--waikato-dark)' }}>
                  Mentor Details
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--waikato-red)' }} />
                    <div>
                      <p style={{ color: 'var(--waikato-dark)' }}>Location</p>
                      <p className="opacity-70" style={{ color: 'var(--waikato-dark)' }}>
                        Hamilton, New Zealand
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--waikato-red)' }} />
                    <div>
                      <p style={{ color: 'var(--waikato-dark)' }}>Career Stage</p>
                      <p className="opacity-70" style={{ color: 'var(--waikato-dark)' }}>
                        Senior Professional (15+ years)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--waikato-red)' }} />
                    <div>
                      <p style={{ color: 'var(--waikato-dark)' }}>Mentoring Types Offered</p>
                      <p className="opacity-70" style={{ color: 'var(--waikato-dark)' }}>
                        One-on-one sessions, Group workshops, Career guidance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--waikato-red)' }} />
                    <div>
                      <p style={{ color: 'var(--waikato-dark)' }}>Availability</p>
                      <p className="opacity-70" style={{ color: 'var(--waikato-dark)' }}>
                        2-4 sessions per month
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--waikato-border)' }}>
                  <p style={{ color: 'var(--waikato-dark)' }}>Response Rate</p>
                  <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: '95%',
                        backgroundColor: 'var(--waikato-red)' 
                      }}
                    />
                  </div>
                  <p className="mt-2 opacity-70" style={{ color: 'var(--waikato-dark)' }}>
                    95% - Usually responds within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
