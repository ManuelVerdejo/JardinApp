import { useState, useEffect } from 'react';
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

  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('afternoon');
  const [season, setSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('spring');

  // Actualizar hora del día automáticamente
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 18) setTimeOfDay('afternoon');
    else if (hour >= 18 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');

    // Actualizar estación
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) setSeason('spring');
    else if (month >= 5 && month <= 7) setSeason('summer');
    else if (month >= 8 && month <= 10) setSeason('autumn');
    else setSeason('winter');
  }, []);

  // Calcular estado de cada planta
  const gardenPlants = plantas.map(planta => {
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
    const size = Math.min(120, Math.max(50, height * 3));

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
  });

  // Colores del cielo según hora
  const getSkyGradient = () => {
    if (isDark) {
      return 'from-gray-900 via-indigo-950 to-purple-950';
    }
    
    switch (timeOfDay) {
      case 'morning':
        return 'from-orange-200 via-yellow-100 to-blue-200';
      case 'afternoon':
        return 'from-sky-300 via-blue-200 to-cyan-100';
      case 'evening':
        return 'from-orange-400 via-pink-300 to-purple-400';
      case 'night':
        return 'from-indigo-900 via-purple-900 to-blue-950';
    }
  };

  // Colores del suelo según estación
  const getGroundColor = () => {
    switch (season) {
      case 'spring':
        return 'from-green-500 via-green-600 to-green-700';
      case 'summer':
        return 'from-green-600 via-green-700 to-green-800';
      case 'autumn':
        return 'from-orange-600 via-amber-700 to-yellow-800';
      case 'winter':
        return 'from-gray-400 via-gray-500 to-gray-600';
    }
  };

  const getMoodColor = (mood: 'happy' | 'thirsty' | 'critical') => {
    switch (mood) {
      case 'happy': 
        return isDark 
          ? 'from-green-700 to-emerald-800' 
          : 'from-green-300 to-emerald-400';
      case 'thirsty': 
        return isDark 
          ? 'from-yellow-700 to-amber-800' 
          : 'from-yellow-300 to-amber-400';
      case 'critical': 
        return isDark 
          ? 'from-red-700 to-pink-800' 
          : 'from-red-300 to-pink-400';
    }
  };

  const getMoodFace = (mood: 'happy' | 'thirsty' | 'critical') => {
    switch (mood) {
      case 'happy': return '😊';
      case 'thirsty': return '😅';
      case 'critical': return '🥺';
    }
  };

  // Elementos decorativos según hora
  const renderSkyElements = () => {
    if (timeOfDay === 'night' || isDark) {
      return (
        <>
          {/* Estrellas */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 40}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
          {/* Luna */}
          <div className="absolute top-4 right-8">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full shadow-lg">
              <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-300/50 rounded-full"></div>
              <div className="absolute bottom-3 right-2 w-2 h-2 bg-yellow-300/50 rounded-full"></div>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        {/* Sol */}
        <div className={`absolute ${timeOfDay === 'morning' ? 'top-8 left-8' : timeOfDay === 'evening' ? 'bottom-20 right-8' : 'top-4 right-8'}`}>
          <div className={`w-16 h-16 rounded-full shadow-lg animate-pulse-soft ${
            timeOfDay === 'evening' 
              ? 'bg-gradient-to-br from-orange-400 to-red-500' 
              : 'bg-gradient-to-br from-yellow-300 to-orange-400'
          }`}>
            <div className="absolute inset-2 bg-white/30 rounded-full"></div>
          </div>
        </div>
        
        {/* Nubes */}
        <div className="absolute top-6 left-12 opacity-80 animate-float" style={{ animationDuration: '6s' }}>
          <div className="w-20 h-8 bg-white rounded-full"></div>
          <div className="w-16 h-8 bg-white rounded-full -mt-4 ml-4"></div>
          <div className="w-12 h-6 bg-white rounded-full -mt-2 ml-2"></div>
        </div>
        <div className="absolute top-12 right-16 opacity-60 animate-float" style={{ animationDuration: '8s', animationDelay: '1s' }}>
          <div className="w-16 h-6 bg-white rounded-full"></div>
          <div className="w-12 h-6 bg-white rounded-full -mt-3 ml-3"></div>
        </div>
      </>
    );
  };

  // Elementos decorativos según estación
  const renderSeasonElements = () => {
    if (season === 'autumn') {
      return (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`leaf-${i}`}
              className="absolute text-lg animate-fall"
              style={{
                top: `${Math.random() * 60}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              🍂
            </div>
          ))}
        </>
      );
    }

    if (season === 'winter') {
      return (
        <>
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`snow-${i}`}
              className="absolute text-sm animate-fall"
              style={{
                top: `${Math.random() * 60}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
              }}
            >
              ❄️
            </div>
          ))}
        </>
      );
    }

    if (season === 'spring') {
      return (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`butterfly-${i}`}
              className="absolute text-lg animate-float"
              style={{
                top: `${20 + Math.random() * 40}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
              }}
            >
              🦋
            </div>
          ))}
        </>
      );
    }

    return null;
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
      <div className={`rounded-2xl sm:rounded-3xl border-2 shadow-cute-lg relative overflow-hidden ${
        isDark ? 'border-gray-700' : 'border-sky-200'
      }`}>
        {/* Sky */}
        <div className={`h-48 bg-gradient-to-b ${getSkyGradient()} relative`}>
          {renderSkyElements()}
          {renderSeasonElements()}
        </div>

        {/* Ground */}
        <div className={`relative bg-gradient-to-t ${getGroundColor()} p-4 min-h-[280px]`}>
          {/* Grass texture */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={`grass-${i}`}
                className="absolute w-1 h-3 bg-green-900 rounded-t-full"
                style={{
                  bottom: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: `rotate(${-10 + Math.random() * 20}deg)`,
                }}
              />
            ))}
          </div>

          {/* Plants grid */}
          <div className="relative grid grid-cols-3 gap-4">
            {gardenPlants.map((plant, i) => (
              <div
                key={plant.planta_id}
                className="flex flex-col items-center animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Plant */}
                <div className="relative group">
                  <div
                    className={`bg-gradient-to-t ${getMoodColor(plant.mood)} rounded-t-full flex items-center justify-center transition-all duration-500 shadow-cute hover:scale-110 cursor-pointer`}
                    style={{
                      width: `${plant.size * 0.7}px`,
                      height: `${plant.size}px`,
                    }}
                  >
                    <Icon emoji={plant.emoji} size={plant.size * 0.45} />
                  </div>
                  
                  {/* Mood face */}
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200">
                    <span className="text-sm">{getMoodFace(plant.mood)}</span>
                  </div>

                  {/* Water drops if thirsty */}
                  {plant.mood === 'critical' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 animate-bounce">
                      <Icon emoji="💧" size={16} />
                    </div>
                  )}

                  {/* Harvest badge */}
                  {plant.totalCosechas > 0 && (
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      <span className="text-[10px] font-black text-white">{plant.totalCosechas}</span>
                    </div>
                  )}

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className={`px-3 py-2 rounded-lg shadow-lg text-xs font-bold whitespace-nowrap ${
                      isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
                    }`}>
                      <p className="font-black">{plant.nombre}</p>
                      <p className="text-[10px] font-normal opacity-75">
                        {plant.height} cm · {plant.totalCosechas} cosechas
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pot */}
                <div className={`w-10 h-4 rounded-b-lg mt-1 ${
                  isDark 
                    ? 'bg-gradient-to-b from-amber-800 to-amber-900' 
                    : 'bg-gradient-to-b from-amber-700 to-amber-800'
                }`}></div>

                {/* Name */}
                <p className={`text-[10px] font-bold mt-1 text-center truncate w-full ${
                  isDark ? 'text-gray-200' : 'text-white'
                }`}>
                  {plant.nombre}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats overlay */}
        <div className={`p-3 ${isDark ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm`}>
          <div className="grid grid-cols-3 gap-2">
            <div className={`text-center p-2 rounded-xl ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
              <p className={`text-lg font-black ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                {gardenPlants.filter(p => p.mood === 'happy').length}
              </p>
              <p className={`text-[9px] font-medium ${isDark ? 'text-green-500' : 'text-green-600'}`}>
                Felices
              </p>
            </div>
            <div className={`text-center p-2 rounded-xl ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>
              <p className={`text-lg font-black ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                {gardenPlants.filter(p => p.mood === 'thirsty').length}
              </p>
              <p className={`text-[9px] font-medium ${isDark ? 'text-yellow-500' : 'text-yellow-600'}`}>
                Con sed
              </p>
            </div>
            <div className={`text-center p-2 rounded-xl ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`}>
              <p className={`text-lg font-black ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                {gardenPlants.filter(p => p.mood === 'critical').length}
              </p>
              <p className={`text-[9px] font-medium ${isDark ? 'text-red-500' : 'text-red-600'}`}>
                Sedientas
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
              {timeOfDay === 'morning' ? '🌅' : timeOfDay === 'afternoon' ? '☀️' : timeOfDay === 'evening' ? '🌇' : '🌙'}
            </span>
            <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {timeOfDay === 'morning' ? 'Mañana' : timeOfDay === 'afternoon' ? 'Tarde' : timeOfDay === 'evening' ? 'Atardecer' : 'Noche'}
            </span>
          </div>
          <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Hora actual en tu jardín
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
            Estación actual
          </p>
        </div>
      </div>
    </div>
  );
}
