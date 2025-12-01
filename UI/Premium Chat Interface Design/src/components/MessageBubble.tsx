import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Message {
  id: number;
  sender: "mentor" | "student";
  text: string;
  timestamp: string;
  avatar?: string;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isMentor = message.sender === "mentor";

  return (
    <div className={`flex gap-3 ${isMentor ? "justify-start" : "justify-end"}`}>
      {/* Avatar for mentor messages */}
      {isMentor && message.avatar && (
        <ImageWithFallback
          src={message.avatar}
          alt="Mentor"
          className="w-10 h-10 rounded-full object-cover flex-shrink-0 shadow-sm"
        />
      )}

      {/* Message Content */}
      <div className={`flex flex-col ${isMentor ? "items-start" : "items-end"} max-w-[70%]`}>
        <div
          className={`px-5 py-3 rounded-2xl shadow-md ${
            isMentor
              ? "bg-white text-gray-800 rounded-tl-none"
              : "bg-[#D50000] text-white rounded-tr-none"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1.5 px-1">{message.timestamp}</span>
      </div>

      {/* Empty space for student messages to maintain alignment */}
      {!isMentor && <div className="w-10 flex-shrink-0"></div>}
    </div>
  );
}
