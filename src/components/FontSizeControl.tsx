import { useFontSize } from '../context/FontSizeContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { Type } from 'lucide-react';

export function FontSizeControl() {
  const { fontSize, setFontSize } = useFontSize();
  const { isDark } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const sizes = [
    { value: 'small', label: 'Pequeño', preview: 'Aa', px: '14px' },
    { value: 'medium', label: 'Mediano', preview: 'Aa', px: '16px' },
    { value: 'large', label: 'Grande', preview: 'Aa', px: '18px' },
    { value: 'xlarge', label: 'Muy Grande', preview: 'Aa', px: '20px' },
  ] as const;

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all btn-cute ${
          isDark 
            ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' 
            : 'bg-white/60 text-gray-600 hover:bg-white/80'
        } shadow-cute`}
        aria-label="Ajustar tamaño de fuente"
      >
        <Type size={18} />
      </button>
      
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          <div className={`absolute right-0 top-12 z-50 w-56 rounded-xl shadow-cute-lg border-2 overflow-hidden animate-fade-in ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                Tamaño de Texto
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Ajusta el tamaño para mejor legibilidad
              </p>
            </div>
            
            <div className="p-2">
              {sizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => { setFontSize(size.value); setShowMenu(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all btn-cute mb-1 ${
                    fontSize === size.value
                      ? isDark ? 'bg-blue-900/30 border-2 border-blue-500' : 'bg-blue-50 border-2 border-blue-400'
                      : isDark ? 'hover:bg-gray-700 border-2 border-transparent' : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <span 
                    className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
                    style={{ fontSize: size.px }}
                  >
                    {size.preview}
                  </span>
                  <div className="flex-1">
                    <span className={`text-sm font-medium block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      {size.label}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {size.px}
                    </span>
                  </div>
                  {fontSize === size.value && (
                    <span className="text-blue-500 text-lg">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
