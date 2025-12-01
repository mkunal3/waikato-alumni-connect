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
    avatar: 'https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzY0MDE0NjM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 2,
    name: 'Emma Williams',
    role: 'Marketing Director',
    company: 'Fonterra',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1607286908165-b8b6a2874fc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjQwOTEyNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 3,
    name: 'Michael Park',
    role: 'Data Analyst',
    company: 'Xero',
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1762341120638-b5b9358ef571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbnxlbnwxfHx8fDE3NjM5OTAwNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
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
