import { useEffect, useState } from 'react';

type AnimationType = 'growing' | 'sunrise' | 'watering' | 'harvest';

interface LoadingAnimationProps {
  type?: AnimationType;
  message?: string;
}

export function LoadingAnimation({ message }: LoadingAnimationProps) {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95;
        return prev + 12;
      });
    }, 180);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 via-emerald-50/70 to-yellow-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Resplandor ambiental suave de fondo */}
      <div className="absolute w-72 h-72 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl pointer-events-none animate-pulse-soft"></div>

      {/* Contenedor central */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xs animate-fade-in">
        {/* Icono de la app con animación flotante */}
        <div className="relative mb-6">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1 bg-white/80 dark:bg-gray-800/80 shadow-2xl shadow-emerald-500/20 border-2 border-white dark:border-gray-700 animate-float flex items-center justify-center">
            <img
              src="/app-icon.jpg"
              alt="Logo Mi Huerto"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
          {/* Pequeño destello decorativo */}
          <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-emerald-400 text-white rounded-full flex items-center justify-center text-xs shadow-md animate-pulse-soft">
            ✨
          </div>
        </div>

        {/* Título y subtítulo */}
        <h1 className="text-2xl sm:text-3xl font-black text-green-950 dark:text-gray-100 tracking-tight mb-1">
          Mi Huerto
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-6">
          {message || 'Preparando tu jardín mágico...'}
        </p>

        {/* Barra de progreso minimalista y limpia */}
        <div className="w-44 h-1.5 bg-emerald-200/60 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner mb-3">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          Cargando
        </span>
      </div>
    </div>
  );
}

export function FullPageLoading({ type }: { type?: AnimationType }) {
  return <LoadingAnimation type={type} />;
}

export function InlineLoading({ message = 'Cargando...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="relative w-12 h-12 mx-auto mb-3">
          <div className="absolute inset-0 rounded-full border-3 border-emerald-200 dark:border-emerald-900/60"></div>
          <div className="absolute inset-0 rounded-full border-3 border-t-emerald-500 animate-spin"></div>
        </div>
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}
