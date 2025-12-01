import { ImageWithFallback } from './figma/ImageWithFallback';
import { ExternalLink } from 'lucide-react';

interface Mentor {
  id: number;
  name: string;
  role: string;
  company: string;
  status: 'Active' | 'Pending' | 'Completed';
  avatar: string;
}

const mentors: Mentor[] = [
  {
    id: 1,
    name: 'Dr. James Chen',
    role: 'Senior Software Engineer',
    company: 'Google',
    status: 'Active',
    avatar: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
  },
  {
    id: 2,
    name: 'Emma Williams',
    role: 'Marketing Director',
    company: 'Fonterra',
    status: 'Active',
    avatar: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
  },
  {
    id: 3,
    name: 'Michael Park',
    role: 'Data Analyst',
    company: 'Xero',
    status: 'Pending',
    avatar: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
  }
];

const statusColors = {
  Active: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Completed: 'bg-gray-100 text-gray-800'
};

export function MentoringMatches() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-gray-900 mb-6">Your Mentoring Matches</h2>
      
      <div className="space-y-4">
        {mentors.map((mentor) => (
          <div 
            key={mentor.id} 
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <ImageWithFallback 
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <div className="text-gray-900">{mentor.name}</div>
                <div className="text-gray-600 text-sm">{mentor.role} · {mentor.company}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs ${statusColors[mentor.status]}`}>
                {mentor.status}
              </span>
              
              <button className="px-4 py-2 text-[#D50000] border border-[#D50000] rounded-lg hover:bg-[#D50000] hover:text-white transition-colors flex items-center gap-2">
                <span>View Profile</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
