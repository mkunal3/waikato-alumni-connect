import waikatoLogo from 'figma:asset/db2e9e04f65d3b029ee3458fee7925cd0a8c7f70.png';
import maoriPattern from 'figma:asset/dda2da833816f514a0418bb2c5fe9f0fc78fd1ea.png';

export function WaikatoFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-[1440px] mx-auto px-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={waikatoLogo} 
            alt="University of Waikato" 
            className="h-20 object-contain"
          />
        </div>

        {/* Links */}
        <div className="flex items-center justify-center gap-10 flex-wrap mb-6">
          <a href="#" className="text-gray-700 hover:text-black transition-colors">
            About Us / Mō Mātou
          </a>
          <a href="#" className="text-gray-700 hover:text-black transition-colors">
            Privacy / Tūmataitinga
          </a>
          <a href="#" className="text-gray-700 hover:text-black transition-colors">
            Terms / Ture
          </a>
          <a href="#" className="text-gray-700 hover:text-black transition-colors">
            Contact / Whakapā mai
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-600 mb-1">
            © 2025 Waikato University | Te Whare Wānanga o Waikato
          </p>
          <p className="text-gray-500">
            Alumni Mentoring Platform · Waikato Navigator
          </p>
        </div>
      </div>
      
      {/* Māori Pattern Border */}
      <div className="w-full mt-12">
        <img 
          src={maoriPattern} 
          alt="Māori Tukutuku Pattern" 
          className="w-full h-auto"
        />
      </div>
    </footer>
  );
}