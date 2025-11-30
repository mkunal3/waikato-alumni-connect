import { CheckCircle, Calendar, TrendingUp } from 'lucide-react';

export function SessionsOverview() {
  const stats = [
    { icon: CheckCircle, label: 'Completed Sessions', value: '3', color: 'text-green-600', bgColor: 'bg-green-50' },
    { icon: Calendar, label: 'Upcoming Sessions', value: '2', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { icon: TrendingUp, label: 'Mentor Engagement Rate', value: '78%', color: 'text-[var(--waikato-red)]', bgColor: 'bg-red-50' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="mb-6">My Mentorship Progress</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className={`p-3 ${stat.bgColor} rounded-lg`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar for Engagement */}
      <div className="mt-6">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[var(--waikato-red)] rounded-full" style={{ width: '78%' }}></div>
        </div>
      </div>
    </div>
  );
}
