import { Sidebar } from "./components/Sidebar";
import { ChatHeader } from "./components/ChatHeader";
import { ChatArea } from "./components/ChatArea";
import { MessageInput } from "./components/MessageInput";
import waikatoLogo from "figma:asset/db2e9e04f65d3b029ee3458fee7925cd0a8c7f70.png";

export default function App() {
  return (
    <div className="flex h-screen bg-[#F5F5F5]" style={{ fontFamily: 'Segoe UI, Inter, sans-serif' }}>
      {/* Header with Waikato Logo */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50 flex items-center px-6">
        <img src={waikatoLogo} alt="University of Waikato" className="h-10" />
      </div>

      {/* Main Content */}
      <div className="flex w-full mt-16">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatHeader />
          <ChatArea />
          
          {/* Sticky Tip Bar */}
          <div className="bg-yellow-50 border-t border-yellow-200 px-6 py-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-yellow-800 text-sm">
              Be respectful. Mentors volunteer their time to help you.
            </p>
          </div>

          <MessageInput />
        </div>
      </div>
    </div>
  );
}
