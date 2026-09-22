import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Planta, Riego } from '../db/database';
import { Droplets, AlertTriangle, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

interface Props {
  onOpenFicha: (nombre: string) => void;
}

export default function Dashboard({ onOpenFicha }: Props) {
  const plantas = useLiveQuery(() => db.plantas.toArray()) || [];
  const riegos = useLiveQuery(() => db.riegos.toArray()) || [];
  const alertasSalud = useLiveQuery(() => db.salud.where('estado').equals('En seguimiento').toArray()) || [];
  const [refreshKey, setRefreshKey] = useState(0);

  // Forzar re-render cada minuto para actualizar cálculos de tiempo
  useEffect(() => {
    const interval = setInterval(() => setRefreshKey(k => k + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const quickWater = async (plantaNombre: string) => {
    await db.riegos.add({
      planta_nombre: plantaNombre,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'Agua limpia',
      cantidad: 'Normal',
    });
    setRefreshKey(k => k + 1);
  };

  const getWaterStatus = (planta: Planta) => {
    const riegosPlanta = riegos
      .filter(r => r.planta_nombre === planta.nombre)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
    
    if (riegosPlanta.length === 0) {
      return { daysSince: null, daysRemaining: -999, lastWater: null, status: 'danger' as const };
    }

    const lastWater = riegosPlanta[0];
    const lastDate = new Date(lastWater.fecha);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    
    const daysSince = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = planta.frecuencia_riego_dias - daysSince;

    let status: 'success' | 'warning' | 'danger';
    if (daysRemaining > 0) status = 'success';
    else if (daysRemaining === 0) status = 'warning';
    else status = 'danger';

    return { daysSince, daysRemaining, lastWater, status };
  };

  const statusConfig = {
    success: { bg: 'bg-green-50 border-green-200', badge: 'bg-green-500', text: 'text-green-800', label: 'Al día', emoji: '🟢' },
    warning: { bg: 'bg-yellow-50 border-yellow-200', badge: 'bg-yellow-500', text: 'text-yellow-800', label: 'Regar hoy', emoji: '🟡' },
    danger: { bg: 'bg-red-50 border-red-200', badge: 'bg-red-500', text: 'text-red-800', label: '¡Sedienta!', emoji: '🔴' },
  };

  // Ordenar plantas: primero las que necesitan riego urgente
  const sortedPlantas = [...plantas].sort((a, b) => {
    const sa = getWaterStatus(a);
    const sb = getWaterStatus(b);
    return sa.daysRemaining - sb.daysRemaining;
  });

  return (
    <div className="space-y-4">
      {/* Resumen rápido */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-green-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{plantas.length}</p>
          <p className="text-xs text-green-600">Plantas</p>
        </div>
        <div className="bg-yellow-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-yellow-700">
            {plantas.filter(p => getWaterStatus(p).status === 'warning').length}
          </p>
          <p className="text-xs text-yellow-600">Regar hoy</p>
        </div>
        <div className="bg-red-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-700">
            {plantas.filter(p => getWaterStatus(p).status === 'danger').length}
          </p>
          <p className="text-xs text-red-600">Retrasadas</p>
        </div>
      </div>

      {/* Alertas de salud */}
      {alertasSalud.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">Alertas de Salud ({alertasSalud.length})</span>
          </div>
          <div className="space-y-1">
            {alertasSalud.slice(0, 3).map((s, i) => (
              <div key={i} className="text-xs text-amber-700 flex items-center gap-1">
                <span>•</span>
                <span className="font-medium">{s.planta_nombre}:</span>
                <span>{s.sintoma_riesgo}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Semáforo de riego */}
      <div>
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Droplets size={14} />
          Semáforo de Riego
        </h2>
        <div className="space-y-2">
          {sortedPlantas.map(planta => {
            const status = getWaterStatus(planta);
            const config = statusConfig[status.status];
            
            return (
              <div
                key={planta.planta_id}
                className={`rounded-xl border p-3 ${config.bg} transition-all active:scale-[0.98]`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1" onClick={() => onOpenFicha(planta.nombre)}>
                    <span className="text-2xl">{planta.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold text-sm ${config.text}`}>{planta.nombre}</h3>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium ${config.badge}`}>
                          {config.emoji} {config.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {status.daysSince !== null
                          ? `Último riego: hace ${status.daysSince}d | Frecuencia: cada ${planta.frecuencia_riego_dias}d`
                          : 'Sin registros de riego'}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      quickWater(planta.nombre);
                    }}
                    className={`ml-2 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all active:scale-95 ${
                      status.status === 'danger' ? 'bg-red-500 hover:bg-red-600' :
                      status.status === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' :
                      'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    💧 Regar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
