import { MentorProfile } from "./components/MentorProfile";
import { ChatArea } from "./components/ChatArea";
import { RightSidebar } from "./components/RightSidebar";
import waikatoLogo from "figma:asset/db2e9e04f65d3b029ee3458fee7925cd0a8c7f70.png";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F8F8] to-[#FFFFFF]" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={waikatoLogo} alt="University of Waikato" className="h-12" />
          <div className="border-l border-gray-300 pl-3 ml-2">
            <h1 className="text-gray-900">Alumni Connect</h1>
            <p className="text-sm text-gray-500">Mentorship Platform</p>
          </div>
        </div>
      </header>

      {/* Main 3-Column Layout */}
      <div className="flex h-[calc(100vh-88px)]">
        {/* Left Column - Mentor Profile */}
        <div className="w-[250px] border-r border-gray-200 bg-white overflow-y-auto">
          <MentorProfile />
        </div>

        {/* Center Column - Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatArea />
        </div>

        {/* Right Column - Quick Actions & Notes */}
        <div className="w-[300px] border-l border-gray-200 bg-white overflow-y-auto">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
