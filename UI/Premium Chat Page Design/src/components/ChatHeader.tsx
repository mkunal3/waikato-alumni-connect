import { Video, Phone, MoreVertical } from "lucide-react";

export function ChatHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Left: Mentor Info */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1738566061505-556830f8b8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhc2lhbiUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDA4Njc1MXww&ixlib=rb-4.1.0&q=80&w=1080"
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
