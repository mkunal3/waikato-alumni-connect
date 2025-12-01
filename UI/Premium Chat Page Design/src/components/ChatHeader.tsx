import { Video, Phone, MoreVertical } from "lucide-react";

export function ChatHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Left: Mentor Info */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E"
            alt="Dr. James Chen"
            className="w-14 h-14 rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        </div>
        
        <div>
          <h2 className="text-gray-900 flex items-center gap-2">
            Dr. James Chen
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Online</span>
          </h2>
          <p className="text-sm text-gray-500">Senior Data Scientist at Microsoft</p>
        </div>
      </div>

      {/* Right: Action Icons */}
      <div className="flex items-center gap-3">
        <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-[#D50000]">
          <Video className="w-5 h-5" />
        </button>
        <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-[#D50000]">
          <Phone className="w-5 h-5" />
        </button>
        <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-[#D50000]">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
