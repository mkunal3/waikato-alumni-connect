import { Calendar, Plus, List, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface LeftSidebarProps {
  filters: {
    mentor: string;
    student: string;
    sessionType: string;
    showCompleted: boolean;
    showCanceled: boolean;
  };
  onFiltersChange: (filters: any) => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function LeftSidebar({ filters, onFiltersChange, selectedDate, onDateSelect }: LeftSidebarProps) {
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(miniCalendarDate);

  const handlePrevMonth = () => {
    setMiniCalendarDate(new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setMiniCalendarDate(new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth() + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      miniCalendarDate.getMonth() === today.getMonth() &&
      miniCalendarDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      miniCalendarDate.getMonth() === selectedDate.getMonth() &&
      miniCalendarDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 space-y-6">
      {/* Filters Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="mb-4 text-gray-900">Filters</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-gray-600 mb-1">Mentor</label>
            <select
              value={filters.mentor}
              onChange={(e) => onFiltersChange({ ...filters, mentor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D50000] focus:border-transparent"
            >
              <option value="">All Mentors</option>
              <option value="sarah">Dr. Sarah Mitchell</option>
              <option value="michael">Prof. Michael Wong</option>
              <option value="lisa">Lisa Anderson</option>
              <option value="robert">Dr. Robert Lee</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Student</label>
            <select
              value={filters.student}
              onChange={(e) => onFiltersChange({ ...filters, student: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D50000] focus:border-transparent"
            >
              <option value="">All Students</option>
              <option value="james">James Chen</option>
              <option value="emma">Emma Thompson</option>
              <option value="ryan">Ryan Parker</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Session Type</label>
            <select
              value={filters.sessionType}
              onChange={(e) => onFiltersChange({ ...filters, sessionType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D50000] focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="career">Career</option>
              <option value="technical">Technical</option>
              <option value="interview">Interview Prep</option>
            </select>
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showCompleted}
                onChange={(e) => onFiltersChange({ ...filters, showCompleted: e.target.checked })}
                className="w-4 h-4 text-[#D50000] border-gray-300 rounded focus:ring-[#D50000]"
              />
              <span className="text-gray-700">Show Completed Sessions</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showCanceled}
                onChange={(e) => onFiltersChange({ ...filters, showCanceled: e.target.checked })}
                className="w-4 h-4 text-[#D50000] border-gray-300 rounded focus:ring-[#D50000]"
              />
              <span className="text-gray-700">Show Canceled Sessions</span>
            </label>
          </div>
        </div>
      </div>

      {/* Mini Calendar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-gray-900">
            {miniCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h4>
          <div className="flex gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-center text-gray-500 p-1">
              {day}
            </div>
          ))}

          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="p-1"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            return (
              <button
                key={day}
                onClick={() => onDateSelect(new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth(), day))}
                className={`p-1 text-center rounded transition-colors ${
                  isToday(day)
                    ? 'bg-[#D50000] text-white'
                    : isSelected(day)
                    ? 'bg-[#FFE5E5] text-[#D50000]'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <h3 className="text-gray-900 mb-3">Quick Actions</h3>

        <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#D50000] text-white rounded-lg hover:bg-[#B00000] transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          <span>Book New Session</span>
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <List className="w-5 h-5" />
          <span>View All Sessions</span>
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-5 h-5" />
          <span>Export Calendar</span>
        </button>
      </div>
    </aside>
  );
}
