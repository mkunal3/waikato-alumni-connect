import { UserPlus, Calendar, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';

interface Activity {
  icon: any;
  text: string;
  time: string;
  color: string;
}

export function ActivityFeed() {
  const activities: Activity[] = [
    {
      icon: UserPlus,
      text: 'John Doe registered as Mentor',
      time: '5 minutes ago',
      color: 'text-green-600'
    },
    {
      icon: MessageSquare,
      text: 'New session booked: Sarah + Dr. Chen',
      time: '12 minutes ago',
      color: 'text-blue-600'
    },
    {
      icon: AlertCircle,
      text: '3 approvals pending review',
      time: '1 hour ago',
      color: 'text-[#D50000]'
    },
    {
      icon: CheckCircle,
      text: 'Emma Williams approved as Mentor',
      time: '2 hours ago',
      color: 'text-green-600'
    },
    {
      icon: UserPlus,
      text: 'Michael Chen registered as Student',
      time: '3 hours ago',
      color: 'text-blue-600'
    },
    {
      icon: Calendar,
      text: 'System backup completed',
      time: '5 hours ago',
      color: 'text-gray-600'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Mentor Orientation',
      date: 'Nov 28, 2025',
      time: '2:00 PM'
    },
    {
      title: 'Admin Review Meeting',
      date: 'Nov 30, 2025',
      time: '10:00 AM'
    },
    {
      title: 'System Maintenance',
      date: 'Dec 1, 2025',
      time: '11:00 PM'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl">Recent Activity</h2>
          <p className="text-sm text-gray-500 mt-1">Latest platform events</p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className={`${activity.color} bg-gray-50 p-2 rounded-lg`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* System Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl">System Notifications</h2>
        </div>

        <div className="p-6 space-y-3">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>All systems operational</span>
            </div>
          </div>
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>17 pending approvals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl">Upcoming Events</h2>
        </div>

        <div className="p-6 space-y-3">
          {upcomingEvents.map((event, index) => (
            <div 
              key={index}
              className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="text-sm">{event.title}</div>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{event.date} • {event.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
