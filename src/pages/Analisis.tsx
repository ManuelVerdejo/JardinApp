import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Icon } from '../components/Icon';
import { WaterDrop, Scissors, HeartGreen, Sparkles as SparklesIcon, Star } from '../components/Icons';
import { TrendingUp, Heart } from 'lucide-react';

export default function Analisis() {
  const plantas = useLiveQuery(() => db.plantas.toArray()) || [];
  const bitacora = useLiveQuery(() => db.bitacora.toArray()) || [];
  const riegos = useLiveQuery(() => db.riegos.toArray()) || [];
  const cosechas = useLiveQuery(() => db.cosechas.toArray()) || [];
  const salud = useLiveQuery(() => db.salud.toArray()) || [];
  
  const [selectedPlanta, setSelectedPlanta] = useState<string>('all');

  const crecimientoData = (() => {
    let filtered = bitacora;
    if (selectedPlanta !== 'all') {
      filtered = bitacora.filter(b => b.planta_nombre === selectedPlanta);
    }
    const grouped: Record<string, Record<string, number>> = {};
    filtered.forEach(b => {
      if (!grouped[b.fecha]) grouped[b.fecha] = {};
      grouped[b.fecha][b.planta_nombre] = b.altura_cm;
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([fecha, plantasData]) => {
        const entry: Record<string, any> = { fecha: fecha.slice(5) };
        Object.entries(plantasData).forEach(([key, val]) => {
          entry[key] = val;
        });
        return entry;
      });
  })();

  const riegoData = (() => {
    const last14Days: string[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last14Days.push(d.toISOString().split('T')[0]);
    }
    return last14Days.map(fecha => {
      const count = riegos.filter(r => r.fecha === fecha).length;
      return { fecha: fecha.slice(5), riegos: count };
    });
  })();

  const cosechaData = (() => {
    const grouped: Record<string, number> = {};
    cosechas.forEach(c => {
      grouped[c.planta_nombre] = (grouped[c.planta_nombre] || 0) + c.cantidad_estimada;
    });
    return Object.entries(grouped).map(([nombre, cantidad]) => ({
      nombre: nombre.length > 8 ? nombre.slice(0, 8) + '…' : nombre,
      nombreCompleto: nombre,
      cantidad,
      emoji: plantas.find(p => p.nombre === nombre)?.emoji || '🌱',
    }));
  })();

  const saludData = (() => {
    const resueltos = salud.filter(s => s.estado === 'Resuelto').length;
    const seguimiento = salud.filter(s => s.estado === 'En seguimiento').length;
    return [
      { name: 'Resueltos', value: resueltos, color: '#34d399' },
      { name: 'En seguimiento', value: seguimiento, color: '#fbbf24' },
    ];
  })();

  const totalSalud = saludData.reduce((acc, d) => acc + d.value, 0);
  const porcentajeResueltos = totalSalud > 0 ? Math.round((saludData[0].value / totalSalud) * 100) : 0;

  const lineColors = ['#34d399', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa', '#fb923c', '#22d3ee', '#a3e635', '#f97316'];

  const totalRiegos = riegos.length;
  const totalCosechas = cosechas.reduce((acc, c) => acc + c.cantidad_estimada, 0);
  const diasActivos = new Set(riegos.map(r => r.fecha)).size;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <Icon emoji="📊" size={40} className="mx-auto animate-float" />
        <h2 className="text-lg font-black text-gray-800 mt-2">Análisis y Estadísticas</h2>
        <p className="text-xs text-gray-500 font-medium">Mira cómo crece tu huerto</p>
      </div>

      {/* Stats resumen */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-3 text-center shadow-cute sticker border-2 border-white animate-fade-in">
          <WaterDrop size={24} className="mx-auto" />
          <p className="text-xl font-black text-blue-700 mt-1">{totalRiegos}</p>
          <p className="text-[10px] text-blue-600 font-bold">Riegos</p>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-3 text-center shadow-cute sticker border-2 border-white animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Scissors size={24} className="mx-auto" />
          <p className="text-xl font-black text-purple-700 mt-1">{totalCosechas}</p>
          <p className="text-[10px] text-purple-600 font-bold">Cosechas</p>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-3 text-center shadow-cute sticker border-2 border-white animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Icon emoji="📅" size={24} className="mx-auto" />
          <p className="text-xl font-black text-green-700 mt-1">{diasActivos}</p>
          <p className="text-[10px] text-green-600 font-bold">Días activos</p>
        </div>
      </div>

      {/* Filtro de planta */}
      <div className="glass rounded-2xl p-3 shadow-cute">
        <label className="text-xs font-bold text-gray-600 mb-1.5 block flex items-center gap-1">
          <Icon emoji="🌱" size={14} /> Filtrar por planta
        </label>
        <select
          value={selectedPlanta}
          onChange={e => setSelectedPlanta(e.target.value)}
          className="w-full p-2.5 rounded-xl border-2 border-green-100 text-sm bg-green-50/50 focus:ring-2 focus:ring-green-300 outline-none font-medium"
        >
          <option value="all">Todas las plantas</option>
          {plantas.map(p => <option key={p.planta_id} value={p.nombre}>{p.nombre}</option>)}
        </select>
      </div>

      {/* Gráfico de Crecimiento */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-green-100 p-3 sm:p-4 shadow-cute-lg animate-fade-in">
        <h3 className="font-black text-gray-800 text-xs sm:text-sm flex items-center gap-2 mb-2 sm:mb-3">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg sm:rounded-xl flex items-center justify-center shadow-cute">
            <TrendingUp size={12} className="text-white" />
          </div>
          <span className="truncate">Evolución del Crecimiento</span>
          <Icon emoji="📈" size={14} />
        </h3>
        {crecimientoData.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={crecimientoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
              <XAxis dataKey="fecha" tick={{ fontSize: 10, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: '2px solid #d1fae5', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'Nunito' }} />
              {selectedPlanta === 'all'
                ? plantas.map((p, i) => {
                    const hasData = crecimientoData.some(d => d[p.nombre] !== undefined);
                    if (!hasData) return null;
                    return (
                      <Line key={p.nombre} type="monotone" dataKey={p.nombre} stroke={lineColors[i % lineColors.length]} strokeWidth={2.5} dot={{ r: 4, fill: lineColors[i % lineColors.length], strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} connectNulls />
                    );
                  })
                : <Line type="monotone" dataKey={selectedPlanta} stroke="#34d399" strokeWidth={3} dot={{ r: 5, fill: '#34d399', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
              }
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8">
            <Icon emoji="🌱" size={40} className="mx-auto" />
            <p className="text-gray-400 text-sm mt-2 font-medium">Sin datos de crecimiento aún</p>
          </div>
        )}
      </div>

      {/* Gráfico de Riegos */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-blue-100 p-3 sm:p-4 shadow-cute-lg animate-fade-in">
        <h3 className="font-black text-gray-800 text-xs sm:text-sm flex items-center gap-2 mb-2 sm:mb-3">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg sm:rounded-xl flex items-center justify-center shadow-cute">
            <WaterDrop size={12} />
          </div>
          <span className="truncate">Frecuencia de Riego</span>
          <Icon emoji="💧" size={14} />
        </h3>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={riegoData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
            <XAxis dataKey="fecha" tick={{ fontSize: 9, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: '2px solid #bfdbfe', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'Nunito' }} />
            <Bar dataKey="riegos" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Cosechas */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-purple-100 p-3 sm:p-4 shadow-cute-lg animate-fade-in">
        <h3 className="font-black text-gray-800 text-xs sm:text-sm flex items-center gap-2 mb-2 sm:mb-3">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg sm:rounded-xl flex items-center justify-center shadow-cute">
            <Scissors size={12} />
          </div>
          <span className="truncate">Balance de Cosechas</span>
          <Icon emoji="🎉" size={14} />
        </h3>
        {cosechaData.length > 0 ? (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={cosechaData} layout="vertical">
              <defs>
                <linearGradient id="barPurple" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#6b7280' }} allowDecimals={false} />
              <YAxis type="category" dataKey="nombre" tick={{ fontSize: 10, fill: '#6b7280' }} width={70} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: '2px solid #e9d5ff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'Nunito' }} formatter={(value: number, name: string, props: any) => [`${value} unidades`, props.payload.nombreCompleto]} />
              <Bar dataKey="cantidad" fill="url(#barPurple)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8">
            <Scissors size={40} className="mx-auto text-gray-300" />
            <p className="text-gray-400 text-sm mt-2 font-medium">Sin cosechas registradas</p>
          </div>
        )}
      </div>

      {/* Tasa de resolución de salud */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-pink-100 p-3 sm:p-4 shadow-cute-lg animate-fade-in">
        <h3 className="font-black text-gray-800 text-xs sm:text-sm flex items-center gap-2 mb-2 sm:mb-3">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg sm:rounded-xl flex items-center justify-center shadow-cute">
            <Heart size={12} className="text-white" />
          </div>
          <span className="truncate">Salud del Huerto</span>
          <HeartGreen size={14} />
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
          <div className="w-32 h-32 sm:w-28 sm:h-28 relative flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={saludData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={3} stroke="#fff">
                  {saludData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-gray-800">{porcentajeResueltos}%</span>
              <span className="text-[9px] text-gray-500 font-bold">sano</span>
            </div>
          </div>
          <div className="flex-1 w-full space-y-2">
            {saludData.map((d, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <div className="w-4 h-4 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: d.color }}></div>
                <span className="text-xs font-bold text-gray-700 flex-1">{d.name}</span>
                <span className="text-sm font-black flex-shrink-0" style={{ color: d.color }}>{d.value}</span>
              </div>
            ))}
            <p className="text-[10px] text-gray-400 font-medium text-center pt-1">
              Total: {totalSalud} incidencias
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-2 pb-4">
        <p className="text-[10px] text-gray-400 font-medium flex items-center justify-center gap-1">
          <Star size={10} className="text-yellow-400" />
          Tus datos se guardan localmente
          <Star size={10} className="text-yellow-400" />
        </p>
      </div>
    </div>
  );
}
