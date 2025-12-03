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
    avatar: 'https://images.unsplash.com/photo-1607286908165-b8b6a2874fc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjQwOTEyNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 2,
    name: 'David Kumar',
    role: 'Product Manager',
    company: 'Air New Zealand',
    tags: ['Strategy', 'Innovation'],
    avatar: 'https://images.unsplash.com/photo-1762341120638-b5b9358ef571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbnxlbnwxfHx8fDE3NjM5OTAwNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 3,
    name: 'Lisa Thompson',
    role: 'Finance Analyst',
    company: 'ASB Bank',
    tags: ['Finance', 'Analytics'],
    avatar: 'https://images.unsplash.com/photo-1758691736975-9f7f643d178e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwcHJvZmVzc2lvbmFsJTIwdGVhbXxlbnwxfHx8fDE3NjQwOTg5Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
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
