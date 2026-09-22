import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Droplets, Scissors, Heart } from 'lucide-react';

export default function Analisis() {
  const plantas = useLiveQuery(() => db.plantas.toArray()) || [];
  const bitacora = useLiveQuery(() => db.bitacora.toArray()) || [];
  const riegos = useLiveQuery(() => db.riegos.toArray()) || [];
  const cosechas = useLiveQuery(() => db.cosechas.toArray()) || [];
  const salud = useLiveQuery(() => db.salud.toArray()) || [];
  
  const [selectedPlanta, setSelectedPlanta] = useState<string>('all');

  // ============ DATOS DE CRECIMIENTO ============
  const crecimientoData = (() => {
    let filtered = bitacora;
    if (selectedPlanta !== 'all') {
      filtered = bitacora.filter(b => b.planta_nombre === selectedPlanta);
    }
    // Agrupar por fecha y planta
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

  // ============ DATOS DE RIEGO (últimos 14 días) ============
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

  // ============ DATOS DE COSECHA ============
  const cosechaData = (() => {
    const grouped: Record<string, number> = {};
    cosechas.forEach(c => {
      grouped[c.planta_nombre] = (grouped[c.planta_nombre] || 0) + c.cantidad_estimada;
    });
    return Object.entries(grouped).map(([nombre, cantidad]) => ({
      nombre: nombre.length > 10 ? nombre.slice(0, 10) + '…' : nombre,
      cantidad,
    }));
  })();

  // ============ DATOS DE SALUD ============
  const saludData = (() => {
    const resueltos = salud.filter(s => s.estado === 'Resuelto').length;
    const seguimiento = salud.filter(s => s.estado === 'En seguimiento').length;
    return [
      { name: 'Resueltos', value: resueltos, color: '#22c55e' },
      { name: 'En seguimiento', value: seguimiento, color: '#f59e0b' },
    ];
  })();

  const totalSalud = saludData.reduce((acc, d) => acc + d.value, 0);
  const porcentajeResueltos = totalSalud > 0 ? Math.round((saludData[0].value / totalSalud) * 100) : 0;

  // Colores para las líneas de crecimiento
  const lineColors = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316'];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">📊 Análisis y Estadísticas</h2>

      {/* Filtro de planta */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Filtrar por planta</label>
        <select
          value={selectedPlanta}
          onChange={e => setSelectedPlanta(e.target.value)}
          className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-green-300 outline-none"
        >
          <option value="all">Todas las plantas</option>
          {plantas.map(p => <option key={p.planta_id} value={p.nombre}>{p.emoji} {p.nombre}</option>)}
        </select>
      </div>

      {/* Gráfico de Crecimiento */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-green-500" />
          Evolución del Crecimiento (cm)
        </h3>
        {crecimientoData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={crecimientoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="fecha" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {selectedPlanta === 'all'
                ? plantas.map((p, i) => {
                    const hasData = crecimientoData.some(d => d[p.nombre] !== undefined);
                    if (!hasData) return null;
                    return (
                      <Line
                        key={p.nombre}
                        type="monotone"
                        dataKey={p.nombre}
                        stroke={lineColors[i % lineColors.length]}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        connectNulls
                      />
                    );
                  })
                : <Line type="monotone" dataKey={selectedPlanta} stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
              }
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-400 text-sm py-8">Sin datos de crecimiento</p>
        )}
      </div>

      {/* Gráfico de Riegos */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2 mb-3">
          <Droplets size={16} className="text-blue-500" />
          Frecuencia de Riego (últimos 14 días)
        </h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={riegoData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="fecha" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Bar dataKey="riegos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Cosechas */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2 mb-3">
          <Scissors size={16} className="text-purple-500" />
          Balance de Cosechas
        </h3>
        {cosechaData.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={cosechaData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
              <YAxis type="category" dataKey="nombre" tick={{ fontSize: 10 }} width={80} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="cantidad" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-400 text-sm py-8">Sin datos de cosecha</p>
        )}
      </div>

      {/* Tasa de resolución de salud */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2 mb-3">
          <Heart size={16} className="text-red-500" />
          Tasa de Resolución de Salud
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={saludData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={40}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {saludData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-800">{porcentajeResueltos}%</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {saludData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-xs text-gray-600">{d.name}: {d.value}</span>
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-2">
              Total: {totalSalud} incidencias registradas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
