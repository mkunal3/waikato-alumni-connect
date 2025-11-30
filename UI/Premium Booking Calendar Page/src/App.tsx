import { useState } from 'react';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { MonthView } from './components/MonthView';
import { WeekView } from './components/WeekView';
import { DayView } from './components/DayView';
import { SessionPopup } from './components/SessionPopup';
import { SummaryBar } from './components/SummaryBar';
import { Session, SessionType } from './types/session';

export default function App() {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    mentor: '',
    student: '',
    sessionType: '',
    showCompleted: false,
    showCanceled: false,
  });

  // Mock session data
  const sessions: Session[] = [
    {
      id: '1',
      mentorName: 'Dr. Sarah Mitchell',
      mentorPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      studentName: 'James Chen',
      studentPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      date: new Date(2025, 10, 27),
      startTime: '10:00',
      endTime: '10:45',
      type: 'career' as SessionType,
      notes: 'Discuss career paths in software engineering and industry trends.',
      status: 'scheduled',
    },
    {
      id: '2',
      mentorName: 'Prof. Michael Wong',
      mentorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      studentName: 'Emma Thompson',
      studentPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
      date: new Date(2025, 10, 27),
      startTime: '15:00',
      endTime: '15:45',
      type: 'technical' as SessionType,
      notes: 'Review data structures and algorithm optimization techniques.',
      status: 'scheduled',
    },
    {
      id: '3',
      mentorName: 'Lisa Anderson',
      mentorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
      studentName: 'Ryan Parker',
      studentPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      date: new Date(2025, 10, 28),
      startTime: '11:00',
      endTime: '11:45',
      type: 'interview' as SessionType,
      notes: 'Mock interview preparation for technical roles.',
      status: 'scheduled',
    },
    {
      id: '4',
      mentorName: 'Dr. Sarah Mitchell',
      mentorPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      studentName: 'Sophie Martin',
      studentPhoto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
      date: new Date(2025, 10, 28),
      startTime: '14:00',
      endTime: '14:45',
      type: 'career' as SessionType,
      notes: 'Career guidance for transition into tech industry.',
      status: 'scheduled',
    },
    {
      id: '5',
      mentorName: 'Prof. Michael Wong',
      mentorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      studentName: 'Alex Kumar',
      studentPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
      date: new Date(2025, 10, 29),
      startTime: '10:30',
      endTime: '11:15',
      type: 'technical' as SessionType,
      notes: 'Database design and SQL query optimization.',
      status: 'scheduled',
    },
    {
      id: '6',
      mentorName: 'Lisa Anderson',
      mentorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
      studentName: 'Olivia Brown',
      studentPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
      date: new Date(2025, 11, 2),
      startTime: '13:00',
      endTime: '13:45',
      type: 'interview' as SessionType,
      notes: 'Behavioral interview practice and STAR method.',
      status: 'scheduled',
    },
    {
      id: '7',
      mentorName: 'Dr. Robert Lee',
      mentorPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
      studentName: 'Daniel Wright',
      studentPhoto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop',
      date: new Date(2025, 11, 3),
      startTime: '09:00',
      endTime: '09:45',
      type: 'career' as SessionType,
      notes: 'Exploring opportunities in AI and machine learning.',
      status: 'scheduled',
    },
    {
      id: '8',
      mentorName: 'Jennifer Taylor',
      mentorPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
      studentName: 'Mia Johnson',
      studentPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop',
      date: new Date(2025, 11, 4),
      startTime: '16:00',
      endTime: '16:45',
      type: 'technical' as SessionType,
      notes: 'Frontend development best practices and React patterns.',
      status: 'scheduled',
    },
    {
      id: '9',
      mentorName: 'Dr. Sarah Mitchell',
      mentorPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      studentName: 'Lucas Garcia',
      studentPhoto: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop',
      date: new Date(2025, 11, 5),
      startTime: '11:00',
      endTime: '11:45',
      type: 'career' as SessionType,
      notes: 'Resume review and LinkedIn profile optimization.',
      status: 'scheduled',
    },
    {
      id: '10',
      mentorName: 'Lisa Anderson',
      mentorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
      studentName: 'Isabella Martinez',
      studentPhoto: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop',
      date: new Date(2025, 11, 6),
      startTime: '15:30',
      endTime: '16:15',
      type: 'interview' as SessionType,
      notes: 'System design interview preparation.',
      status: 'scheduled',
    },
    {
      id: '11',
      mentorName: 'Prof. Michael Wong',
      mentorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      studentName: 'Noah Davis',
      studentPhoto: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop',
      date: new Date(2025, 11, 9),
      startTime: '10:00',
      endTime: '10:45',
      type: 'technical' as SessionType,
      notes: 'Cloud architecture and AWS services overview.',
      status: 'scheduled',
    },
    {
      id: '12',
      mentorName: 'Dr. Robert Lee',
      mentorPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
      studentName: 'Ava Wilson',
      studentPhoto: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop',
      date: new Date(2025, 11, 10),
      startTime: '14:00',
      endTime: '14:45',
      type: 'career' as SessionType,
      notes: 'Networking strategies and building professional connections.',
      status: 'scheduled',
    },
  ];

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
  };

  const closePopup = () => {
    setSelectedSession(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex">
        <LeftSidebar
          filters={filters}
          onFiltersChange={setFilters}
          selectedDate={selectedDate}
          onDateSelect={handleDateClick}
        />

        <main className="flex-1 p-6 bg-[#F4F4F8]">
          <div className="bg-white rounded-lg shadow-sm">
            {viewMode === 'month' && (
              <MonthView
                selectedDate={selectedDate}
                sessions={sessions}
                onSessionClick={handleSessionClick}
                onDateChange={setSelectedDate}
              />
            )}
            {viewMode === 'week' && (
              <WeekView
                selectedDate={selectedDate}
                sessions={sessions}
                onSessionClick={handleSessionClick}
                onDateChange={setSelectedDate}
              />
            )}
            {viewMode === 'day' && (
              <DayView
                selectedDate={selectedDate}
                sessions={sessions}
                onSessionClick={handleSessionClick}
                onDateChange={setSelectedDate}
              />
            )}
          </div>
        </main>
      </div>

      <SummaryBar sessions={sessions} />

      {selectedSession && (
        <SessionPopup session={selectedSession} onClose={closePopup} />
      )}
    </div>
  );
}
