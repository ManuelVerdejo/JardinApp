import { useEffect, useState } from 'react';
import { Seedling } from './Icons';

type AnimationType = 'growing' | 'sunrise' | 'watering' | 'harvest';

interface LoadingAnimationProps {
  type?: AnimationType;
  message?: string;
}

export function LoadingAnimation({ type = 'growing', message }: LoadingAnimationProps) {
  const [currentMessage, setCurrentMessage] = useState(message || getDefaultMessage(type));
  const [progress, setProgress] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Fondo con gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-emerald-50 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-gradient-shift"></div>
      
      {/* Partículas flotantes de fondo */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            <div 
              className="w-2 h-2 rounded-full opacity-30"
              style={{
                background: `radial-gradient(circle, ${
                  ['#4ade80', '#22c55e', '#fbbf24', '#60a5fa'][Math.floor(Math.random() * 4)]
                } 0%, transparent 70%)`,
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Círculos de luz pulsantes */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-green-300/20 to-emerald-300/20 dark:from-green-600/10 dark:to-emerald-600/10 animate-pulse-slow blur-3xl"></div>
        <div className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-yellow-300/20 to-orange-300/20 dark:from-yellow-600/10 dark:to-orange-600/10 animate-pulse-slow blur-3xl" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-blue-300/20 to-cyan-300/20 dark:from-blue-600/10 dark:to-cyan-600/10 animate-pulse-slow blur-3xl" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center animate-fade-in">
          {/* Animación principal */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            {/* Anillo giratorio exterior */}
            <div className="absolute inset-0 animate-spin-slow">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#22c55e" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#4ade80" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="url(#ringGradient)"
                  strokeWidth="3"
                  strokeDasharray="20 10"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Anillo giratorio interior (dirección opuesta) */}
            <div className="absolute inset-4 animate-spin-reverse">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="ringGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="url(#ringGradient2)"
                  strokeWidth="2"
                  strokeDasharray="15 8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Resplandor central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-green-200/40 to-emerald-200/40 dark:from-green-800/20 dark:to-emerald-800/20 animate-pulse-soft blur-2xl"></div>
            </div>

            {/* Animación según tipo */}
            <div className="absolute inset-0 flex items-center justify-center">
              {type === 'growing' && <GrowingPlantAnimation />}
              {type === 'sunrise' && <SunriseAnimation />}
              {type === 'watering' && <WateringAnimation />}
              {type === 'harvest' && <HarvestAnimation />}
            </div>

            {/* Destellos orbitales */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute animate-orbit"
                style={{
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '4s',
                }}
              >
                <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg" style={{
                  boxShadow: '0 0 10px 3px rgba(251, 191, 36, 0.6)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}></div>
              </div>
            ))}
          </div>

          {/* Mensaje con efecto de escritura */}
          <div className="animate-fade-in-up">
            <p className="text-xl font-black text-green-800 dark:text-green-400 mb-4 animate-text-glow">
              {currentMessage}
            </p>
            
            {/* Barra de progreso */}
            <div className="w-64 mx-auto mb-4">
              <div className="h-2 bg-green-200/50 dark:bg-green-900/50 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 rounded-full transition-all duration-300 relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>

            {/* Puntos de carga animados */}
            <div className="flex justify-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`dot-${i}`}
                  className="w-3 h-3 rounded-full animate-bounce-scale"
                  style={{
                    background: `linear-gradient(135deg, ${
                      ['#4ade80', '#22c55e', '#fbbf24', '#60a5fa', '#a78bfa'][i]
                    }, ${
                      ['#22c55e', '#16a34a', '#f59e0b', '#3b82f6', '#8b5cf6'][i]
                    })`,
                    animationDelay: `${i * 0.15}s`,
                    boxShadow: `0 0 10px ${
                      ['#4ade80', '#22c55e', '#fbbf24', '#60a5fa', '#a78bfa'][i]
                    }80`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GrowingPlantAnimation() {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48">
      <defs>
        <linearGradient id="stemGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Maceta */}
      <g className="animate-fade-in">
        <path d="M 80 160 L 85 180 L 115 180 L 120 160 Z" fill="#d97706" stroke="#92400e" strokeWidth="2"/>
        <ellipse cx="100" cy="160" rx="20" ry="5" fill="#b45309"/>
      </g>

      {/* Tierra */}
      <ellipse cx="100" cy="160" rx="18" ry="4" fill="#78350f" opacity="0.6"/>

      {/* Tallo creciendo */}
      <path
        d="M 100 160 Q 100 130 100 100"
        stroke="url(#stemGradient)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        filter="url(#glow)"
        className="animate-grow-stem"
      />

      {/* Hojas apareciendo */}
      <g className="animate-leaf-left" filter="url(#glow)">
        <ellipse cx="85" cy="130" rx="18" ry="10" fill="url(#leafGradient)" transform="rotate(-30 85 130)" />
        <path d="M 85 130 Q 85 125 85 120" stroke="#22c55e" strokeWidth="1" fill="none" opacity="0.5"/>
      </g>

      <g className="animate-leaf-right" filter="url(#glow)">
        <ellipse cx="115" cy="120" rx="18" ry="10" fill="url(#leafGradient)" transform="rotate(30 115 120)" />
        <path d="M 115 120 Q 115 115 115 110" stroke="#22c55e" strokeWidth="1" fill="none" opacity="0.5"/>
      </g>

      {/* Flor floreciendo */}
      <g className="animate-flower" filter="url(#glow)">
        {/* Pétalos */}
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="100"
            cy="100"
            rx="8"
            ry="14"
            fill="#fbbf24"
            opacity="0.8"
            transform={`rotate(${i * 45} 100 100) translate(0 -12)`}
            className="animate-petal"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
        {/* Centro de la flor */}
        <circle cx="100" cy="100" r="10" fill="#f59e0b" />
        <circle cx="100" cy="100" r="7" fill="#fbbf24" />
        <circle cx="98" cy="98" r="2" fill="#fde047" opacity="0.8"/>
      </g>

      {/* Destellos mágicos */}
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={`sparkle-${i}`} className="animate-magic-sparkle" style={{ animationDelay: `${i * 0.3}s` }}>
          <path
            d={`M ${70 + Math.random() * 60} ${80 + Math.random() * 60} L ${72 + Math.random() * 60} ${75 + Math.random() * 60} L ${74 + Math.random() * 60} ${80 + Math.random() * 60} L ${79 + Math.random() * 60} ${82 + Math.random() * 60} L ${74 + Math.random() * 60} ${84 + Math.random() * 60} L ${72 + Math.random() * 60} ${89 + Math.random() * 60} L ${70 + Math.random() * 60} ${84 + Math.random() * 60} L ${65 + Math.random() * 60} ${82 + Math.random() * 60} Z`}
            fill="#fbbf24"
            opacity="0.8"
          />
        </g>
      ))}
    </svg>
  );
}

function SunriseAnimation() {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48">
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="sunGlow">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Cielo */}
      <rect x="0" y="0" width="200" height="200" fill="url(#skyGradient)" />

      {/* Horizonte */}
      <line x1="0" y1="140" x2="200" y2="140" stroke="#f59e0b" strokeWidth="2" opacity="0.5" />

      {/* Resplandor del sol */}
      <circle cx="100" cy="140" r="60" fill="url(#sunGlow)" className="animate-pulse-slow" />

      {/* Sol elevándose */}
      <g className="animate-sun-rise">
        <circle cx="100" cy="140" r="30" fill="#fbbf24" filter="url(#glow)" />
        <circle cx="100" cy="140" r="25" fill="#fcd34d" />
        
        {/* Rayos del sol */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="140"
            x2={100 + Math.cos((i * 30 * Math.PI) / 180) * 45}
            y2={140 + Math.sin((i * 30 * Math.PI) / 180) * 45}
            stroke="#fbbf24"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
            className="animate-ray"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </g>

      {/* Nubes */}
      <g className="animate-cloud-1">
        <ellipse cx="50" cy="60" rx="20" ry="10" fill="white" opacity="0.7" />
        <ellipse cx="60" cy="55" rx="15" ry="8" fill="white" opacity="0.7" />
      </g>
      <g className="animate-cloud-2">
        <ellipse cx="150" cy="80" rx="18" ry="9" fill="white" opacity="0.6" />
        <ellipse cx="160" cy="76" rx="12" ry="7" fill="white" opacity="0.6" />
      </g>

      {/* Siluetas de plantas */}
      <path d="M 30 140 Q 30 130 35 125 Q 40 130 40 140" fill="#22c55e" opacity="0.3" />
      <path d="M 160 140 Q 160 128 165 122 Q 170 128 170 140" fill="#22c55e" opacity="0.3" />
    </svg>
  );
}

function WateringAnimation() {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48">
      <defs>
        <linearGradient id="canGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* Regadera */}
      <g className="animate-can-tilt">
        <rect x="60" y="40" width="50" height="40" rx="5" fill="url(#canGradient)" />
        <rect x="110" y="50" width="30" height="8" rx="4" fill="url(#canGradient)" />
        <circle cx="85" cy="35" r="8" fill="url(#canGradient)" />
        {/* Boquilla */}
        <path d="M 140 54 L 150 50 L 150 58 Z" fill="#3b82f6" />
      </g>

      {/* Gotas de agua */}
      {Array.from({ length: 8 }).map((_, i) => (
        <circle
          key={i}
          cx={120 + (i % 4) * 5}
          cy={70 + Math.floor(i / 4) * 5}
          r="3"
          fill="#3b82f6"
          className="animate-water-drop"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}

      {/* Planta siendo regada */}
      <g>
        <rect x="90" y="140" width="20" height="30" rx="3" fill="#8B4513" opacity="0.5" />
        <path d="M 100 140 Q 100 120 100 100" stroke="#22c55e" strokeWidth="3" fill="none" />
        <ellipse cx="90" cy="110" rx="12" ry="7" fill="#4ade80" transform="rotate(-20 90 110)" />
        <ellipse cx="110" cy="105" rx="12" ry="7" fill="#4ade80" transform="rotate(20 110 105)" />
      </g>

      {/* Efecto de salpicadura */}
      {Array.from({ length: 6 }).map((_, i) => (
        <circle
          key={`splash-${i}`}
          cx={95 + (i % 3) * 5}
          cy="140"
          r="2"
          fill="#3b82f6"
          opacity="0.6"
          className="animate-splash"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </svg>
  );
}

function HarvestAnimation() {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48">
      {/* Cesta */}
      <path d="M 60 120 L 70 160 L 130 160 L 140 120 Z" fill="#d97706" opacity="0.8" />
      <path d="M 60 120 Q 100 110 140 120" fill="none" stroke="#d97706" strokeWidth="3" />
      <path d="M 65 125 L 75 155 L 125 155 L 135 125" fill="none" stroke="#92400e" strokeWidth="1" opacity="0.3" />

      {/* Vegetales apareciendo */}
      <g className="animate-veg-1">
        <circle cx="85" cy="130" r="10" fill="#ef4444" />
        <circle cx="85" cy="130" r="8" fill="#f87171" />
        <circle cx="83" cy="128" r="2" fill="#fca5a5" opacity="0.6"/>
      </g>

      <g className="animate-veg-2">
        <ellipse cx="105" cy="135" rx="8" ry="12" fill="#22c55e" />
        <ellipse cx="105" cy="135" rx="6" ry="10" fill="#4ade80" />
        <path d="M 105 125 L 105 120" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
      </g>

      <g className="animate-veg-3">
        <circle cx="120" cy="128" r="9" fill="#f59e0b" />
        <circle cx="120" cy="128" r="7" fill="#fbbf24" />
        <circle cx="118" cy="126" r="2" fill="#fde047" opacity="0.6"/>
      </g>

      {/* Destellos de celebración */}
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={`sparkle-${i}`} className="animate-celebration-sparkle" style={{ animationDelay: `${i * 0.2}s` }}>
          <path
            d={`M ${50 + Math.random() * 100} ${80 + Math.random() * 40} L ${52 + Math.random() * 100} ${75 + Math.random() * 40} L ${54 + Math.random() * 100} ${80 + Math.random() * 40} L ${59 + Math.random() * 100} ${82 + Math.random() * 40} L ${54 + Math.random() * 100} ${84 + Math.random() * 40} L ${52 + Math.random() * 100} ${89 + Math.random() * 40} L ${50 + Math.random() * 100} ${84 + Math.random() * 40} L ${45 + Math.random() * 100} ${82 + Math.random() * 40} Z`}
            fill="#fbbf24"
            opacity="0.8"
          />
        </g>
      ))}
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

export function FullPageLoading({ type }: { type?: AnimationType }) {
  return <LoadingAnimation type={type} />;
}

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
