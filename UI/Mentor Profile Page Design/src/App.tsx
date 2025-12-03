import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { SessionsReviews } from './components/SessionsReviews';
import { AvailabilityCalendar } from './components/AvailabilityCalendar';
import { ContactCard } from './components/ContactCard';
import { UpcomingSessions } from './components/UpcomingSessions';
import { ResourcesCard } from './components/ResourcesCard';
import { StickyActionBar } from './components/StickyActionBar';

const mentorImage = 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbmRpYW4lMjBtYWxlJTIwaGVhZHNob3R8ZW58MXx8fHwxNzY0MTExOTUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
const bannerImage = 'https://images.unsplash.com/photo-1758413351776-cea82eed2176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYWVyaWFsfGVufDF8fHx8MTc2NDExMTk1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
const studentImage1 = 'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbGUlMjBzdHVkZW50JTIwaGVhZHNob3R8ZW58MXx8fHwxNzY0MTExOTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
const studentImage2 = 'https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMG1hbGUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjQwNjUxMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      <Navigation />
      
      <main className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <HeroSection mentorImage={mentorImage} bannerImage={bannerImage} />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-[70%_30%] gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <AboutSection />
            <SkillsSection />
            <SessionsReviews studentImage1={studentImage1} studentImage2={studentImage2} />
            <AvailabilityCalendar />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ContactCard />
            <UpcomingSessions />
            <ResourcesCard />
          </div>
        </div>
      </main>

      <StickyActionBar />
    </div>
  );
}
