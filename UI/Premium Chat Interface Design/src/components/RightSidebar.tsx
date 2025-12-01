import { Calendar, BookOpen, Share2, FileText, File } from "lucide-react";

export function RightSidebar() {
  const recentFiles = [
    { name: "Portfolio_2024.pdf", size: "2.3 MB", icon: FileText },
    { name: "Resume_Updated.docx", size: "156 KB", icon: File },
    { name: "Project_Screenshots.zip", size: "8.7 MB", icon: File }
  ];

  return (
    <div className="p-5 space-y-5">
      {/* Quick Actions Card */}
      <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
        <h3 className="text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="space-y-2">
          <button className="w-full bg-[#D50000] text-white px-4 py-3 rounded-lg shadow-sm hover:bg-[#B50000] transition-colors flex items-center gap-3">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Book 1-1 Session</span>
          </button>
          
          <button className="w-full bg-white text-gray-700 border border-gray-300 px-4 py-3 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-3">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">View Resources</span>
          </button>
          
          <button className="w-full bg-white text-gray-700 border border-gray-300 px-4 py-3 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-3">
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Share Portfolio</span>
          </button>
        </div>
      </div>

      {/* Notes Panel */}
      <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
        <h3 className="text-gray-900 mb-3">My Notes</h3>
        <p className="text-xs text-gray-500 mb-3">About This Mentor</p>
        
        <textarea
          placeholder="Add notes about your conversation, action items, or key takeaways..."
          className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:border-[#D50000] focus:ring-2 focus:ring-[#D50000] focus:ring-opacity-20 text-gray-700 placeholder-gray-400"
        />
        
        <button className="mt-2 text-sm text-[#D50000] hover:underline">
          Save Notes
        </button>
      </div>

      {/* Recent Files */}
      <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
        <h3 className="text-gray-900 mb-4">Recent Files</h3>
        
        <div className="space-y-3">
          {recentFiles.map((file, index) => {
            const Icon = file.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#D50000]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.size}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
