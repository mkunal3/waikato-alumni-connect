import { Calendar, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface UpcomingSessionCardProps {
  mentorPhoto: string;
  mentorName: string;
  role: string;
  date: string;
  time: string;
}

export function UpcomingSessionCard({ mentorPhoto, mentorName, role, date, time }: UpcomingSessionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex gap-4 mb-4">
        <ImageWithFallback 
          src={mentorPhoto}
          alt={mentorName}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="mb-1">{mentorName}</h3>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{time}</span>
        </div>
      </div>

      <button className="w-full px-4 py-2 bg-[var(--waikato-red)] text-white rounded-lg hover:bg-red-700 transition-colors">
        View Details
      </button>
    </div>
  );
}
