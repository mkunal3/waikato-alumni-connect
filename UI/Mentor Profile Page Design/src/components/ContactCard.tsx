import { Mail, MapPin, Linkedin, CheckCircle2 } from 'lucide-react';

export function ContactCard() {
  return (
    <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <h3 className="text-gray-900 mb-5">Contact & Quick Info</h3>
      
      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-gray-500" />
          <a href="mailto:aarav.kapadia@waikato.ac.nz" className="text-gray-600 hover:text-[#D50000] transition-colors text-sm">
            aarav.kapadia@waikato.ac.nz
          </a>
        </div>

        {/* LinkedIn */}
        <div className="flex items-center gap-3">
          <Linkedin className="w-5 h-5 text-gray-500" />
          <a href="#" className="text-gray-600 hover:text-[#D50000] transition-colors text-sm">
            View LinkedIn Profile
          </a>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600 text-sm">Auckland, New Zealand</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-gray-900 mb-4">Available for:</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#D50000] flex-shrink-0 mt-0.5" />
            <span className="text-gray-600 text-sm">Vocational mentoring</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#D50000] flex-shrink-0 mt-0.5" />
            <span className="text-gray-600 text-sm">Interview preparation</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#D50000] flex-shrink-0 mt-0.5" />
            <span className="text-gray-600 text-sm">Career guidance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
