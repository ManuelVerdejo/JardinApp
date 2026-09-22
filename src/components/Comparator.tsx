import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from './Icon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function PlantComparator() {
  const plantas = useLiveQuery(() => db.plantas.toArray()) || [];
  const bitacora = useLiveQuery(() => db.bitacora.toArray()) || [];
  
  const [plant1, setPlant1] = useState(plantas[0]?.nombre || '');
  const [plant2, setPlant2] = useState(plantas[1]?.nombre || '');

  // Preparar datos para comparación
  const comparisonData = (() => {
    const dates = new Set<string>();
    bitacora
      .filter(b => b.planta_nombre === plant1 || b.planta_nombre === plant2)
      .forEach(b => dates.add(b.fecha));
    
    const sortedDates = Array.from(dates).sort();
    
    return sortedDates.map(fecha => {
      const entry: Record<string, any> = { fecha: fecha.slice(5) };
      
      const b1 = bitacora.find(b => b.planta_nombre === plant1 && b.fecha === fecha);
      const b2 = bitacora.find(b => b.planta_nombre === plant2 && b.fecha === fecha);
      
      if (b1) entry[plant1] = b1.altura_cm;
      if (b2) entry[plant2] = b2.altura_cm;
      
      return entry;
    });
  })();

  // Stats de cada planta
  const getStats = (nombre: string) => {
    const datos = bitacora.filter(b => b.planta_nombre === nombre);
    if (datos.length === 0) return { max: 0, min: 0, promedio: 0, crecimiento: 0 };
    
    const alturas = datos.map(d => d.altura_cm);
    const max = Math.max(...alturas);
    const min = Math.min(...alturas);
    const promedio = alturas.reduce((a, b) => a + b, 0) / alturas.length;
    const crecimiento = max - min;
    
    return { max, min, promedio: Math.round(promedio * 10) / 10, crecimiento };
  };

  const stats1 = getStats(plant1);
  const stats2 = getStats(plant2);

  const planta1 = plantas.find(p => p.nombre === plant1);
  const planta2 = plantas.find(p => p.nombre === plant2);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-cyan-100 dark:border-cyan-900 p-3 sm:p-4 shadow-cute-lg animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-xl flex items-center justify-center shadow-cute">
          <Icon emoji="⚖️" size={14} />
        </div>
        <h3 className="font-black text-gray-800 dark:text-gray-200 text-xs sm:text-sm">Comparador de Plantas</h3>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 mb-1 block">Planta 1</label>
          <select
            value={plant1}
            onChange={e => setPlant1(e.target.value)}
            className="w-full p-2 rounded-lg border-2 border-cyan-100 dark:border-cyan-900 text-xs bg-cyan-50/50 dark:bg-cyan-900/20 focus:ring-2 focus:ring-cyan-300 outline-none font-medium"
          >
            {plantas.map(p => <option key={p.planta_id} value={p.nombre}>{p.nombre}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 mb-1 block">Planta 2</label>
          <select
            value={plant2}
            onChange={e => setPlant2(e.target.value)}
            className="w-full p-2 rounded-lg border-2 border-cyan-100 dark:border-cyan-900 text-xs bg-cyan-50/50 dark:bg-cyan-900/20 focus:ring-2 focus:ring-cyan-300 outline-none font-medium"
          >
            {plantas.map(p => <option key={p.planta_id} value={p.nombre}>{p.nombre}</option>)}
          </select>
        </div>
      </div>

      {/* Plant cards */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl p-2 border border-pink-200 dark:border-pink-800">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Icon emoji={planta1?.emoji || '🌱'} size={20} />
            <span className="text-xs font-bold text-pink-800 dark:text-pink-300 truncate">{plant1}</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex justify-between">
              <span className="text-[9px] text-gray-600 dark:text-gray-400">Máx:</span>
              <span className="text-[10px] font-bold text-pink-700 dark:text-pink-400">{stats1.max} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] text-gray-600 dark:text-gray-400">Prom:</span>
              <span className="text-[10px] font-bold text-pink-700 dark:text-pink-400">{stats1.promedio} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] text-gray-600 dark:text-gray-400">Crec:</span>
              <span className="text-[10px] font-bold text-pink-700 dark:text-pink-400">+{stats1.crecimiento} cm</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-2 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Icon emoji={planta2?.emoji || '🌱'} size={20} />
            <span className="text-xs font-bold text-blue-800 dark:text-blue-300 truncate">{plant2}</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex justify-between">
              <span className="text-[9px] text-gray-600 dark:text-gray-400">Máx:</span>
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400">{stats2.max} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] text-gray-600 dark:text-gray-400">Prom:</span>
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400">{stats2.promedio} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] text-gray-600 dark:text-gray-400">Crec:</span>
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400">+{stats2.crecimiento} cm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      {comparisonData.length > 0 ? (
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
            <XAxis dataKey="fecha" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 9 }} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey={plant1} stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} connectNulls />
            <Line type="monotone" dataKey={plant2} stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-6">Sin datos para comparar</p>
      )}
    </div>
  );
}
