import { X, Calendar, Clock, MapPin, MessageSquare } from 'lucide-react';
import { Session } from '../types/session';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SessionPopupProps {
  session: Session;
  onClose: () => void;
}

export function SessionPopup({ session, onClose }: SessionPopupProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'career':
        return 'Career Guidance';
      case 'technical':
        return 'Technical Mentoring';
      case 'interview':
        return 'Interview Preparation';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'career':
        return 'bg-[#D50000] text-white';
      case 'technical':
        return 'bg-blue-600 text-white';
      case 'interview':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-gray-900">Session Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mentor */}
          <div className="flex items-center gap-4">
            <ImageWithFallback
              src={session.mentorPhoto}
              alt={session.mentorName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <div className="text-gray-500">Mentor</div>
              <div className="text-gray-900">{session.mentorName}</div>
            </div>
          </div>

          {/* Student */}
          <div className="flex items-center gap-4">
            <ImageWithFallback
              src={session.studentPhoto}
              alt={session.studentName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <div className="text-gray-500">Student</div>
              <div className="text-gray-900">{session.studentName}</div>
            </div>
          </div>

          {/* Session Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-gray-500">Date</div>
                <div className="text-gray-900">
                  {session.date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-gray-500">Time</div>
                <div className="text-gray-900">
                  {session.startTime} – {session.endTime}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-gray-500">Location</div>
                <div className="text-gray-900">Online</div>
              </div>
            </div>
          </div>

          {/* Session Type Badge */}
          <div>
            <div className="text-gray-500 mb-2">Session Type</div>
            <span className={`inline-block px-3 py-1 rounded-full ${getTypeColor(session.type)}`}>
              {getTypeLabel(session.type)}
            </span>
          </div>

          {/* Notes */}
          <div>
            <div className="text-gray-500 mb-2">Notes</div>
            <div className="bg-[#F4F4F8] rounded-lg p-4 text-gray-700">
              {session.notes}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Open Chat/Room
          </button>

          <button className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Reschedule
          </button>

          <button className="w-full px-4 py-3 bg-white border border-red-300 text-[#D50000] rounded-lg hover:bg-red-50 transition-colors">
            Cancel Session
          </button>
        </div>
      </div>
    </div>
  );
}
