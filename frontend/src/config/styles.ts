// Centralized style configuration for bilingual text
// Modify these values to change the appearance of English and Maori text across the site

export const bilingualStyles = {
  // For light/white backgrounds
  light: {
    // English text styles
    en: {
      heading: 'text-black',
      subheading: 'text-gray-700 text-lg',
      body: 'text-gray-700',
      small: 'text-gray-700 text-sm',
    },
    // Maori text styles (smaller and lighter than English)
    mi: {
      heading: 'text-gray-500 text-lg',
      subheading: 'text-gray-500 text-base',
      body: 'text-gray-500 text-sm',
      small: 'text-gray-500 text-xs',
    },
  },

  // For dark backgrounds (hero section with background image)
  dark: {
    // English text styles
    en: {
      heading: 'text-white',
      subheading: 'text-white text-xl',
      body: 'text-white',
      small: 'text-white text-sm',
    },
    // Maori text styles (same white color but smaller)
    mi: {
      heading: 'text-white text-lg',
      subheading: 'text-white text-base',
      body: 'text-white text-sm',
      small: 'text-white text-xs',
    },
  },
};

// Brand colors
export const colors = {
  primary: '#D50000',      // Waikato red
  primaryLight: '#FFE5E5', // Light red for backgrounds
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

// Helper function to get bilingual styles
export function getBilingualStyles(
  background: 'light' | 'dark',
  variant: 'heading' | 'subheading' | 'body' | 'small'
) {
  return {
    en: bilingualStyles[background].en[variant],
    mi: bilingualStyles[background].mi[variant],
  };
}


