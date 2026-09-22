import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontSizeMultiplier: number;
}

const FontSizeContext = createContext<FontSizeContextType>({
  fontSize: 'medium',
  setFontSize: () => {},
  fontSizeMultiplier: 1,
});

const fontSizeMultipliers: Record<FontSize, number> = {
  small: 0.875,    // 14px base
  medium: 1,       // 16px base
  large: 1.125,    // 18px base
  xlarge: 1.25,    // 20px base
};

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const saved = localStorage.getItem('huerto-font-size');
    return (saved as FontSize) || 'medium';
  });

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem('huerto-font-size', size);
  };

  const fontSizeMultiplier = fontSizeMultipliers[fontSize];

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSizeMultiplier * 100}%`;
  }, [fontSizeMultiplier]);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize, fontSizeMultiplier }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export const useFontSize = () => useContext(FontSizeContext);
