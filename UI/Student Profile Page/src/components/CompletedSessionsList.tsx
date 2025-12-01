import { FileText } from 'lucide-react';

interface CompletedSession {
  mentor: string;
  topic: string;
}

export function CompletedSessionsList() {
  const completedSessions: CompletedSession[] = [
    { mentor: 'Dr. James Chen', topic: 'Career Strategy' },
    { mentor: 'Michael Park', topic: 'Interview Prep' },
    { mentor: 'Emily Carter', topic: 'Portfolio Review' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="mb-4">Completed Sessions</h2>
      
      <div className="space-y-3">
        {completedSessions.map((session, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div>
              <p className="text-gray-900">{session.mentor}</p>
              <p className="text-sm text-gray-500">{session.topic}</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--waikato-red)] border border-[var(--waikato-red)] rounded-lg hover:bg-red-50 transition-colors">
              <FileText className="w-4 h-4" />
              View Notes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
