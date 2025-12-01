import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";

const messages = [
  {
    id: 1,
    sender: "mentor",
    text: "Hi Neeraj! Happy to help you with your career pathway. What goals are you focusing on right now?",
    timestamp: "10:23 AM",
    avatar: "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E"
  },
  {
    id: 2,
    sender: "student",
    text: "Kia ora! I'm mainly interested in UI/UX and full-stack development. What should I improve first?",
    timestamp: "10:25 AM"
  },
  {
    id: 3,
    sender: "mentor",
    text: "Great direction! I'd start with stronger UI fundamentals, accessibility, and then React with TypeScript. Do you have recent projects?",
    timestamp: "10:27 AM",
    avatar: "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E"
  },
  {
    id: 4,
    sender: "student",
    text: "Yes, I'm creating the Waikato Alumni Connect platform. Want feedback?",
    timestamp: "10:29 AM"
  },
  {
    id: 5,
    sender: "mentor",
    text: "Absolutely, send it through! Also happy to help with internship pathways.",
    timestamp: "10:30 AM",
    avatar: "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E"
  }
];

export function ChatArea() {
  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <h2 className="text-gray-900">Conversation with Dr. Sarah Mitchell</h2>
        <p className="text-sm text-green-600">● Active now</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-gradient-to-b from-[#F8F8F8] to-[#FFFFFF]">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {/* Typing Indicator */}
          <TypingIndicator />
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput />
    </div>
  );
}
