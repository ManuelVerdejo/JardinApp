import { useEffect, useState } from 'react';

type AnimationType = 'growing' | 'sunrise' | 'watering' | 'harvest';

interface LoadingAnimationProps {
  type?: AnimationType;
  message?: string;
}

export function LoadingAnimation({ type = 'growing', message }: LoadingAnimationProps) {
  const [currentMessage, setCurrentMessage] = useState(message || getDefaultMessage(type));

  useEffect(() => {
    if (!message) {
      const messages = getMessagesForType(type);
      let index = 0;
      const interval = setInterval(() => {
        index = (index + 1) % messages.length;
        setCurrentMessage(messages[index]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [type, message]);

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center animate-fade-in">
        {/* Animation Container */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          {type === 'growing' && <GrowingPlantAnimation />}
          {type === 'sunrise' && <SunriseAnimation />}
          {type === 'watering' && <WateringAnimation />}
          {type === 'harvest' && <HarvestAnimation />}
        </div>

        {/* Message */}
        <div className="animate-fade-in">
          <p className="text-lg font-bold text-green-800 dark:text-green-400 mb-2">
            {currentMessage}
          </p>
          <div className="flex justify-center gap-1 mt-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GrowingPlantAnimation() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Soil */}
      <ellipse cx="100" cy="180" rx="60" ry="10" fill="#8B4513" opacity="0.3" />
      
      {/* Stem growing */}
      <path
        d="M 100 180 Q 100 150 100 120"
        stroke="#22c55e"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        className="animate-grow-stem"
      />
      
      {/* Leaves appearing */}
      <g className="animate-leaf-left">
        <ellipse cx="85" cy="130" rx="15" ry="8" fill="#4ade80" transform="rotate(-30 85 130)" />
      </g>
      
      <g className="animate-leaf-right">
        <ellipse cx="115" cy="120" rx="15" ry="8" fill="#4ade80" transform="rotate(30 115 120)" />
      </g>
      
      {/* Flower bud */}
      <g className="animate-flower">
        <circle cx="100" cy="100" r="12" fill="#fbbf24" />
        <circle cx="95" cy="95" r="8" fill="#fcd34d" />
        <circle cx="105" cy="95" r="8" fill="#fcd34d" />
        <circle cx="100" cy="90" r="8" fill="#fde047" />
      </g>
      
      {/* Sparkles */}
      <g className="animate-sparkle-1">
        <path d="M 70 90 L 72 85 L 74 90 L 79 92 L 74 94 L 72 99 L 70 94 L 65 92 Z" fill="#fbbf24" />
      </g>
      <g className="animate-sparkle-2">
        <path d="M 130 110 L 132 105 L 134 110 L 139 112 L 134 114 L 132 119 L 130 114 L 125 112 Z" fill="#fbbf24" />
      </g>
      
      <style>{`
        @keyframes grow-stem {
          0% { stroke-dasharray: 0 100; }
          100% { stroke-dasharray: 100 0; }
        }
        @keyframes leaf-left {
          0%, 50% { transform: scale(0) rotate(-30deg); opacity: 0; }
          100% { transform: scale(1) rotate(-30deg); opacity: 1; }
        }
        @keyframes leaf-right {
          0%, 60% { transform: scale(0) rotate(30deg); opacity: 0; }
          100% { transform: scale(1) rotate(30deg); opacity: 1; }
        }
        @keyframes flower {
          0%, 70% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        .animate-grow-stem {
          animation: grow-stem 2s ease-out forwards;
        }
        .animate-leaf-left {
          animation: leaf-left 2s ease-out forwards;
          transform-origin: 100px 130px;
        }
        .animate-leaf-right {
          animation: leaf-right 2s ease-out forwards;
          transform-origin: 100px 120px;
        }
        .animate-flower {
          animation: flower 2s ease-out forwards;
          transform-origin: 100px 100px;
        }
        .animate-sparkle-1 {
          animation: sparkle 1.5s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-sparkle-2 {
          animation: sparkle 1.5s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </svg>
  );
}

function SunriseAnimation() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Sky gradient */}
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 0.1 }} />
        </linearGradient>
      </defs>
      
      <rect x="0" y="0" width="200" height="200" fill="url(#skyGradient)" />
      
      {/* Horizon */}
      <line x1="0" y1="140" x2="200" y2="140" stroke="#f59e0b" strokeWidth="2" opacity="0.5" />
      
      {/* Sun rising */}
      <g className="animate-sun-rise">
        <circle cx="100" cy="140" r="30" fill="#fbbf24" />
        <circle cx="100" cy="140" r="25" fill="#fcd34d" />
        
        {/* Sun rays */}
        <g className="animate-rays">
          <line x1="100" y1="100" x2="100" y2="85" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <line x1="130" y1="110" x2="140" y2="100" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <line x1="140" y1="140" x2="155" y2="140" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <line x1="70" y1="110" x2="60" y2="100" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1="140" x2="45" y2="140" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
      
      {/* Clouds */}
      <g className="animate-cloud-1">
        <ellipse cx="50" cy="60" rx="20" ry="10" fill="white" opacity="0.7" />
        <ellipse cx="60" cy="55" rx="15" ry="8" fill="white" opacity="0.7" />
      </g>
      <g className="animate-cloud-2">
        <ellipse cx="150" cy="80" rx="18" ry="9" fill="white" opacity="0.6" />
        <ellipse cx="160" cy="76" rx="12" ry="7" fill="white" opacity="0.6" />
      </g>
      
      {/* Plants silhouette */}
      <path d="M 30 140 Q 30 130 35 125 Q 40 130 40 140" fill="#22c55e" opacity="0.3" />
      <path d="M 160 140 Q 160 128 165 122 Q 170 128 170 140" fill="#22c55e" opacity="0.3" />
      
      <style>{`
        @keyframes sun-rise {
          0% { transform: translateY(40px); opacity: 0.5; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes rays {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes cloud-1 {
          0% { transform: translateX(-10px); }
          100% { transform: translateX(10px); }
        }
        @keyframes cloud-2 {
          0% { transform: translateX(10px); }
          100% { transform: translateX(-10px); }
        }
        .animate-sun-rise {
          animation: sun-rise 2s ease-out forwards;
        }
        .animate-rays {
          animation: rays 2s ease-in-out infinite;
        }
        .animate-cloud-1 {
          animation: cloud-1 4s ease-in-out infinite alternate;
        }
        .animate-cloud-2 {
          animation: cloud-2 5s ease-in-out infinite alternate;
        }
      `}</style>
    </svg>
  );
}

function WateringAnimation() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Watering can */}
      <g className="animate-can-tilt">
        <rect x="60" y="40" width="50" height="40" rx="5" fill="#60a5fa" />
        <rect x="110" y="50" width="30" height="8" rx="4" fill="#60a5fa" />
        <circle cx="85" cy="35" r="8" fill="#60a5fa" />
      </g>
      
      {/* Water drops */}
      <g className="animate-drops">
        <circle cx="120" cy="70" r="3" fill="#3b82f6" className="animate-drop-1" />
        <circle cx="125" cy="75" r="3" fill="#3b82f6" className="animate-drop-2" />
        <circle cx="130" cy="72" r="3" fill="#3b82f6" className="animate-drop-3" />
        <circle cx="128" cy="80" r="3" fill="#3b82f6" className="animate-drop-4" />
      </g>
      
      {/* Plant being watered */}
      <g>
        <rect x="90" y="140" width="20" height="30" rx="3" fill="#8B4513" opacity="0.5" />
        <path d="M 100 140 Q 100 120 100 100" stroke="#22c55e" strokeWidth="3" fill="none" />
        <ellipse cx="90" cy="110" rx="12" ry="7" fill="#4ade80" transform="rotate(-20 90 110)" />
        <ellipse cx="110" cy="105" rx="12" ry="7" fill="#4ade80" transform="rotate(20 110 105)" />
      </g>
      
      {/* Splash effect */}
      <g className="animate-splash">
        <circle cx="100" cy="140" r="2" fill="#3b82f6" opacity="0.6" />
        <circle cx="95" cy="138" r="1.5" fill="#3b82f6" opacity="0.6" />
        <circle cx="105" cy="138" r="1.5" fill="#3b82f6" opacity="0.6" />
      </g>
      
      <style>{`
        @keyframes can-tilt {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-15deg); }
        }
        @keyframes drop {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(60px); opacity: 0; }
        }
        @keyframes splash {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        .animate-can-tilt {
          animation: can-tilt 2s ease-in-out infinite;
          transform-origin: 85px 60px;
        }
        .animate-drop-1 {
          animation: drop 1s ease-in infinite;
          animation-delay: 0s;
        }
        .animate-drop-2 {
          animation: drop 1s ease-in infinite;
          animation-delay: 0.2s;
        }
        .animate-drop-3 {
          animation: drop 1s ease-in infinite;
          animation-delay: 0.4s;
        }
        .animate-drop-4 {
          animation: drop 1s ease-in infinite;
          animation-delay: 0.6s;
        }
        .animate-splash {
          animation: splash 1s ease-in-out infinite;
        }
      `}</style>
    </svg>
  );
}

function HarvestAnimation() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Basket */}
      <path d="M 60 120 L 70 160 L 130 160 L 140 120 Z" fill="#d97706" opacity="0.8" />
      <path d="M 60 120 Q 100 110 140 120" fill="none" stroke="#d97706" strokeWidth="3" />
      
      {/* Vegetables appearing */}
      <g className="animate-veg-1">
        <circle cx="85" cy="130" r="10" fill="#ef4444" />
        <circle cx="85" cy="130" r="8" fill="#f87171" />
      </g>
      
      <g className="animate-veg-2">
        <ellipse cx="105" cy="135" rx="8" ry="12" fill="#22c55e" />
        <ellipse cx="105" cy="135" rx="6" ry="10" fill="#4ade80" />
      </g>
      
      <g className="animate-veg-3">
        <circle cx="120" cy="128" r="9" fill="#f59e0b" />
        <circle cx="120" cy="128" r="7" fill="#fbbf24" />
      </g>
      
      {/* Sparkles around basket */}
      <g className="animate-sparkle-1">
        <path d="M 50 100 L 52 95 L 54 100 L 59 102 L 54 104 L 52 109 L 50 104 L 45 102 Z" fill="#fbbf24" />
      </g>
      <g className="animate-sparkle-2">
        <path d="M 150 110 L 152 105 L 154 110 L 159 112 L 154 114 L 152 119 L 150 114 L 145 112 Z" fill="#fbbf24" />
      </g>
      <g className="animate-sparkle-3">
        <path d="M 100 80 L 102 75 L 104 80 L 109 82 L 104 84 L 102 89 L 100 84 L 95 82 Z" fill="#fbbf24" />
      </g>
      
      <style>{`
        @keyframes veg-appear {
          0% { transform: translateY(20px) scale(0); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        .animate-veg-1 {
          animation: veg-appear 0.8s ease-out forwards;
          animation-delay: 0.2s;
          transform-origin: 85px 130px;
        }
        .animate-veg-2 {
          animation: veg-appear 0.8s ease-out forwards;
          animation-delay: 0.5s;
          transform-origin: 105px 135px;
        }
        .animate-veg-3 {
          animation: veg-appear 0.8s ease-out forwards;
          animation-delay: 0.8s;
          transform-origin: 120px 128px;
        }
        .animate-sparkle-1 {
          animation: sparkle 1.5s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-sparkle-2 {
          animation: sparkle 1.5s ease-in-out infinite;
          animation-delay: 1.3s;
        }
        .animate-sparkle-3 {
          animation: sparkle 1.5s ease-in-out infinite;
          animation-delay: 1.6s;
        }
      `}</style>
    </svg>
  );
}

function getDefaultMessage(type: AnimationType): string {
  const messages = getMessagesForType(type);
  return messages[0];
}

function getMessagesForType(type: AnimationType): string[] {
  const messages: Record<AnimationType, string[]> = {
    growing: [
      '🌱 Tu huerto está creciendo...',
      '💚 Preparando tus plantas...',
      '🌿 Organizando todo con cariño...',
    ],
    sunrise: [
      '☀️ Un nuevo día en el huerto...',
      '🌅 Amaneciendo en tu jardín...',
      '✨ Empezando con energía...',
    ],
    watering: [
      '💧 Regando con amor...',
      '🚿 Preparando el agua...',
      '💦 Hidratando tus plantas...',
    ],
    harvest: [
      '🧺 Preparando la cosecha...',
      '🎉 Recogiendo los frutos...',
      '🌾 Momento de cosechar...',
    ],
  };
  return messages[type];
}

// Full page loading screen
export function FullPageLoading({ type }: { type?: AnimationType }) {
  return <LoadingAnimation type={type} />;
}

// Inline loading for components
export function InlineLoading({ message = 'Cargando...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-3">
          <div className="absolute inset-0 rounded-full border-4 border-green-200 dark:border-green-900"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-green-500 animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}
