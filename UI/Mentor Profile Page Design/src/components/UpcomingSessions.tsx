import { Clock } from 'lucide-react';

const sessions = [
  { date: 'Nov 28', time: '2:00 PM', title: 'Career Planning Session' },
  { date: 'Dec 1', time: '11:00 AM', title: 'Technical Interview Prep' },
  { date: 'Dec 5', time: '3:30 PM', title: 'Resume Review' },
];

export function UpcomingSessions() {
  return (
    <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <h3 className="text-gray-900 mb-5">Upcoming Sessions</h3>
      
      <div className="space-y-3">
        {sessions.map((session, index) => (
          <div 
            key={index} 
            className="p-4 bg-gray-50 rounded-[12px] hover:bg-red-50 hover:border-[#D50000] border border-transparent transition-all group"
          >
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-500 group-hover:text-[#D50000] mt-0.5" />
              <div>
                <p className="text-gray-900 group-hover:text-[#D50000]">
                  {session.date} – {session.time}
                </p>
                <p className="text-gray-600 text-sm mt-1">{session.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-[12px] hover:bg-gray-200 transition-colors">
        View All Sessions
      </button>
    </div>
  );
}
