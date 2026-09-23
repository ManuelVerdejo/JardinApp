import { useEffect, useState } from 'react';

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
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [type, message]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Fondo con gradiente animado más suave */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 animate-gradient-shift"></div>
      
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #4ade80 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #fbbf24 2px, transparent 2px)`,
          backgroundSize: '60px 60px',
        }}></div>
      </div>

      {/* Partículas flotantes mejoradas */}
      <div className="absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 5}s`,
            }}
          >
            <div 
              className="rounded-full opacity-40"
              style={{
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                background: `radial-gradient(circle, ${
                  ['#4ade80', '#22c55e', '#fbbf24', '#60a5fa', '#f472b6'][Math.floor(Math.random() * 5)]
                } 0%, transparent 70%)`,
                boxShadow: `0 0 ${4 + Math.random() * 8}px ${
                  ['#4ade80', '#22c55e', '#fbbf24', '#60a5fa', '#f472b6'][Math.floor(Math.random() * 5)]
                }40`,
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Círculos de luz pulsantes mejorados */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-green-200/30 to-emerald-200/30 dark:from-green-600/10 dark:to-emerald-600/10 animate-pulse-slow blur-3xl"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-yellow-200/30 to-orange-200/30 dark:from-yellow-600/10 dark:to-orange-600/10 animate-pulse-slow blur-3xl" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-br from-pink-200/30 to-rose-200/30 dark:from-pink-600/10 dark:to-rose-600/10 animate-pulse-slow blur-3xl" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center animate-fade-in max-w-md w-full">
          {/* Animación principal mejorada */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto mb-8">
            {/* Anillo giratorio exterior con gradiente más rico */}
            <div className="absolute inset-0 animate-spin-slow">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity="0.9" />
                    <stop offset="25%" stopColor="#22c55e" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#16a34a" stopOpacity="0.9" />
                    <stop offset="75%" stopColor="#22c55e" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#4ade80" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r="92"
                  fill="none"
                  stroke="url(#ringGradient)"
                  strokeWidth="4"
                  strokeDasharray="25 12"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Anillo giratorio interior mejorado */}
            <div className="absolute inset-6 animate-spin-reverse">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="ringGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r="82"
                  fill="none"
                  stroke="url(#ringGradient2)"
                  strokeWidth="3"
                  strokeDasharray="18 10"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Tercer anillo sutil */}
            <div className="absolute inset-12 animate-spin-slow" style={{ animationDuration: '12s' }}>
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle
                  cx="100"
                  cy="100"
                  r="72"
                  fill="none"
                  stroke="#f472b6"
                  strokeWidth="2"
                  strokeDasharray="10 8"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </svg>
            </div>

            {/* Resplandor central mejorado */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-56 h-56 rounded-full bg-gradient-to-br from-green-100/50 to-emerald-100/50 dark:from-green-800/20 dark:to-emerald-800/20 animate-pulse-soft blur-2xl"></div>
            </div>

            {/* Animación según tipo mejorada */}
            <div className="absolute inset-0 flex items-center justify-center">
              {type === 'growing' && <GrowingPlantAnimation />}
              {type === 'sunrise' && <SunriseAnimation />}
              {type === 'watering' && <WateringAnimation />}
              {type === 'harvest' && <HarvestAnimation />}
            </div>

            {/* Destellos orbitales mejorados */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute animate-orbit"
                style={{
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '5s',
                }}
              >
                <div className="relative">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-lg animate-pulse" style={{
                    boxShadow: '0 0 15px 5px rgba(251, 191, 36, 0.6)',
                  }}></div>
                  <div className="absolute inset-0 w-4 h-4 bg-white rounded-full opacity-50 blur-sm"></div>
                </div>
              </div>
            ))}

            {/* Corazones flotantes cute */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`heart-${i}`}
                className="absolute text-2xl animate-float-heart"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 1.2}s`,
                  animationDuration: `${4 + Math.random() * 2}s`,
                }}
              >
                💚
              </div>
            ))}
          </div>

          {/* Mensaje mejorado */}
          <div className="animate-fade-in-up">
            <p className="text-2xl font-black text-green-800 dark:text-green-400 mb-6 animate-text-glow">
              {currentMessage}
            </p>
            
            {/* Barra de progreso mejorada */}
            <div className="w-full max-w-xs mx-auto mb-6">
              <div className="h-3 bg-green-200/50 dark:bg-green-900/50 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 rounded-full transition-all duration-300 relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
                {Math.round(progress)}% completado
              </p>
            </div>

            {/* Puntos de carga mejorados */}
            <div className="flex justify-center gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`dot-${i}`}
                  className="relative"
                >
                  <div
                    className="w-4 h-4 rounded-full animate-bounce-scale"
                    style={{
                      background: `linear-gradient(135deg, ${
                        ['#4ade80', '#22c55e', '#fbbf24', '#60a5fa', '#f472b6'][i]
                      }, ${
                        ['#22c55e', '#16a34a', '#f59e0b', '#3b82f6', '#ec4899'][i]
                      })`,
                      animationDelay: `${i * 0.15}s`,
                      boxShadow: `0 0 12px ${
                        ['#4ade80', '#22c55e', '#fbbf24', '#60a5fa', '#f472b6'][i]
                      }80`,
                    }}
                  ></div>
                  <div
                    className="absolute inset-0 w-4 h-4 rounded-full animate-ping"
                    style={{
                      background: ['#4ade80', '#22c55e', '#fbbf24', '#60a5fa', '#f472b6'][i],
                      animationDelay: `${i * 0.15}s`,
                      opacity: 0.3,
                    }}
                  ></div>
                </div>
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
    <svg viewBox="0 0 200 200" className="w-56 h-56">
      <defs>
        <linearGradient id="stemGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="50%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bbf7d0" />
          <stop offset="50%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
        <linearGradient id="potGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <radialGradient id="flowerGradient">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Maceta mejorada */}
      <g className="animate-fade-in">
        {/* Plato debajo */}
        <ellipse cx="100" cy="182" rx="25" ry="4" fill="#78350f" opacity="0.3"/>
        {/* Cuerpo de la maceta */}
        <path d="M 75 160 L 80 180 L 120 180 L 125 160 Z" fill="url(#potGradient)" stroke="#78350f" strokeWidth="2"/>
        {/* Borde superior */}
        <ellipse cx="100" cy="160" rx="25" ry="6" fill="#b45309" stroke="#78350f" strokeWidth="2"/>
        {/* Detalle decorativo */}
        <path d="M 80 165 Q 100 168 120 165" stroke="#78350f" strokeWidth="1" fill="none" opacity="0.5"/>
      </g>

      {/* Tierra con textura */}
      <ellipse cx="100" cy="160" rx="22" ry="5" fill="#78350f"/>
      <ellipse cx="100" cy="159" rx="20" ry="4" fill="#92400e" opacity="0.6"/>

      {/* Tallo creciendo mejorado */}
      <path
        d="M 100 160 Q 100 130 100 95"
        stroke="url(#stemGradient)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        filter="url(#glow)"
        className="animate-grow-stem"
      />

      {/* Hojas mejoradas con venas */}
      <g className="animate-leaf-left" filter="url(#glow)">
        <ellipse cx="82" cy="125" rx="20" ry="12" fill="url(#leafGradient)" transform="rotate(-35 82 125)" />
        <path d="M 82 125 Q 82 120 82 115" stroke="#22c55e" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M 78 125 Q 82 123 86 125" stroke="#22c55e" strokeWidth="1" fill="none" opacity="0.4"/>
      </g>

      <g className="animate-leaf-right" filter="url(#glow)">
        <ellipse cx="118" cy="115" rx="20" ry="12" fill="url(#leafGradient)" transform="rotate(35 118 115)" />
        <path d="M 118 115 Q 118 110 118 105" stroke="#22c55e" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M 114 115 Q 118 113 122 115" stroke="#22c55e" strokeWidth="1" fill="none" opacity="0.4"/>
      </g>

      {/* Flor mejorada con más pétalos */}
      <g className="animate-flower" filter="url(#glow)">
        {/* Pétalos exteriores */}
        {Array.from({ length: 10 }).map((_, i) => (
          <ellipse
            key={`petal-outer-${i}`}
            cx="100"
            cy="95"
            rx="9"
            ry="16"
            fill="url(#flowerGradient)"
            opacity="0.9"
            transform={`rotate(${i * 36} 100 95) translate(0 -14)`}
            className="animate-petal"
            style={{ animationDelay: `${i * 0.08}s` }}
          />
        ))}
        {/* Pétalos interiores */}
        {Array.from({ length: 6 }).map((_, i) => (
          <ellipse
            key={`petal-inner-${i}`}
            cx="100"
            cy="95"
            rx="6"
            ry="10"
            fill="#fde047"
            opacity="0.8"
            transform={`rotate(${i * 60 + 30} 100 95) translate(0 -8)`}
            className="animate-petal"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
        {/* Centro de la flor */}
        <circle cx="100" cy="95" r="12" fill="#f59e0b" />
        <circle cx="100" cy="95" r="9" fill="#fbbf24" />
        <circle cx="100" cy="95" r="6" fill="#fde047" />
        {/* Brillo en el centro */}
        <circle cx="98" cy="93" r="3" fill="#fef3c7" opacity="0.8"/>
      </g>

      {/* Carita feliz en la flor */}
      <g className="animate-flower">
        <circle cx="96" cy="93" r="1.5" fill="#78350f"/>
        <circle cx="104" cy="93" r="1.5" fill="#78350f"/>
        <path d="M 96 97 Q 100 100 104 97" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </g>

      {/* Mariposa cute */}
      <g className="animate-butterfly-around" style={{ transformOrigin: '100px 95px' }}>
        <g transform="translate(130, 80)">
          <ellipse cx="0" cy="0" rx="6" ry="8" fill="#f472b6" opacity="0.8" className="animate-wing-left"/>
          <ellipse cx="0" cy="0" rx="6" ry="8" fill="#ec4899" opacity="0.8" className="animate-wing-right"/>
          <ellipse cx="0" cy="0" rx="1" ry="4" fill="#7c3aed"/>
        </g>
      </g>

      {/* Destellos mágicos mejorados */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const radius = 50 + Math.random() * 20;
        const x = 100 + Math.cos(angle) * radius;
        const y = 95 + Math.sin(angle) * radius;
        return (
          <g key={`sparkle-${i}`} className="animate-magic-sparkle" style={{ animationDelay: `${i * 0.25}s` }}>
            <path
              d={`M ${x} ${y} L ${x + 2} ${y - 5} L ${x + 4} ${y} L ${x + 9} ${y + 2} L ${x + 4} ${y + 4} L ${x + 2} ${y + 9} L ${x} ${y + 4} L ${x - 5} ${y + 2} Z`}
              fill="#fbbf24"
              opacity="0.9"
              filter="url(#glow)"
            />
          </g>
        );
      })}
    </svg>
  );
}

function SunriseAnimation() {
  return (
    <svg viewBox="0 0 200 200" className="w-56 h-56">
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="sunGlow">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
          <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Cielo */}
      <rect x="0" y="0" width="200" height="200" fill="url(#skyGradient)" />

      {/* Horizonte con gradiente */}
      <rect x="0" y="135" width="200" height="65" fill="#22c55e" opacity="0.3"/>
      <line x1="0" y1="140" x2="200" y2="140" stroke="#f59e0b" strokeWidth="2" opacity="0.6" />

      {/* Resplandor del sol mejorado */}
      <circle cx="100" cy="140" r="70" fill="url(#sunGlow)" className="animate-pulse-slow" />

      {/* Sol elevándose mejorado */}
      <g className="animate-sun-rise">
        <circle cx="100" cy="140" r="35" fill="#fbbf24" filter="url(#glow)" />
        <circle cx="100" cy="140" r="30" fill="#fcd34d" />
        <circle cx="100" cy="140" r="25" fill="#fde047" />
        
        {/* Carita feliz en el sol */}
        <circle cx="92" cy="135" r="2" fill="#78350f"/>
        <circle cx="108" cy="135" r="2" fill="#78350f"/>
        <path d="M 92 145 Q 100 150 108 145" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round"/>
        
        {/* Rayos del sol mejorados */}
        {Array.from({ length: 16 }).map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="140"
            x2={100 + Math.cos((i * 22.5 * Math.PI) / 180) * 50}
            y2={140 + Math.sin((i * 22.5 * Math.PI) / 180) * 50}
            stroke="#fbbf24"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.7"
            className="animate-ray"
            style={{ animationDelay: `${i * 0.08}s` }}
          />
        ))}
      </g>

      {/* Nubes mejoradas */}
      <g className="animate-cloud-1">
        <ellipse cx="50" cy="60" rx="25" ry="12" fill="white" opacity="0.8" />
        <ellipse cx="65" cy="55" rx="18" ry="10" fill="white" opacity="0.8" />
        <ellipse cx="40" cy="58" rx="15" ry="9" fill="white" opacity="0.8" />
      </g>
      <g className="animate-cloud-2">
        <ellipse cx="150" cy="80" rx="22" ry="11" fill="white" opacity="0.7" />
        <ellipse cx="165" cy="76" rx="15" ry="9" fill="white" opacity="0.7" />
      </g>

      {/* Plantas siluetas mejoradas */}
      <g opacity="0.4">
        <path d="M 30 140 Q 30 125 35 120 Q 40 125 40 140" fill="#22c55e" />
        <ellipse cx="35" cy="118" rx="8" ry="5" fill="#4ade80" transform="rotate(-20 35 118)"/>
      </g>
      <g opacity="0.4">
        <path d="M 160 140 Q 160 122 165 115 Q 170 122 170 140" fill="#22c55e" />
        <ellipse cx="165" cy="113" rx="8" ry="5" fill="#4ade80" transform="rotate(20 165 113)"/>
      </g>

      {/* Pájaros */}
      <g className="animate-bird-1">
        <path d="M 60 50 Q 65 45 70 50" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </g>
      <g className="animate-bird-2">
        <path d="M 140 40 Q 145 35 150 40" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

function WateringAnimation() {
  return (
    <svg viewBox="0 0 200 200" className="w-56 h-56">
      <defs>
        <linearGradient id="canGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="50%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Regadera mejorada */}
      <g className="animate-can-tilt">
        <rect x="60" y="40" width="55" height="45" rx="6" fill="url(#canGradient)" stroke="#2563eb" strokeWidth="2"/>
        <rect x="115" y="52" width="35" height="10" rx="5" fill="url(#canGradient)" stroke="#2563eb" strokeWidth="2"/>
        <circle cx="87" cy="35" r="10" fill="url(#canGradient)" stroke="#2563eb" strokeWidth="2"/>
        {/* Boquilla mejorada */}
        <path d="M 150 57 L 165 52 L 165 62 Z" fill="#3b82f6" stroke="#2563eb" strokeWidth="2"/>
        {/* Detalles */}
        <ellipse cx="87" cy="62" rx="8" ry="3" fill="#2563eb" opacity="0.3"/>
      </g>

      {/* Gotas de agua mejoradas */}
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={i} className="animate-water-drop" style={{ animationDelay: `${i * 0.12}s` }}>
          <path
            d={`M ${125 + (i % 4) * 4} ${75 + Math.floor(i / 4) * 4} Q ${127 + (i % 4) * 4} ${70 + Math.floor(i / 4) * 4} ${129 + (i % 4) * 4} ${75 + Math.floor(i / 4) * 4} Q ${127 + (i % 4) * 4} ${80 + Math.floor(i / 4) * 4} ${125 + (i % 4) * 4} ${75 + Math.floor(i / 4) * 4}`}
            fill="#3b82f6"
            filter="url(#glow)"
          />
        </g>
      ))}

      {/* Planta siendo regada mejorada */}
      <g>
        {/* Maceta */}
        <path d="M 85 140 L 90 170 L 110 170 L 115 140 Z" fill="#d97706" stroke="#92400e" strokeWidth="2"/>
        <ellipse cx="100" cy="140" rx="15" ry="4" fill="#b45309" stroke="#92400e" strokeWidth="2"/>
        {/* Tallo */}
        <path d="M 100 140 Q 100 115 100 95" stroke="#22c55e" strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Hojas */}
        <ellipse cx="88" cy="110" rx="14" ry="8" fill="#4ade80" transform="rotate(-25 88 110)" stroke="#16a34a" strokeWidth="1"/>
        <ellipse cx="112" cy="105" rx="14" ry="8" fill="#4ade80" transform="rotate(25 112 105)" stroke="#16a34a" strokeWidth="1"/>
        {/* Carita feliz */}
        <circle cx="96" cy="95" r="1.5" fill="#16a34a"/>
        <circle cx="104" cy="95" r="1.5" fill="#16a34a"/>
        <path d="M 96 100 Q 100 103 104 100" stroke="#16a34a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </g>

      {/* Efecto de salpicadura mejorado */}
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={`splash-${i}`} className="animate-splash" style={{ animationDelay: `${i * 0.15}s` }}>
          <circle
            cx={92 + (i % 4) * 4}
            cy="140"
            r="2.5"
            fill="#60a5fa"
            opacity="0.7"
            filter="url(#glow)"
          />
        </g>
      ))}

      {/* Charco de agua */}
      <ellipse cx="100" cy="172" rx="20" ry="3" fill="#60a5fa" opacity="0.3" className="animate-pulse-slow"/>
    </svg>
  );
}

function HarvestAnimation() {
  return (
    <svg viewBox="0 0 200 200" className="w-56 h-56">
      <defs>
        <linearGradient id="basketGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Cesta mejorada */}
      <path d="M 55 120 L 65 165 L 135 165 L 145 120 Z" fill="url(#basketGradient)" stroke="#78350f" strokeWidth="2"/>
      <path d="M 55 120 Q 100 108 145 120" fill="none" stroke="#78350f" strokeWidth="3"/>
      {/* Textura de la cesta */}
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={i} x1={65 + i * 15} y1="125" x2={70 + i * 15} y2="160" stroke="#78350f" strokeWidth="1" opacity="0.3"/>
      ))}
      <path d="M 60 135 L 140 135" stroke="#78350f" strokeWidth="1" opacity="0.3"/>
      <path d="M 62 150 L 138 150" stroke="#78350f" strokeWidth="1" opacity="0.3"/>

      {/* Vegetales mejorados */}
      <g className="animate-veg-1" filter="url(#glow)">
        <circle cx="80" cy="130" r="12" fill="#ef4444" stroke="#dc2626" strokeWidth="2"/>
        <circle cx="80" cy="130" r="10" fill="#f87171"/>
        <circle cx="77" cy="127" r="3" fill="#fca5a5" opacity="0.7"/>
        {/* Hojita del tomate */}
        <path d="M 80 118 Q 82 115 85 118" stroke="#22c55e" strokeWidth="2" fill="#4ade80"/>
      </g>

      <g className="animate-veg-2" filter="url(#glow)">
        <ellipse cx="105" cy="135" rx="10" ry="15" fill="#22c55e" stroke="#16a34a" strokeWidth="2"/>
        <ellipse cx="105" cy="135" rx="8" ry="13" fill="#4ade80"/>
        <path d="M 105 120 L 105 115" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx="105" cy="115" rx="5" ry="3" fill="#86efac"/>
      </g>

      <g className="animate-veg-3" filter="url(#glow)">
        <circle cx="125" cy="128" r="11" fill="#f59e0b" stroke="#d97706" strokeWidth="2"/>
        <circle cx="125" cy="128" r="9" fill="#fbbf24"/>
        <circle cx="122" cy="125" r="3" fill="#fde047" opacity="0.7"/>
      </g>

      {/* Destellos de celebración mejorados */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 22.5 * Math.PI) / 180;
        const radius = 60 + Math.random() * 30;
        const x = 100 + Math.cos(angle) * radius;
        const y = 100 + Math.sin(angle) * radius;
        return (
          <g key={`sparkle-${i}`} className="animate-celebration-sparkle" style={{ animationDelay: `${i * 0.15}s` }}>
            <path
              d={`M ${x} ${y} L ${x + 2} ${y - 6} L ${x + 4} ${y} L ${x + 10} ${y + 2} L ${x + 4} ${y + 4} L ${x + 2} ${y + 10} L ${x} ${y + 4} L ${x - 6} ${y + 2} Z`}
              fill={['#fbbf24', '#f472b6', '#60a5fa', '#4ade80'][i % 4]}
              opacity="0.9"
              filter="url(#glow)"
            />
          </g>
        );
      })}

      {/* Confeti */}
      {Array.from({ length: 20 }).map((_, i) => (
        <rect
          key={`confetti-${i}`}
          x={50 + Math.random() * 100}
          y={50 + Math.random() * 50}
          width="4"
          height="4"
          fill={['#ef4444', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7'][i % 5]}
          className="animate-confetti"
          style={{ animationDelay: `${Math.random() * 2}s` }}
          transform={`rotate(${Math.random() * 360} ${50 + Math.random() * 100} ${50 + Math.random() * 50})`}
        />
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
      '✨ Creando algo especial...',
    ],
    sunrise: [
      '☀️ Un nuevo día en el huerto...',
      '🌅 Amaneciendo en tu jardín...',
      '✨ Empezando con energía...',
      '🌻 ¡Buenos días, jardinero!',
    ],
    watering: [
      '💧 Regando con amor...',
      '🚿 Preparando el agua...',
      '💦 Hidratando tus plantas...',
      '🌱 ¡Sed de vida!',
    ],
    harvest: [
      '🧺 Preparando la cosecha...',
      '🎉 Recogiendo los frutos...',
      '🌾 Momento de cosechar...',
      '✨ ¡Tiempo de recompensa!',
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
