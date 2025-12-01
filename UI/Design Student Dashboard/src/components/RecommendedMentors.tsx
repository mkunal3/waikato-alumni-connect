import { ImageWithFallback } from './figma/ImageWithFallback';
import { UserPlus } from 'lucide-react';

interface RecommendedMentor {
  id: number;
  name: string;
  role: string;
  company: string;
  tags: string[];
  avatar: string;
}

const recommendedMentors: RecommendedMentor[] = [
  {
    id: 1,
    name: 'Sophie Anderson',
    role: 'UX Designer',
    company: 'Trade Me',
    tags: ['Design', 'User Research'],
    avatar: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
  },
  {
    id: 2,
    name: 'David Kumar',
    role: 'Product Manager',
    company: 'Air New Zealand',
    tags: ['Strategy', 'Innovation'],
    avatar: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
  },
  {
    id: 3,
    name: 'Lisa Thompson',
    role: 'Finance Analyst',
    company: 'ASB Bank',
    tags: ['Finance', 'Analytics'],
    avatar: 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E
  }
];

export function RecommendedMentors() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-gray-900 mb-6">Recommended Mentors</h2>
      
      <div className="space-y-4">
        {recommendedMentors.map((mentor) => (
          <div 
            key={mentor.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <ImageWithFallback 
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <div className="text-gray-900">{mentor.name}</div>
                <div className="text-gray-600 text-sm">{mentor.role}</div>
                <div className="text-gray-500 text-xs">{mentor.company}</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {mentor.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <button className="w-full px-4 py-2 text-[#D50000] border border-[#D50000] rounded-lg hover:bg-[#D50000] hover:text-white transition-colors flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span>Request Mentorship</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
