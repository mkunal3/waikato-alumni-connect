import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StatsCard } from './components/StatsCard';
import { ApprovalTable } from './components/ApprovalTable';
import { ActiveMatches } from './components/ActiveMatches';
import { ActivityFeed } from './components/ActivityFeed';
import { Footer } from './components/Footer';
import { Users, Award, GraduationCap, Clock, MessageSquare, CheckCircle } from 'lucide-react';

export default function App() {
  const stats = [
    {
      title: 'Total Users',
      value: '421',
      subtitle: 'Total users registered',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Mentors',
      value: '112',
      subtitle: 'Active mentors',
      icon: Award,
      color: 'text-purple-600'
    },
    {
      title: 'Students',
      value: '309',
      subtitle: 'Active students',
      icon: GraduationCap,
      color: 'text-green-600'
    },
    {
      title: 'Pending Approvals',
      value: '17',
      subtitle: 'Awaiting admin review',
      icon: Clock,
      color: 'text-[#D50000]',
      badge: true
    },
    {
      title: 'Active Sessions',
      value: '54',
      subtitle: 'Ongoing mentorship sessions',
      icon: MessageSquare,
      color: 'text-indigo-600'
    },
    {
      title: 'System Health',
      value: '✓',
      subtitle: 'All systems operational',
      icon: CheckCircle,
      color: 'text-green-500',
      isHealth: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F8]">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 ml-64">
          <div className="max-w-[1440px] mx-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Approval Table (spans 2 columns) */}
              <div className="col-span-2 space-y-6">
                <ApprovalTable />
                <ActiveMatches />
              </div>

              {/* Right Column - Activity Feed */}
              <div className="col-span-1">
                <ActivityFeed />
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
