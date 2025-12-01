import { Session } from '../types/session';

interface SummaryBarProps {
  sessions: Session[];
}

export function SummaryBar({ sessions }: SummaryBarProps) {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const sessionsThisWeek = sessions.filter(session => 
    session.date >= startOfWeek && session.date <= endOfWeek
  ).length;

  const sessionsThisMonth = sessions.filter(session =>
    session.date >= startOfMonth && session.date <= endOfMonth
  ).length;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto text-center text-gray-700">
        You have <span className="text-[#D50000]">{sessionsThisWeek} sessions</span> this week and{' '}
        <span className="text-[#D50000]">{sessionsThisMonth} sessions</span> this month.
      </div>
    </div>
  );
}
