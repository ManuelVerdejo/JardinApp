import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from './Icon';

export function Predictions() {
  const plantas = useLiveQuery(() => db.plantas.toArray()) || [];
  const bitacora = useLiveQuery(() => db.bitacora.toArray()) || [];
  const cosechas = useLiveQuery(() => db.cosechas.toArray()) || [];

  // Calcular predicciones basadas en datos históricos
  const predictions = plantas.map(planta => {
    const datos = bitacora.filter(b => b.planta_nombre === planta.nombre).sort((a, b) => a.fecha.localeCompare(b.fecha));
    const cosechasPlanta = cosechas.filter(c => c.planta_nombre === planta.nombre);
    
    if (datos.length < 2) {
      return {
        planta,
        nextHeight: null,
        nextHarvest: null,
        growthRate: null,
      };
    }

    // Calcular tasa de crecimiento
    const firstData = datos[0];
    const lastData = datos[datos.length - 1];
    const daysDiff = Math.floor((new Date(lastData.fecha).getTime() - new Date(firstData.fecha).getTime()) / (1000 * 60 * 60 * 24));
    const heightDiff = lastData.altura_cm - firstData.altura_cm;
    const growthRate = daysDiff > 0 ? heightDiff / daysDiff : 0;

    // Predecir altura en 7 días
    const nextHeight = lastData.altura_cm + (growthRate * 7);

    // Predecir próxima cosecha basada en historial
    let nextHarvest: Date | null = null;
    if (cosechasPlanta.length >= 2) {
      const sortedCosechas = cosechasPlanta.sort((a, b) => a.fecha.localeCompare(b.fecha));
      const intervals: number[] = [];
      for (let i = 1; i < sortedCosechas.length; i++) {
        const days = Math.floor((new Date(sortedCosechas[i].fecha).getTime() - new Date(sortedCosechas[i - 1].fecha).getTime()) / (1000 * 60 * 60 * 24));
        intervals.push(days);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const lastHarvest = new Date(sortedCosechas[sortedCosechas.length - 1].fecha);
      nextHarvest = new Date(lastHarvest.getTime() + avgInterval * 24 * 60 * 60 * 1000);
    }

    return {
      planta,
      nextHeight: Math.round(nextHeight * 10) / 10,
      nextHarvest,
      growthRate: Math.round(growthRate * 100) / 100,
    };
  }).filter(p => p.growthRate !== null);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-amber-100 dark:border-amber-900 p-3 sm:p-4 shadow-cute-lg animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center shadow-cute">
          <Icon emoji="🔮" size={14} />
        </div>
        <h3 className="font-black text-gray-800 dark:text-gray-200 text-xs sm:text-sm">Predicciones</h3>
      </div>

      {predictions.length === 0 ? (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-6">
          Necesitas más datos para generar predicciones
        </p>
      ) : (
        <div className="space-y-2">
          {predictions.slice(0, 5).map((pred, i) => (
            <div key={i} className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-2.5 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-1.5">
                <Icon emoji={pred.planta.emoji} size={20} />
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300">{pred.planta.nombre}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {pred.nextHeight && (
                  <div>
                    <p className="text-[9px] text-gray-600 dark:text-gray-400 mb-0.5">Altura en 7 días:</p>
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-400">
                      {pred.nextHeight} cm
                      <span className="text-[9px] font-normal text-gray-500 dark:text-gray-400 ml-1">
                        ({pred.growthRate! > 0 ? '+' : ''}{pred.growthRate} cm/día)
                      </span>
                    </p>
                  </div>
                )}
                
                {pred.nextHarvest && (
                  <div>
                    <p className="text-[9px] text-gray-600 dark:text-gray-400 mb-0.5">Próxima cosecha:</p>
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-400">
                      {pred.nextHarvest.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
