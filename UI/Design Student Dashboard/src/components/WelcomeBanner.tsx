import { GraduationCap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function WelcomeBanner() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Welcome back, Sarah Johnson</h1>
          <p className="text-gray-600">Here's a quick overview of your mentoring activity.</p>
        </div>
        
        <div className="hidden md:block">
          <div className="w-32 h-32 rounded-lg overflow-hidden">
            <ImageWithFallback 
              src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23e5e7eb%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-family=%27sans-serif%27 font-size=%2720%27 fill=%27%23999%27%3EImage Placeholder%3C/text%3E%3C/svg%3E"
              alt="Mentoring illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
