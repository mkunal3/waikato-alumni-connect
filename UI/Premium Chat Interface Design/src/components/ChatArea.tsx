import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";

const messages = [
  {
    id: 1,
    sender: "mentor",
    text: "Hi Neeraj! Happy to help you with your career pathway. What goals are you focusing on right now?",
    timestamp: "10:23 AM",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop"
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
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop"
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
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop"
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
