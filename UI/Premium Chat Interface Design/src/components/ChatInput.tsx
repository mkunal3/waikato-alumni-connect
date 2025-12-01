import { Smile, Paperclip, Mic, Send } from "lucide-react";

export function ChatInput() {
  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-full px-4 py-3 shadow-sm focus-within:border-[#D50000] focus-within:ring-2 focus-within:ring-[#D50000] focus-within:ring-opacity-20 transition-all">
          {/* Emoji Icon */}
          <button className="text-gray-500 hover:text-[#D50000] transition-colors p-1">
            <Smile className="w-5 h-5" />
          </button>

          {/* Input Field */}
          <input
            type="text"
            placeholder="Type your message…"
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400"
          />

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button className="text-gray-500 hover:text-[#D50000] transition-colors p-1">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="text-gray-500 hover:text-[#D50000] transition-colors p-1">
              <Mic className="w-5 h-5" />
            </button>
            <button className="bg-[#D50000] text-white p-2 rounded-full hover:bg-[#B50000] transition-colors shadow-md ml-1">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
