import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from './Icon';
import { useTheme } from '../context/ThemeContext';

export function HeatMap() {
  const { isDark } = useTheme();
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
    if (isDark) {
      if (count === 0) return 'bg-gray-700';
      if (count === 1) return 'bg-green-800';
      if (count === 2) return 'bg-green-700';
      if (count === 3) return 'bg-green-600';
      return 'bg-green-500';
    } else {
      if (count === 0) return 'bg-gray-100';
      if (count === 1) return 'bg-green-200';
      if (count === 2) return 'bg-green-300';
      if (count === 3) return 'bg-green-400';
      return 'bg-green-500';
    }
  };

  const totalRiegos = days.reduce((acc, d) => acc + d.count, 0);
  const diasConRiego = days.filter(d => d.count > 0).length;
  const promedio = diasConRiego > 0 ? (totalRiegos / diasConRiego).toFixed(1) : '0';

  return (
    <div className={`rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-cute-lg animate-fade-in border-2 ${
      isDark ? 'bg-gray-800/80 border-green-900' : 'bg-white/80 backdrop-blur-sm border-green-100'
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-cute">
          <Icon emoji="🔥" size={14} />
        </div>
        <h3 className={`font-black text-xs sm:text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Mapa de Riego</h3>
        <span className={`ml-auto text-[9px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Últimos 90 días</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className={`rounded-xl p-2 text-center ${isDark ? 'bg-green-900/30' : 'bg-green-50'}`}>
          <p className={`text-sm sm:text-base font-black ${isDark ? 'text-green-400' : 'text-green-700'}`}>{totalRiegos}</p>
          <p className={`text-[9px] sm:text-[10px] font-medium ${isDark ? 'text-green-500' : 'text-green-600'}`}>Total</p>
        </div>
        <div className={`rounded-xl p-2 text-center ${isDark ? 'bg-green-900/30' : 'bg-green-50'}`}>
          <p className={`text-sm sm:text-base font-black ${isDark ? 'text-green-400' : 'text-green-700'}`}>{diasConRiego}</p>
          <p className={`text-[9px] sm:text-[10px] font-medium ${isDark ? 'text-green-500' : 'text-green-600'}`}>Días activos</p>
        </div>
        <div className={`rounded-xl p-2 text-center ${isDark ? 'bg-green-900/30' : 'bg-green-50'}`}>
          <p className={`text-sm sm:text-base font-black ${isDark ? 'text-green-400' : 'text-green-700'}`}>{promedio}</p>
          <p className={`text-[9px] sm:text-[10px] font-medium ${isDark ? 'text-green-500' : 'text-green-600'}`}>Promedio/día</p>
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
        <span className={`text-[9px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Menos</span>
        <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
        <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm ${isDark ? 'bg-green-800' : 'bg-green-200'}`}></div>
        <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm ${isDark ? 'bg-green-700' : 'bg-green-300'}`}></div>
        <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm ${isDark ? 'bg-green-600' : 'bg-green-400'}`}></div>
        <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm ${isDark ? 'bg-green-500' : 'bg-green-500'}`}></div>
        <span className={`text-[9px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Más</span>
      </div>
    </div>
  );
}
