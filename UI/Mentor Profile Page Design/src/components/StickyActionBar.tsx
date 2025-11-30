import { Calendar, MessageCircle, StickyNote } from 'lucide-react';

export function StickyActionBar() {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-white rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-6 py-4 flex items-center gap-4">
        <button className="px-6 py-3 bg-[#D50000] text-white rounded-[12px] hover:bg-[#B00000] transition-colors shadow-md hover:shadow-lg flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Book Session
        </button>
        <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-[12px] hover:bg-gray-200 transition-colors flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Message Mentor
        </button>
        <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-[12px] hover:bg-gray-200 transition-colors flex items-center gap-2">
          <StickyNote className="w-5 h-5" />
          Add Note
        </button>
      </div>
    </div>
  );
}
