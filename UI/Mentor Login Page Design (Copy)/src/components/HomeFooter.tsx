import waikatoLogo from 'figma:asset/db2e9e04f65d3b029ee3458fee7925cd0a8c7f70.png';

export function HomeFooter() {
  return (
    <footer className="bg-[#F5F5F5] border-t border-gray-200">
      <div className="max-w-[1080px] mx-auto px-8 py-12">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <img 
            src={waikatoLogo} 
            alt="University of Waikato" 
            className="h-16 object-contain"
          />
        </div>

        {/* Links */}
        <div className="flex items-center justify-center gap-8 flex-wrap mb-6">
          <a href="#" className="text-gray-600 hover:text-black transition-colors">
            About Us / Mō Mātou
          </a>
          <a href="#" className="text-gray-600 hover:text-black transition-colors">
            Privacy / Tūmataitinga
          </a>
          <a href="#" className="text-gray-600 hover:text-black transition-colors">
            Terms / Ture
          </a>
          <a href="#" className="text-gray-600 hover:text-black transition-colors">
            Contact / Whakapā mai
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <small className="text-gray-500">
            © 2025 Waikato Navigator – Alumni Mentoring Platform
          </small>
          <br />
          <small className="text-gray-500">
            University of Waikato | Te Whare Wānanga o Waikato
          </small>
        </div>
      </div>
    </footer>
  );
}
