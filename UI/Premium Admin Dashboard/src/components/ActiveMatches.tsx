import { ArrowRight, ExternalLink } from 'lucide-react';

interface Match {
  student: {
    name: string;
    initials: string;
    color: string;
  };
  mentor: {
    name: string;
    initials: string;
    color: string;
  };
  status: 'Active' | 'In Progress';
  sessionCount: number;
}

export function ActiveMatches() {
  const matches: Match[] = [
    {
      student: {
        name: 'Michael Chen',
        initials: 'MC',
        color: 'bg-blue-500'
      },
      mentor: {
        name: 'Dr. Sarah Williams',
        initials: 'SW',
        color: 'bg-purple-500'
      },
      status: 'Active',
      sessionCount: 5
    },
    {
      student: {
        name: 'Emma Thompson',
        initials: 'ET',
        color: 'bg-green-500'
      },
      mentor: {
        name: 'Prof. James Taylor',
        initials: 'JT',
        color: 'bg-indigo-500'
      },
      status: 'In Progress',
      sessionCount: 3
    },
    {
      student: {
        name: 'David Kumar',
        initials: 'DK',
        color: 'bg-orange-500'
      },
      mentor: {
        name: 'Dr. Lisa Chen',
        initials: 'LC',
        color: 'bg-pink-500'
      },
      status: 'Active',
      sessionCount: 7
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl">Active Mentorship Matches</h2>
        <p className="text-sm text-gray-500 mt-1">Current mentor-student pairings</p>
      </div>

      <div className="p-6 space-y-4">
        {matches.map((match, index) => (
          <div 
            key={index}
            className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            {/* Student */}
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-12 h-12 rounded-full ${match.student.color} flex items-center justify-center text-white`}>
                {match.student.initials}
              </div>
              <div>
                <div className="text-sm">{match.student.name}</div>
                <div className="text-xs text-gray-500">Student</div>
              </div>
            </div>

            {/* Arrow */}
            <ArrowRight className="w-5 h-5 text-gray-400" />

            {/* Mentor */}
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-12 h-12 rounded-full ${match.mentor.color} flex items-center justify-center text-white`}>
                {match.mentor.initials}
              </div>
              <div>
                <div className="text-sm">{match.mentor.name}</div>
                <div className="text-xs text-gray-500">Mentor</div>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                  match.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {match.status}
                </span>
                <div className="text-xs text-gray-500 mt-1">{match.sessionCount} sessions</div>
              </div>
              <button className="px-4 py-2 bg-[#D50000] text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm">
                View Room
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
