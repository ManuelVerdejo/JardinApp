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

  // Actualizar hora del día y estación automáticamente
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

      // Clima aleatorio pero consistente por hora
      const weatherSeed = Math.floor(hour / 4);
      const weathers: ('clear' | 'cloudy' | 'rainy')[] = ['clear', 'clear', 'cloudy', 'clear', 'rainy', 'clear'];
      setWeather(weathers[weatherSeed]);
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

    return {
      ...planta,
      mood,
      size,
      daysSinceWater,
      totalCosechas,
      height,
    };
  }), [plantas, riegos, bitacora, cosechas]);

  // Colores del cielo según hora del día
  const getSkyGradient = () => {
    if (isDark) return 'from-slate-950 via-indigo-950 to-purple-950';
    
    switch (timeOfDay) {
      case 'dawn': return 'from-orange-300 via-pink-200 to-blue-300';
      case 'morning': return 'from-orange-100 via-yellow-50 to-blue-200';
      case 'afternoon': return 'from-sky-300 via-blue-200 to-cyan-100';
      case 'sunset': return 'from-orange-500 via-pink-400 to-purple-500';
      case 'night': return 'from-indigo-900 via-purple-900 to-blue-950';
    }
  };

  // Colores del suelo según estación
  const getGroundGradient = () => {
    switch (season) {
      case 'spring': return 'from-green-500 via-emerald-600 to-green-700';
      case 'summer': return 'from-green-600 via-emerald-700 to-green-800';
      case 'autumn': return 'from-amber-600 via-orange-700 to-yellow-800';
      case 'winter': return 'from-slate-400 via-gray-500 to-slate-600';
    }
  };

  const getMoodColor = (mood: 'happy' | 'thirsty' | 'critical') => {
    switch (mood) {
      case 'happy': 
        return isDark 
          ? 'from-green-600 via-emerald-700 to-green-800' 
          : 'from-green-300 via-emerald-400 to-green-500';
      case 'thirsty': 
        return isDark 
          ? 'from-yellow-600 via-amber-700 to-orange-800' 
          : 'from-yellow-300 via-amber-400 to-orange-400';
      case 'critical': 
        return isDark 
          ? 'from-red-600 via-pink-700 to-rose-800' 
          : 'from-red-300 via-pink-400 to-rose-500';
    }
  };

  const getMoodFace = (mood: 'happy' | 'thirsty' | 'critical') => {
    switch (mood) {
      case 'happy': return '😊';
      case 'thirsty': return '😅';
      case 'critical': return '🥺';
    }
  };

  // Elementos del cielo
  const renderSkyElements = () => {
    const elements = [];

    // Estrellas (noche)
    if (timeOfDay === 'night' || isDark) {
      for (let i = 0; i < 40; i++) {
        elements.push(
          <div
            key={`star-${i}`}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        );
      }
      
      // Luna
      elements.push(
        <div key="moon" className="absolute top-6 right-10 animate-float" style={{ animationDuration: '8s' }}>
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full shadow-2xl">
              <div className="absolute top-3 left-4 w-4 h-4 bg-yellow-300/40 rounded-full"></div>
              <div className="absolute bottom-4 right-3 w-3 h-3 bg-yellow-300/40 rounded-full"></div>
              <div className="absolute top-6 right-5 w-2 h-2 bg-yellow-300/40 rounded-full"></div>
            </div>
            {/* Halo de la luna */}
            <div className="absolute inset-0 w-16 h-16 bg-yellow-200/20 rounded-full blur-xl -z-10"></div>
          </div>
        </div>
      );
    } else {
      // Sol
      const sunPosition = timeOfDay === 'dawn' ? 'bottom-16 left-10' : 
                          timeOfDay === 'sunset' ? 'bottom-16 right-10' : 'top-6 right-10';
      
      elements.push(
        <div key="sun" className={`absolute ${sunPosition}`}>
          <div className="relative">
            <div className={`w-20 h-20 rounded-full shadow-2xl animate-pulse-soft ${
              timeOfDay === 'sunset' 
                ? 'bg-gradient-to-br from-orange-400 to-red-500' 
                : timeOfDay === 'dawn'
                ? 'bg-gradient-to-br from-yellow-200 to-orange-300'
                : 'bg-gradient-to-br from-yellow-300 to-orange-400'
            }`}>
              <div className="absolute inset-3 bg-white/30 rounded-full"></div>
            </div>
            {/* Rayos del sol */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`ray-${i}`}
                className="absolute top-1/2 left-1/2 w-1 h-8 bg-yellow-300/40 origin-bottom animate-pulse"
                style={{
                  transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
            {/* Halo del sol */}
            <div className={`absolute inset-0 w-20 h-20 rounded-full blur-2xl -z-10 ${
              timeOfDay === 'sunset' ? 'bg-orange-400/30' : 'bg-yellow-300/30'
            }`}></div>
          </div>
        </div>
      );
    }

    // Nubes
    if (weather !== 'clear' || timeOfDay === 'morning' || timeOfDay === 'afternoon') {
      const cloudCount = weather === 'cloudy' ? 5 : weather === 'rainy' ? 7 : 3;
      for (let i = 0; i < cloudCount; i++) {
        elements.push(
          <div
            key={`cloud-${i}`}
            className="absolute animate-float"
            style={{
              top: `${10 + Math.random() * 30}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${6 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: weather === 'clear' ? 0.7 : 0.9,
            }}
          >
            <div className={`relative ${weather === 'rainy' ? 'scale-125' : ''}`}>
              <div className={`w-20 h-8 ${isDark ? 'bg-gray-700' : 'bg-white'} rounded-full shadow-lg`}></div>
              <div className={`absolute -top-3 left-3 w-14 h-8 ${isDark ? 'bg-gray-700' : 'bg-white'} rounded-full`}></div>
              <div className={`absolute -top-1 left-8 w-10 h-6 ${isDark ? 'bg-gray-700' : 'bg-white'} rounded-full`}></div>
            </div>
          </div>
        );
      }
    }

    // Lluvia
    if (weather === 'rainy') {
      for (let i = 0; i < 50; i++) {
        elements.push(
          <div
            key={`rain-${i}`}
            className="absolute w-0.5 bg-gradient-to-b from-transparent to-blue-400/60 animate-rain"
            style={{
              height: `${10 + Math.random() * 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
            }}
          />
        );
      }
    }

    // Elementos de estación
    if (season === 'autumn') {
      for (let i = 0; i < 12; i++) {
        elements.push(
          <div
            key={`leaf-${i}`}
            className="absolute text-lg animate-fall"
            style={{
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          >
            🍂
          </div>
        );
      }
    }

    if (season === 'winter') {
      for (let i = 0; i < 30; i++) {
        elements.push(
          <div
            key={`snow-${i}`}
            className="absolute text-xs animate-fall"
            style={{
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 3}s`,
            }}
          >
            ❄️
          </div>
        );
      }
    }

    if (season === 'spring') {
      for (let i = 0; i < 8; i++) {
        elements.push(
          <div
            key={`butterfly-${i}`}
            className="absolute text-lg animate-butterfly"
            style={{
              top: `${20 + Math.random() * 40}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${5 + Math.random() * 3}s`,
            }}
          >
            🦋
          </div>
        );
      }
    }

    if (season === 'summer') {
      for (let i = 0; i < 5; i++) {
        elements.push(
          <div
            key={`bee-${i}`}
            className="absolute text-sm animate-bee"
            style={{
              top: `${30 + Math.random() * 30}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          >
            🐝
          </div>
        );
      }
    }

    // Pájaros (cualquier estación)
    for (let i = 0; i < 3; i++) {
      elements.push(
        <div
          key={`bird-${i}`}
          className="absolute text-sm animate-bird"
          style={{
            top: `${10 + Math.random() * 25}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
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
        <div className={`h-56 sm:h-64 bg-gradient-to-b ${getSkyGradient()} relative overflow-hidden`}>
          {renderSkyElements()}
          
          {/* Montañas al fondo */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 400 80" className="w-full h-20 opacity-30">
              <path d="M0 80 L50 40 L100 60 L150 30 L200 50 L250 25 L300 45 L350 35 L400 55 L400 80 Z" 
                    fill={isDark ? '#1e293b' : '#64748b'} />
            </svg>
          </div>

          {/* Arcoíris (solo después de lluvia o en primavera) */}
          {(weather === 'clear' && season === 'spring') && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-30">
              <div className="w-64 h-32 border-t-8 border-r-8 border-l-8 rounded-t-full"
                   style={{
                     borderImage: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet) 1'
                   }}></div>
            </div>
          )}
        </div>

        {/* Ground */}
        <div className={`relative bg-gradient-to-t ${getGroundGradient()} p-4 sm:p-6 min-h-[320px]`}>
          {/* Textura de hierba */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={`grass-${i}`}
                className={`absolute w-0.5 rounded-t-full ${
                  season === 'winter' ? 'bg-slate-300' : 'bg-green-800'
                }`}
                style={{
                  height: `${8 + Math.random() * 12}px`,
                  bottom: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: `rotate(${-15 + Math.random() * 30}deg)`,
                  opacity: 0.3,
                }}
              />
            ))}
          </div>

          {/* Flores pequeñas en el suelo */}
          {season === 'spring' && (
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={`flower-${i}`}
                  className="absolute text-xs animate-float"
                  style={{
                    bottom: `${Math.random() * 30}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${3 + Math.random() * 2}s`,
                  }}
                >
                  {['🌼', '🌸', '🌺'][Math.floor(Math.random() * 3)]}
                </div>
              ))}
            </div>
          )}

          {/* Rocas decorativas */}
          <div className="absolute bottom-4 left-4 text-2xl opacity-50">🪨</div>
          <div className="absolute bottom-8 right-8 text-xl opacity-40">🪨</div>

          {/* Cerca de madera */}
          <div className="absolute top-0 left-0 right-0 flex justify-around opacity-30">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`fence-${i}`} className="w-2 h-8 bg-amber-800 rounded-t"></div>
            ))}
            <div className="absolute top-2 left-0 right-0 h-1 bg-amber-800"></div>
            <div className="absolute top-5 left-0 right-0 h-1 bg-amber-800"></div>
          </div>

          {/* Plants grid */}
          <div className="relative grid grid-cols-3 gap-4 sm:gap-6 mt-8">
            {gardenPlants.map((plant, i) => (
              <div
                key={plant.planta_id}
                className="flex flex-col items-center animate-fade-in relative group"
                style={{ animationDelay: `${i * 0.1}s` }}
                onMouseEnter={() => setHoveredPlant(plant.nombre)}
                onMouseLeave={() => setHoveredPlant(null)}
              >
                {/* Sombra de la planta */}
                <div 
                  className="absolute bottom-0 w-12 h-3 bg-black/20 rounded-full blur-sm"
                  style={{ width: `${plant.size * 0.5}px` }}
                ></div>

                {/* Plant */}
                <div className="relative">
                  <div
                    className={`bg-gradient-to-t ${getMoodColor(plant.mood)} rounded-t-full flex items-center justify-center transition-all duration-500 shadow-lg hover:scale-110 cursor-pointer relative overflow-hidden ${
                      hoveredPlant === plant.nombre ? 'ring-4 ring-white/50' : ''
                    }`}
                    style={{
                      width: `${plant.size * 0.7}px`,
                      height: `${plant.size}px`,
                    }}
                  >
                    {/* Textura de la planta */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    
                    {/* Brillo */}
                    <div className="absolute top-2 left-2 w-4 h-8 bg-white/30 rounded-full blur-sm transform -rotate-12"></div>
                    
                    <Icon emoji={plant.emoji} size={plant.size * 0.45} className="relative z-10" />
                  </div>
                  
                  {/* Mood face */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200 z-20">
                    <span className="text-sm">{getMoodFace(plant.mood)}</span>
                  </div>

                  {/* Water drops if thirsty */}
                  {plant.mood === 'critical' && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce">
                      <Icon emoji="💧" size={18} />
                    </div>
                  )}

                  {/* Sparkles if happy */}
                  {plant.mood === 'happy' && (
                    <>
                      <div className="absolute -top-2 -left-2 text-xs animate-sparkle">✨</div>
                      <div className="absolute -top-1 -right-3 text-xs animate-sparkle" style={{ animationDelay: '0.5s' }}>✨</div>
                    </>
                  )}

                  {/* Harvest badge */}
                  {plant.totalCosechas > 0 && (
                    <div className="absolute -top-2 -left-2 w-7 h-7 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-20">
                      <span className="text-[10px] font-black text-white">{plant.totalCosechas}</span>
                    </div>
                  )}

                  {/* Tooltip on hover */}
                  {hoveredPlant === plant.nombre && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-30 animate-fade-in">
                      <div className={`px-4 py-3 rounded-xl shadow-2xl text-xs font-bold whitespace-nowrap border-2 ${
                        isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'
                      }`}>
                        <p className="font-black text-sm mb-1">{plant.nombre}</p>
                        <p className={`text-[10px] font-normal ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          📏 {plant.height} cm · ✂️ {plant.totalCosechas} cosechas
                        </p>
                        <p className={`text-[10px] font-normal ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          💧 Último riego: hace {plant.daysSinceWater} días
                        </p>
                        <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-t-${isDark ? 'gray-800' : 'white'} border-x-transparent border-b-transparent`}></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Maceta mejorada */}
                <div className="relative mt-1">
                  <div className={`w-12 h-5 rounded-b-lg ${
                    isDark 
                      ? 'bg-gradient-to-b from-amber-800 to-amber-950' 
                      : 'bg-gradient-to-b from-amber-700 to-amber-900'
                  } shadow-lg`}>
                    {/* Detalle de la maceta */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-amber-900/50"></div>
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-amber-900/30 rounded"></div>
                  </div>
                  {/* Plato debajo de la maceta */}
                  <div className={`w-14 h-1.5 rounded-full mx-auto -mt-0.5 ${
                    isDark ? 'bg-gray-700' : 'bg-gray-400'
                  }`}></div>
                </div>

                {/* Name plate */}
                <div className={`mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-center truncate max-w-full shadow-md ${
                  isDark ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-white text-gray-800 border border-gray-200'
                }`}>
                  {plant.nombre}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats overlay */}
        <div className={`p-3 sm:p-4 ${isDark ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-md border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="grid grid-cols-3 gap-2">
            <div className={`text-center p-2 rounded-xl ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
              <p className={`text-lg font-black ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                {gardenPlants.filter(p => p.mood === 'happy').length}
              </p>
              <p className={`text-[9px] font-medium ${isDark ? 'text-green-500' : 'text-green-600'}`}>
                Felices 😊
              </p>
            </div>
            <div className={`text-center p-2 rounded-xl ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>
              <p className={`text-lg font-black ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                {gardenPlants.filter(p => p.mood === 'thirsty').length}
              </p>
              <p className={`text-[9px] font-medium ${isDark ? 'text-yellow-500' : 'text-yellow-600'}`}>
                Con sed 😅
              </p>
            </div>
            <div className={`text-center p-2 rounded-xl ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`}>
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
            {weather === 'clear' ? 'Cielo despejado' : weather === 'cloudy' ? 'Nublado' : 'Lluvioso'}
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
            {season === 'spring' ? 'Tiempo de floración' : season === 'summer' ? 'Máximo crecimiento' : season === 'autumn' ? 'Tiempo de cosecha' : 'Descanso invernal'}
          </p>
        </div>
      </div>
    </div>
  );
}
