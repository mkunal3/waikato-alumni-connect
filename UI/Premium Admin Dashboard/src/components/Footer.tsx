export function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-12 ml-64">
      <div className="px-8 py-4">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between text-sm text-gray-600">
          <p>Waikato Alumni Connect — Admin Portal</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#D50000] transition-colors">
              Support
            </a>
            <a href="#" className="hover:text-[#D50000] transition-colors">
              Documentation
            </a>
            <a href="#" className="hover:text-[#D50000] transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
