import { Target } from 'lucide-react';

export function CareerGoalsCard() {
  const interests = ['AI/ML', 'Full-stack Development', 'DevOps'];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full">
      <h2 className="mb-4">Career Goals</h2>
      
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-[var(--waikato-red)]" />
          <p className="text-gray-900">Aspire to be:</p>
        </div>
        <p className="text-gray-700 ml-7">Software Engineer / Cloud Engineer</p>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 mb-3">Interested in:</p>
        <p className="text-gray-700 ml-0">{interests.join(', ')}</p>
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        {interests.map((interest, index) => (
          <span 
            key={index}
            className="px-4 py-2 bg-red-50 text-[var(--waikato-red)] rounded-lg border border-red-200"
          >
            {interest}
          </span>
        ))}
      </div>
    </div>
  );
}
