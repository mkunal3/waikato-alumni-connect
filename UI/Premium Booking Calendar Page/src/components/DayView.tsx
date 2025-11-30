import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { Session } from '../types/session';

interface DayViewProps {
  selectedDate: Date;
  sessions: Session[];
  onSessionClick: (session: Session) => void;
  onDateChange: (date: Date) => void;
}

export function DayView({ selectedDate, sessions, onSessionClick, onDateChange }: DayViewProps) {
  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const getSessionsForDate = () => {
    return sessions.filter((session) => {
      return (
        session.date.getDate() === selectedDate.getDate() &&
        session.date.getMonth() === selectedDate.getMonth() &&
        session.date.getFullYear() === selectedDate.getFullYear()
      );
    });
  };

  const daySessions = getSessionsForDate();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'career':
        return 'bg-[#D50000] border-[#D50000]';
      case 'technical':
        return 'bg-blue-600 border-blue-600';
      case 'interview':
        return 'bg-purple-600 border-purple-600';
      default:
        return 'bg-gray-600 border-gray-600';
    }
  };

  const getSessionPosition = (session: Session) => {
    const [hours, minutes] = session.startTime.split(':').map(Number);
    const startHour = hours + minutes / 60;
    const [endHours, endMinutes] = session.endTime.split(':').map(Number);
    const endHour = endHours + endMinutes / 60;
    
    const top = (startHour - 8) * 100; // 100px per hour
    const height = (endHour - startHour) * 100;
    
    return { top, height };
  };

  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

  const isToday = () => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="p-6">
      {/* Day Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevDay}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-gray-900">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          <button
            onClick={handleNextDay}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          {isToday() && (
            <span className="px-3 py-1 bg-[#D50000] text-white rounded-full">Today</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <CalendarIcon className="w-4 h-4" />
            Today
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Day Timeline */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex">
          {/* Time Labels */}
          <div className="w-24 bg-[#F4F4F8] border-r border-gray-200">
            {hours.map((hour) => (
              <div key={hour} className="h-25 p-3 text-right text-gray-600 border-b border-gray-200">
                {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="flex-1 relative">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-25 border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              />
            ))}

            {/* Sessions */}
            {daySessions.map((session) => {
              const { top, height } = getSessionPosition(session);
              return (
                <button
                  key={session.id}
                  onClick={() => onSessionClick(session)}
                  className={`absolute left-2 right-2 rounded-lg ${getTypeColor(session.type)} text-white p-4 hover:opacity-90 transition-opacity shadow-md`}
                  style={{ top: `${top}px`, height: `${height}px` }}
                >
                  <div className="flex items-start gap-3 h-full">
                    <div className="flex-1">
                      <div className="mb-1">{session.mentorName}</div>
                      <div className="opacity-90">{session.studentName}</div>
                      <div className="opacity-75 mt-2">
                        {session.startTime} – {session.endTime}
                      </div>
                      <div className="mt-2 px-2 py-1 bg-white bg-opacity-20 rounded inline-block">
                        Online
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="px-2 py-1 bg-white bg-opacity-20 rounded">
                        {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
