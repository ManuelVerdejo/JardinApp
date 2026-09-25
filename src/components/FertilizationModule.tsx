import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { useTheme } from '../context/ThemeContext';
import { FertilizerInventory } from './FertilizerInventory';
import { FertilizationPlan } from './FertilizationPlan';
import { FlaskConical, CalendarDays } from 'lucide-react';

export function FertilizationModule() {
  const { isDark } = useTheme();
  const [subTab, setSubTab] = useState<'inventory' | 'plans'>('inventory');

  const fertilizantes = useLiveQuery(() => db.fertilizantes.toArray()) || [];
  const planes = useLiveQuery(async () => {
    try {
      const all = await db.planesFertilizacion.toArray();
      return all.filter(p => Boolean(p.activo));
    } catch {
      return [];
    }
  }) || [];

  return (
    <div className="space-y-4">
      {/* Selector de Pestañas Segmentado */}
      <div className={`p-1.5 rounded-2xl shadow-cute border-2 flex items-center gap-1.5 transition-all ${
        isDark 
          ? 'bg-gray-800/90 border-gray-700' 
          : 'bg-white/90 backdrop-blur-md border-emerald-100'
      }`}>
        <button
          onClick={() => setSubTab('inventory')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
            subTab === 'inventory'
              ? isDark
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-cute'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-cute'
              : isDark
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
              : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50'
          }`}
        >
          <FlaskConical size={16} className={subTab === 'inventory' ? 'animate-bounce-soft' : ''} />
          <span>Inventario</span>
          {fertilizantes.length > 0 && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
              subTab === 'inventory'
                ? 'bg-white/20 text-white'
                : isDark
                ? 'bg-gray-700 text-gray-300'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {fertilizantes.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('plans')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
            subTab === 'plans'
              ? isDark
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-cute'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-cute'
              : isDark
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
              : 'text-gray-600 hover:text-orange-700 hover:bg-orange-50/50'
          }`}
        >
          <CalendarDays size={16} className={subTab === 'plans' ? 'animate-bounce-soft' : ''} />
          <span>Planes</span>
          {planes.length > 0 && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
              subTab === 'plans'
                ? 'bg-white/20 text-white'
                : isDark
                ? 'bg-gray-700 text-gray-300'
                : 'bg-orange-100 text-orange-800'
            }`}>
              {planes.length}
            </span>
          )}
        </button>
      </div>

      {/* Vista de contenido */}
      <div className="animate-fade-in">
        {subTab === 'inventory' ? (
          <FertilizerInventory />
        ) : (
          <FertilizationPlan />
        )}
      </div>
    </div>
  );
}
export default FertilizationModule;
