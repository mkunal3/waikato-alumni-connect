import { BilingualText as BilingualTextType } from '../config/content';

// Style presets for different contexts
export type TextVariant = 
  | 'heading'      // Large title (h2)
  | 'subheading'   // Section subtitle
  | 'body'         // Normal paragraph
  | 'small'        // Small text (cards, buttons)
  | 'badge';       // Badge/tag text

export type TextTheme = 
  | 'light'        // For dark backgrounds (white text)
  | 'dark';        // For light backgrounds (gray/black text)

interface BilingualTextProps {
  text: BilingualTextType;
  variant?: TextVariant;
  theme?: TextTheme;
  className?: string;
  showMaori?: boolean;
  separator?: string;  // For inline display like "English / Maori"
  inline?: boolean;    // Display inline with separator
}

// Style configurations
const styles = {
  light: {
    // For dark backgrounds - all white, Maori slightly smaller
    heading: {
      en: 'text-white',
      mi: 'text-white text-lg',
    },
    subheading: {
      en: 'text-white text-xl',
      mi: 'text-white text-base',
    },
    body: {
      en: 'text-white',
      mi: 'text-white text-sm',
    },
    small: {
      en: 'text-white text-sm',
      mi: 'text-white text-xs',
    },
    badge: {
      en: '',
      mi: '',
    },
  },
  dark: {
    // For light backgrounds - English darker, Maori lighter and smaller
    heading: {
      en: 'text-black',
      mi: 'text-gray-500 text-lg',
    },
    subheading: {
      en: 'text-gray-700 text-lg',
      mi: 'text-gray-500 text-base',
    },
    body: {
      en: 'text-gray-700',
      mi: 'text-gray-500 text-sm',
    },
    small: {
      en: 'text-gray-700 text-sm',
      mi: 'text-gray-500 text-xs',
    },
    badge: {
      en: '',
      mi: '',
    },
  },
};

export function BilingualText({
  text,
  variant = 'body',
  theme = 'dark',
  className = '',
  showMaori = true,
  separator = ' / ',
  inline = false,
}: BilingualTextProps) {
  const styleConfig = styles[theme][variant];

  // Inline display (e.g., "About Us / Mo Matou")
  if (inline) {
    return (
      <span className={className}>
        <span className={styleConfig.en}>{text.en}</span>
        {showMaori && text.mi && (
          <>
            {separator}
            <span className={styleConfig.mi}>{text.mi}</span>
          </>
        )}
      </span>
    );
  }

  // Block display (stacked)
  return (
    <div className={className}>
      <div className={styleConfig.en}>{text.en}</div>
      {showMaori && text.mi && (
        <div className={styleConfig.mi}>{text.mi}</div>
      )}
    </div>
  );
}

// Simpler component for just displaying bilingual text with custom styles
interface SimpleBilingualProps {
  en: string;
  mi: string;
  enClassName?: string;
  miClassName?: string;
  className?: string;
  inline?: boolean;
  separator?: string;
}

export function SimpleBilingual({
  en,
  mi,
  enClassName = 'text-gray-700',
  miClassName = 'text-gray-500 text-sm',
  className = '',
  inline = false,
  separator = ' / ',
}: SimpleBilingualProps) {
  if (inline) {
    return (
      <span className={className}>
        <span className={enClassName}>{en}</span>
        {mi && (
          <>
            {separator}
            <span className={miClassName}>{mi}</span>
          </>
        )}
      </span>
    );
  }

  return (
    <div className={className}>
      <div className={enClassName}>{en}</div>
      {mi && <div className={miClassName}>{mi}</div>}
    </div>
  );
}


