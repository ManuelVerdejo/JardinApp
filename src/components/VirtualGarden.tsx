import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from './Icon';

export function VirtualGarden() {
  const plantas = useLiveQuery(() => db.plantas.toArray()) || [];
  const riegos = useLiveQuery(() => db.riegos.toArray()) || [];
  const bitacora = useLiveQuery(() => db.bitacora.toArray()) || [];

  // Calcular estado de cada planta para el jardín virtual
  const gardenPlants = plantas.map(planta => {
    const riegosPlanta = riegos.filter(r => r.planta_nombre === planta.nombre);
    const bitacoraPlanta = bitacora.filter(b => b.planta_nombre === planta.nombre);
    
    const ultimoRiego = riegosPlanta.sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
    const ultimaMedicion = bitacoraPlanta.sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
    
    let daysSinceWater = 999;
    if (ultimoRiego) {
      const lastDate = new Date(ultimoRiego.fecha);
      const today = new Date();
      daysSinceWater = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    const height = ultimaMedicion?.altura_cm || 5;
    const size = Math.min(100, Math.max(40, height * 3)); // Tamaño visual basado en altura

    let mood: 'happy' | 'thirsty' | 'critical';
    if (daysSinceWater > planta.frecuencia_riego_dias) mood = 'critical';
    else if (daysSinceWater === planta.frecuencia_riego_dias) mood = 'thirsty';
    else mood = 'happy';

    return {
      ...planta,
      mood,
      size,
      daysSinceWater,
    };
  });

  const getMoodColor = (mood: 'happy' | 'thirsty' | 'critical') => {
    switch (mood) {
      case 'happy': return 'from-green-200 to-emerald-200 dark:from-green-800 dark:to-emerald-800';
      case 'thirsty': return 'from-yellow-200 to-amber-200 dark:from-yellow-800 dark:to-amber-800';
      case 'critical': return 'from-red-200 to-pink-200 dark:from-red-800 dark:to-pink-800';
    }
  };

  const getMoodFace = (mood: 'happy' | 'thirsty' | 'critical') => {
    switch (mood) {
      case 'happy': return '😊';
      case 'thirsty': return '😅';
      case 'critical': return '🥺';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <Icon emoji="🏡" size={40} className="mx-auto animate-float" />
        <h2 className="text-lg font-black text-gray-800 dark:text-gray-200 mt-2">Tu Jardín Virtual</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Visualiza tu huerto en tiempo real</p>
      </div>

      {/* Garden visualization */}
      <div className="bg-gradient-to-br from-sky-200 via-blue-100 to-green-100 dark:from-sky-900 dark:via-blue-900 dark:to-green-900 rounded-2xl sm:rounded-3xl border-2 border-sky-200 dark:border-sky-800 p-4 shadow-cute-lg relative overflow-hidden">
        {/* Sky with sun */}
        <div className="absolute top-2 right-2">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-lg animate-pulse-soft"></div>
        </div>

        {/* Clouds */}
        <div className="absolute top-4 left-4 opacity-60">
          <div className="w-16 h-6 bg-white rounded-full"></div>
          <div className="w-12 h-6 bg-white rounded-full -mt-3 ml-2"></div>
        </div>

        {/* Ground */}
        <div className="relative mt-16 bg-gradient-to-t from-amber-600 via-amber-500 to-green-400 dark:from-amber-900 dark:via-amber-800 dark:to-green-800 rounded-xl p-4 min-h-[200px]">
          {/* Plants grid */}
          <div className="grid grid-cols-3 gap-3">
            {gardenPlants.map((plant, i) => (
              <div
                key={plant.planta_id}
                className="flex flex-col items-center animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Plant */}
                <div className="relative">
                  <div
                    className={`bg-gradient-to-t ${getMoodColor(plant.mood)} rounded-t-full flex items-center justify-center transition-all duration-500 shadow-cute`}
                    style={{
                      width: `${plant.size * 0.6}px`,
                      height: `${plant.size}px`,
                    }}
                  >
                    <Icon emoji={plant.emoji} size={plant.size * 0.4} />
                  </div>
                  
                  {/* Mood face */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
                    <span className="text-[10px]">{getMoodFace(plant.mood)}</span>
                  </div>

                  {/* Water drops if thirsty */}
                  {plant.mood === 'critical' && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 animate-bounce">
                      <Icon emoji="💧" size={12} />
                    </div>
                  )}
                </div>

                {/* Pot */}
                <div className="w-8 h-3 bg-gradient-to-b from-amber-700 to-amber-800 dark:from-amber-900 dark:to-amber-950 rounded-b-lg mt-0.5"></div>

                {/* Name */}
                <p className="text-[9px] font-bold text-white dark:text-gray-200 mt-1 text-center truncate w-full">
                  {plant.nombre}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats overlay */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2 text-center backdrop-blur-sm">
            <p className="text-sm font-black text-green-700 dark:text-green-400">
              {gardenPlants.filter(p => p.mood === 'happy').length}
            </p>
            <p className="text-[9px] text-gray-600 dark:text-gray-400">Felices</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2 text-center backdrop-blur-sm">
            <p className="text-sm font-black text-yellow-700 dark:text-yellow-400">
              {gardenPlants.filter(p => p.mood === 'thirsty').length}
            </p>
            <p className="text-[9px] text-gray-600 dark:text-gray-400">Con sed</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2 text-center backdrop-blur-sm">
            <p className="text-sm font-black text-red-700 dark:text-red-400">
              {gardenPlants.filter(p => p.mood === 'critical').length}
            </p>
            <p className="text-[9px] text-gray-600 dark:text-gray-400">Sedientas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
