import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { ArrowLeft, Sun, Droplets, Bug, Scissors, Ruler, AlertTriangle } from 'lucide-react';

interface Props {
  nombre: string;
  onBack: () => void;
}

type TabType = 'info' | 'riegos' | 'crecimiento' | 'salud' | 'cosechas';

export default function FichaPlanta({ nombre, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  
  const planta = useLiveQuery(() => db.plantas.where('nombre').equals(nombre).first(), [nombre]);
  const riegos = useLiveQuery(() => db.riegos.where('planta_nombre').equals(nombre).reverse().sortBy('fecha'), [nombre]) || [];
  const bitacora = useLiveQuery(() => db.bitacora.where('planta_nombre').equals(nombre).sortBy('fecha'), [nombre]) || [];
  const salud = useLiveQuery(() => db.salud.where('planta_nombre').equals(nombre).reverse().sortBy('fecha_deteccion'), [nombre]) || [];
  const cosechas = useLiveQuery(() => db.cosechas.where('planta_nombre').equals(nombre).reverse().sortBy('fecha'), [nombre]) || [];

  if (!planta) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Planta no encontrada</p>
        <button onClick={onBack} className="mt-4 text-green-600 font-medium">← Volver</button>
      </div>
    );
  }

  // Calcular estado de riego
  const ultimoRiego = riegos[0];
  const diasDesdeRiego = ultimoRiego
    ? Math.floor((Date.now() - new Date(ultimoRiego.fecha).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const diasRestantes = diasDesdeRiego !== null ? planta.frecuencia_riego_dias - diasDesdeRiego : -999;

  const tabs = [
    { id: 'info' as const, label: 'Ficha', icon: <Sun size={14} /> },
    { id: 'riegos' as const, label: 'Riegos', icon: <Droplets size={14} /> },
    { id: 'crecimiento' as const, label: 'Altura', icon: <Ruler size={14} /> },
    { id: 'salud' as const, label: 'Salud', icon: <Bug size={14} /> },
    { id: 'cosechas' as const, label: 'Cosecha', icon: <Scissors size={14} /> },
  ];

  return (
    <div className="space-y-4">
      {/* Header con botón volver */}
      <button onClick={onBack} className="flex items-center gap-1 text-green-700 text-sm font-medium">
        <ArrowLeft size={16} /> Volver al dashboard
      </button>

      {/* Card principal */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{planta.emoji}</span>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{planta.nombre}</h2>
            <p className="text-sm text-gray-500">{planta.fase_actual}</p>
          </div>
        </div>
        
        {/* Estado de riego */}
        <div className={`mt-3 p-3 rounded-xl ${
          diasRestantes > 0 ? 'bg-green-50 border border-green-200' :
          diasRestantes === 0 ? 'bg-yellow-50 border border-yellow-200' :
          'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            <Droplets size={14} />
            <span className="text-sm font-medium">
              {diasDesdeRiego !== null
                ? `Último riego: hace ${diasDesdeRiego} días | Frecuencia: cada ${planta.frecuencia_riego_dias}d`
                : 'Sin registros de riego'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de tabs */}
      {activeTab === 'info' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-start gap-2">
            <Sun size={16} className="text-yellow-500 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-700">Horario solar</p>
              <p className="text-sm text-gray-600">{planta.horario_solar}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Ruler size={16} className="text-green-500 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-700">Manejo recomendado</p>
              <p className="text-sm text-gray-600">{planta.ajuste_manejo}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Droplets size={16} className="text-blue-500 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-700">Fertilizantes recomendados</p>
              <p className="text-sm text-gray-600">{planta.fertilizantes_recomendados}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-red-500 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-700">Prohibiciones</p>
              <p className="text-sm text-red-600">{planta.prohibiciones}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'riegos' && (
        <div className="space-y-2">
          {riegos.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Sin registros de riego</p>
          ) : (
            riegos.slice(0, 20).map((r, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.tipo}</p>
                  <p className="text-xs text-gray-500">{r.fecha} · {r.cantidad}</p>
                </div>
                <span className="text-lg">💧</span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'crecimiento' && (
        <div className="space-y-2">
          {bitacora.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Sin mediciones registradas</p>
          ) : (
            [...bitacora].reverse().map((b, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{b.altura_cm} cm</p>
                  <p className="text-xs text-gray-500">{b.fecha} · {b.num_plantas} planta(s)</p>
                </div>
                <span className="text-lg">📏</span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'salud' && (
        <div className="space-y-2">
          {salud.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Sin incidencias registradas</p>
          ) : (
            salud.map((s, i) => (
              <div key={i} className={`rounded-xl border p-3 ${
                s.estado === 'Resuelto' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-800">{s.sintoma_riesgo}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${
                    s.estado === 'Resuelto' ? 'bg-green-500' : 'bg-amber-500'
                  }`}>{s.estado}</span>
                </div>
                <p className="text-xs text-gray-600">Causa: {s.causa_probable}</p>
                <p className="text-xs text-gray-600">Tratamiento: {s.tratamiento_natural}</p>
                <p className="text-xs text-gray-400 mt-1">Detectado: {s.fecha_deteccion}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'cosechas' && (
        <div className="space-y-2">
          {cosechas.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Sin cosechas registradas</p>
          ) : (
            cosechas.map((c, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{c.parte_cosechada}</p>
                  <p className="text-xs text-gray-500">{c.fecha} · {c.cantidad_estimada} unidades</p>
                </div>
                <span className="text-lg">✂️</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
