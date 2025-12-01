import { Calendar, Clock, Video } from 'lucide-react';

interface Session {
  id: number;
  date: string;
  time: string;
  mentor: string;
  type: 'One-off' | 'Vocational' | 'Employment';
}

const sessions: Session[] = [
  {
    id: 1,
    date: 'Nov 28, 2024',
    time: '2:00 PM',
    mentor: 'Dr. James Chen',
    type: 'Vocational'
  },
  {
    id: 2,
    date: 'Dec 2, 2024',
    time: '10:30 AM',
    mentor: 'Emma Williams',
    type: 'Employment'
  },
  {
    id: 3,
    date: 'Dec 5, 2024',
    time: '3:00 PM',
    mentor: 'Michael Park',
    type: 'One-off'
  }
];

const typeColors = {
  'One-off': 'bg-blue-100 text-blue-800',
  'Vocational': 'bg-purple-100 text-purple-800',
  'Employment': 'bg-green-100 text-green-800'
};

export function UpcomingSessions() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-gray-900 mb-6">Upcoming Sessions</h2>
      
      <div className="space-y-3">
        {sessions.map((session) => (
          <div 
            key={session.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-700 min-w-[140px]">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{session.date}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-700 min-w-[100px]">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{session.time}</span>
              </div>
              
              <div className="text-gray-900 min-w-[150px]">
                {session.mentor}
              </div>
              
              <span className={`px-3 py-1 rounded-full text-xs ${typeColors[session.type]}`}>
                {session.type}
              </span>
            </div>
            
            <button className="px-4 py-2 bg-[#D50000] text-white rounded-lg hover:bg-[#B00000] transition-colors flex items-center gap-2">
              <Video className="w-4 h-4" />
              <span>Join</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
