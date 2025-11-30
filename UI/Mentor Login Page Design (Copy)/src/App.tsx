import { WaikatoNavigation } from './components/WaikatoNavigation';
import { WaikatoHeroSection } from './components/WaikatoHeroSection';
import { FeatureCardsSection } from './components/FeatureCardsSection';
import { HowItWorksWaikato } from './components/HowItWorksWaikato';
import { ProgrammeGuideWaikato } from './components/ProgrammeGuideWaikato';
import { TutorialSectionWaikato } from './components/TutorialSectionWaikato';
import { WaikatoFooter } from './components/WaikatoFooter';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <WaikatoNavigation />
      <main>
        <WaikatoHeroSection />
        <FeatureCardsSection />
        <HowItWorksWaikato />
        <ProgrammeGuideWaikato />
        <TutorialSectionWaikato />
      </main>
      <WaikatoFooter />
    </div>
  );
}
