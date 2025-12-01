export function Sidebar() {
  const mentors = [
    {
      id: 1,
      name: "Dr. James Chen",
      role: "Senior Data Scientist – Microsoft",
      lastMessage: "Build one small project every week...",
      time: "2m ago",
      avatar: "https://images.unsplash.com/photo-1738566061505-556830f8b8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDA4Njc1MXww&ixlib=rb-4.1.0&q=80&w=1080",
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
      avatar: "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MDAxMzYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      online: true,
      active: false
    },
    {
      id: 3,
      name: "Marcus Thompson",
      role: "Software Engineer – Amazon",
      lastMessage: "You're on the right track! Keep going.",
      time: "3h ago",
      avatar: "https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBidXNpbmVzcyUyMGhlYWRzaG90fGVufDF8fHx8MTc2NDA3MjQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      online: false,
      active: false
    },
    {
      id: 4,
      name: "Dr. Emily Roberts",
      role: "Lead UX Designer – Meta",
      lastMessage: "Happy to review your portfolio!",
      time: "Yesterday",
      avatar: "https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDA2MzY3NXww&ixlib=rb-4.1.0&q=80&w=1080",
      online: true,
      active: false
    },
    {
      id: 5,
      name: "David Park",
      role: "CTO – StartupNZ",
      lastMessage: "Let's schedule a call next week.",
      time: "2 days ago",
      avatar: "https://images.unsplash.com/photo-1724627559656-9652a42c7e91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWNoJTIwd29ya2VyfGVufDF8fHx8MTc2NDEwNzgzMHww&ixlib=rb-4.1.0&q=80&w=1080",
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
