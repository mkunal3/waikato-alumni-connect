import { ImageWithFallback } from './figma/ImageWithFallback';

interface StudentHeaderProps {
  photoUrl: string;
  name: string;
  degree: string;
  tags: string[];
}

export function StudentHeader({ photoUrl, name, degree, tags }: StudentHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
      <div className="flex gap-8">
        {/* Student Photo */}
        <div className="flex-shrink-0">
          <ImageWithFallback 
            src={photoUrl}
            alt={name}
            className="w-[180px] h-[180px] object-cover rounded-xl"
          />
        </div>

        {/* Student Information */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="mb-2">{name}</h1>
          <p className="mb-4 text-gray-600">{degree}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="px-4 py-1.5 bg-gray-50 text-gray-700 rounded-full text-sm border border-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Edit Profile Button */}
          <div>
            <button className="px-6 py-2.5 border-2 border-[var(--waikato-red)] text-[var(--waikato-red)] rounded-lg hover:bg-red-50 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
