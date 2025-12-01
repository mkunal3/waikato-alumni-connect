import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { Session } from '../types/session';

interface WeekViewProps {
  selectedDate: Date;
  sessions: Session[];
  onSessionClick: (session: Session) => void;
  onDateChange: (date: Date) => void;
}

export function WeekView({ selectedDate, sessions, onSessionClick, onDateChange }: WeekViewProps) {
  const getWeekDays = () => {
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const weekDays = getWeekDays();

  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    onDateChange(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const getSessionsForDate = (date: Date) => {
    return sessions.filter((session) => {
      return (
        session.date.getDate() === date.getDate() &&
        session.date.getMonth() === date.getMonth() &&
        session.date.getFullYear() === date.getFullYear()
      );
    });
  };

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

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

  const getSessionPosition = (session: Session) => {
    const [hours, minutes] = session.startTime.split(':').map(Number);
    const startHour = hours + minutes / 60;
    const [endHours, endMinutes] = session.endTime.split(':').map(Number);
    const endHour = endHours + endMinutes / 60;
    
    const top = (startHour - 8) * 80; // 80px per hour
    const height = (endHour - startHour) * 80;
    
    return { top, height };
  };

  return (
    <div className="p-6">
      {/* Week Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-gray-900">
            {weekDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          <button
            onClick={handleNextWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
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

      {/* Week Grid */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-8 bg-[#F4F4F8] border-b border-gray-200">
          <div className="p-3"></div>
          {weekDays.map((date, i) => (
            <div key={i} className="p-3 text-center border-l border-gray-200">
              <div className="text-gray-600">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mt-1 ${
                isToday(date) ? 'bg-[#D50000] text-white' : 'text-gray-900'
              }`}>
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-8">
          {hours.map((hour) => (
            <div key={hour} className="contents">
              <div className="p-2 text-right text-gray-500 border-b border-gray-200">
                {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
              </div>
              {weekDays.map((date, i) => {
                const daySessions = getSessionsForDate(date);
                return (
                  <div
                    key={i}
                    className="relative border-l border-b border-gray-200 bg-white h-20 hover:bg-gray-50 transition-colors"
                  >
                    {hour === 8 && daySessions.map((session) => {
                      const { top, height } = getSessionPosition(session);
                      return (
                        <button
                          key={session.id}
                          onClick={() => onSessionClick(session)}
                          className={`absolute left-1 right-1 rounded-md ${getTypeColor(session.type)} text-white p-2 text-xs hover:opacity-90 transition-opacity shadow-sm overflow-hidden`}
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                          <div className="truncate">{session.mentorName}</div>
                          <div className="truncate opacity-90">{session.studentName}</div>
                          <div className="opacity-75">{session.startTime}–{session.endTime}</div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
