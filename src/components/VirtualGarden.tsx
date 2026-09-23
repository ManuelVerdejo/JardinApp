import { useState, useEffect, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from './Icon';
import { useTheme } from '../context/ThemeContext';

export function VirtualGarden() {
  const { isDark } = useTheme();
  const plantas = useLiveQuery(() => db.plantas.toArray()) || [];
  const riegos = useLiveQuery(() => db.riegos.toArray()) || [];
  const bitacora = useLiveQuery(() => db.bitacora.toArray()) || [];
  const cosechas = useLiveQuery(() => db.cosechas.toArray()) || [];

  const [timeOfDay, setTimeOfDay] = useState<'dawn' | 'morning' | 'afternoon' | 'sunset' | 'night'>('afternoon');
  const [season, setSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('spring');
  const [weather, setWeather] = useState<'clear' | 'cloudy' | 'rainy'>('clear');
  const [hoveredPlant, setHoveredPlant] = useState<string | null>(null);
  const [windIntensity, setWindIntensity] = useState(0);

  // Actualizar ambiente
  useEffect(() => {
    const updateEnvironment = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 7) setTimeOfDay('dawn');
      else if (hour >= 7 && hour < 12) setTimeOfDay('morning');
      else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
      else if (hour >= 17 && hour < 20) setTimeOfDay('sunset');
      else setTimeOfDay('night');

      const month = new Date().getMonth();
      if (month >= 2 && month <= 4) setSeason('spring');
      else if (month >= 5 && month <= 7) setSeason('summer');
      else if (month >= 8 && month <= 10) setSeason('autumn');
      else setSeason('winter');

      const weatherSeed = Math.floor(hour / 4);
      const weathers: ('clear' | 'cloudy' | 'rainy')[] = ['clear', 'clear', 'cloudy', 'clear', 'rainy', 'clear'];
      setWeather(weathers[weatherSeed]);
      
      // Viento aleatorio suave
      setWindIntensity(Math.random() * 3);
    };

    updateEnvironment();
    const interval = setInterval(updateEnvironment, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calcular estado de cada planta
  const gardenPlants = useMemo(() => plantas.map(planta => {
    const riegosPlanta = riegos.filter(r => r.planta_nombre === planta.nombre);
    const bitacoraPlanta = bitacora.filter(b => b.planta_nombre === planta.nombre);
    const cosechasPlanta = cosechas.filter(c => c.planta_nombre === planta.nombre);
    
    const ultimoRiego = riegosPlanta.sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
    const ultimaMedicion = bitacoraPlanta.sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
    
    let daysSinceWater = 999;
    if (ultimoRiego) {
      const lastDate = new Date(ultimoRiego.fecha);
      const today = new Date();
      daysSinceWater = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    const height = ultimaMedicion?.altura_cm || 5;
    const size = Math.min(140, Math.max(60, height * 3.5));

    let mood: 'happy' | 'thirsty' | 'critical';
    if (daysSinceWater > planta.frecuencia_riego_dias) mood = 'critical';
    else if (daysSinceWater === planta.frecuencia_riego_dias) mood = 'thirsty';
    else mood = 'happy';

    const totalCosechas = cosechasPlanta.reduce((acc, c) => acc + c.cantidad_estimada, 0);

    return { ...planta, mood, size, daysSinceWater, totalCosechas, height };
  }), [plantas, riegos, bitacora, cosechas]);

  // Colores del cielo
  const getSkyGradient = () => {
    if (isDark) return 'from-slate-950 via-indigo-950 to-purple-950';
    switch (timeOfDay) {
      case 'dawn': return 'from-rose-300 via-orange-200 to-sky-300';
      case 'morning': return 'from-sky-200 via-blue-100 to-cyan-50';
      case 'afternoon': return 'from-sky-400 via-blue-300 to-cyan-200';
      case 'sunset': return 'from-orange-500 via-rose-400 to-purple-600';
      case 'night': return 'from-indigo-950 via-purple-950 to-slate-950';
    }
  };

  const getGroundGradient = () => {
    switch (season) {
      case 'spring': return 'from-green-500 via-emerald-600 to-green-800';
      case 'summer': return 'from-green-600 via-emerald-700 to-green-900';
      case 'autumn': return 'from-amber-600 via-orange-700 to-yellow-900';
      case 'winter': return 'from-slate-300 via-gray-400 to-slate-600';
    }
  };

  const getMoodColor = (mood: 'happy' | 'thirsty' | 'critical') => {
    switch (mood) {
      case 'happy': 
        return isDark 
          ? 'from-green-600 via-emerald-700 to-green-900' 
          : 'from-green-300 via-emerald-400 to-green-600';
      case 'thirsty': 
        return isDark 
          ? 'from-yellow-700 via-amber-800 to-orange-900' 
          : 'from-yellow-300 via-amber-400 to-orange-500';
      case 'critical': 
        return isDark 
          ? 'from-red-700 via-pink-800 to-rose-900' 
          : 'from-red-300 via-pink-400 to-rose-600';
    }
  };

  const getMoodFace = (mood: 'happy' | 'thirsty' | 'critical') => {
    switch (mood) {
      case 'happy': return '😊';
      case 'thirsty': return '😅';
      case 'critical': return '🥺';
    }
  };

  // Renderizado del cielo
  const renderSky = () => {
    const elements: JSX.Element[] = [];

    // Estrellas (noche)
    if (timeOfDay === 'night' || isDark) {
      for (let i = 0; i < 80; i++) {
        const size = Math.random() * 2 + 1;
        elements.push(
          <div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${Math.random() * 55}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              boxShadow: '0 0 4px rgba(255,255,255,0.8)',
            }}
          />
        );
      }
      
      // Estrella fugaz ocasional
      elements.push(
        <div key="shooting-star" className="absolute top-10 left-1/4 animate-shooting-star">
          <div className="w-1 h-1 bg-white rounded-full shadow-lg" style={{
            boxShadow: '0 0 10px 2px rgba(255,255,255,0.8), -20px 0 20px rgba(255,255,255,0.4)',
          }}></div>
        </div>
      );

      // Luna detallada
      elements.push(
        <div key="moon" className="absolute top-8 right-12 animate-float" style={{ animationDuration: '10s' }}>
          <div className="relative">
            {/* Halo exterior */}
            <div className="absolute -inset-8 bg-yellow-100/10 rounded-full blur-2xl"></div>
            <div className="absolute -inset-4 bg-yellow-100/20 rounded-full blur-xl"></div>
            {/* Luna */}
            <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 rounded-full shadow-2xl">
              {/* Cráteres */}
              <div className="absolute top-4 left-5 w-5 h-5 bg-yellow-300/40 rounded-full"></div>
              <div className="absolute bottom-5 right-4 w-4 h-4 bg-yellow-300/40 rounded-full"></div>
              <div className="absolute top-8 right-6 w-3 h-3 bg-yellow-300/40 rounded-full"></div>
              <div className="absolute bottom-8 left-6 w-2 h-2 bg-yellow-300/40 rounded-full"></div>
              {/* Brillo */}
              <div className="absolute top-2 left-2 w-6 h-6 bg-white/30 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>
      );

      // Luciérnagas
      for (let i = 0; i < 15; i++) {
        elements.push(
          <div
            key={`firefly-${i}`}
            className="absolute animate-firefly"
            style={{
              top: `${40 + Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          >
            <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full" style={{
              boxShadow: '0 0 8px 3px rgba(253, 224, 71, 0.6)',
              animation: `pulse ${1 + Math.random()}s ease-in-out infinite`,
            }}></div>
          </div>
        );
      }
    } else {
      // Sol
      const sunPosition = timeOfDay === 'dawn' ? 'bottom-20 left-12' : 
                          timeOfDay === 'sunset' ? 'bottom-20 right-12' : 'top-8 right-12';
      
      elements.push(
        <div key="sun" className={`absolute ${sunPosition}`}>
          <div className="relative">
            {/* Resplandor exterior */}
            <div className={`absolute -inset-16 rounded-full blur-3xl ${
              timeOfDay === 'sunset' ? 'bg-orange-400/30' : 'bg-yellow-300/30'
            }`}></div>
            <div className={`absolute -inset-8 rounded-full blur-2xl ${
              timeOfDay === 'sunset' ? 'bg-orange-400/40' : 'bg-yellow-300/40'
            }`}></div>
            {/* Sol */}
            <div className={`relative w-24 h-24 rounded-full shadow-2xl ${
              timeOfDay === 'sunset' 
                ? 'bg-gradient-to-br from-orange-400 via-red-400 to-red-600' 
                : timeOfDay === 'dawn'
                ? 'bg-gradient-to-br from-yellow-200 via-orange-300 to-orange-400'
                : 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400'
            }`}>
              {/* Brillo interno */}
              <div className="absolute inset-4 bg-white/40 rounded-full blur-md"></div>
              <div className="absolute top-3 left-3 w-8 h-8 bg-white/30 rounded-full blur-sm"></div>
            </div>
            {/* Rayos */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`ray-${i}`}
                className={`absolute top-1/2 left-1/2 w-0.5 h-12 origin-bottom ${
                  timeOfDay === 'sunset' ? 'bg-orange-300/40' : 'bg-yellow-300/40'
                }`}
                style={{
                  transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                  animation: `pulse ${2 + (i % 3)}s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
      );

      // Aurora en amanecer
      if (timeOfDay === 'dawn') {
        elements.push(
          <div key="aurora" className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-pink-300/50 via-purple-300/30 to-transparent blur-xl"></div>
          </div>
        );
      }
    }

    // Nubes
    const cloudCount = weather === 'rainy' ? 8 : weather === 'cloudy' ? 6 : timeOfDay === 'night' ? 2 : 4;
    for (let i = 0; i < cloudCount; i++) {
      const scale = 0.6 + Math.random() * 0.8;
      elements.push(
        <div
          key={`cloud-${i}`}
          className="absolute animate-cloud"
          style={{
            top: `${5 + Math.random() * 35}%`,
            left: `${-10 + Math.random() * 100}%`,
            animationDuration: `${40 + Math.random() * 30}s`,
            animationDelay: `${-Math.random() * 40}s`,
            transform: `scale(${scale})`,
            opacity: weather === 'clear' ? 0.8 : 0.95,
          }}
        >
          <div className="relative">
            <div className={`w-24 h-10 ${
              weather === 'rainy' 
                ? 'bg-gray-600' 
                : timeOfDay === 'sunset'
                ? 'bg-orange-200/80'
                : timeOfDay === 'night'
                ? 'bg-gray-700/80'
                : 'bg-white'
            } rounded-full shadow-lg`}></div>
            <div className={`absolute -top-4 left-4 w-16 h-10 ${
              weather === 'rainy' ? 'bg-gray-600' : timeOfDay === 'sunset' ? 'bg-orange-200/80' : timeOfDay === 'night' ? 'bg-gray-700/80' : 'bg-white'
            } rounded-full`}></div>
            <div className={`absolute -top-2 left-10 w-12 h-8 ${
              weather === 'rainy' ? 'bg-gray-600' : timeOfDay === 'sunset' ? 'bg-orange-200/80' : timeOfDay === 'night' ? 'bg-gray-700/80' : 'bg-white'
            } rounded-full`}></div>
            <div className={`absolute -top-6 left-6 w-10 h-8 ${
              weather === 'rainy' ? 'bg-gray-600' : timeOfDay === 'sunset' ? 'bg-orange-200/80' : timeOfDay === 'night' ? 'bg-gray-700/80' : 'bg-white'
            } rounded-full`}></div>
          </div>
        </div>
      );
    }

    // Lluvia
    if (weather === 'rainy') {
      for (let i = 0; i < 80; i++) {
        elements.push(
          <div
            key={`rain-${i}`}
            className="absolute w-0.5 bg-gradient-to-b from-transparent via-blue-300/60 to-blue-400/80"
            style={{
              height: `${15 + Math.random() * 25}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 70}%`,
              animation: `rain ${0.4 + Math.random() * 0.4}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`,
              transform: `rotate(${5 + Math.random() * 10}deg)`,
            }}
          />
        );
      }
    }

    // Niebla al amanecer
    if (timeOfDay === 'dawn') {
      elements.push(
        <div key="fog" className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent blur-2xl animate-fog"></div>
        </div>
      );
    }

    // Elementos de estación
    if (season === 'autumn') {
      for (let i = 0; i < 15; i++) {
        elements.push(
          <div
            key={`leaf-${i}`}
            className="absolute text-xl animate-leaf-fall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          >
            {['🍂', '🍁'][Math.floor(Math.random() * 2)]}
          </div>
        );
      }
    }

    if (season === 'winter') {
      for (let i = 0; i < 40; i++) {
        elements.push(
          <div
            key={`snow-${i}`}
            className="absolute text-xs animate-snow"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
              opacity: 0.6 + Math.random() * 0.4,
            }}
          >
            ❄️
          </div>
        );
      }
    }

    if (season === 'spring') {
      for (let i = 0; i < 6; i++) {
        elements.push(
          <div
            key={`butterfly-${i}`}
            className="absolute text-xl animate-butterfly"
            style={{
              top: `${25 + Math.random() * 40}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            🦋
          </div>
        );
      }
      // Polen flotante
      for (let i = 0; i < 20; i++) {
        elements.push(
          <div
            key={`pollen-${i}`}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-pollen"
            style={{
              top: `${30 + Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
              boxShadow: '0 0 3px rgba(253, 224, 71, 0.5)',
            }}
          />
        );
      }
    }

    if (season === 'summer') {
      for (let i = 0; i < 4; i++) {
        elements.push(
          <div
            key={`bee-${i}`}
            className="absolute text-base animate-bee"
            style={{
              top: `${35 + Math.random() * 30}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 3}s`,
            }}
          >
            🐝
          </div>
        );
      }
    }

    // Pájaros
    for (let i = 0; i < 2; i++) {
      elements.push(
        <div
          key={`bird-${i}`}
          className="absolute text-sm animate-bird"
          style={{
            top: `${8 + Math.random() * 20}%`,
            animationDelay: `${i * 8 + Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 5}s`,
          }}
        >
          🐦
        </div>
      );
    }

    return elements;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <Icon emoji="🏡" size={40} className="mx-auto animate-float" />
        <h2 className={`text-lg font-black mt-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          Tu Jardín Virtual
        </h2>
        <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Visualiza tu huerto en tiempo real
        </p>
      </div>

      {/* Garden visualization */}
      <div className={`rounded-2xl sm:rounded-3xl border-2 shadow-2xl relative overflow-hidden ${
        isDark ? 'border-gray-700' : 'border-sky-200'
      }`}>
        {/* Sky */}
        <div className={`h-64 sm:h-72 bg-gradient-to-b ${getSkyGradient()} relative overflow-hidden transition-all duration-1000`}>
          {renderSky()}
          
          {/* Montañas con profundidad */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 800 120" className="w-full h-28" preserveAspectRatio="none">
              {/* Montañas lejanas */}
              <path d="M0 120 L100 60 L200 80 L300 40 L400 70 L500 30 L600 60 L700 45 L800 75 L800 120 Z" 
                    fill={isDark ? '#1e293b' : timeOfDay === 'sunset' ? '#7c3aed' : '#64748b'} 
                    opacity="0.4" />
              {/* Montañas cercanas */}
              <path d="M0 120 L80 80 L160 95 L240 65 L320 85 L400 55 L480 75 L560 60 L640 80 L720 70 L800 90 L800 120 Z" 
                    fill={isDark ? '#334155' : timeOfDay === 'sunset' ? '#581c87' : '#475569'} 
                    opacity="0.6" />
            </svg>
          </div>

          {/* Arcoíris */}
          {(weather === 'clear' && (season === 'spring' || season === 'summer')) && timeOfDay !== 'night' && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-40">
              <div className="relative w-80 h-40">
                {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'].map((color, i) => (
                  <div
                    key={color}
                    className="absolute rounded-t-full border-t-4 border-x-0 border-b-0"
                    style={{
                      borderColor: color,
                      width: `${320 - i * 15}px`,
                      height: `${160 - i * 8}px`,
                      left: `${i * 7.5}px`,
                      top: `${i * 4}px`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ground */}
        <div className={`relative bg-gradient-to-t ${getGroundGradient()} p-4 sm:p-6 min-h-[360px] transition-all duration-1000`}>
          {/* Textura de hierba */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={`grass-${i}`}
                className={`absolute rounded-t-full ${
                  season === 'winter' ? 'bg-slate-200' : 'bg-green-900'
                }`}
                style={{
                  width: '2px',
                  height: `${10 + Math.random() * 15}px`,
                  bottom: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: `rotate(${-20 + Math.random() * 40}deg)`,
                  opacity: 0.3,
                  animation: `sway ${3 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Flores en el suelo */}
          {season !== 'winter' && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: season === 'spring' ? 20 : 10 }).map((_, i) => (
                <div
                  key={`ground-flower-${i}`}
                  className="absolute text-xs"
                  style={{
                    bottom: `${Math.random() * 40}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `sway ${3 + Math.random() * 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                >
                  {season === 'spring' 
                    ? ['🌼', '🌸', '🌺', '🌻'][Math.floor(Math.random() * 4)]
                    : season === 'summer'
                    ? ['🌻', '🌼'][Math.floor(Math.random() * 2)]
                    : ['🍂', '🍁'][Math.floor(Math.random() * 2)]
                  }
                </div>
              ))}
            </div>
          )}

          {/* Rocas y detalles */}
          <div className="absolute bottom-6 left-6 text-3xl opacity-60">🪨</div>
          <div className="absolute bottom-10 right-10 text-2xl opacity-50">🪨</div>
          <div className="absolute bottom-4 right-1/4 text-xl opacity-40">🍄</div>
          
          {/* Caracol */}
          {season !== 'winter' && (
            <div className="absolute bottom-8 left-1/3 text-xl opacity-60 animate-crawl">
              🐌
            </div>
          )}

          {/* Cerca de madera */}
          <div className="absolute top-0 left-0 right-0 opacity-40">
            <div className="flex justify-around px-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={`fence-${i}`} className="relative">
                  <div className="w-2 h-10 bg-gradient-to-b from-amber-700 to-amber-900 rounded-t shadow-md"></div>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-amber-600 rounded-t"></div>
                </div>
              ))}
            </div>
            <div className="absolute top-3 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800"></div>
            <div className="absolute top-6 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800"></div>
          </div>

          {/* Plants grid */}
          <div className="relative grid grid-cols-3 gap-4 sm:gap-6 mt-10">
            {gardenPlants.map((plant, i) => (
              <div
                key={plant.planta_id}
                className="flex flex-col items-center animate-fade-in relative group"
                style={{ animationDelay: `${i * 0.1}s` }}
                onMouseEnter={() => setHoveredPlant(plant.nombre)}
                onMouseLeave={() => setHoveredPlant(null)}
              >
                {/* Sombra dinámica */}
                <div 
                  className="absolute bottom-0 rounded-full bg-black/30 blur-md transition-all duration-500"
                  style={{ 
                    width: `${plant.size * 0.6}px`,
                    height: `${plant.size * 0.15}px`,
                    transform: `translateX(${timeOfDay === 'sunset' ? '10px' : timeOfDay === 'morning' ? '-10px' : '0'})`,
                  }}
                ></div>

                {/* Plant */}
                <div 
                  className="relative"
                  style={{
                    animation: hoveredPlant === plant.nombre ? undefined : `sway ${4 + Math.random() * 2}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                    transformOrigin: 'bottom center',
                  }}
                >
                  <div
                    className={`bg-gradient-to-t ${getMoodColor(plant.mood)} rounded-t-full flex items-center justify-center transition-all duration-500 shadow-xl relative overflow-hidden ${
                      hoveredPlant === plant.nombre ? 'scale-110 ring-4 ring-white/60' : 'hover:scale-105'
                    }`}
                    style={{
                      width: `${plant.size * 0.7}px`,
                      height: `${plant.size}px`,
                    }}
                  >
                    {/* Efectos de luz */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/20"></div>
                    <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent"></div>
                    
                    {/* Brillo especular */}
                    <div className="absolute top-3 left-3 w-6 h-10 bg-white/40 rounded-full blur-md transform -rotate-12"></div>
                    <div className="absolute top-6 left-4 w-3 h-6 bg-white/30 rounded-full blur-sm transform -rotate-12"></div>
                    
                    <Icon emoji={plant.emoji} size={plant.size * 0.45} className="relative z-10 drop-shadow-lg" />
                  </div>
                  
                  {/* Mood face */}
                  <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-gray-100 z-20 transition-transform hover:scale-110">
                    <span className="text-base">{getMoodFace(plant.mood)}</span>
                  </div>

                  {/* Water drops if thirsty */}
                  {plant.mood === 'critical' && (
                    <>
                      <div className="absolute -top-4 left-1/4 animate-bounce">
                        <Icon emoji="💧" size={16} />
                      </div>
                      <div className="absolute -top-2 left-1/2 animate-bounce" style={{ animationDelay: '0.3s' }}>
                        <Icon emoji="💧" size={12} />
                      </div>
                    </>
                  )}

                  {/* Sparkles if happy */}
                  {plant.mood === 'happy' && (
                    <>
                      <div className="absolute -top-3 -left-3 text-sm animate-sparkle">✨</div>
                      <div className="absolute -top-2 -right-4 text-sm animate-sparkle" style={{ animationDelay: '0.7s' }}>✨</div>
                      <div className="absolute top-1/4 -left-4 text-xs animate-sparkle" style={{ animationDelay: '1.2s' }}>✨</div>
                    </>
                  )}

                  {/* Harvest badge */}
                  {plant.totalCosechas > 0 && (
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-purple-400 via-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-xl border-2 border-white z-20 animate-pulse-soft">
                      <span className="text-[11px] font-black text-white">{plant.totalCosechas}</span>
                    </div>
                  )}

                  {/* Tooltip on hover */}
                  {hoveredPlant === plant.nombre && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-30 animate-fade-in pointer-events-none">
                      <div className={`px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold whitespace-nowrap border-2 ${
                        isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'
                      }`}>
                        <p className="font-black text-sm mb-1.5 flex items-center gap-1">
                          <Icon emoji={plant.emoji} size={16} />
                          {plant.nombre}
                        </p>
                        <div className="space-y-0.5">
                          <p className={`text-[10px] font-normal ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            📏 Altura: {plant.height} cm
                          </p>
                          <p className={`text-[10px] font-normal ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            ✂️ Cosechas: {plant.totalCosechas} unidades
                          </p>
                          <p className={`text-[10px] font-normal ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            💧 Último riego: hace {plant.daysSinceWater} días
                          </p>
                          <p className={`text-[10px] font-normal ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {plant.mood === 'happy' ? '😊 ¡Feliz y saludable!' : 
                             plant.mood === 'thirsty' ? '😅 Necesita agua pronto' : 
                             '🥺 ¡Necesita agua urgente!'}
                          </p>
                        </div>
                        <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-8 border-t-${isDark ? 'gray-800' : 'white'} border-x-transparent border-b-transparent`}></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Maceta mejorada */}
                <div className="relative mt-1">
                  {/* Borde superior de la maceta */}
                  <div className={`w-14 h-2 rounded-t-lg mx-auto ${
                    isDark ? 'bg-gradient-to-b from-amber-700 to-amber-800' : 'bg-gradient-to-b from-amber-600 to-amber-700'
                  }`}></div>
                  {/* Cuerpo de la maceta */}
                  <div className={`w-12 h-6 mx-auto ${
                    isDark 
                      ? 'bg-gradient-to-b from-amber-800 to-amber-950' 
                      : 'bg-gradient-to-b from-amber-700 to-amber-900'
                  } shadow-lg relative`}>
                    {/* Textura */}
                    <div className="absolute inset-x-0 top-1 h-0.5 bg-amber-900/30"></div>
                    <div className="absolute inset-x-0 bottom-2 h-0.5 bg-amber-900/30"></div>
                    {/* Tierra visible */}
                    <div className="absolute top-0 left-1 right-1 h-1.5 bg-gradient-to-b from-amber-950 to-amber-900 rounded-t-sm"></div>
                  </div>
                  {/* Plato */}
                  <div className={`w-16 h-2 rounded-b-lg mx-auto ${
                    isDark ? 'bg-gradient-to-b from-gray-600 to-gray-800' : 'bg-gradient-to-b from-gray-400 to-gray-600'
                  } shadow-md`}></div>
                </div>

                {/* Name plate */}
                <div className={`mt-2 px-3 py-1 rounded-full text-[10px] font-bold text-center truncate max-w-full shadow-lg transition-all ${
                  hoveredPlant === plant.nombre 
                    ? isDark ? 'bg-gray-700 text-gray-100 border-2 border-green-500 scale-110' : 'bg-white text-gray-900 border-2 border-green-500 scale-110'
                    : isDark ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-white text-gray-800 border border-gray-200'
                }`}>
                  {plant.nombre}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats overlay */}
        <div className={`p-3 sm:p-4 ${isDark ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-md border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="grid grid-cols-3 gap-2">
            <div className={`text-center p-2 rounded-xl transition-all ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
              <p className={`text-lg font-black ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                {gardenPlants.filter(p => p.mood === 'happy').length}
              </p>
              <p className={`text-[9px] font-medium ${isDark ? 'text-green-500' : 'text-green-600'}`}>
                Felices 😊
              </p>
            </div>
            <div className={`text-center p-2 rounded-xl transition-all ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>
              <p className={`text-lg font-black ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                {gardenPlants.filter(p => p.mood === 'thirsty').length}
              </p>
              <p className={`text-[9px] font-medium ${isDark ? 'text-yellow-500' : 'text-yellow-600'}`}>
                Con sed 😅
              </p>
            </div>
            <div className={`text-center p-2 rounded-xl transition-all ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`}>
              <p className={`text-lg font-black ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                {gardenPlants.filter(p => p.mood === 'critical').length}
              </p>
              <p className={`text-[9px] font-medium ${isDark ? 'text-red-500' : 'text-red-600'}`}>
                Sedientas 🥺
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-xl p-3 shadow-cute ${isDark ? 'bg-gray-800/80 border border-gray-700' : 'bg-white/80 backdrop-blur-sm border-2 border-indigo-100'}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">
              {timeOfDay === 'dawn' ? '🌅' : timeOfDay === 'morning' ? '🌤️' : timeOfDay === 'afternoon' ? '☀️' : timeOfDay === 'sunset' ? '🌇' : '🌙'}
            </span>
            <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {timeOfDay === 'dawn' ? 'Amanecer' : timeOfDay === 'morning' ? 'Mañana' : timeOfDay === 'afternoon' ? 'Tarde' : timeOfDay === 'sunset' ? 'Atardecer' : 'Noche'}
            </span>
          </div>
          <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {weather === 'clear' ? '✨ Cielo despejado' : weather === 'cloudy' ? '☁️ Nublado' : '🌧️ Lluvioso'}
          </p>
        </div>

        <div className={`rounded-xl p-3 shadow-cute ${isDark ? 'bg-gray-800/80 border border-gray-700' : 'bg-white/80 backdrop-blur-sm border-2 border-indigo-100'}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">
              {season === 'spring' ? '🌸' : season === 'summer' ? '☀️' : season === 'autumn' ? '🍂' : '❄️'}
            </span>
            <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {season === 'spring' ? 'Primavera' : season === 'summer' ? 'Verano' : season === 'autumn' ? 'Otoño' : 'Invierno'}
            </span>
          </div>
          <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {season === 'spring' ? '🦋 Tiempo de floración' : season === 'summer' ? '🌻 Máximo crecimiento' : season === 'autumn' ? '🍁 Tiempo de cosecha' : '⛄ Descanso invernal'}
          </p>
        </div>
      </div>
    </div>
  );
}
