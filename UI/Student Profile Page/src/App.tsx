import { StudentHeader } from './components/StudentHeader';
import { AboutCard } from './components/AboutCard';
import { CareerGoalsCard } from './components/CareerGoalsCard';
import { SessionsOverview } from './components/SessionsOverview';
import { UpcomingSessionCard } from './components/UpcomingSessionCard';
import { CompletedSessionsList } from './components/CompletedSessionsList';
import { QuickActions } from './components/QuickActions';
import { SkillsBadgeProgress } from './components/SkillsBadgeProgress';
import waikatoLogo from 'figma:asset/db2e9e04f65d3b029ee3458fee7925cd0a8c7f70.png';

export default function App() {
  const studentData = {
    name: "Neeraj Sharma",
    degree: "Master of Information Technology – University of Waikato",
    tags: ["Cloud Computing", "Cybersecurity", "UI/UX Design"],
    photoUrl: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjQxMTE0NzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
  };

  const upcomingSessions = [
    {
      mentorPhoto: "https://images.unsplash.com/photo-1758691463605-f4a3a92d6d37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYWxlJTIwbWVudG9yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MTExNDcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      mentorName: "Aarav Patel",
      role: "Software Engineer · Microsoft NZ",
      date: "Nov 29, 2025",
      time: "2:00 PM"
    },
    {
      mentorPhoto: "https://images.unsplash.com/photo-1610631066894-62452ccb927c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBmZW1hbGUlMjBidXNpbmVzc3dvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MTExNDcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      mentorName: "Emma Williams",
      role: "Marketing Director · Fonterra",
      date: "Dec 4, 2025",
      time: "10:30 AM"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--section-grey)]">
      {/* Header with Logo */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <img src={waikatoLogo} alt="University of Waikato" className="h-16" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <h1 className="mb-6">Student Profile</h1>

        {/* Student Header */}
        <StudentHeader 
          photoUrl={studentData.photoUrl}
          name={studentData.name}
          degree={studentData.degree}
          tags={studentData.tags}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Overview - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AboutCard />
              <CareerGoalsCard />
            </div>

            {/* Sessions Overview */}
            <SessionsOverview />

            {/* Upcoming Sessions */}
            <div>
              <h2 className="mb-4">Upcoming Sessions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingSessions.map((session, index) => (
                  <UpcomingSessionCard key={index} {...session} />
                ))}
              </div>
            </div>

            {/* Completed Sessions */}
            <CompletedSessionsList />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <QuickActions />
            <SkillsBadgeProgress />
          </div>
        </div>
      </div>
    </div>
  );
}
