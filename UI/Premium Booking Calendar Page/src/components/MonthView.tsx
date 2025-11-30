import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { Session } from '../types/session';

interface MonthViewProps {
  selectedDate: Date;
  sessions: Session[];
  onSessionClick: (session: Session) => void;
  onDateChange: (date: Date) => void;
}

export function MonthView({ selectedDate, sessions, onSessionClick, onDateChange }: MonthViewProps) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const handlePrevMonth = () => {
    onDateChange(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onDateChange(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const getSessionsForDate = (day: number) => {
    return sessions.filter((session) => {
      return (
        session.date.getDate() === day &&
        session.date.getMonth() === month &&
        session.date.getFullYear() === year
      );
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'career':
        return 'bg-[#FFE5E5] text-[#D50000] border-[#D50000]';
      case 'technical':
        return 'bg-blue-50 text-blue-700 border-blue-700';
      case 'interview':
        return 'bg-purple-50 text-purple-700 border-purple-700';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-700';
    }
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-gray-900">
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={handleNextMonth}
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

      {/* Calendar Grid */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-[#F4F4F8]">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
            <div key={day} className="p-3 text-center text-gray-600 border-b border-gray-200">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {/* Empty cells before first day */}
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-32 p-2 bg-gray-50 border-b border-r border-gray-200"></div>
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const daySessions = getSessionsForDate(day);
            const today = isToday(day);

            return (
              <div
                key={day}
                className={`min-h-32 p-2 border-b border-r border-gray-200 ${
                  today ? 'bg-[#FFF5F5]' : 'bg-white'
                } hover:bg-gray-50 transition-colors`}
              >
                <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full mb-2 ${
                  today ? 'bg-[#D50000] text-white' : 'text-gray-900'
                }`}>
                  {day}
                </div>

                <div className="space-y-1">
                  {daySessions.slice(0, 3).map((session) => (
                    <button
                      key={session.id}
                      onClick={() => onSessionClick(session)}
                      className={`w-full text-left px-2 py-1 rounded border-l-2 text-xs hover:opacity-80 transition-opacity ${getTypeColor(session.type)}`}
                    >
                      <div className="truncate">{session.mentorName}</div>
                      <div className="text-xs opacity-75 truncate">{session.studentName}</div>
                      <div className="text-xs opacity-75">{session.startTime}–{session.endTime}</div>
                    </button>
                  ))}
                  {daySessions.length > 3 && (
                    <div className="text-xs text-gray-500 px-2">+{daySessions.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
