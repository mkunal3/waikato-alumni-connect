import { Code, Cloud, Database, Brain, BarChart3, Lightbulb } from 'lucide-react';

const skills = [
  { name: 'Python', icon: Code },
  { name: 'Machine Learning', icon: Brain },
  { name: 'Azure Cloud', icon: Cloud },
  { name: 'SQL', icon: Database },
  { name: 'Data Engineering', icon: BarChart3 },
  { name: 'AI Strategy', icon: Lightbulb },
];

export function SkillsSection() {
  return (
    <div className="bg-white rounded-[16px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <h2 className="text-gray-900 mb-6">Skills & Expertise</h2>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => {
          const Icon = skill.icon;
          return (
            <div
              key={skill.name}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 rounded-full border border-gray-200 hover:border-[#D50000] hover:bg-red-50 transition-colors group"
            >
              <Icon className="w-4 h-4 text-gray-600 group-hover:text-[#D50000]" />
              <span className="text-gray-700 group-hover:text-[#D50000]">{skill.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
