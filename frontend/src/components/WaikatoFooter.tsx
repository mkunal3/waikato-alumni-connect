import React from 'react';

const waikatoLogo = '/Ko te Tangata | For the People.svg';
const maoriPattern = '/footer-decoration.png';

export function WaikatoFooter() {
  return (
    <footer style={{ backgroundColor: '#f5f5f5' }}>
      {/* Main Footer Content - simplified to remove non-functional links */}
      <div className="max-w-[1440px] mx-auto px-12 py-12" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="flex items-center gap-6 flex-wrap">
          <img 
            src={waikatoLogo} 
            alt="University of Waikato - For the People" 
            className="w-48 object-contain"
          />
        </div>
      </div>
      
      {/* Maori Pattern Border */}
      <div className="w-full bg-[#f5f5f5]">
        <img 
          src={maoriPattern} 
          alt="Maori Tukutuku Pattern" 
          className="w-full h-auto"
        />
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#2c2c2c] text-white py-6">
        <div className="max-w-[1440px] mx-auto px-12 flex flex-row justify-between items-center">
          <p className="text-sm text-gray-200" style={{ margin: 0 }}>
            © 2025 University of Waikato / Te Whare Wānanga o Waikato. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
