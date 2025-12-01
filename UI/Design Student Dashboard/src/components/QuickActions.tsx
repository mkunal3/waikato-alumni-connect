import { Search, Calendar, UserCircle } from 'lucide-react';

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-gray-900 mb-6">Quick Actions</h2>
      
      <div className="space-y-3">
        <button className="w-full px-4 py-3 bg-[#D50000] text-white rounded-lg hover:bg-[#B00000] transition-colors flex items-center justify-center gap-2">
          <Search className="w-4 h-4" />
          <span>Find a Mentor</span>
        </button>
        
        <button className="w-full px-4 py-3 text-[#D50000] border border-[#D50000] rounded-lg hover:bg-[#D50000] hover:text-white transition-colors flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Browse Events</span>
        </button>
        
        <button className="w-full px-4 py-3 text-[#D50000] border border-[#D50000] rounded-lg hover:bg-[#D50000] hover:text-white transition-colors flex items-center justify-center gap-2">
          <UserCircle className="w-4 h-4" />
          <span>Update Profile</span>
        </button>
      </div>
    </div>
  );
}
