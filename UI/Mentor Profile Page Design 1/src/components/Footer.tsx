import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t mt-16" style={{ 
      borderColor: 'var(--waikato-border)',
      backgroundColor: 'var(--waikato-gray)' 
    }}>
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="mb-4" style={{ color: 'var(--waikato-dark)' }}>About</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:opacity-70" style={{ color: 'var(--waikato-dark)' }}>About Us</a></li>
              <li><a href="#" className="hover:opacity-70" style={{ color: 'var(--waikato-dark)' }}>Our Mission</a></li>
              <li><a href="#" className="hover:opacity-70" style={{ color: 'var(--waikato-dark)' }}>Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4" style={{ color: 'var(--waikato-dark)' }}>Programs</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:opacity-70" style={{ color: 'var(--waikato-dark)' }}>Mentorship</a></li>
              <li><a href="#" className="hover:opacity-70" style={{ color: 'var(--waikato-dark)' }}>Career Services</a></li>
              <li><a href="#" className="hover:opacity-70" style={{ color: 'var(--waikato-dark)' }}>Alumni Network</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4" style={{ color: 'var(--waikato-dark)' }}>Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:opacity-70" style={{ color: 'var(--waikato-dark)' }}>FAQs</a></li>
              <li><a href="#" className="hover:opacity-70" style={{ color: 'var(--waikato-dark)' }}>Guidelines</a></li>
              <li><a href="#" className="hover:opacity-70" style={{ color: 'var(--waikato-dark)' }}>Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4" style={{ color: 'var(--waikato-dark)' }}>Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:opacity-70">
                <Facebook className="w-5 h-5" style={{ color: 'var(--waikato-dark)' }} />
              </a>
              <a href="#" className="hover:opacity-70">
                <Twitter className="w-5 h-5" style={{ color: 'var(--waikato-dark)' }} />
              </a>
              <a href="#" className="hover:opacity-70">
                <Linkedin className="w-5 h-5" style={{ color: 'var(--waikato-dark)' }} />
              </a>
              <a href="#" className="hover:opacity-70">
                <Instagram className="w-5 h-5" style={{ color: 'var(--waikato-dark)' }} />
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t flex justify-between items-center" style={{ borderColor: 'var(--waikato-border)' }}>
          <p style={{ color: 'var(--waikato-dark)' }}>© 2025 University of Waikato. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:opacity-70" style={{ color: 'var(--waikato-dark)' }}>Privacy Policy</a>
            <a href="#" className="hover:opacity-70" style={{ color: 'var(--waikato-dark)' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
