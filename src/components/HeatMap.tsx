import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from './Icon';

export function HeatMap() {
  const riegos = useLiveQuery(() => db.riegos.toArray()) || [];

  // Generar últimos 90 días
  const days: { date: string; count: number }[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = riegos.filter(r => r.fecha === dateStr).length;
    days.push({ date: dateStr, count });
  }

  // Organizar en semanas (7 columnas)
  const weeks: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-700';
    if (count === 1) return 'bg-green-200 dark:bg-green-800';
    if (count === 2) return 'bg-green-300 dark:bg-green-700';
    if (count === 3) return 'bg-green-400 dark:bg-green-600';
    return 'bg-green-500 dark:bg-green-500';
  };

  const totalRiegos = days.reduce((acc, d) => acc + d.count, 0);
  const diasConRiego = days.filter(d => d.count > 0).length;
  const promedio = diasConRiego > 0 ? (totalRiegos / diasConRiego).toFixed(1) : '0';

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-green-100 dark:border-green-900 p-3 sm:p-4 shadow-cute-lg animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-cute">
          <Icon emoji="🔥" size={14} />
        </div>
        <h3 className="font-black text-gray-800 dark:text-gray-200 text-xs sm:text-sm">Mapa de Riego</h3>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-2 text-center">
          <p className="text-sm sm:text-base font-black text-green-700 dark:text-green-400">{totalRiegos}</p>
          <p className="text-[9px] sm:text-[10px] text-green-600 dark:text-green-500 font-medium">Total</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-2 text-center">
          <p className="text-sm sm:text-base font-black text-green-700 dark:text-green-400">{diasConRiego}</p>
          <p className="text-[9px] sm:text-[10px] text-green-600 dark:text-green-500 font-medium">Días activos</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-2 text-center">
          <p className="text-sm sm:text-base font-black text-green-700 dark:text-green-400">{promedio}</p>
          <p className="text-[9px] sm:text-[10px] text-green-600 dark:text-green-500 font-medium">Promedio/día</p>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-0.5 min-w-max">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((day, di) => (
                <div
                  key={`${wi}-${di}`}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm ${getColor(day.count)} transition-colors`}
                  title={`${day.date}: ${day.count} riego(s)`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-2">
        <span className="text-[9px] text-gray-500 dark:text-gray-400">Menos</span>
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-gray-100 dark:bg-gray-700"></div>
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-green-200 dark:bg-green-800"></div>
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-green-300 dark:bg-green-700"></div>
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-green-400 dark:bg-green-600"></div>
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-green-500 dark:bg-green-500"></div>
        <span className="text-[9px] text-gray-500 dark:text-gray-400">Más</span>
      </div>
    </div>
  );
}
