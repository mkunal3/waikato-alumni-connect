import { Award } from 'lucide-react';

interface SkillBadge {
  name: string;
  progress: number;
}

export function SkillsBadgeProgress() {
  const badges: SkillBadge[] = [
    { name: 'Cloud Basics', progress: 60 },
    { name: 'UI/UX Foundations', progress: 80 },
    { name: 'Professional Communication', progress: 50 }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-[var(--waikato-red)]" />
        <h2>Skills Badge Progress</h2>
      </div>
      
      <div className="space-y-5">
        {badges.map((badge, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-700">{badge.name}</p>
              <span className="text-sm text-gray-600">{badge.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getProgressColor(badge.progress)} rounded-full transition-all`}
                style={{ width: `${badge.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
