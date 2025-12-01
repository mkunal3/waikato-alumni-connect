export function Sidebar() {
  const mentors = [
    {
      id: 1,
      name: "Dr. James Chen",
      role: "Senior Data Scientist – Microsoft",
      lastMessage: "Build one small project every week...",
      time: "2m ago",
      avatar: "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E",
      online: true,
      active: true,
      unread: 2
    },
    {
      id: 2,
      name: "Sarah Mitchell",
      role: "Product Manager – Google",
      lastMessage: "Great to hear! Let me know if you need...",
      time: "1h ago",
      avatar: "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E",
      online: true,
      active: false
    },
    {
      id: 3,
      name: "Marcus Thompson",
      role: "Software Engineer – Amazon",
      lastMessage: "You're on the right track! Keep going.",
      time: "3h ago",
      avatar: "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E",
      online: false,
      active: false
    },
    {
      id: 4,
      name: "Dr. Emily Roberts",
      role: "Lead UX Designer – Meta",
      lastMessage: "Happy to review your portfolio!",
      time: "Yesterday",
      avatar: "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E",
      online: true,
      active: false
    },
    {
      id: 5,
      name: "David Park",
      role: "CTO – StartupNZ",
      lastMessage: "Let's schedule a call next week.",
      time: "2 days ago",
      avatar: "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E",
      online: false,
      active: false
    }
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-4rem)]">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-gray-900 mb-1">Messages</h1>
        <p className="text-gray-500 text-sm">Your mentor connections</p>
      </div>

      {/* Mentors List */}
      <div className="flex-1 overflow-y-auto">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
              mentor.active ? 'bg-red-50 border-l-4 border-l-[#D50000]' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Avatar with status */}
              <div className="relative flex-shrink-0">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    mentor.online ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-0.5">
                  <h3 className="text-gray-900 truncate">{mentor.name}</h3>
                  <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{mentor.time}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1 truncate">{mentor.role}</p>
                <p className="text-sm text-gray-600 truncate">{mentor.lastMessage}</p>
              </div>

              {/* Unread Badge */}
              {mentor.unread && (
                <div className="flex-shrink-0 ml-2">
                  <div className="bg-[#D50000] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {mentor.unread}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
