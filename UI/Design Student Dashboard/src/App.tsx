import { Header } from './components/Header';
import { WelcomeBanner } from './components/WelcomeBanner';
import { MentoringMatches } from './components/MentoringMatches';
import { UpcomingSessions } from './components/UpcomingSessions';
import { RecommendedMentors } from './components/RecommendedMentors';
import { QuickActions } from './components/QuickActions';
import { HelpStrip } from './components/HelpStrip';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <WelcomeBanner />
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Takes 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <MentoringMatches />
            <UpcomingSessions />
          </div>
          
          {/* Right Column - Takes 1/3 width */}
          <div className="space-y-6">
            <RecommendedMentors />
            <QuickActions />
          </div>
        </div>
        
        {/* Bottom Help Strip */}
        <HelpStrip />
      </main>
    </div>
  );
}
