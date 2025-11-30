export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="mb-4">Study</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Undergraduate</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Postgraduate</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Online Learning</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4">Research</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Research Areas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Publications</a></li>
              <li><a href="#" className="hover:text-white transition-colors">PhD Study</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4">About</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Campus</a></li>
              <li><a href="#" className="hover:text-white transition-colors">News</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Visit Campus</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 flex justify-between items-center text-gray-400">
          <p>&copy; 2024 University of Waikato. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
