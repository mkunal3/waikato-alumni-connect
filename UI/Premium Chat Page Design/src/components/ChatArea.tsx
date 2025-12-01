export function ChatArea() {
  const messages = [
    {
      id: 1,
      sender: "mentor",
      text: "Hi Neeraj! Happy to see you here. How can I support your career journey today?",
      time: "10:32 AM",
      avatar: "https://images.unsplash.com/photo-1738566061505-556830f8b8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDA4Njc1MXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 2,
      sender: "student",
      text: "Hi Dr. Chen! I want to move into software engineering. What skills should I start with?",
      time: "10:34 AM"
    },
    {
      id: 3,
      sender: "mentor",
      text: "Great goal! Start with Python or JavaScript, then learn Git, APIs, and build 2–3 projects. Do you already have coding experience?",
      time: "10:35 AM",
      avatar: "https://images.unsplash.com/photo-1738566061505-556830f8b8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDA4Njc1MXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 4,
      sender: "student",
      text: "Yes, I've done some basic JavaScript. How can I improve faster?",
      time: "10:36 AM"
    },
    {
      id: 5,
      sender: "mentor",
      text: "Build one small project every week. Even simple apps help a LOT. I'm happy to guide you.",
      time: "10:37 AM",
      avatar: "https://images.unsplash.com/photo-1738566061505-556830f8b8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDA4Njc1MXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 6,
      sender: "student",
      text: "That's really helpful, thank you! What kind of projects would you recommend?",
      time: "10:38 AM"
    },
    {
      id: 7,
      sender: "mentor",
      text: "Start with a to-do app, then maybe a weather app using an API. After that, try a portfolio site. Each one teaches you something different.",
      time: "10:39 AM",
      avatar: "https://images.unsplash.com/photo-1738566061505-556830f8b8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDA4Njc1MXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 8,
      sender: "mentor",
      text: "Also, don't worry about making them perfect. The goal is to learn by doing!",
      time: "10:39 AM",
      avatar: "https://images.unsplash.com/photo-1738566061505-556830f8b8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDA4Njc1MXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: 9,
      sender: "student",
      text: "Got it! Should I focus on frontend or backend first?",
      time: "10:41 AM"
    },
    {
      id: 10,
      sender: "mentor",
      text: "Frontend first is usually easier to see results and stay motivated. Once you're comfortable, backend is a natural next step.",
      time: "10:42 AM",
      avatar: "https://images.unsplash.com/photo-1738566061505-556830f8b8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDA4Njc1MXww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  return (
    <div 
      className="flex-1 overflow-y-auto px-6 py-6"
      style={{
        background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)'
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Date Divider */}
        <div className="flex items-center justify-center my-6">
          <div className="bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-200">
            <span className="text-xs text-gray-500">Today</span>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "student" ? "justify-end" : "justify-start"}`}
            >
              {/* Mentor Message (Left) */}
              {message.sender === "mentor" && (
                <div className="flex items-end gap-2 max-w-[70%]">
                  <img
                    src={message.avatar}
                    alt="Dr. James Chen"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div>
                    <div
                      className="bg-white px-4 py-3 rounded-[18px] shadow-sm"
                      style={{
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                      }}
                    >
                      <p className="text-gray-800">{message.text}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 ml-2">{message.time}</p>
                  </div>
                </div>
              )}

              {/* Student Message (Right) */}
              {message.sender === "student" && (
                <div className="max-w-[70%]">
                  <div
                    className="px-4 py-3 rounded-[18px] text-white"
                    style={{
                      background: 'linear-gradient(135deg, #D50000 0%, #960000 100%)',
                      boxShadow: '0 2px 8px rgba(213, 0, 0, 0.3)'
                    }}
                  >
                    <p>{message.text}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 mr-2 text-right">{message.time}</p>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          <div className="flex items-end gap-2 max-w-[70%]">
            <img
              src="https://images.unsplash.com/photo-1738566061505-556830f8b8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDA4Njc1MXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Dr. James Chen"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="bg-white px-5 py-4 rounded-[18px] shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
