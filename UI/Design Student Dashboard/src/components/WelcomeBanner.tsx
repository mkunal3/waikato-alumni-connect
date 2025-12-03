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
              src="https://images.unsplash.com/photo-1585984968562-1443b72fb0dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50b3JpbmclMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzY0MTA1MzAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Mentoring illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
