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
      mentorPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
      studentName: 'James Chen',
      studentPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
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
      mentorPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
      studentName: 'Emma Thompson',
      studentPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
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
      mentorPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
      studentName: 'Ryan Parker',
      studentPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
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
      mentorPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
      studentName: 'Sophie Martin',
      studentPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
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
      mentorPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
      studentName: 'Alex Kumar',
      studentPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
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
      mentorPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
      studentName: 'Olivia Brown',
      studentPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
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
      mentorPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
      studentName: 'Daniel Wright',
      studentPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
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
      mentorPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
      studentName: 'Mia Johnson',
      studentPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
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
      mentorPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
      studentName: 'Lucas Garcia',
      studentPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
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
      mentorPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
      studentName: 'Isabella Martinez',
      studentPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
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
      mentorPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
      studentName: 'Noah Davis',
      studentPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
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
      mentorPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
      studentName: 'Ava Wilson',
      studentPhoto: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
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
