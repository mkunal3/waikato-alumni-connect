import { useLanguage } from '../contexts/LanguageContext';
import { content } from '../config/content';

const waikatoLogo = '/waikato-logo.png';
const maoriPattern = '/footer-decoration.png';

export function WaikatoFooter() {
  const { t } = useLanguage();

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
            {t(content.footer.links.about.en, content.footer.links.about.mi)}
          </a>
          <a href="#" className="text-gray-700 hover:text-black transition-colors">
            {t(content.footer.links.privacy.en, content.footer.links.privacy.mi)}
          </a>
          <a href="#" className="text-gray-700 hover:text-black transition-colors">
            {t(content.footer.links.terms.en, content.footer.links.terms.mi)}
          </a>
          <a href="#" className="text-gray-700 hover:text-black transition-colors">
            {t(content.footer.links.contact.en, content.footer.links.contact.mi)}
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-600 mb-1">
            {t(content.footer.copyright.en, content.footer.copyright.mi)}
          </p>
          <p className="text-gray-500">
            {t(content.footer.tagline.en, content.footer.tagline.mi)}
          </p>
        </div>
      </div>
      
      {/* Maori Pattern Border */}
      <div className="w-full mt-12">
        <img 
          src={maoriPattern} 
          alt="Maori Tukutuku Pattern" 
          className="w-full h-auto"
        />
      </div>
    </footer>
  );
}
