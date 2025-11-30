import { ChevronLeft, ChevronRight } from 'lucide-react';

export function AvailabilityCalendar() {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentMonth = 'December 2025';
  
  // Sample calendar data - available days are highlighted
  const calendarDays = [
    { day: null }, { day: null }, { day: null }, { day: null }, { day: null }, { day: 1, available: false }, { day: 2, available: true },
    { day: 3, available: false }, { day: 4, available: true }, { day: 5, available: false }, { day: 6, available: false }, { day: 7, available: false }, { day: 8, available: true }, { day: 9, available: false },
    { day: 10, available: true }, { day: 11, available: false }, { day: 12, available: true }, { day: 13, available: false }, { day: 14, available: false }, { day: 15, available: true }, { day: 16, available: false },
    { day: 17, available: false }, { day: 18, available: true }, { day: 19, available: false }, { day: 20, available: false }, { day: 21, available: false }, { day: 22, available: true }, { day: 23, available: false },
    { day: 24, available: false }, { day: 25, available: false }, { day: 26, available: false }, { day: 27, available: false }, { day: 28, available: false }, { day: 29, available: true }, { day: 30, available: false },
    { day: 31, available: false },
  ];

  return (
    <div className="bg-white rounded-[16px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Availability</h2>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-gray-700 px-2">{currentMonth}</span>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-gray-500 text-sm py-2">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((item, index) => (
          <div
            key={index}
            className={`
              aspect-square flex items-center justify-center rounded-lg text-sm
              ${item.day === null ? '' : 'hover:bg-gray-50 cursor-pointer'}
              ${item.available ? 'bg-[#D50000] text-white hover:bg-[#B00000]' : 'text-gray-700'}
            `}
          >
            {item.day}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-4 h-4 bg-[#D50000] rounded"></div>
          <span>Available for booking</span>
        </div>
      </div>
    </div>
  );
}
