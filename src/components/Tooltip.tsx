import { useState, useRef, type ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({ content, children, position = 'top', delay = 0 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const showTooltip = () => {
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
    setIsVisible(false);
    setTimeout(() => setShouldShow(false), 200);
  };

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-800 border-y-transparent border-l-transparent',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {shouldShow && (
        <div
          className={`absolute z-50 ${positions[position]} transition-all duration-200 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
            {content}
          </div>
          <div className={`absolute w-0 h-0 border-4 ${arrows[position]}`}></div>
        </div>
      )}
    </div>
  );
}

// Tooltip persistente para onboarding
interface PersistentTooltipProps {
  content: string;
  isVisible: boolean;
  onClose: () => void;
  position?: 'top' | 'bottom';
}

export function PersistentTooltip({ content, isVisible, onClose, position = 'bottom' }: PersistentTooltipProps) {
  if (!isVisible) return null;

  return (
    <div className={`absolute z-50 ${position === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'} left-1/2 -translate-x-1/2 animate-bounce-in`}>
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-xl px-4 py-2 shadow-lg border-2 border-white relative">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors shadow-md"
        >
          ×
        </button>
        {content}
      </div>
      <div className={`absolute ${position === 'bottom' ? '-top-2' : '-bottom-2'} left-1/2 -translate-x-1/2 w-0 h-0 border-4 ${
        position === 'bottom' 
          ? 'border-b-purple-500 border-x-transparent border-t-transparent'
          : 'border-t-pink-500 border-x-transparent border-b-transparent'
      }`}></div>
    </div>
  );
}
