export function Footer() {
  return (
    <footer className="bg-[#F5F5F5] border-t border-gray-200 mt-auto">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <a href="#" className="text-gray-600 hover:text-black transition-colors">
            About Us / Mō Mātou
          </a>
          <a href="#" className="text-gray-600 hover:text-black transition-colors">
            Privacy Policy / Kaupapahere Tūmataitinga
          </a>
          <a href="#" className="text-gray-600 hover:text-black transition-colors">
            Terms of Use / Ngā Ture Whakamahi
          </a>
          <a href="#" className="text-gray-600 hover:text-black transition-colors">
            Contact / Whakapā Mai
          </a>
        </div>
        <div className="text-center mt-4">
          <small className="text-gray-500">
            © 2025 Waikato Navigator – Alumni Mentoring Platform
          </small>
        </div>
      </div>
    </footer>
  );
}
