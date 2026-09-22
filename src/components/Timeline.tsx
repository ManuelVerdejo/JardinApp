import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from './Icon';

interface TimelineEvent {
  date: string;
  type: 'riego' | 'cosecha' | 'crecimiento' | 'salud';
  planta: string;
  description: string;
  emoji: string;
  color: string;
}

export function Timeline({ plantaNombre }: { plantaNombre?: string }) {
  const riegos = useLiveQuery(() => 
    plantaNombre 
      ? db.riegos.where('planta_nombre').equals(plantaNombre).toArray()
      : db.riegos.toArray()
  ) || [];
  
  const cosechas = useLiveQuery(() => 
    plantaNombre 
      ? db.cosechas.where('planta_nombre').equals(plantaNombre).toArray()
      : db.cosechas.toArray()
  ) || [];
  
  const bitacora = useLiveQuery(() => 
    plantaNombre 
      ? db.bitacora.where('planta_nombre').equals(plantaNombre).toArray()
      : db.bitacora.toArray()
  ) || [];
  
  const salud = useLiveQuery(() => 
    plantaNombre 
      ? db.salud.where('planta_nombre').equals(plantaNombre).toArray()
      : db.salud.toArray()
  ) || [];

  // Combinar todos los eventos
  const events: TimelineEvent[] = [
    ...riegos.map(r => ({
      date: r.fecha,
      type: 'riego' as const,
      planta: r.planta_nombre,
      description: `${r.tipo} (${r.cantidad})`,
      emoji: '💧',
      color: 'blue',
    })),
    ...cosechas.map(c => ({
      date: c.fecha,
      type: 'cosecha' as const,
      planta: c.planta_nombre,
      description: `${c.parte_cosechada} (${c.cantidad_estimada} uds)`,
      emoji: '✂️',
      color: 'purple',
    })),
    ...bitacora.map(b => ({
      date: b.fecha,
      type: 'crecimiento' as const,
      planta: b.planta_nombre,
      description: `${b.altura_cm} cm · ${b.num_plantas} planta(s)`,
      emoji: '📏',
      color: 'green',
    })),
    ...salud.map(s => ({
      date: s.fecha_deteccion,
      type: 'salud' as const,
      planta: s.planta_nombre,
      description: s.sintoma_riesgo,
      emoji: '🐛',
      color: 'orange',
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
    purple: 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800',
    green: 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    orange: 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800',
  };

  const lineColors = {
    blue: 'bg-blue-300 dark:bg-blue-600',
    purple: 'bg-purple-300 dark:bg-purple-600',
    green: 'bg-green-300 dark:bg-green-600',
    orange: 'bg-orange-300 dark:bg-orange-600',
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-indigo-100 dark:border-indigo-900 p-3 sm:p-4 shadow-cute-lg animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center shadow-cute">
          <Icon emoji="📜" size={14} />
        </div>
        <h3 className="font-black text-gray-800 dark:text-gray-200 text-xs sm:text-sm">
          {plantaNombre ? 'Historial' : 'Línea de Tiempo'}
        </h3>
      </div>

      {events.length === 0 ? (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-6">Sin eventos registrados</p>
      ) : (
        <div className="relative max-h-80 overflow-y-auto">
          {events.slice(0, 20).map((event, i) => (
            <div key={i} className="flex gap-3 mb-3 last:mb-0">
              {/* Timeline line and dot */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClasses[event.color as keyof typeof colorClasses]} border-2 flex-shrink-0`}>
                  <Icon emoji={event.emoji} size={14} />
                </div>
                {i < events.slice(0, 20).length - 1 && (
                  <div className={`w-0.5 flex-1 min-h-[20px] ${lineColors[event.color as keyof typeof lineColors]}`}></div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                    {plantaNombre ? event.description : `${event.planta} · ${event.description}`}
                  </p>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
