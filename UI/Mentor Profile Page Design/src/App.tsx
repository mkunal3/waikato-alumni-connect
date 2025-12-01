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

const mentorImage = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
const bannerImage = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
const studentImage1 = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
const studentImage2 = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E

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
