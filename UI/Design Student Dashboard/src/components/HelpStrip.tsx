import { HelpCircle } from 'lucide-react';

export function HelpStrip() {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-center gap-2 text-gray-600">
        <HelpCircle className="w-5 h-5 text-gray-500" />
        <span>Need help? Contact the Careers & Employability team.</span>
      </div>
    </div>
  );
}
