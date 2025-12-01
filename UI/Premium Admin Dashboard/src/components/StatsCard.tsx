import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  badge?: boolean;
  isHealth?: boolean;
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color, 
  badge,
  isHealth 
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            {badge ? (
              <span className="bg-[#D50000] text-white text-3xl px-4 py-2 rounded-lg">
                {value}
              </span>
            ) : isHealth ? (
              <span className="text-4xl text-green-500">✓</span>
            ) : (
              <span className="text-4xl">{value}</span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-2">{subtitle}</p>
        </div>
        <div className={`${color} bg-gray-50 p-3 rounded-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
