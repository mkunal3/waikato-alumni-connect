import { Smile, Paperclip, Mic, Send } from "lucide-react";

export function MessageInput() {
  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div
          className="flex items-center gap-3 bg-white rounded-full px-5 py-3 border border-gray-200"
          style={{
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Input Field */}
          <input
            type="text"
            placeholder="Write a message…"
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
          />

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700">
              <Smile className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700">
              <Mic className="w-5 h-5" />
            </button>

            {/* Send Button */}
            <button
              className="p-2.5 rounded-full bg-gradient-to-br from-[#D50000] to-[#960000] hover:shadow-lg transition-all duration-200 ml-1"
              style={{
                boxShadow: '0 4px 12px rgba(213, 0, 0, 0.3)'
              }}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
