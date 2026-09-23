import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useState } from 'react';

export function ThemeToggle() {
  const { isDark, theme, setTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all btn-cute ${
          isDark 
            ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
            : 'bg-white/60 text-gray-600 hover:bg-white/80'
        } shadow-cute`}
        aria-label="Cambiar tema"
      >
        {isDark ? <Moon size={18} /> : <Sun size={18} />}
      </button>
      
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          <div className={`absolute right-0 top-12 z-50 w-48 rounded-xl shadow-cute-lg border-2 overflow-hidden animate-fade-in ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <button
              onClick={() => { setTheme('light'); setShowMenu(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all btn-cute ${
                theme === 'light'
                  ? isDark ? 'bg-gray-700' : 'bg-green-50'
                  : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <Sun size={18} className={theme === 'light' ? 'text-yellow-500' : isDark ? 'text-gray-400' : 'text-gray-500'} />
              <div className="flex-1">
                <span className={`text-sm font-medium block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Claro</span>
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tema luminoso</span>
              </div>
              {theme === 'light' && <span className="text-green-500 text-lg">✓</span>}
            </button>
            
            <button
              onClick={() => { setTheme('dark'); setShowMenu(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all btn-cute ${
                theme === 'dark'
                  ? isDark ? 'bg-gray-700' : 'bg-green-50'
                  : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <Moon size={18} className={theme === 'dark' ? 'text-indigo-400' : isDark ? 'text-gray-400' : 'text-gray-500'} />
              <div className="flex-1">
                <span className={`text-sm font-medium block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Oscuro</span>
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Para uso nocturno</span>
              </div>
              {theme === 'dark' && <span className="text-green-500 text-lg">✓</span>}
            </button>
            
            <button
              onClick={() => { setTheme('system'); setShowMenu(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all btn-cute ${
                theme === 'system'
                  ? isDark ? 'bg-gray-700' : 'bg-green-50'
                  : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <Monitor size={18} className={theme === 'system' ? 'text-blue-500' : isDark ? 'text-gray-400' : 'text-gray-500'} />
              <div className="flex-1">
                <span className={`text-sm font-medium block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Sistema</span>
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Según tu dispositivo</span>
              </div>
              {theme === 'system' && <span className="text-green-500 text-lg">✓</span>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
