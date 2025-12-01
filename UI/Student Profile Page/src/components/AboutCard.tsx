import { Code2, Cloud, Palette } from 'lucide-react';

export function AboutCard() {
  const skills = [
    { icon: Code2, label: 'Programming', items: 'Python, JavaScript' },
    { icon: Cloud, label: 'Cloud', items: 'AWS, Azure' },
    { icon: Palette, label: 'Frontend', items: 'React, Figma' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full">
      <h2 className="mb-4">About Me</h2>
      <p className="mb-6 text-gray-600">
        I'm a passionate IT student with a strong interest in cloud technologies and user experience design. 
        Currently pursuing my Master's degree while actively seeking mentorship opportunities to grow my skills 
        in software development and cloud engineering.
      </p>

      <div className="space-y-4">
        <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-3">Key Strengths</h3>
        {skills.map((skill, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <skill.icon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-gray-900">{skill.label}</p>
              <p className="text-sm text-gray-500">{skill.items}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
