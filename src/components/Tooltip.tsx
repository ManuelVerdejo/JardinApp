import { useState, useRef, type ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  delay?: number;
  mobileFriendly?: boolean;
}

export function Tooltip({ 
  content, 
  children, 
  position = 'auto', 
  delay = 0,
  mobileFriendly = true 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Detectar si es móvil
  useState(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    }
  });

  const showTooltip = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setShouldShow(true);
        setIsVisible(true);
      }, delay);
    } else {
      setShouldShow(true);
      setIsVisible(true);
    }
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setShouldShow(false), 200);
    }, mobileFriendly && isMobile ? 2000 : 100);
  };

  const handleTouch = (e: React.TouchEvent) => {
    if (mobileFriendly && isMobile) {
      e.preventDefault();
      if (!isVisible) {
        showTooltip();
      } else {
        hideTooltip();
      }
    }
  };

  // Posicionamiento automático basado en espacio disponible
  const getAutoPosition = (): 'top' | 'bottom' | 'left' | 'right' => {
    if (typeof window === 'undefined') return 'top';
    
    // En móvil, preferir top
    if (isMobile) {
      return 'top';
    }
    
    return 'top';
  };

  const actualPosition: 'top' | 'bottom' | 'left' | 'right' = position === 'auto' ? getAutoPosition() : position;

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  };

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800 dark:border-t-gray-700 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 dark:border-b-gray-700 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800 dark:border-l-gray-700 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-800 dark:border-r-gray-700 border-y-transparent border-l-transparent',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onTouchStart={handleTouch}
      role="button"
      tabIndex={0}
      aria-describedby={shouldShow ? "tooltip" : undefined}
    >
      {children}
      {shouldShow && (
        <div
          id="tooltip"
          role="tooltip"
          className={`absolute z-[100] ${positions[actualPosition]} transition-all duration-200 pointer-events-none ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${isMobile ? 'max-w-[250px]' : 'whitespace-nowrap'}`}
        >
          <div className={`
            ${isMobile ? 'px-4 py-3 text-sm' : 'px-3 py-2 text-xs'} 
            bg-gray-800 dark:bg-gray-700 
            text-white 
            rounded-xl 
            shadow-lg 
            font-medium
            ${isMobile ? 'text-center' : ''}
          `}>
            {content}
          </div>
          <div className={`absolute w-0 h-0 border-4 ${arrows[actualPosition]}`}></div>
        </div>
      )}
    </div>
  );
}

// Tooltip persistente para onboarding - Más visible y funcional en móvil
interface PersistentTooltipProps {
  content: string;
  isVisible: boolean;
  onClose: () => void;
  position?: 'top' | 'bottom';
  title?: string;
}

export function PersistentTooltip({ 
  content, 
  isVisible, 
  onClose, 
  position = 'bottom',
  title 
}: PersistentTooltipProps) {
  if (!isVisible) return null;

  return (
    <div className={`absolute z-50 ${position === 'bottom' ? 'top-full mt-3' : 'bottom-full mb-3'} left-1/2 -translate-x-1/2 animate-bounce-in w-[280px] sm:w-auto`}>
      <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white rounded-2xl shadow-2xl border-2 border-white relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-2 w-20 h-20 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-2 left-2 w-16 h-16 bg-white rounded-full blur-2xl"></div>
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-7 h-7 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all shadow-lg z-10"
          aria-label="Cerrar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        {/* Content */}
        <div className="relative p-4 pr-10">
          {title && (
            <h3 className="font-black text-base mb-1 flex items-center gap-2">
              <span>✨</span>
              {title}
            </h3>
          )}
          <p className="text-sm leading-relaxed font-medium">
            {content}
          </p>
        </div>
        
        {/* Action hint */}
        <div className="relative bg-white/10 backdrop-blur-sm px-4 py-2 border-t border-white/20">
          <p className="text-xs text-center font-medium opacity-90">
            Toca para cerrar
          </p>
        </div>
      </div>
      
      {/* Arrow */}
      <div className={`absolute ${position === 'bottom' ? '-top-2' : '-bottom-2'} left-1/2 -translate-x-1/2 w-0 h-0 border-4 ${
        position === 'bottom' 
          ? 'border-b-purple-500 border-x-transparent border-t-transparent'
          : 'border-t-rose-500 border-x-transparent border-b-transparent'
      }`}></div>
    </div>
  );
}

// Tooltip con icono para características nuevas
interface FeatureTooltipProps {
  content: string;
  isVisible: boolean;
  onClose: () => void;
  icon?: string;
  position?: 'top' | 'bottom';
}

export function FeatureTooltip({ 
  content, 
  isVisible, 
  onClose, 
  icon = '✨',
  position = 'bottom'
}: FeatureTooltipProps) {
  if (!isVisible) return null;

  return (
    <div className={`absolute z-50 ${position === 'bottom' ? 'top-full mt-3' : 'bottom-full mb-3'} left-1/2 -translate-x-1/2 animate-bounce-in`}>
      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 text-white rounded-xl shadow-xl border-2 border-white relative max-w-[250px]">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-all shadow-lg text-xs font-bold"
          aria-label="Cerrar"
        >
          ×
        </button>
        
        <div className="p-3 pr-8">
          <div className="flex items-start gap-2">
            <span className="text-2xl flex-shrink-0">{icon}</span>
            <p className="text-xs leading-relaxed font-medium pt-1">
              {content}
            </p>
          </div>
        </div>
      </div>
      
      <div className={`absolute ${position === 'bottom' ? '-top-2' : '-bottom-2'} left-1/2 -translate-x-1/2 w-0 h-0 border-4 ${
        position === 'bottom' 
          ? 'border-b-blue-500 dark:border-b-blue-600 border-x-transparent border-t-transparent'
          : 'border-t-cyan-500 dark:border-t-cyan-600 border-x-transparent border-b-transparent'
      }`}></div>
    </div>
  );
}
