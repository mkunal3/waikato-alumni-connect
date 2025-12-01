import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Eye, Calendar } from "lucide-react";

export function MentorProfile() {
  const mentorImage = "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E";
  
  const skills = [
    "UI/UX Design",
    "React",
    "TypeScript",
    "Product Strategy",
    "Mentorship",
    "Accessibility"
  ];

  return (
    <div className="p-4 bg-[#F5F5F5]">
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-5">
        {/* Mentor Image */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative">
            <ImageWithFallback
              src={mentorImage}
              alt="Mentor"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {/* Online Status Dot */}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </div>

        {/* Mentor Info */}
        <div className="text-center mb-4">
          <h2 className="text-gray-900 mb-1">Dr. Sarah Mitchell</h2>
          <p className="text-sm text-gray-600 mb-0.5">Senior Product Designer</p>
          <p className="text-sm text-gray-500">Microsoft</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mb-5">
          <button className="w-full bg-[#D50000] text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-[#B50000] transition-colors flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" />
            View Profile
          </button>
          <button className="w-full bg-white text-[#D50000] border-2 border-[#D50000] px-4 py-2.5 rounded-lg shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Book Session
          </button>
        </div>

        {/* Skills & Expertise */}
        <div>
          <h3 className="text-sm text-gray-700 mb-3">Skills & Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs border border-gray-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
