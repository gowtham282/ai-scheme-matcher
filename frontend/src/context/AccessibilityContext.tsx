import React, { createContext, useContext, useState, useEffect } from 'react';

type FontScale = 'sm' | 'md' | 'lg' | 'xl';

interface AccessibilityContextType {
  fontScale: FontScale;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontScale, setFontScale] = useState<FontScale>(() => {
    return (localStorage.getItem('font_scale') as FontScale) || 'md';
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('high_contrast') === 'true';
  });

  useEffect(() => {
    document.body.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg', 'font-scale-xl');
    document.body.classList.add(`font-scale-${fontScale}`);
    localStorage.setItem('font_scale', fontScale);
  }, [fontScale]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('high_contrast', String(highContrast));
  }, [highContrast]);

  const increaseFontSize = () => {
    if (fontScale === 'sm') setFontScale('md');
    else if (fontScale === 'md') setFontScale('lg');
    else if (fontScale === 'lg') setFontScale('xl');
  };

  const decreaseFontSize = () => {
    if (fontScale === 'xl') setFontScale('lg');
    else if (fontScale === 'lg') setFontScale('md');
    else if (fontScale === 'md') setFontScale('sm');
  };

  const resetFontSize = () => setFontScale('md');
  const toggleHighContrast = () => setHighContrast(prev => !prev);

  return (
    <AccessibilityContext.Provider
      value={{
        fontScale,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        highContrast,
        toggleHighContrast
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
